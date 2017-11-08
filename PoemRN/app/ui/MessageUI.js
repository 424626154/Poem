'use strict'
/**
 * 消息
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
  UIName,
  Global,
  HttpUtil,
  pstyles,
  MessageDao,
  Emitter,
  goPersonalUI,
} from '../AppUtil';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import NewsPage from '../custom/msgtab/NewsPage';
import ChatPage from '../custom/msgtab/ChatPage';
import MessageTabBar from '../custom/msgtab/MessageTabBar';

export default class MessageUI extends Component {
  static navigationOptions = ({navigation}) => ({
        title:'消息',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(
          <TouchableOpacity  onPress={()=>navigation.goBack()}>
            <Text style={pstyles.nav_left}>返回</Text>
          </TouchableOpacity>
        ),
     });
     navigate = null;
     constructor(props){
       super(props)
       const { navigate } = this.props.navigation;
       this.navigate = navigate;
       this.state = {
           userid:Global.user.userid,
       }
     }
     componentDidMount(){

     }
     componentWillUnmount(){

     }
    render(){
      return(
        <View style={styles.container}>
          <ScrollableTabView
            locked={true}
            renderTabBar={() => <MessageTabBar someProp={'here'} />}>
           <NewsPage
             tabLabel="通知"
             navigation={this.props.navigation}
           />
           <ChatPage
             tabLabel="私信"
             navigation={this.props.navigation}
           />
         </ScrollableTabView>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
