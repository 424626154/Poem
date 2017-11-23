import {
        DeviceEventEmitter,
      } from 'react-native';
var Emitter = {};
Emitter.CLEAR = 'clear';

Emitter.emit = function(action,param='{}'){
    var param_obj = {
      action:action,
      param:param,
    }
    console.log('------emit param:'+JSON.stringify(param_obj));
    DeviceEventEmitter.emit(Emitter.OBSERVER,param_obj);
}
export default Emitter;
