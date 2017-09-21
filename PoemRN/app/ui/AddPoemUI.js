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
} from 'react-native';
import {RichTextEditor,RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import SQLite from '../db/Sqlite';
const sqlite = new SQLite();
import PoemModel from '../db/PoemModel';

const bold = require('../images/ic_format_bold_black.png');
const italic = require('../images/ic_format_italic_black.png');
const align_left = require('../images/ic_format_align_left_black.png');
const align_center = require('../images/ic_format_align_center_black.png');

class AddPoemUI extends React.Component {
 static navigationOptions = ({navigation}) => ({
       title: '添加',
       headerTintColor:'#ffffff',
       headerTitleStyle:{fontSize:20},
       headerLeft:(
         <TouchableOpacity  onPress={()=>navigation.goBack()}>
           <Text style={styles.nav_left}>取消</Text>
         </TouchableOpacity>
       ),
       headerRight:(
         <TouchableOpacity  onPress={()=>navigation.state.params.oGetContentHtml()}>
           <Text style={styles.nav_right}>发布</Text>
         </TouchableOpacity>
       ),
       headerStyle:{
         backgroundColor:'#1e8ae8',
       },
    });
    constructor(props) {
        super(props);
        this.state = {
            placeholder:'请输入内容',
            value:'',
            userid:'',
        }
        this.oGetContentHtml = this.oGetContentHtml.bind(this);
    }
    componentDidMount(){
       this.props.navigation.setParams({oGetContentHtml:this.oGetContentHtml})
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
      <View style={styles.container}>
      <RichTextEditor
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
        </View>
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
  async oGetContentHtml() {
    const contentHtml = await this.richtext.getContentHtml();

    if(!contentHtml){
      Alert.alert('请输入发布内容')
    }
    if(!this.state.userid){
      Alert.alert('登录后再发布')
    }
    var url = 'http://192.168.1.6:3000/poem/addpoem';
    var json = JSON.stringify({
      userid:this.state.userid,
      poem:contentHtml,
    });
    var that = this;
    fetch(url,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: json,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.code == 0){
            var poem = responseJson.data;
            sqlite.savePoem(poem).then(()=>{
                DeviceEventEmitter.emit('AddPoem',poem);
             	  that.props.navigation.goBack();
             	}).catch((err)=>{
             	    Alert.alert('保存诗歌失败:',err);
             	});
        }else{
          alert(responseJson.errmsg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


}
const markdownStyles = {
  heading1: {
    fontSize: 24,
    color: 'purple',
  },
  link: {
    color: 'pink',
  },
  mailTo: {
    color: 'orange',
  },
  text: {
    color: '#555555',
  },
  richText: {
     alignItems:'center',
     justifyContent: 'center',
     backgroundColor: 'transparent',
     marginTop: 60
   },
   toolbar:{
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0
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
  }
});

export {AddPoemUI};
