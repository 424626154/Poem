'use strict';
/**
 * 修改作品
 * @flow
 */
import React from 'react';
import {connect} from 'react-redux';
import * as PoemsActions from '../redux/actions/PoemsActions';
import {
  StyleSheet,
  Text,
  View ,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Button,Icon } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import WritingToolbar from '../custom/WritingToolbar';
import {
        StyleConfig,
        HeaderConfig,
        StorageConfig,
        HttpUtil,
        pstyles,
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
    id:number,
    title:string,
    content:string,
    align:string,
};

class ModifyPoemUI extends React.Component<Props,State> {
 static navigationOptions = ({navigation}) => ({
       title: '修改',
       headerTintColor:HeaderConfig.headerTintColor,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(<NavBack navigation={navigation}/>),
       headerRight:(
         <TouchableOpacity  onPress={()=>navigation.state.params.onModify()}>
           <Text style={pstyles.nav_right}>修改</Text>
         </TouchableOpacity>
       ),
    });
    onModify:Function;
    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        console.log(params);
        let peom = params.poem;
        let align = 'center';
        if(peom.extend){
          let extend = JSON.parse(peom.extend)
          if(extend.align) align = extend.align
        }
        this.state = {
            placeholder:'请输入内容',
            title:peom.title,
            content:peom.content,
            id:peom.id,
            poem:peom,
            align:align,
        }
        this.onModify = this.onModify.bind(this);
    }
    componentDidMount(){
       this.props.navigation.setParams({onModify:this.onModify});
    }
    componentWillUnmount(){
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
  onModify(){
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
      id:this.state.id,
      userid:this.props.papp.userid,
      title:title,
      content:content,
      extend:{align:this.state.align},
    });
    HttpUtil.post(HttpUtil.POEM_UPPOEM,json).then((data)=>{
      if(data.code == 0){
        var poem = data.data;
        let { dispatch } = this.props.navigation;
        dispatch(PoemsActions.raUpPoemInfo(poem));
        showToast('修改成功')
     	  this.props.navigation.goBack();
      }else{
        showToast(data.errmsg);
      }
    }).catch((err)=>{
        console.error('保存诗歌失败:',err);
    });
  }
  _focusNextField(nextField){
    if(nextField == 'content'){
      this.refs.content.focus()
    }
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
    fontSize:20,
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
)(ModifyPoemUI);
