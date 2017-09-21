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
import HTMLView from 'react-native-htmlview';

import SQLite from '../db/Sqlite';
const sqlite = new SQLite();


class DetailsUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
    title: '详情',
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
    super(props);
    let params = this.props.navigation.state.params;
    console.log(params.id);
    this.state = {
        id:params.id,
        poem:{poem:'',livenum:0,commentnum:0},
        userid:'',
        islogin:false,
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('userid',(error,userid)=>{
      if(!error){
        var islogin = false;
        if(userid){
          islogin = true;
        }
        console.log('@@@@@@userid:'+userid)
        this.setState({
          islogin:islogin,
          userid:userid,
        })
        sqlite.queryAllPoem(this.state.id).then((peom)=>{
          console.log('@@@@@@peom:'+peom.commentnum)
            this.setState({
              poem: peom,
            });
          })
      }
    })
    DeviceEventEmitter.addListener('UpPoem', (poem)=>{
        temp_poem = this.state.poem;
        if(temp_poem.id == poem.id){
          temp_poem.poem = poem.poem;
          this.setState({
            poem:temp_poem,
          })
        }
    });
  }

  componentWillUnMount(){
    DeviceEventEmitter.remove();
  }

  render(){
    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
        <View>
        <HTMLView
            value={this.state.poem.poem}
            />
        </View>
        {/* ---menu--- */}
        {this._renderMenu()}
        {/* ---menu--- */}
      </View>
    )
  }
  _renderMenu(){
    if(this.state.userid == this.state.poem.userid){
      return(
        <View style={styles.menu}>
            <TouchableOpacity
              onPress={()=>{
                this.props.navigation.navigate('ModifyPoemUI',{id:this.state.id})
              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='receipt'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>Alert.alert(
              '删除',
              '是否确认删除？',
              [
                {text: '取消', style: 'cancel'},
                {text: '确认', onPress: () => {
                  this._onDeletePoem()
                }},
              ],
              { cancelable: false }
            )}>
              <View style={styles.menu_item}>
                <Icon
                  name='delete'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{

              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='sms'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderCommentnum(this.state.poem.commentnum)}
                  </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>Alert.alert('点赞')}>
              <View style={styles.menu_item}>
                <Icon
                  name='thumb-up'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderLivenum(this.state.poem.livenum)}
                  </Text>
              </View>
            </TouchableOpacity>
        </View>
      )
    }else{
      return(
        <View style={styles.menu}>
            <TouchableOpacity
              onPress={()=>{
                this.props.navigate('DetailsUI',{id:this.props.id});
              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='sms'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderCommentnum(this.state.poem.commentnum)}
                  </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>Alert.alert('点赞')}>
              <View style={styles.menu_item}>
                <Icon
                  name='thumb-up'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderLivenum(this.state.poem.livenum)}
                  </Text>
              </View>
            </TouchableOpacity>
        </View>
      )
    }
  }
  _renderCommentnum(commentnum){
    return commentnum > 0 ? commentnum:'';
  }
  _renderLivenum(livenum){
    return livenum > 0 ? livenum:'';
  }
  _onDeletePoem(){
    sqlite.deletePoem(this.state.id).then(()=>{
        DeviceEventEmitter.emit('DelPoem',this.state.id);
		 	  this.props.navigation.goBack();
		 	}).catch((err)=>{
		 	    Alert.alert('删除诗歌失败:',err);
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
  menu:{
    paddingLeft:60,
    flexDirection:'row',
    justifyContent:'flex-end',
  },
  menu_item:{
    flexDirection:'row',
    padding:10,
  },
})

export {DetailsUI};
