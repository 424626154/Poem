'use strict'
/**
 * 完善资料
 * @flow
 */
import React from 'react';
import {
        StyleSheet,
        View,
        TouchableOpacity,
        Alert,
        Text,
        Image,
        TextInput,
        ActivityIndicator,
      } from 'react-native';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
import BaseUI from '../BaseUI';

import ImagePicker from 'react-native-image-crop-picker';

import DialogSelected from '../utils/AlertSelected';
const selectedArr = ["拍照", "图库"];

import{
      StyleConfig,
      HeaderConfig,
      StorageConfig,
      pstyles,
      HttpUtil,
      Utils,
      showToast,
      } from '../AppUtil';

import{
      NavBack,
      }from '../custom/Custom';

const nothead = require('../images/nothead.png');
const mhead = require('../images/modify.png');

type Props = {
    papp:Object,
    navigation:any,
};

type State = {
    headurl:any,
    pseudonym:string,
    sheadurl:string,
    animating:boolean,
};

class PerfectUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title: '完善资料',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(
          <TouchableOpacity  onPress={()=>navigation.state.params._onSave()}>
            <Text style={pstyles.nav_right}>保存</Text>
          </TouchableOpacity>
        ),
     });
  _imageObj = {};
  showAlertSelected:Function;
  callbackSelected:Function;
  _onSave:Function;
  dialog:any;
  constructor(props){
    super(props)
    console.log('------PerfectUI() constructor');
    this.state = {
        headurl:nothead,
        sheadurl:'',
        pseudonym:'',
        animating:false,
    }
    this.showAlertSelected = this.showAlertSelected.bind(this);
    this.callbackSelected = this.callbackSelected.bind(this);
    this._onSave = this._onSave.bind(this);
  }
  componentDidMount(){
    let user = this.props.papp.user;
    let headurl = Utils.getHead(user.head);
    let pseudonym = user.pseudonym;
    let sheadurl = '';
    if(user.head){
      sheadurl = user.head;
    }
    this.setState({
      headurl:headurl,
      pseudonym:pseudonym,
      sheadurl:sheadurl,
    })
    this.props.navigation.setParams({_onSave:this._onSave})
  }
  componentWillUnmount(){

  }
  render(){
    return(
      <View style={[pstyles.container,styles.container]}>
        {/* ---修改头像--- */}
        <TouchableOpacity
          onPress={() => {this.showAlertSelected()}}
        >
          <View style={styles.head_bg}>
            <Image
              style={styles.head}
              source={this.state.headurl}
              />
              <Image
                style={styles.mhead}
                source={mhead}
                />
          </View>
        </TouchableOpacity>
        {/* ---笔名--- */}
        <View style={styles.input_bg}>
            <TextInput
              style={styles.input}
              underlineColorAndroid={'transparent'}
              placeholder={'请输入笔名'}
              onChangeText={(text) => this.setState({pseudonym:text})}
              value={this.state.pseudonym}
              returnKeyType={'done'}
            />
        </View>
        <DialogSelected ref={(dialog)=>{
                   this.dialog = dialog;
               }} />
        {this._renderLoading()}
      </View>
    )
  }
  _renderLoading(){
    if(this.state.animating){
      return(
        <View style={pstyles.loading}>
          <ActivityIndicator
           animating={this.state.animating}
           style={pstyles.centering}
           color="white"
           size="large"/>
        </View>
      )
    }else{
      return null;
    }
  }
  _onSave(){
    if(!this.state.pseudonym){
      showToast('请输入笔名')
      return;
    }
    let strlen = Utils.strlen(this.state.pseudonym);
    // console.log(strlen);
    if(strlen > 20){
      showToast('笔名过长')
      return;
    }
    if(!this.state.sheadurl){
      showToast('请选择头像')
      return;
    }
    var json = JSON.stringify({
      head:this.state.sheadurl,
      pseudonym:this.state.pseudonym,
      userid:this.props.papp.userid,
    })
    HttpUtil.post(HttpUtil.USER_UPINFO,json).then((res)=>{
      if(res.code == 0 ){
        let user = res.data;
        let { dispatch } = this.props.navigation;
        dispatch(UserActions.raUpInfo(user.userid,user.head,user.pseudonym));
        const fui = this.props.navigation.state.params.fui;
        console.log('------fui:'+fui);
        if(fui){
          this.props.navigation.goBack(fui);
        }else{
          this.props.navigation.goBack();
        }
      }else{
        showToast(res.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }
  _uploadImage(){
    this.setState({animating:true});
    HttpUtil.uploadImageData(this._imageObj).then((res)=>{
      if(res.code == 0){
        var name = res.data.name;
        if(name){
          this.setState({
            sheadurl:name,
          })
        }
      }else{
        showToast(res.errmsg);
      }
      this.setState({animating:false});
    }).catch((err)=>{
      console.error(err);
    })
  }
  showAlertSelected(){
        this.dialog.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
  }
    // 回调
    callbackSelected(i){
        switch (i){
            case 0: // 拍照
                this.takePhoto();
                break;
            case 1: // 图库
                this.pickMultiple();
                break;
        }
    }
    takePhoto(){
      ImagePicker.openCamera({
        width: 800,
        height: 800,
        cropping: true,
        includeBase64:true,
      }).then(image => {
        this.setState({
            headurl: {uri: image['path']}
        });
        this._imageObj = image;
        this._uploadImage();
      });
    }
    pickMultiple(){
      ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        includeBase64:true,
      }).then(image => {
        this.setState({
            headurl: {uri: image['path']}
        });
        this._imageObj = image;
        this._uploadImage();
      });
    }
}

const styles = StyleSheet.create({
  container:{
    alignItems:'center',
  },
  head_bg:{
    marginTop:40,
    alignItems:'center',
    justifyContent:'center',
    height:122,
    width:122,
    backgroundColor:StyleConfig.C_FFFFFF,
    borderWidth:1,
    borderColor:StyleConfig.C_333333,
    borderRadius:15,
  },
  head:{
    height:120,
    width:120,
    resizeMode:'cover',
    // 设置圆角
    borderRadius:15,
  },
  mhead:{
    width:20,
    height:20,
    position: 'absolute',//相对父元素进行绝对定位
    top: 0,
    right: 0,
  },
  input_bg:{
    paddingTop:20,
  },
  input:{
      width:200,
      fontSize:22,
      borderBottomWidth:1,
      borderBottomColor:StyleConfig.C_D4D4D4,
  }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(PerfectUI);
