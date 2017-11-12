
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
import { Icon } from 'react-native-elements';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NewsPage from '../custom/msgtab/NewsPage';
import ChatPage from '../custom/msgtab/ChatPage';
import MessageTabBar from '../custom/msgtab/MessageTabBar';
import TabBarIcon from '../custom/TabBarIcon';

import {connect} from 'react-redux';
import * as Actions from '../redux/actions/Actions'

class MessageTab extends Component {
  static navigationOptions = ({navigation}) => ({
        title:'消息',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:null,
        tabBarLabel: '消息',
        tabBarIcon: ({ tintColor, focused }) => (
          <TabBarIcon
            tintColor={tintColor}/>
        //     <View>
        //       <Icon
        //         name='message'
        //         size={26}
        //         type="MaterialIcons"
        //         color={tintColor}
        //       />
        //     </View>
        ),
        tabBarOnPress:(({ route, index },jumpToIndex)=>{
            if(navigation.state.params){
              navigation.state.params.onTabBarPress(index);
            }
            jumpToIndex(index);
        }),
     });
     navigate = null;
     constructor(props){
       super(props)
       const { navigate } = this.props.navigation;
       this.navigate = navigate;
       this.state = {
           userid:Global.user.userid,
           son_index:0,
       }
       this._renderRot = this._renderRot.bind(this);
       this._onTabBarPress = this._onTabBarPress.bind(this);
       this._reduxMsgRead = this._reduxMsgRead.bind(this);
     }
     componentDidMount(){
       this.props.navigation.setParams({onTabBarPress:this._onTabBarPress});
     }
     componentWillUnmount(){

     }
    render(){

      return(
        <View style={styles.container}>
          <ScrollableTabView
            locked={true}
            onChangeTab={(fnc)=>{
              this._onChangeTab(fnc.i);
            }}
            renderTabBar={() => <MessageTabBar someProp={'here'} />}>
           <NewsPage
             ref='NewsPage'
             tabLabel="通知"
             reduxMsgRead={this._reduxMsgRead}
             navigation={this.props.navigation}
           />
           <ChatPage
             ref='ChatPage'
             tabLabel="私信"
             reduxMsgRead={this._reduxMsgRead}
             navigation={this.props.navigation}
           />
         </ScrollableTabView>
        </View>
      )
    }

    _renderRot(){
      return(
        <View>
          <Text>a</Text>
        </View>
      )
    }
    _onTabBarPress(index){
      this._loadSonTab(this.state.son_index);
    }
    _onChangeTab(index){
      if(index == 0 || index == 1){
        this.setState({
          son_index:index,
        });
        this._loadSonTab(index);
      }
    }
    _loadSonTab(index){
      if(index == 0){
        this.refs.NewsPage._loadNews();
      }else if(index == 1){
        this.refs.ChatPage._loadChat();
      }
    }
    _reduxMsgRead(){
      let { dispatch } = this.props.navigation;
      dispatch(Actions.onMsgRead());
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
export default connect(
    state => ({
        num: state.num,
    }),
)(MessageTab);
