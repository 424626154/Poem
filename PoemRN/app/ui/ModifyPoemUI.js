import React from 'react';
import { Button,Icon } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View ,
  Alert,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
  AsyncStorage,
} from 'react-native';
// import {RichTextEditor,RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
// import SQLite from '../db/Sqlite';
// const sqlite = new SQLite();
import HttpUtil  from '../utils/HttpUtil';
import Emitter from '../utils/Emitter';
import Global from '../Global';

const bold = require('../images/ic_format_bold_black.png');
const italic = require('../images/ic_format_italic_black.png');
const align_left = require('../images/ic_format_align_left_black.png');
const align_center = require('../images/ic_format_align_center_black.png');

/**
 * 修改作品
 */
class ModifyPoemUI extends React.Component {
 static navigationOptions = ({navigation}) => ({
       title: '修改',
       headerTintColor:StyleConfig.C_FFFFFF,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(
         <TouchableOpacity  onPress={()=>navigation.goBack()}>
           <Text style={styles.nav_left}>取消</Text>
         </TouchableOpacity>
       ),
       headerRight:(
         <TouchableOpacity  onPress={()=>navigation.state.params.onModify()}>
           <Text style={styles.nav_right}>修改</Text>
         </TouchableOpacity>
       ),
    });
    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        console.log(params);
        this.state = {
            placeholder:'请输入内容',
            title:params.poem.title,
            content:params.poem.content,
            id:params.id,
            userid:Global.user.userid,
            poem:params.poem,
        }
        this.onGetContentHtml = this.onGetContentHtml.bind(this);
        this.onModify = this.onModify.bind(this);
    }
    componentDidMount(){
       this.props.navigation.setParams({onGetContentHtml:this.onGetContentHtml});
       this.props.navigation.setParams({onModify:this.onModify});
    }
    componentWillUnMount(){
    }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
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
      </View>
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
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.state.userid,
      poem:contentHtml,
    });
    HttpUtil.post(HttpUtil.POEM_UPPOEM,json).then((data)=>{
      if(data.code == 0){
        var poem = data.data;
        // sqlite.updateAllPoem(poem).then((data)=>{
        //
        // })
        // sqlite.updatePoem(poem).then((data)=>{
        //
        // })
        Emitter.emit(Emitter.UPPOEM,poem);
     	  this.props.navigation.goBack();
      }else{
        Alert.alert(data.errmsg);
      }
    }).catch((err)=>{
        Alert.alert('保存诗歌失败:',err);
    });
  }
  onModify(){
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
      id:this.state.id,
      userid:this.state.userid,
      title:title,
      content:content,
    });
    HttpUtil.post(HttpUtil.POEM_UPPOEM,json).then((data)=>{
      if(data.code == 0){
        var poem = data.data;
        // sqlite.updateAllPoem(poem).then((data)=>{
        //
        // })
        // sqlite.updatePoem(poem).then((data)=>{
        //
        // })
        Emitter.emit(Emitter.UPPOEM,poem);
     	  this.props.navigation.goBack();
      }else{
        Alert.alert(data.errmsg);
      }
    }).catch((err)=>{
        Alert.alert('保存诗歌失败:',err);
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding:10,
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

export {ModifyPoemUI};
