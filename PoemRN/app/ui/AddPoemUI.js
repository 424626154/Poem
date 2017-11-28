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
} from 'react-native';
import {connect} from 'react-redux';
import * as PoemsActions from '../redux/actions/PoemsActions';
import { Icon } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import dismissKeyboard from 'dismissKeyboard';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import WritingToolbar from '../custom/WritingToolbar';

import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  pstyles,
  HttpUtil,
  Emitter,
  showToast,
} from '../AppUtil';

import{
      NavBack,
      }from '../custom/Custom';

type Props = {
      navigation:any,
      papp:Object,
};

type State = {
      title:string,
      content:string,
      align:string,
      keyboardHeight:number,
};

class AddPoemUI extends React.Component<Props,State> {
 static navigationOptions = ({navigation}) => ({
       title: '添加',
       headerTintColor:HeaderConfig.headerTintColor,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(<NavBack navigation={navigation}/>),
       headerRight:(
         <TouchableOpacity  onPress={()=>navigation.state.params.onRelease()}>
           <Text style={pstyles.nav_right}>发布</Text>
         </TouchableOpacity>
       ),
    });
    onRelease:Function;
    keyboardDidShowListener:any;
    keyboardDidHideListener:any;
    scroll:any;
    constructor(props) {
        super(props);
        this.state = {
            placeholder:'请输入内容',
            value:'',
            title:'',
            content:'',
            keyboardHeight:0,
            align:'center',
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
          textAlign={this.state.align}
          textAlignVertical={'top'}
          value={this.state.content}
          onFocus={(event: Event) => {

          }}
        />
      </View>
    <WritingToolbar
      align={this.state.align}
      onItem={(align)=>{
        this.setState({align:align})
      }}
      />
    <KeyboardSpacer/>
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
    var json = JSON.stringify({
      userid:this.props.papp.userid,
      title:title,
      content:content,
      extend:{align:this.state.align},
    });
    HttpUtil.post(HttpUtil.POEM_ADDPOEM,json).then(res=>{
      if(res.code == 0){
          var poem = res.data;
          let { dispatch } = this.props.navigation;
          dispatch(PoemsActions.raAddPoem(poem));
          showToast('发布成功')
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
    fontFamily: StyleConfig.FONT_FAMILY,
  },
  content:{
    // height:height,
    padding:10,
    fontSize:18,
    fontFamily: StyleConfig.FONT_FAMILY,
  },
  line:{
    height:1,
    backgroundColor:StyleConfig.C_D4D4D4,
  },
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(AddPoemUI);
