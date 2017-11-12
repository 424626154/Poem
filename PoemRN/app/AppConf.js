AppConf = {

}
AppConf.DEBUG = 'debug';
AppConf.ALI = 'ali';

AppConf.ENV = AppConf.DEBUG;
// AppConf.ENV = AppConf.ALI;

AppConf.DEBUG_IP = '192.168.1.8';
AppConf.ALI_IP = '182.92.167.29';
AppConf.HOST = 9001;
AppConf.IP = '';

if(AppConf.ENV == AppConf.DEBUG){
  AppConf.IP = AppConf.DEBUG_IP;
}else if(AppConf.ENV == AppConf.ALI){
  AppConf.IP = AppConf.ALI_IP;
}

export default AppConf;
