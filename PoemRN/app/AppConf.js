AppConf = {

}
AppConf.DEBUG = 'debug';
AppConf.ALI = 'ali';
AppConf.APPSTORE = 'appstore';
AppConf.YIYONGBAO = 'yingyongbao';

AppConf.ENV = AppConf.DEBUG;
// AppConf.ENV = AppConf.ALI;

AppConf.IOS_CHANNEL = AppConf.APPSTORE
AppConf.ANDROID_CHANNEL = AppConf.YIYONGBAO

AppConf.DEBUG_IP = '192.168.1.7';
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
