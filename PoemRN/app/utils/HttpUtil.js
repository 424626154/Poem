import {
    NetInfo,
} from 'react-native';
import AppConf from '../AppConf';

var HttpUtil = {};

HttpUtil.USER_LOGIN = 'user/login';
HttpUtil.USER_LOGOUT = 'user/logout';
HttpUtil.USER_REGISTER = 'user/register';
HttpUtil.USER_FORGET = 'user/forget';
HttpUtil.USER_UPINFO = 'user/upinfo';
HttpUtil.USER_INFO = 'user/info';
HttpUtil.USER_VALIDATE = 'user/validate';
HttpUtil.USER_FOLLOWS = 'user/follows';
HttpUtil.USER_OTHERINFO = 'user/otherinfo';
HttpUtil.USER_FOLLOW = 'user/follow';

HttpUtil.POEM_ADDPOEM = 'poem/addpoem';
HttpUtil.POEM_INFO = 'poem/info';
HttpUtil.POEM_NEWEST_POEM = 'poem/newestpoem';
HttpUtil.POEM_HISTORY_POEM = 'poem/historypoem';
HttpUtil.POEM_UPPOEM = 'poem/uppoem';
HttpUtil.POEM_DELPOEM = 'poem/delpoem';
HttpUtil.POEM_COMMENTPOEM = 'poem/commentpoem';
HttpUtil.POEM_LOVEPOEM = 'poem/lovepoem';
HttpUtil.POEM_LOVES = 'poem/getloves';
HttpUtil.POEM_NEWEST_COMMENT = 'poem/newestcomment';
HttpUtil.POEM_HISTORY_COMMENT = 'poem/historycomment';
HttpUtil.POEM_MYLOVE = 'poem/mylove';
HttpUtil.POEM_LOVE_COMMENT = 'poem/lovecomment';
HttpUtil.POEM_NEWEST_ALLPOEM = 'poem/newestallpoem';
HttpUtil.POEM_HISTORY_ALLPOEM = 'poem/historyallpoem';

HttpUtil.CHAT_SEND = 'chat/send';
HttpUtil.CHAT_CHATS = 'chat/chats';
HttpUtil.CHAT_READ = 'chat/read';

HttpUtil.MESSAGE_PUSHID = 'message/pushid';
HttpUtil.MESSAGE_MESSAGES = 'message/messages';
HttpUtil.MESSAGE_READ = 'message/read';
HttpUtil.MESSAGE_FEEDBACK = 'message/feedback';

HttpUtil.BASE_URL = 'http://'+AppConf.IP+':'+AppConf.HOST;
console.log('---http url :'+HttpUtil.BASE_URL);

HttpUtil.post = function(rep_url,body){
  //检测网络是否连接
  // NetInfo.isConnected.fetch().done((isConnected)=>{
  //   console.log('---检测网络是否连接---');
  //     console.log(isConnected);
  // });
  var baseurl = HttpUtil.BASE_URL;
  var url = baseurl+'/'+rep_url;
  console.log('---request post url:'+rep_url+' body:'+body);
  var that = this;
  return new Promise(function (resolve, reject) {
    try {
      fetch(url,{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('---response post  url:'+rep_url+' data:');
          console.log(responseJson);
          resolve(responseJson);
        })
        .catch((error) => {
            reject(error)
        });
    } catch (e) {
        console.error(e);
    } finally {

    }
  })
}


HttpUtil.uploadImage =(params)=> {
    return new Promise(function (resolve, reject) {
        var ary = params.path.split('/');
        console.log('ary:' + ary);
        let formData = new FormData();
        let file = {uri: params.path, type: 'multipart/form-data', name: ary[ary.length-1]};
        formData.append("file", file);
        var upimage = 'pimage/upload';
        var baseurl = HttpUtil.BASE_URL;
        var url = baseurl+'/'+upimage;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'identity'
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json())
        .then((responseData)=> {
            console.log('uploadImage', responseData);
            resolve(responseData);
        })
        .catch((err)=> {
            console.log('err', err);
            reject(err);
        });
    });
};

HttpUtil.uploadImageData = function(imagedata){
  return new Promise(function (resolve, reject) {
      let uri = imagedata['path'];
      let mime = imagedata['mime'];
      let mimes = mime.split('/');
      let itype =  mimes.length > 0?mimes[mimes.length-1]:'jpg';
      let uris = uri.split('/');
      let name = uris.length > 0 ? uris[uris.length-1]:Date.now()+itype;
      let formData = new FormData();
      let file = {uri: uri, type: 'multipart/form-data', name: name};   //这里的key(uri和type和name)不能改变,
      formData.append("file",file);
      var uploadimg = 'pimage/uploadimg';
      var baseurl = HttpUtil.BASE_URL;
      var url = baseurl+'/'+uploadimg;
      fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type':'multipart/form-data',
          },
          body: formData,
      }).then((response) => response.json())
      .then((responseData)=> {
          console.log('uploadImage', responseData);
          resolve(responseData);
      })
      .catch((err)=> {
          console.log('err', err);
          reject(err);
      });
   });
};

HttpUtil.getHeadurl = function(url){
  if(!url){
    return '';
  }
  var baseurl = HttpUtil.BASE_URL;
  var rep_url = 'pimage/file'
  var head_url = baseurl+'/'+rep_url+'/'+url;
  console.log('head_url:'+head_url);
  return head_url;
}

export default HttpUtil;
