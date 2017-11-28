'use strict'
/**
 * 消息内容
 * @flow
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Text,
} from 'react-native';
import {
        StyleConfig,
        HeaderConfig,
        HttpUtil,
        pstyles
      } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
type Props = {
      navigation:any,
};

type State = {
    message:Object,
};
export default class MsgContentUI extends Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title:navigation.state.params.message.title,
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
     });
     state = {
         // 存储数据的状态
         message:this.props.navigation.state.params.message,
     }
     componentDidMount(){

     }
     componentWillUnmount(){

     }
    render(){
      return(
        <View style={pstyles.container}>
          <Text style={styles.content}>
            {this.state.message.content}
          </Text>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  content:{
    padding:10,
    fontSize:18,
  }
});
