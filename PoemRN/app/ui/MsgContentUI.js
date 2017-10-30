'use strict'
/**
 * 消息内容
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Text,
} from 'react-native';
import MessageListItem from '../custom/MessageListItem';
import {
  StyleConfig,
  HeaderConfig,
  Global,
  HttpUtil,
  pstyles
} from '../AppUtil';
export default class MsgContentUI extends Component {
  static navigationOptions = ({navigation}) => ({
        title:navigation.state.params.message.title,
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(
          <TouchableOpacity  onPress={()=>navigation.goBack()}>
            <Text style={pstyles.nav_left}>返回</Text>
          </TouchableOpacity>
        ),
     });
     constructor(props){
       super(props)
       let params = this.props.navigation.state.params;
       let message = params.message;
       this.state = {
           // 存储数据的状态
           message:message,
       }
     }
     componentDidMount(){

     }
     componentWillUnmount(){

     }
    render(){
      return(
        <View style={styles.container}>
          <Text style={styles.content}>
            {this.state.message.content}
          </Text>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content:{
    padding:10,
    fontSize:14,
  }
});
