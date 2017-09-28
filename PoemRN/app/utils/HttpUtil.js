var HttpUtil = {};

HttpUtil.USER_LOGIN = 'user/login';
HttpUtil.USER_UPINFO = 'user/upinfo';
HttpUtil.USER_INFO = 'user/info';
HttpUtil.USER_REGISTER = 'user/register';
HttpUtil.USER_VALIDATE = 'user/validate';
HttpUtil.USER_FOLLOWS = 'user/follows';

HttpUtil.POEM_ADDPOEM = 'poem/addpoem';
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

HttpUtil.BASE_URL = 'http://192.168.1.6:3000';

HttpUtil.post = function(rep_url,body){
  var baseurl = HttpUtil.BASE_URL;
  var url = baseurl+'/'+rep_url;
  console.log('HttpUtil url:'+url+' body:'+body);
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
  var baseurl = HttpUtil.BASE_URL;
  var rep_url = 'pimage/file'
  var head_url = baseurl+'/'+rep_url+'/'+url;
  console.log('head_url:'+head_url);
  return head_url;
}

export default HttpUtil;
