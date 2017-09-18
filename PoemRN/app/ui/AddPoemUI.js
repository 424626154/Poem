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
} from 'react-native';
import {RichTextEditor,RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

class AddPoemUI extends React.Component {
 static navigationOptions = ({navigation}) => ({
       title: '添加诗词',
       headerTintColor:'#ffffff',
       headerTitleStyle:{fontSize:20},
       headerLeft:(
         <TouchableOpacity  onPress={()=>navigation.goBack()}>
           <Text style={styles.nav_left}>取消</Text>
         </TouchableOpacity>
       ),
       headerRight:(
         <TouchableOpacity  onPress={()=>navigation.state.params.navigatePress()}>
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
            text:'1122'
        }
    }
    componentDidMount(){
       this.props.navigation.setParams({navigatePress:this.getHTML})
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
          style={{backgroundColor:'#d4d4d4'}}
            getEditor={() => this.richtext}
            onPressAddLink={()=>{
              Alert.alert('onPressAddLink')
            }}
            onPressAddImage={()=>Alert.alert('onPressAddImage')}
            selectedButtonStyle={{backgroundColor:'#1e8ae8'}}
            selectedIconTint={'#ffffff'}
            />
        </View>
        <KeyboardSpacer/>
      </View>
    );
  }
  onEditorInitialized(){
    // Alert.alert('onEditorInitialized')
  }
  async getHTML() {
    const contentHtml = await this.richtext.getContentHtml();
    // alert(contentHtml)
    Alert.alert(contentHtml)
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
