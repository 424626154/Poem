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
} from 'react-native';
// import {RichTextEditor,RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import dismissKeyboard from 'dismissKeyboard'

import pstyles from '../style/PStyles';
import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
// import SQLite from '../db/Sqlite';
// const sqlite = new SQLite();
import HttpUtil from '../utils/HttpUtil';
import Emitter from '../utils/Emitter';

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
            userid:'',
            title:'',
            content:'',
        }
        this.onGetContentHtml = this.onGetContentHtml.bind(this);
        this.onRelease = this.onRelease.bind(this);
    }
    componentDidMount(){
       this.props.navigation.setParams({onGetContentHtml:this.onGetContentHtml});
       this.props.navigation.setParams({onRelease:this.onRelease});
       AsyncStorage.getItem('userid',(error,result)=>{
         if(!error){
           var islogin = false;
           if(result){
             islogin = true;
           }
           this.setState({
             islogin:islogin,
             userid:result,
           })
           if(!islogin){
             this.props.navigation.navigate('LoginUI')
           }
         }
       })
    }
    componentWillUnMount(){

    }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
      {/* <RichTextEditor
          ref={(r)=>this.richtext = r}
          style={styles.richText}
          contentInset={{right: 0, left: 0}}
          bounces={false}
          hiddenTitle={true}
          enableOnChange={true}
          contentPlaceholder={this.state.placeholder}
          initialContentHTML={this.state.value}
          editorInitializedCallback={() => this.onEditorInitialized()}
          />
        <View style={styles.toolbar}>
          <RichTextToolbar
            style={{backgroundColor:'#ffffff', borderTopWidth: 1,borderTopColor:'#d4d4d4'}}
            getEditor={() => this.richtext}
            iconTint='#d4d4d4'
            selectedButtonStyle={{backgroundColor:'#0f88eb'}}
            selectedIconTint={'#ffffff'}
            actions={['bold','italic','justifyLeft','justifyCenter']}
            iconMap={{bold:bold,italic:italic,justifyLeft:align_left,justifyCenter:align_center}}
            />
        </View> */}
        <TextInput
          style={styles.title}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入标题'}
          onChangeText={(text) => this.setState({title:text})}
          value={this.state.title}
        />
        <View style={styles.line}></View>
        <TextInput
          style={styles.content}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入内容'}
          onChangeText={(text) => this.setState({content:text})}
          multiline={true}
          textAlign={'center'}
          textAlignVertical={'top'}
          value={this.state.content}
        />
        <KeyboardSpacer/>
      </ScrollView>
    );
  }
  onEditorInitialized(){
    this.setFocusHandlers();
    this.getHTML();
  }
  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    // alert(titleHtml + ' ' + contentHtml)
  }
  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
  }
  async onGetContentHtml() {
    const contentHtml = await this.richtext.getContentHtml();
    if(!contentHtml){
      Alert.alert('请输入发布内容')
    }
    if(!this.state.userid){
      Alert.alert('登录后再发布')
    }
    var json = JSON.stringify({
      userid:this.state.userid,
      poem:contentHtml,
    });
    HttpUtil.post(HttpUtil.POEM_ADDPOEM,json).then(res=>{
      if(res.code == 0){
          var poem = res.data;
          Emitter.emit(Emitter.ADDPOEM,poem);
          this.props.navigation.goBack();
          // sqlite.savePoem(poem).then(()=>{
          //   }).catch((err)=>{
          //       console.error(err);
          //   });
      }else{
        alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
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
          // sqlite.savePoem(poem).then(()=>{
          //   }).catch((err)=>{
          //       console.error(err);
          //   });
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
    padding:0,
    fontSize:30,
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
