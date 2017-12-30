'use strict'
/**
 * AppConf
 * @flow
 */
var AppConf = {

}
AppConf.DEBUG = 'debug';
AppConf.ALI = 'ali';
AppConf.APPSTORE = 'appstore';
AppConf.YIYONGBAO = 'yingyongbao';
AppConf.FIR_IM = 'fir_im';
AppConf.XIAOMI = 'xiaomi';
AppConf.QIHU360 = 'qihu360';
AppConf.ALI_DIS = 'ali_dis';
AppConf.BAIDU = 'baidu';
//服务器环境
AppConf.ENV = AppConf.DEBUG;
// AppConf.ENV = AppConf.ALI;
// ios渠道
AppConf.IOS_CHANNEL = AppConf.APPSTORE;
//android渠道
// AppConf.ANDROID_CHANNEL = AppConf.YIYONGBAO;
// AppConf.ANDROID_CHANNEL = AppConf.FIR_IM;
// AppConf.ANDROID_CHANNEL = AppConf.XIAOMI;
// AppConf.ANDROID_CHANNEL = AppConf.QIHU360;
// AppConf.ANDROID_CHANNEL = AppConf.ALI_DIS;
AppConf.ANDROID_CHANNEL = AppConf.BAIDU;

// AppConf.DEBUG_IP = '192.168.1.7';
AppConf.DEBUG_IP = '192.168.1.5';
// AppConf.DEBUG_IP = 'localhost';
AppConf.ALI_IP = '182.92.167.29';
AppConf.HOST = 9001;
AppConf.IP = '';

if(AppConf.ENV == AppConf.DEBUG){
  AppConf.IP = AppConf.DEBUG_IP;
}else if(AppConf.ENV == AppConf.ALI){
  AppConf.IP = AppConf.ALI_IP;
}

export default AppConf;
