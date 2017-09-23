//评论
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
import SQLite from '../db/Sqlite';
const sqlite = new SQLite();
import HttpUtil  from '../utils/HttpUtil';

class CommentUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
        title: '评论',
        headerTintColor:'#ffffff',
        headerTitleStyle:{fontSize:20},
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
        headerStyle:{
          backgroundColor:'#1e8ae8',
        },
     });

  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      id:params.id,
      replyid:params.replyid,
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

  componentWillUnMount(){
    DeviceEventEmitter.remove();
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
      replyid:this.state.replyid,
      comment:this.state.comment,
    })
    console.log(json);
    HttpUtil.post(HttpUtil.POEM_COMMENTPOEM,json).then((data)=>{
      if(data.code == 0){
        var comment = data.data;
        sqlite.saveComment(comment).then((data)=>{
          DeviceEventEmitter.emit('Comment',comment);
       	  this.props.navigation.goBack();
        }).catch((err)=>{
          console.error(err);
        })
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
