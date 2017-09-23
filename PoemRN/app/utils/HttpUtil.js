var HttpUtil = {};

HttpUtil.POEM_UPPOEM = 'poem/uppoem';
HttpUtil.POEM_DELPOEM = 'poem/delpoem';
HttpUtil.POEM_COMMENTPOEM = 'poem/commentpoem';
HttpUtil.POEM_LOVEPOEM = 'poem/lovepoem';
HttpUtil.POEM_LOVES = 'poem/getloves';
HttpUtil.POEM_NEWEST_COMMENT = 'poem/newestcomment';
HttpUtil.POEM_HISTORY_COMMENT = 'poem/historycomment';
HttpUtil.POEM_MYLOVE = 'poem/mylove';
HttpUtil.post = function(rep_url,body){
  var baseurl = 'http://192.168.1.6:3000';
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

export default HttpUtil;
