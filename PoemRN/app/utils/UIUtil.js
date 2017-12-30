'use strict';
/**
 * UIUtil
 * @flow
 */
import Storage from './Storage'
import Global from '../Global';
var UIUtil = {};
UIUtil.getFontSize = function(){
  var size = Storage.getFontSize();
  var tSize = 24;
  var cSize = 18;
  if(size == 0){
    tSize = 18;
    cSize = 12;
  }
  if(size == 1){

  }
  if(size == 2){
    tSize = 30;
    cSize = 24;
  }
  var fontSize = {
    tSize:tSize,
    cSize:cSize,
  }
  return fontSize;
}
UIUtil.getFontSizeFSize = function(size:number){
  var tSize = 24;
  var cSize = 18;
  if(size == 0){
    tSize = 18;
    cSize = 12;
  }
  if(size == 1){

  }
  if(size == 2){
    tSize = 30;
    cSize = 24;
  }
  var fontSize = {
    tSize:tSize,
    cSize:cSize,
  }
  return fontSize;
}
/**
 * 作品标题样式
 */
UIUtil.getTFontStyle = function(){
  return {fontFamily:Global.fontFamily,
    fontSize:UIUtil.getFontSizeFSize(Global.fontSize).tSize
  }
}
/**
 * 作品内容样式
 */
UIUtil.getCFontStyle = function(){
  return {fontFamily:Global.fontFamily,
    fontSize:UIUtil.getFontSizeFSize(Global.fontSize).cSize,
    lineHeight:Global.lineHeight,
  }
}
/**
 * 收录标题样式
 */
UIUtil.getFTFontStyle = function(){
  return {fontFamily:Global.fontFamily,
    fontSize:UIUtil.getFontSizeFSize(Global.fontSize).tSize,
  }
}
/**
 * 收录内容样式
 */
UIUtil.getFCFontStyle = function(){
  console.log('----------------fontAlignment')
  console.log(Global.fontAlignment)
  return {fontFamily:Global.fontFamily,
    fontSize:UIUtil.getFontSizeFSize(Global.fontSize).cSize,
    textAlign:Global.fontAlignment,
    lineHeight:Global.lineHeight,
  }
}
export default UIUtil;
