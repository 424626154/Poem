'use strict';
/**
 * 更新作品
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

import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  HttpUtil,
} from '../AppUtil';



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
            poem:params.poem,
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
      <View style={styles.container}>
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
    });
    HttpUtil.post(HttpUtil.POEM_UPPOEM,json).then((data)=>{
      if(data.code == 0){
        var poem = data.data;
        let { dispatch } = this.props.navigation;
        dispatch(PoemsActions.raUpPoemInfo(poem));
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
export default connect(
    state => ({
        papp: state.papp,
    }),
)(ModifyPoemUI);
