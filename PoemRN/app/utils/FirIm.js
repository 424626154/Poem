'use strict';
/**
 * FirIm
 * @flow
 */
import{
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
var FirIm = {};

FirIm.IOS_ID = '59cdeb7dca87a81d5c000764';
FirIm.ANDROID_ID = '59cdd1df959d690d7d000366';
FirIm.API_TOKEN = '686e7a53c3eab242b665beaf4972cf5c';
/**
 * 版本查询
 * http://api.fir.im/apps/latest/xxx?api_token=xxx
 */
FirIm.queryVersion = function():Promise<Object> {
  return new Promise(function (resolve, reject) {
    let base_url = 'http://api.fir.im/apps/latest';
    let id = '';
    if(Platform.OS  === 'ios'){
      id = FirIm.IOS_ID;
    }
    if(Platform.OS === 'android'){
      id = FirIm.ANDROID_ID;
    }
    if(!id){
      console.error('---fir.im 获取ID失败');
      reject('获取ID失败');
      return;
    }
    let url = base_url+'/'+id;
    let params = {
      api_token:FirIm.API_TOKEN
    }
    console.log('---queryVersion url:',url)
    FirIm.get(url,params).then(res=>{
        resolve(res);
    }).catch(err=>{
        reject(err);
    });
  });
}

FirIm.get = function(url:string,params:any):Promise<void> {
     return new Promise(function (resolve, reject) {
         if (params) {
             let paramsArray = [];
             //拼接参数
             Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
             if (url.search(/\?/) === -1) {
                 url += '?' + paramsArray.join('&')
             } else {
                 url += '&' + paramsArray.join('&')
             }
         }
         fetch(url).then((response) => response.json())
         .then((responseData)=> {
             console.log('---fir.im responseData:', responseData);
             resolve(responseData);
         })
         .catch((err)=> {
             console.log('---fir.im  err:', err);
             reject(err);
         });
     });
 }

export default FirIm;
