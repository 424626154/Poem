import {
        DeviceEventEmitter,
      } from 'react-native';
var Emitter = {};
Emitter.OBSERVER = 'observer'
Emitter.UPINFO = 'upinfo';//刷新信息
Emitter.COMMENT = 'comment';//评论
Emitter.ADDPOEM = 'addpoem';//添加作品
Emitter.DELPOEM = 'delpoem';
Emitter.UPPOEM = 'uppoem';
Emitter.DRAWER_CLOSE = 'drawer_close';
Emitter.READMSG = 'readmsg';
Emitter.READCHAT = 'readchat';//读私信
Emitter.NEWCHAT = 'newchat';//新的私信
Emitter.CLEAR = 'clear';
Emitter.MSGROT = 'msgrot';

Emitter.emit = function(action,param='{}'){
    var param_obj = {
      action:action,
      param:param,
    }
    console.log('------emit param:'+JSON.stringify(param_obj));
    DeviceEventEmitter.emit(Emitter.OBSERVER,param_obj);
}
export default Emitter;
