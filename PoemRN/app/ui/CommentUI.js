import React from 'react';
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

import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
// import SQLite from '../db/Sqlite';
// const sqlite = new SQLite();
import HttpUtil  from '../utils/HttpUtil';
import Emitter from '../utils/Emitter';
/**
 * 评论
 */
class CommentUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
        title: '评论',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(
          <TouchableOpacity  onPress={()=>navigation.goBack()}>
            <Text style={styles.nav_left}>取消</Text>
          </TouchableOpacity>
        ),
        headerRight:(
          <TouchableOpacity  onPress={()=>navigation.state.params._onRelease()}>
            <Text style={styles.nav_right}>发布</Text>
          </TouchableOpacity>
        ),
     });

  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      id:params.id,
      cid:params.cid,
      userid:'',
    }
    this._onRelease = this._onRelease.bind(this);
  }

  componentDidMount(){
    this.props.navigation.setParams({_onRelease:this._onRelease})
    AsyncStorage.getItem('userid',(error,userid)=>{
      if(!error){
        this.setState({
          userid:userid,
        })
      }
    })
    DeviceEventEmitter.addListener('', (data)=>{
    });
  }

  componentWillUnmount(){
    DeviceEventEmitter.removeAllListeners();
  }
  render(){
    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={'请输入评论'}
            multiline={true}
            onChangeText={(text) => this.setState({comment:text})}
            value={this.state.comment}
            />
      </View>
    )
  }
  //发布
  _onRelease(){
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.state.userid,
      cid:this.state.cid,
      comment:this.state.comment,
    })
    console.log(json);
    HttpUtil.post(HttpUtil.POEM_COMMENTPOEM,json).then((data)=>{
      if(data.code == 0){
        var comment = data.data;
        // sqlite.saveComment(comment).then((data)=>{
        //   Emitter.emit(Emitter.COMMENT,comment);
       // 	  this.props.navigation.goBack();
        // }).catch((err)=>{
        //   console.error(err);
        // })
        Emitter.emit(Emitter.COMMENT,comment);
        this.props.navigation.goBack();
      }else{
        Alert.alert(data.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding:10,
  },
  nav_right:{
    fontSize:18,
    color:'#ffffff',
    marginRight:10,
  },
  nav_left:{
    fontSize:18,
    color:'#ffffff',
    marginLeft:10,
  },
  input:{
    flex:1,
    textAlign:'left',
    textAlignVertical:'top',
    fontSize:18,
  }
})

export {CommentUI};
