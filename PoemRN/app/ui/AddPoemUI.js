'use strict'
/**
 * 添加作品
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View ,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  findNodeHandle,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import * as PoemsActions from '../redux/actions/PoemsActions';
import { Icon } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
// import dismissKeyboard from 'dismissKeyboard';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import WritingToolbar from '../custom/WritingToolbar';
const {width, height} = Dimensions.get('window');

import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  ImageConfig,
  pstyles,
  HttpUtil,
  showToast,
  PImage,
  Utils,
  UIName,
  Permission,
  Global,
  UIUtil,
} from '../AppUtil';
import ImagePicker from 'react-native-image-crop-picker';
import{
      NavBack,
      }from '../custom/Custom';

type Props = {
      navigation:any,
      papp:Object,
};

type State = {
      ftype:number,
      pid:number,
      title:string,
      content:string,
      align:string,//样式
      photo:string,//图片 信息
      pw:number,
      ph:number,
      labels:string,//标签
      annotation:string,//注释
      keyboardHeight:number,
      animating:boolean,
      pstyle:number,
      pzoom:boolean,
};

class AddPoemUI extends React.Component<Props,State> {
 static navigationOptions = ({navigation}) => ({
       title: navigation.state.params.nav_title,
       headerTintColor:HeaderConfig.headerTintColor,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(<NavBack navigation={navigation}/>),
       headerRight:(
         <TouchableOpacity  onPress={()=>navigation.state.params.onRelease()}>
           <Text style={pstyles.nav_right}>{navigation.state.params.nav_right}</Text>
         </TouchableOpacity>
       ),
       mode: 'modal',
    });
    onRelease:Function;
    _onChangeLabels:Function;
    _onChangeAnnotation:Function;
    keyboardDidShowListener:any;
    keyboardDidHideListener:any;
    scroll:any;
    dialog:any;
    _imageObj:Object;
    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        let ftype = params.ftype;//0 添加 1 修改
        let poem = params.poem;
        let pid = 0;
        let align = 'center';
        let title = '';
        let content = '';
        let pzoom = false;
        let photo = '';
        let pw = 0;
        let ph = 0;
        let labels = '';
        let annotation = '';
        if(ftype == 1){
          if(poem){
            pid = poem.id;
            title = poem.title;
            content = poem.content;
            if(poem.extend){
              let extend = JSON.parse(poem.extend)
              if(extend.align) align = extend.align;
              if(extend.photo&&extend.pw&&extend.ph){
                photo = extend.photo;
                pw = extend.pw;
                ph = extend.ph;
                pzoom = true;
              }
              if(extend.labels){
                labels = extend.labels;
              }
              if(extend.annotation){
                annotation = extend.annotation;
              }
            }
          }
        }
        this.state = {
            placeholder:'请输入内容',
            pid:pid,
            ftype:ftype,
            title:title,
            content:content,
            keyboardHeight:0,
            align:align,
            photo:photo,
            pw:pw,
            ph:ph,
            labels:labels,
            annotation:annotation,
            animating:false,
            pstyle:0,
            pzoom:pzoom
        }
        let nav_title = ftype == 1?'修改':'添加';
        let nav_right = ftype == 1?'提交':'发布';
        this.onRelease = this.onRelease.bind(this);
        this.props.navigation.setParams({nav_title:nav_title});
        this.props.navigation.setParams({nav_right:nav_right});
        this._onChangeLabels = this._onChangeLabels.bind(this);
        this._onChangeAnnotation = this._onChangeAnnotation.bind(this);
    }
    componentDidMount(){
      console.log('-----AddPoemUI componentDidMount------')
       this.props.navigation.setParams({onRelease:this.onRelease});
       this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
       this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    componentWillUnmount(){
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  render() {
    const { navigate } = this.props.navigation;
    return (
    <View style={pstyles.container}>
        <TextInput
          style={[styles.title,UIUtil.getTFontStyle()]}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入标题'}
          onChangeText={(text) => this.setState({title:text})}
          value={this.state.title}
          returnKeyType={'next'}
          blurOnSubmit={false}
          autoFocus={true}
          onSubmitEditing={() => this._focusNextField('content')}
        />
        <View style={styles.line}></View>
        {this._renderPhoto()}
       <View style={{flex:1}}>
        <TextInput
          ref='content'
          style={[styles.content,UIUtil.getCFontStyle()]}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入内容'}
          onChangeText={(text) => this.setState({content:text})}
          multiline={true}
          textAlign={this.state.align}
          textAlignVertical={'top'}
          value={this.state.content}
          returnKeyType={'done'}
          onFocus={(event: Event) => {

          }}
        />
      </View>
    <WritingToolbar
      align={this.state.align}
      onItem={(align)=>{
        this.setState({align:align})
      }}
      onShowSelect={()=>{
        console.log('------onShowSelect')
          // Keyboard.dismiss();
      }}
      onImagePicker={(index,style)=>{
        console.log('---onImagePicker index:'+index+' style:'+style);
          if(index == 0){
            this.takePhoto(style);
          }else if (index == 1){
            this.pickMultiple(style);
          }
          this.setState({pstyle:style})
      }}
      onLabel={()=>{
          console.log(this.state.labels)
          this.props.navigation.navigate(UIName.PoemLabelUI,{labels:this.state.labels,onChangeLabels:this._onChangeLabels});
      }}
      onAnnotation={()=>{
        this.props.navigation.navigate(UIName.AnnotationUI,{annotation:this.state.annotation,onChangeAnnotation:this._onChangeAnnotation});
      }}
      />
    {Platform.OS === 'ios' && <KeyboardSpacer/>}
    </View>
    );
  }
  _scrollToInput (reactNode: any) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  }
  _focusNextField(nextField){
    if(nextField == 'content'){
      this.refs.content.focus()
    }
  }
  _keyboardDidShow (e) {  //当键盘弹出的时候要做的事
      //拿到的值就是键盘的高度
      let keyboardHeight = e.endCoordinates.height;
      this.setState({
        keyboardHeight:keyboardHeight,
      })
  }
  _keyboardDidHide (e) {   //当键盘收缩的时候要做的事
    // alert('Keyboard Hidden');
  }
  _renderPhoto(){
    if(this.state.photo){
      if(this.state.pzoom){
        return(
          <TouchableOpacity style={styles.zoom_photo}
            onPress={()=>{
              this.setState({pzoom:false})
            }}>
            <PImage
              style={{resizeMode:'cover',width:this.getPhotoZW(),height:this.getPhotoZH()}}
              source={Utils.getPhoto(this.state.photo)}
              noborder={true}
              />
              <Image
                style={styles.zoomin}
                source={ImageConfig.zoomin}
              />
          </TouchableOpacity>
        )
      }else{
        return(
          <View style={styles.big_photo}>
            <View style={[styles.bg_photo,{height:this.getPhotoH()}]}>
              <PImage
                style={{resizeMode:'cover',width:this.getPhotoW(),height:this.getPhotoH()}}
                source={Utils.getPhoto(this.state.photo+'_big')}
                noborder={true}
                />
            </View>
              <View style={styles.photo_sidebar}>
                {this._renderItem('zoom-out',()=>{
                  this.setState({pzoom:true})
                })}
                {this._renderItem('delete',()=>{
                  this.setState({photo:''})
                })}
              </View>
          </View>
        )
      }
    }else{
      return null
    }
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
  _renderItem(icon:string,func:Function){
    return(
      <TouchableOpacity style={styles.item}
        onPress={()=>{
          func()
        }}>
        <Icon
          name={icon}
          size={30}
          type="MaterialIcons"
          color={StyleConfig.C_333333}
        />
      </TouchableOpacity>
    )
  }
  //拍照
  takePhoto(style:number){
    ImagePicker.openCamera({
      width: this.getStyleW(style),
      height: this.getStyleH(style),
      cropping: true,
      // includeBase64:true,
    }).then(image => {
      // {uri: image['path']}
      this._imageObj = image;
      this._uploadImage();
    });
  }
  //相册
  pickMultiple(style:number){
    // console.log('------width:',width)
    // console.log('------height:',height)
    ImagePicker.openPicker({
      width: this.getStyleW(style),
      height: this.getStyleH(style),
      cropping: true,
      // includeBase64:true,
    }).then(image => {
      // {uri: image['path']}
      this._imageObj = image;
      this._uploadImage();
    });
  }
  getStyleW(style:number){
    // 16:9
    // let w = 800;
    let w = width;
    if(style == 1){
      // w = 1200;
      w = width;
    }else if(style == 2){
      // w = 800;
      w = width;
    }else if(style == 3){
      // w = 600;
      w = height*9/16;
    }
    this.setState({pw:w});
    console.log('---getStyleW:',w)
    return w;
  }
  getStyleH(style:number){
    // let h = 800;
    let h = width;
    if(style == 1){
      // h = 600;
      h = width*9/16
    }else if(style == 2){
      // h = 800;
      h = width;
    }else if(style == 3){
      // h = 1200;
      h = height;//height-100;
    }
    this.setState({ph:h});
    console.log('---getStyleH:',h)
    return h;
  }
  getPhotoW(){
      let w = width-60;
      if(this.state.pw > this.state.ph){

      }
      if(this.state.pw < this.state.ph){
        let h = width-60;
        w = h*this.state.pw/this.state.ph;
      }
      return w;
  }
  getPhotoH(){
      let h = width-60;
      if(this.state.pw > this.state.ph){
        let w = width-60;
        h = w*this.state.ph/this.state.pw;
      }
      if(this.state.pw < this.state.ph){
      }
      return h;
  }
  getPhotoZW(){
    let w = 40;
    if(this.state.pw > this.state.ph){
      let h = 40;
      w = h*this.state.pw/this.state.ph;
    }
    if(this.state.pw < this.state.ph){

    }
    return w;
  }
  getPhotoZH(){
    let h = 40;
    if(this.state.pw > this.state.ph){

    }
    if(this.state.pw < this.state.ph){
      let w = 40;
      h = w*this.state.ph/this.state.pw;
    }
    return h;
  }
  _uploadImage(){
    this.setState({animating:true})
    HttpUtil.uploadImageData(this._imageObj,4).then((res)=>{
      if(res.code == 0){
        var name = res.data.name;
        if(name){
          this.setState({
            photo:name,
            pzoom:false,
          })
          console.log(name)
        }
      }else{
        showToast(res.errmsg);
      }
      this.setState({animating:false})
    }).catch((err)=>{
      console.error(err);
      this.setState({animating:false})
    })
  }
  _onChangeLabels(labels:string){
    console.log('------_onChangeLabels')
    console.log(labels);
    this.setState({labels:labels});
  }
  _onChangeAnnotation(annotation:string){
    console.log('------_onChangeAnnotation')
    console.log(annotation);
    this.setState({annotation:annotation});
  }
  onRelease(){
    var title = this.state.title;
    var content = this.state.content;
    if(!this.props.papp.userid){
      Alert.alert('登录后再发布');
      return;
    }
    if(!title){
      Alert.alert('请输入标题');
      return;
    }
    if(!content){
      Alert.alert('请输入内容');
      return;
    }
    let extend = {align:this.state.align};
    if(this.state.photo&&this.state.pw&&this.state.ph){
      let photo = {
        photo:this.state.photo,
        pw:this.state.pw,
        ph:this.state.ph,
      }
      extend = Object.assign({},extend, photo);
    }
    if(this.state.labels){
      let labels = {
        labels:this.state.labels,
      }
      extend = Object.assign({},extend, labels);
    }
    if(this.state.annotation){
      let annotation = {
        annotation:this.state.annotation,
      }
      extend = Object.assign({},extend, annotation);
    }
    console.log('------extend');
    console.log(extend);
    var json = JSON.stringify({
      id:this.state.pid,
      userid:this.props.papp.userid,
      title:title,
      content:content,
      extend:extend,
    });
    let url = HttpUtil.POEM_ADDPOEM;
    console.log('------type:')
    console.log(this.state.ftype)
    if(this.state.ftype == 1){
      url = HttpUtil.POEM_UPPOEM;
    }
    console.log('------url:',url);
    HttpUtil.post(url,json).then(res=>{
      if(res.code == 0){
          var poem = res.data;
          let { dispatch } = this.props.navigation;
          if(this.state.ftype == 0){
            dispatch(PoemsActions.raAddPoem(poem));
            showToast('发布成功')
          }else{
            dispatch(PoemsActions.raUpPoemInfo(poem));
            showToast('修改成功')
          }
          this.props.navigation.goBack();
      }else{
        // alert(res.errmsg);
        showToast(res.errmsg)
      }
    }).catch(err=>{
      console.error(err);
    })
  }

}

const styles = StyleSheet.create({
  input:{
    flex:1,
  },
  title:{
    // height:30,
    padding:10,
    fontSize:24,
  },
  content:{
    // height:height,
    padding:10,
    fontSize:18,
  },
  line:{
    height:1,
    backgroundColor:StyleConfig.C_D4D4D4,
  },
  big_photo:{
    padding:10,
    flexDirection:'row',
  },
  bg_photo:{
    alignItems:'center',
    justifyContent:'center',
    width:width-60,
    height:width-60,
  },
  photo_sidebar:{
    alignItems:'center',
    justifyContent:'center',
  },
  item:{
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  zoom_photo:{
    position: 'absolute',
    right:0,
  },
  zoomin:{
    position: 'absolute',
    right:0,
    top:0,
    width:25,
    height:25,
  }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(AddPoemUI);
