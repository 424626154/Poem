/**
 * 个人信息
 */
import React from 'react';
import {
        StyleSheet,
        View,
        TouchableOpacity,
        Alert,
        Text,
        Image,
        TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Icon } from 'react-native-elements';

import DialogSelected from '../utils/AlertSelected';
const selectedArr = ["拍照", "图库"];

import HttpUtil  from '../utils/HttpUtil';
import Global from '../Global';

const nothead = require('../images/ic_account_circle_black.png');

class PersonalUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
        title: '个人信息',
        headerTintColor:'#ffffff',
        headerTitleStyle:{fontSize:20},
        headerLeft:(
          <TouchableOpacity  onPress={()=>navigation.goBack()}>
            <Text style={styles.nav_left}>返回</Text>
          </TouchableOpacity>
        ),
        headerStyle:{
          backgroundColor:'#1e8ae8',
        },
     });
  constructor(props){
    super(props)
    let params = this.props.navigation.state.params;
    let userid = params.userid;
    this.state = {
      headurl:nothead,
      pseudonym:'',
      userid:userid,
    }
  }
  componentDidMount(){
    const { navigate } = this.props.navigation;
    if(this.state.userid){
      this._requestUserInfo(this.state.userid);
    }
  }
  componentWillUnmount(){

  }
  render(){
    return(
      <View style={styles.container}>
        <View style={styles.person_info}>
          {/* ---修改头像--- */}
          <TouchableOpacity
              onPress={() => {
                this._onEidet()
              }}
            >
            <View style={styles.head_bg}>
              <Image
                style={styles.head}
                source={this.state.headurl}
                />
            </View>
          </TouchableOpacity>
          {/* ---笔名--- */}
          <TouchableOpacity
            onPress={() => {
              this._onEidet()
            }}
          >
            <View style={styles.pseudonym_bg}>
                <Text>{this.state.pseudonym}</Text>
                {this._readerPse()}
            </View>
          </TouchableOpacity>
        </View>
        <DialogSelected ref={(dialog)=>{
                   this.dialog = dialog;
               }} />
      </View>
    )
  }
  _requestUserInfo(userid){
    var json = JSON.stringify({
      userid:userid,
    })
    HttpUtil.post(HttpUtil.USER_INFO,json).then(res=>{
      if(res.code == 0 ){
        let user = res.data;
        let headurl = user.head?{uri:HttpUtil.getHeadurl(user.head)}:nothead;
        let pseudonym = user.pseudonym;
        this.setState({
          headurl:headurl,
          pseudonym:pseudonym,
          user:user,
        })
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.log(err);
    })
  }
  _readerPse(){
    if(this.state.userid == Global.user.userid){
      return(
        <Icon
          name='edit'
          size={26}
          type="MaterialIcons"
          color={'#d4d4d4'}
        />
      )
    }else{
      retrun(
        <View></View>
      )
    }
  }
  _onEidet(){
    if(this.state.userid == Global.user.userid){
      const { navigate } = this.props.navigation;
      navigate('PerfectUI');
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
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
  head_bg:{
    marginTop:40,
    alignItems:'center',
    height:120,
    width:120,
  },
  head:{
    height:120,
    width:120,
  },
  mhead:{
    width:20,
    height:20,
    right:1,
    position: 'absolute',//相对父元素进行绝对定位
    top: 0,
    right: 0,
  },
  person_info:{

  },
  pseudonym_bg:{
    paddingTop:20,
    flexDirection:'row',
  },
  pseudonym:{
    fontSize:22,
    borderBottomWidth:1,
    borderBottomColor:'#d4d4d4',
  }
})
export {PersonalUI};
