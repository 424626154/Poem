'use strict'
/**
 * Config
 * @flow
 */
var StyleConfig = {

};

// StyleConfig.C_176EB9 = '#176eb9';//深蓝
// StyleConfig.C_1E8AE8 = '#1e8ae8';//蓝色
/*白色*/
StyleConfig.C_FFFFFF = '#ffffff';
StyleConfig.C_000000 = '#000000';//黑色
StyleConfig.C_232323 = '#232323';//近黑色
StyleConfig.C_7B8992 = '#7B8992';//深灰
StyleConfig.C_D4D4D4 = '#d4d4d4';//浅灰
StyleConfig.C_FFCA28 = '#ffca28';//黄色
StyleConfig.C_E7E7E7 = '#e7e7e7';//浅灰色 列表背景
StyleConfig.C_FF4040 = '#ff4040';//红色

StyleConfig.F_22 = 22;
StyleConfig.F_18 = 18;
StyleConfig.F_14 = 14;
StyleConfig.F_12 = 12;
StyleConfig.F_10 = 10;
StyleConfig.IOS_NAV = 20;

StyleConfig.FONT_FAMILY ='HYZhongSongJ';

var HeaderConfig = {

};
HeaderConfig.headerTitleStyle = {
  fontSize:StyleConfig.F_22,
  alignSelf:'center',
  };
HeaderConfig.headerStyle = {
  backgroundColor:StyleConfig.C_FFFFFF,
  };
HeaderConfig.iosNavStyle = {
  height:20,
}
HeaderConfig.headerTintColor = StyleConfig.C_000000;

var StorageConfig = {

};
StorageConfig.USERID = 'userid';
StorageConfig.PUSHIID = 'pushid';
StorageConfig.LAST_PHONE = 'last_phone';//上次登录手机号
StorageConfig.LABEL_HISTORY = 'label_history';//标签历史


const nothead = require('./images/nothead.png');
const notphoto = require('./images/notphoto.png');
const official = require('./images/official.png');
const zoomin = require('./images/zoom_in.png');
const clear = require('./images/clear.png');
var ImageConfig = {

}
ImageConfig.nothead = nothead;
ImageConfig.notphoto = notphoto;
ImageConfig.official = official;
ImageConfig.zoomin = zoomin;
ImageConfig.clear = clear;

var UIName = {}
UIName.LoginUI = 'LoginUI';
UIName.ForgetUI = 'ForgetUI';
UIName.RegisterUI = 'RegisterUI';
UIName.PersonalUI = 'PersonalUI';
UIName.DetailsUI = 'DetailsUI';
UIName.AddPoemUI = 'AddPoemUI';
// UIName.ModifyPoemUI = 'ModifyPoemUI';
UIName.CommentUI = 'CommentUI';
UIName.LovesUI = 'LovesUI';
UIName.MsgContentUI = 'MsgContentUI';
UIName.ChatUI = 'ChatUI';
UIName.FeedbackUI = 'FeedbackUI';
UIName.PerfectUI = 'PerfectUI';
UIName.SettingUI = 'SettingUI';
UIName.WorksUI = 'WorksUI';
UIName.PhotoUI = 'PhotoUI';
UIName.AgreementUI = 'AgreementUI';
UIName.ReportUI = 'ReportUI';
UIName.ProtocolUI = 'ProtocolUI';
UIName.FollowUI = 'FollowUI';
UIName.PoemLabelUI = 'PoemLabelUI';

var Permission = {

}
Permission.WRITE = 0;

export {StyleConfig,HeaderConfig,StorageConfig,ImageConfig,UIName,Permission} ;
