'use strict'
/**
 * Global
 * @flow
 */
import {
  Dimensions
} from 'react-native';
import Storage from './utils/Storage';
const Global = {
    // user:{
    //   userid:'',
    //   head:'',
    //   pseudonym:'',
    //   myfollow:0,
    //   followme:0,
    // },
    // uppoem:{},
    width:0,
    height:0,
    userid:'',
    per:0,
    fontFamily:Storage.getFontFamily(),
    fontSize:Storage.getFontSize(),
    fontAlignment:Storage.getFontAlignment(),
    lineHeight:Storage.getLineHeight(),
};
const {width, height} = Dimensions.get('window');
Global.width = width;
Global.height = height;
// console.log(Global);
export default Global;
