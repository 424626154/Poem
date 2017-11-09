// 添加作品
import React from 'react';
import { Button,Icon } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View ,
  Alert,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  DeviceEventEmitter,
  Keyboard,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  findNodeHandle,
} from 'react-native';
// import {RichTextEditor,RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import dismissKeyboard from 'dismissKeyboard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  pstyles,
  HttpUtil,
  Emitter,
  Global,
} from '../AppUtil';


const bold = require('../images/ic_format_bold_black.png');
const italic = require('../images/ic_format_italic_black.png');
const align_left = require('../images/ic_format_align_left_black.png');
const align_center = require('../images/ic_format_align_center_black.png');

const {width, height} = Dimensions.get('window');

class AddPoemUI extends React.Component {
 static navigationOptions = ({navigation}) => ({
       title: '添加',
       headerTintColor:StyleConfig.C_FFFFFF,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(
         <TouchableOpacity  onPress={()=>navigation.goBack()}>
           <Text style={pstyles.nav_left}>取消</Text>
         </TouchableOpacity>
       ),
       headerRight:(
         <TouchableOpacity  onPress={()=>navigation.state.params.onRelease()}>
           <Text style={pstyles.nav_right}>发布</Text>
         </TouchableOpacity>
       ),
    });
    constructor(props) {
        super(props);
        this.state = {
            placeholder:'请输入内容',
            value:'',
            userid:Global.user.userid,
            title:'',
            content:'',
            keyboardHeight:0,
        }
        this.onRelease = this.onRelease.bind(this);
    }
    componentDidMount(){
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
          style={styles.title}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入标题'}
          onChangeText={(text) => this.setState({title:text})}
          value={this.state.title}
          returnKeyType={'next'}
          blurOnSubmit={false}
          onSubmitEditing={() => this._focusNextField('content')}
        />
        <View style={styles.line}></View>
        <KeyboardAwareScrollView
          innerRef={ref => {this.scroll = ref}}
        >
          <View>
        <TextInput
          ref='content'
          style={styles.content}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入内容'}
          onChangeText={(text) => this.setState({content:text})}
          multiline={true}
          textAlign={'center'}
          textAlignVertical={'top'}
          value={this.state.content}
          onChange={({x, y, width, height})=>{
            // console.log(height)
          }}
          onLayout={(event)=>{
            // console.log('---onLayout---')
            // this._scrollToInput(ReactNative.findNodeHandle(event.target))
          }}
          onSubmitEditing={(event: Event) => {
            // console.log('---onSubmitEditing--')
            // console.log(event.nativeEvent)
            // console.log(event)
            // console.log(this.state.keyboardHeight)
            // console.log(this.scroll)
            // this.scroll.props.scrollToPosition(0, 0)
          }}
          onContentSizeChange={(event) => {
            // console.log(event.nativeEvent.contentSize);
            // console.log(event.nativeEvent.contentSize.height)
           }}
           onScroll={(event)=>{
            //  console.log('---onScroll--')
            //  console.log(event)
           }}
          onFocus={(event: Event) => {
            // `bind` the function if you're using ES6 classes
             this._scrollToInput(ReactNative.findNodeHandle(event.target))
           }}
        />
      </View>
    </KeyboardAwareScrollView>
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
  onRelease(){
    var title = this.state.title;
    var content = this.state.content;
    if(!this.state.userid){
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
    var json = JSON.stringify({
      userid:this.state.userid,
      title:title,
      content:content
    });
    HttpUtil.post(HttpUtil.POEM_ADDPOEM,json).then(res=>{
      if(res.code == 0){
          var poem = res.data;
          Emitter.emit(Emitter.ADDPOEM,poem);
          this.props.navigation.goBack();
      }else{
        alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }

}
// const markdownStyles = {
//   heading1: {
//     fontSize: 24,
//     color: 'purple',
//   },
//   link: {
//     color: 'pink',
//   },
//   mailTo: {
//     color: 'orange',
//   },
//   text: {
//     color: '#555555',
//   },
//   richText: {
//      alignItems:'center',
//      justifyContent: 'center',
//      backgroundColor: 'transparent',
//      marginTop: 60
//    },
//    toolbar:{
//      position: 'absolute',
//      top: 0,
//      left: 0,
//      right: 0
//    }
// }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding:10,
  },
  input:{
    flex:1,
  },
  title:{
    // height:30,
    backgroundColor: '#ffffff',
    padding:4,
    fontSize:24,
  },
  content:{
    // height:height,
    padding:0,
    fontSize:20,
  },
  line:{
    height:1,
    backgroundColor:StyleConfig.C_D4D4D4,
  },
});

export {AddPoemUI};
