import {
        DeviceEventEmitter,
      } from 'react-native';
var Emitter = {};
Emitter.OBSERVER = 'observer'
Emitter.UPINFO = 'upinfo';//刷新信息
Emitter.COMMENT = 'comment';//评论
Emitter.ADDPOEM = 'addpoem';//添加作品
Emitter.LOGIN = 'login';
Emitter.LOGOUT = 'logout';

Emitter.emit = function(action,param){
    var param_obj = {
      action:action,
      param:param,
    }
    console.log('emit param:'+JSON.stringify(param_obj));
    DeviceEventEmitter.emit(Emitter.OBSERVER,param_obj);
}
export default Emitter;
