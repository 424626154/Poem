var StyleConfig = {

};

StyleConfig.C_176EB9 = '#176eb9';
StyleConfig.C_1E8AE8 = '#1e8ae8';
StyleConfig.C_FFFFFF = '#ffffff';
StyleConfig.C_000000 = '#000000';
StyleConfig.C_232323 = '#232323';
StyleConfig.C_7B8992 = '#7B8992';
StyleConfig.C_D4D4D4 = '#d4d4d4';
StyleConfig.C_FFCA28 = '#ffca28';

StyleConfig.F_22 = 22;
StyleConfig.F_18 = 18;
StyleConfig.F_14 = 14;
StyleConfig.F_12 = 12;
StyleConfig.F_10 = 10;
StyleConfig.IOS_NAV = 20;

var HeaderConfig = {

};
HeaderConfig.headerTitleStyle = {
  fontSize:StyleConfig.F_22,
  alignSelf:'center',
  };
HeaderConfig.headerStyle = {
  backgroundColor:'#1e8ae8',
  };
HeaderConfig.iosNavStyle = {
  height:20,
}
var StorageConfig = {

};
StorageConfig.USERID = 'userid';
StorageConfig.PUSHIID = 'pushid';
StorageConfig.LAST_PHONE = 'last_phone';//上次登录手机号
const nothead = require('./images/nothead.png');
const official = require('./images/official.png');

var ImageConfig = {

}
ImageConfig.nothead = nothead;
ImageConfig.official = official;

var UIName = {}
UIName.LoginUI = 'LoginUI';
UIName.ForgetUI = 'ForgetUI';
UIName.RegisterUI = 'RegisterUI';
UIName.PersonalUI = 'PersonalUI';
UIName.DetailsUI = 'DetailsUI';
UIName.AddPoemUI = 'AddPoemUI';
UIName.ModifyPoemUI = 'ModifyPoemUI';
UIName.CommentUI = 'CommentUI';
UIName.LovesUI = 'LovesUI';
UIName.MsgContentUI = 'MsgContentUI';
UIName.ChatUI = 'ChatUI';
UIName.FeedbackUI = 'FeedbackUI';
UIName.PerfectUI = 'PerfectUI';
UIName.SettingUI = 'SettingUI';
UIName.WorksUI = 'WorksUI';

export {StyleConfig,HeaderConfig,StorageConfig,ImageConfig,UIName} ;
