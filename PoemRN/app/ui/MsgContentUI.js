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
import {connect} from 'react-redux';
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
class MsgContentUI extends Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title:navigation.state.params.message.title,
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(<View style={pstyles.nav_right}/>),
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

export default  connect(
    state => ({
        papp: state.papp,
    }),
)(MsgContentUI);
