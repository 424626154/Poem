var HttpUtil = {};
HttpUtil.USERS_UPINFO = 'users/upinfo';
HttpUtil.USER_INFO = 'users/info';

HttpUtil.POEM_UPPOEM = 'poem/uppoem';
HttpUtil.POEM_DELPOEM = 'poem/delpoem';
HttpUtil.POEM_COMMENTPOEM = 'poem/commentpoem';
HttpUtil.POEM_LOVEPOEM = 'poem/lovepoem';
HttpUtil.POEM_LOVES = 'poem/getloves';
HttpUtil.POEM_NEWEST_COMMENT = 'poem/newestcomment';
HttpUtil.POEM_HISTORY_COMMENT = 'poem/historycomment';
HttpUtil.POEM_MYLOVE = 'poem/mylove';

HttpUtil.BASE_URL = 'http://192.168.1.6:3000';

HttpUtil.post = function(rep_url,body){
  var baseurl = HttpUtil.BASE_URL;
  var url = baseurl+'/'+rep_url;
  var that = this;
  return new Promise(function (resolve, reject) {
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
        resolve(responseJson);
      })
      .catch((error) => {
          reject(error)
      });
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

HttpUtil.getHeadurl = function(url){
  var baseurl = HttpUtil.BASE_URL;
  var rep_url = 'pimage/file'
  var head_url = baseurl+'/'+rep_url+'/'+url;
  console.log('head_url:'+head_url);
  return head_url;
}

export default HttpUtil;
