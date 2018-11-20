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
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import {SafeAreaView } from 'react-navigation';
import * as DiscussActions from '../redux/actions/DiscussActions';
import { Icon } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import WritingToolbar from '../custom/WritingToolbar';
const {width, height} = Dimensions.get('window');
const pitem = (width-50)/3;

import {
  StyleConfig,
  HeaderConfig,
  ImageConfig,
  pstyles,
  HttpUtil,
  showToast,
  Utils,
  UIName,
  Global,
  UIUtil,
} from '../AppUtil';
import ImagePicker from 'react-native-image-crop-picker';
import GridView from 'react-native-super-grid';
import{
      NavBack,
      }from '../custom/Custom';

type Props = {
      navigation:any,
      app:Object,
};

type State = {
      title:string,
      content:string,
      photos:Array<Object>,//图片 信息[{photo,pw,ph}]
      keyboardHeight:number,
      animating:boolean,
      pstyle:number,
      links:Array<Object>,
};

class AddDiscussUI extends React.Component<Props,State> {
 static navigationOptions = ({navigation}) => ({
       title: '想法',
       headerTintColor:HeaderConfig.headerTintColor,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(<NavBack navigation={navigation}/>),
       headerRight:(
         <TouchableOpacity  onPress={()=>navigation.state.params.onRelease()}>
           <Text style={pstyles.nav_right}>{'发布'}</Text>
         </TouchableOpacity>
       ),
       mode: 'modal',
    });
    onRelease:Function;
    _onDelPhoto:Function;
    _renderPhotoItem:Function;
    keyboardDidShowListener:any;
    keyboardDidHideListener:any;
    scroll:any;
    dialog:any;
    _imageObj:Object;
    constructor(props) {
        super(props);
        let pid = 0;
        let align = 'center';
        let title = '';
        let content = '';
        let pzoom = false;
        this.state = {
            placeholder:'请输入内容',
            pid:pid,
            title:title,
            content:content,
            keyboardHeight:0,
            photos:[],
            animating:false,
            pstyle:0,
            links:[],
        }
        this.onRelease = this.onRelease.bind(this);
        this._onDelPhoto = this._onDelPhoto.bind(this);
        this._renderPhotoItem = this._renderPhotoItem.bind(this);
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
      <SafeAreaView style={pstyles.safearea}>
        <View style={pstyles.container}>
            <TextInput
              style={styles.title}
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
           <View style={{flex:1}}>
            <TextInput
              ref='content'
              style={styles.content}
              underlineColorAndroid={'transparent'}
              placeholder={'请输入内容'}
              onChangeText={(text) => this.setState({content:text})}
              multiline={true}
              // textAlign={'left'}
              // textAlignVertical={'top'}
              value={this.state.content}
              returnKeyType={'done'}
              onFocus={(event: Event) => {

              }}
            />
          </View>
          {this._renderPhoto()}
        <WritingToolbar
          onShowSelect={()=>{
            console.log('------onShowSelect')
              // Keyboard.dismiss();
          }}
          onImagePicker={(index,style)=>{
            console.log('---onImagePicker index:'+index+' style:'+style);
            if(this.state.photos.length >= 9){
              showToast('最多选择9张')
              return;
            }
              if(index == 0){
                this.takePhoto(style);
              }else if (index == 1){
                this.pickMultiple(style);
              }
              this.setState({pstyle:style})
          }}
          align={'center'}
          hiddenAlign={true}
          hiddenLabel={true}
          hiddenAnnot={true}
          />
        {Platform.OS === 'ios' && <KeyboardSpacer/>}
        {this._renderLoading()}
        </View>
      </SafeAreaView>
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
    if(this.state.photos.length > 0){
      return(
        <GridView
          itemDimension={pitem}
          items={this.state.photos}
          renderItem={this._renderPhotoItem}
        />
      )
    }else{
      return null
    }
  }
  _renderPhotoItem(item){
    console.log('---_renderPhotoItem')
    console.log(item)
    const photo_url = Utils.getPhoto(item.photo);
    console.log(photo_url)
    return(
      <TouchableOpacity style={styles.photo_item}
        onPress={()=>{
          this._onShowPhoto(item);
        }}
        >
        <Image
          style={styles.photo_item_image}
          source={photo_url}
        />
        <TouchableOpacity
          style={styles.photo_item_del_bg}
          onPress={()=>{
              this._onDelPhoto(item)
          }}>
          <Image
            style={styles.photo_item_del}
            source={ImageConfig.photo_del}
          />
        </TouchableOpacity>
      </TouchableOpacity>
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
  _onDelPhoto(item){
    var photos = this.state.photos;
    for(var i = photos.length -1 ; i >= 0 ; i -- ){
      if(photos[i].id == item.id){
        photos.splice(i,1);
      }
    }
    for(var i = 0 ; i <  photos.length ; i ++ ){
      photos[i].id = i;
    }
    this.setState({photos:photos});
  }
  _onShowPhoto(item){
    let photos = this.state.photos;
    let index = 0;
    for(var  i = 0 ; i < this.state.photos.length ; i ++){
      // let temp = this.state.photos[i];
      // let photo = {
      //    url:HttpUtil.getHeadurl(temp.photo),
      //    width: temp.pw,
      //    height: temp.ph,
      //  }
      //  photos.push(photo);
      if(this.state.photos[i].id == item.id){
        index = i;
      }
    }
    this.props.navigation.navigate(UIName.GalleryUI,{index:index,images:photos})
  }
  //拍照
  takePhoto(style:number){
    var pw = this.getStyleW(style) ;
    var ph = this.getStyleH(style) ;
    ImagePicker.openCamera({
      width:pw,
      height:ph,
      cropping: true,
      // includeBase64:true,
    }).then(image => {
      // {uri: image['path']}
      this._imageObj = image;
      this._uploadImage(pw,ph);
    });
  }
  //相册
  pickMultiple(style:number){
    // console.log('------width:',width)
    // console.log('------height:',height)
    var pw = this.getStyleW(style) ;
    var ph = this.getStyleH(style) ;
    ImagePicker.openPicker({
      width:pw,
      height:ph,
      cropping: true,
      // includeBase64:true,
    }).then(image => {
      // {uri: image['path']}
      this._imageObj = image;
      this._uploadImage(pw,ph);
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
    return h;
  }
  _uploadImage(pw,ph){
    this.setState({animating:true})
    HttpUtil.uploadImageData(this._imageObj,4).then((res)=>{
      if(res.code == 0){
        var name = res.data.name;
        if(name){
          var id = this.state.photos.length;
          var photo = {id:id,photo:name,pw:pw,ph:ph,}
          var photos = this.state.photos;
          photos =photos.concat([photo])
          this.setState({
            photos:photos,
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

  onRelease(){
    if(!Utils.isLogin(this.props.navigation)){
        return;
    }
    if(this.state.animating){
      return;
    }
    this.setState({animating:true})
    var title = this.state.title;
    var content = this.state.content;
    if(!title){
      Alert.alert('请输入标题');
      return;
    }
    if(!content){
      Alert.alert('请输入内容');
      return;
    }
    var reg = /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ig;
    let links_arry = [];
    this.state.content.replace(reg,(url) => {
      links_arry.push({url:url})
      return url;
    });
    let extend = {};
    if(this.state.photos.length > 0){
      let photos = {photos:this.state.photos};
      extend = Object.assign({},extend,photos);
    }
    if(links_arry.length > 0){
      let links = {links:links_arry};
      extend = Object.assign({},extend,links);
    }
    console.log('------extend');
    console.log(extend);
    var json = JSON.stringify({
      userid:this.props.app.userid,
      title:title,
      content:content,
      extend:extend,
    });
    HttpUtil.post(HttpUtil.DISCUSS_ADD,json).then(res=>{
      if(res.code == 0){
          var poem = res.data;
          let { dispatch } = this.props.navigation;
          dispatch(DiscussActions.raAddDiscuss(poem));
          showToast('发布成功')
          this.props.navigation.goBack();
      }else{
        // alert(res.errmsg);
        showToast(res.errmsg)
      }
      this.setState({animating:false})
    }).catch(err=>{
      this.setState({animating:false})
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
    backgroundColor:StyleConfig.C_BFBFBF,
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
  },
  photo_item:{
    width:pitem,
    height:pitem,
    backgroundColor:StyleConfig.C_BFBFBF,
  },
  photo_item_image:{
    width:pitem,
    height:pitem,
  },
  photo_item_del_bg:{
    width:30,
    height:30,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  photo_item_del:{
    width:30,
    height:30,
    tintColor:StyleConfig.C_BFBFBF,
  },
});
export default connect(
    state => ({
        app: state.papp,
    }),
)(AddDiscussUI);
