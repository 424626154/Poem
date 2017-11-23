import {
  Dimensions
} from 'react-native';
const Global = {
    // user:{
    //   userid:'',
    //   head:'',
    //   pseudonym:'',
    //   myfollow:0,
    //   followme:0,
    // },
    // uppoem:{},
    // width:0,
    // height:0,
    userid:'',
};
const {width, height} = Dimensions.get('window');
Global.width = width;
Global.height = height;
// console.log(Global);
export default Global;
