/**
 * 完善资料
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
        DeviceEventEmitter,
      } from 'react-native';
import {connect} from 'react-redux';
import * as Actions from '../redux/actions/Actions';
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
    Emitter,
    Utils,
    } from '../AppUtil';
const nothead = require('../images/nothead.png');
const mhead = require('../images/modify.png');

class PerfectUI extends BaseUI{
  static navigationOptions = ({navigation}) => ({
        title: '完善资料',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(
          <TouchableOpacity  onPress={()=>{
            navigation.goBack()
          }}>
            <Text style={styles.nav_left}>放弃</Text>
          </TouchableOpacity>
        ),
        headerRight:(
          <TouchableOpacity  onPress={()=>navigation.state.params._onSave()}>
            <Text style={styles.nav_right}>保存</Text>
          </TouchableOpacity>
        ),
     });
  _imageObj = {};
  constructor(props){
    super(props)
    console.log('------PerfectUI() constructor');
    let papp = this.props.papp;
    this.papp = papp||{};
    this.state = {
        headurl:nothead,
        sheadurl:'',
        pseudonym:'',
    }
    this.showAlertSelected = this.showAlertSelected.bind(this);
    this.callbackSelected = this.callbackSelected.bind(this);
    this._onSave = this._onSave.bind(this);
  }
  componentDidMount(){
    let user = this.papp.user;
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
      <View style={styles.container}>
        {/* ---修改头像--- */}
        <TouchableOpacity
          onPress={() => {this.showAlertSelected()}}
        >
          <View style={styles.head_bg}>
            <Image
              style={pstyles.big_head}
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
      </View>
    )
  }

  _onSave(){
    if(!this.state.pseudonym){
      Alert.alert('请输入笔名')
      return;
    }
    let strlen = Utils.strlen(this.state.pseudonym);
    // console.log(strlen);
    if(strlen > 20){
      Alert.alert('笔名过长')
      return;
    }
    if(!this.state.sheadurl){
      Alert.alert('请选择头像')
      return;
    }
    var json = JSON.stringify({
      head:this.state.sheadurl,
      pseudonym:this.state.pseudonym,
      userid:this.papp.userid,
    })
    HttpUtil.post(HttpUtil.USER_UPINFO,json).then((res)=>{
      if(res.code == 0 ){
        let user = res.data;
        let { dispatch } = this.props.navigation;
        dispatch(Actions.raUpInfo(user.userid,user.head,user.pseudonym));
        const fui = this.props.navigation.state.params.fui;
        console.log('------fui:'+fui);
        if(fui){
          this.props.navigation.goBack(fui);
        }else{
          this.props.navigation.goBack();
        }
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }
  _uploadImage(){
    HttpUtil.uploadImageData(this._imageObj).then((res)=>{
      if(res.code == 0){
        var name = res.data.name;
        if(name){
          this.setState({
            sheadurl:name,
          })
        }
      }else{
        Alert.alert(res.errmsg);
      }
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
        cropping: true
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
        cropping: true
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
  container: {
    flex: 1,
    alignItems:'center',
  },
  nav_left:{
    fontSize:18,
    color:'#ffffff',
    marginLeft:10,
  },
  nav_right:{
    fontSize:18,
    color:'#ffffff',
    marginRight:10,
  },
  head_bg:{
    marginTop:40,
    alignItems:'center',
    height:120,
    width:120,
  },
  head:{
    height:120,
    width:120,
  },
  mhead:{
    width:20,
    height:20,
    right:1,
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
      borderBottomColor:'#d4d4d4',
  }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(PerfectUI);
