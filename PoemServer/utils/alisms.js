var uuid = require('node-uuid');
var crypto = require('crypto');
var moment = require('moment');
var http = require('http');
var alidayuUrl = 'http://dysmsapi.aliyuncs.com/';
var config = require('../conf/aliconf')
var obj = {
    //系统参数
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: uuid.v1(),
    AccessKeyId: config.AppKey,
    SignatureVersion: '1.0',
    Timestamp: '',
    Format: 'JSON',
    //业务api参数
    Action: 'SendSms',
    Version: '2017-05-25',
    RegionId: 'cn-hangzhou',
    PhoneNumbers: '',
    SignName: 'Poem验证',
    TemplateParam: "{\"customer\":\"test\"}",
    TemplateCode:config.SMS,
    OutId:'123',
}
var sms = {
    NORMAL_TEMPPLATE: 'SMS_78770029',
    REGISTER_TEMPLATE: 'SMS_75995228',
    CHANGEPROJECT_TEMPLATE: 'SMS_75995226',
    FORGETPASSS_TEMPLATE: 'SMS_75995225',
    sendMessage: function (phone, TemplateCode, TemplateParam, callback) {
        var sendurl = this.url(phone, TemplateCode, TemplateParam);
        console.log(sendurl)
        var req = http.request(sendurl, function (res) {
            var status = res.statusCode;
            if (status != 200) {
                console.log(status)
                // callback(new Error('网络异常'),'');
            }
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log(chunk);
                var value = JSON.parse(chunk);
                if (value.Code != 'OK') {
                    // console.log(value.Message)
                    callback(new Error(value.Message),'');
                } else {
                    callback(null,value);
                }
            }).on('error', function (e) {
                callback(e,'');
            });
        });
        // req.write('执行完毕');
        req.end();
    },
    sign: function (params, accessSecret) {
        // 3. 去除签名关键字Key
        console.log(params);
        if (params["Signature"]){
          delete params.Signature
        }
        // 4. 参数KEY排序
        params = this.objKeySort(params)
  
        var param = {}, qstring = [];
        var oa = Object.keys(params);
        for (var i = 0; i < oa.length; i++) {
            param[oa[i]] = params[oa[i]];
        }
        for (var key in param) {
            var value = param[key];
            if(value instanceof Object){
                value = JSON.stringify(value);
                // console.log(typeof value)
            }
            // console.log(typeof key)
            // console.log(typeof param[key])
            // console.log(param[key] instanceof Object)
            // qstring.push(encodeURIComponent(key) + '=' + encodeURIComponent(param[key]));
            qstring.push(this.specialUrlEncode(key) + '=' + this.specialUrlEncode(value));
        }
        qstring = qstring.join('&');
        var StringToSign = 'GET' + '&' + encodeURIComponent('/') + '&' + encodeURIComponent(qstring);
        accessSecret = accessSecret + '&';
        var signature = crypto.createHmac('sha1', accessSecret).update(StringToSign).digest().toString('base64');
        // signature = signature.replace(/\+/, "%20").replace(/\*/, '%2A').replace(/%7E/, '~');
        return signature;
    },
    url: function (phone, TemplateCode, TemplateParam) {
        var timestamp = moment(new Date().getTime() - 3600 * 1000 * 8).format("YYYY-MM-DDTHH:mm:ss") + 'Z';
        obj.PhoneNumbers = phone;
        obj.SignatureNonce = uuid.v1();
        obj.TemplateCode = TemplateCode;
        obj.TemplateParam = TemplateParam;
        obj.Timestamp = timestamp;
        var sign = this.sign(obj, config.AppSecret);
        var arr = [];
        arr.push(encodeURIComponent('Signature') + '=' + encodeURIComponent(sign))
        for (var p in obj) {
            var value = obj[p];
            if(value instanceof Object){
                value = JSON.stringify(value);
                // console.log(typeof value)
            }
            arr.push(encodeURIComponent(p) + '=' + encodeURIComponent(value));
        }
        var msg = arr.join('&')
        var sendurl = alidayuUrl + '?' + msg;
        return sendurl;
    },
    objKeySort:function(obj) {//排序的函数
        var newkey = Object.keys(obj).sort();
    　　//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
        var newObj = {};//创建一个新的对象，用于存放排好序的键值对
        for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
            newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
        }
        return newObj;//返回排好序的新对象
    },
    specialUrlEncode:function(value){
        var newvalue  = value.replace(/\+/, "%20").replace(/\*/, '%2A').replace(/%7E/, '~');
        return  encodeURIComponent(newvalue);
    }


}
module.exports = sms;
