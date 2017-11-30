
'use strict'
/**
 * 消息
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
  UIName,
  HttpUtil,
  pstyles,
  MessageDao,
  goPersonalUI,
} from '../AppUtil';
import { Icon } from 'react-native-elements';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NewsPage from '../custom/msgtab/NewsPage';
import ChatPage from '../custom/msgtab/ChatPage';
import MessageTabBar from '../custom/msgtab/MessageTabBar';
import TabBarIcon from '../custom/TabBarIcon';

import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
type Props = {
      navigation:any,
      papp:Object,
};

type State = {
    son_index:number,
};
class MessageTab extends Component <Props,State>{
  static navigationOptions = ({navigation}) => ({
        title:'消息',
        headerTintColor:HeaderConfig.headerTintColor,
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
        tabBarOnPress:(({previousScene,scene,jumpToIndex})=>{
            // console.log('-------tabBarOnPress');
            // console.log(previousScene)
            // console.log(scene)
            // console.log(jumpToIndex)
            let index = scene.index;
            console.log(scene)
            if(navigation.state.params){
              navigation.state.params.onTabBarPress(index);
            }
            jumpToIndex(index);
        }),
     });
     _renderRot: Function;
     _onTabBarPress: Function;
     _reduxMsgRead: Function;
     constructor(props){
       super(props)
       this.state = {
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
     shouldComponentUpdate(nextProps, nextState){
       //切换用户id
       if(nextProps.papp.userid !== this.props.papp.userid){
         console.log('---MessageTab() up papp');
         console.log(nextProps.papp)
         console.log(this.props.papp)
       }
       console.log('------MessageTab() shouldComponentUpdate ')
       console.log('--- nextProps push_news',nextProps.papp.push_news)
       console.log('--- this.props push_news',this.props.papp.push_news)
       console.log('--- nextProps push_chat',nextProps.papp.push_chat)
       console.log('--- this.props push_chat',this.props.papp.push_chat)
       if(nextProps.papp.push_news !== this.props.papp.push_news){
         Object.assign(this.props.papp,nextProps.papp);
         console.log('--- up push_news');
         if(!this.props.papp.push_news){
           return false;
         }
       }
       if(this.props.papp.push_news){
         if(this.refs.NewsPage)this.refs.NewsPage._pushNews();
         let { dispatch } = this.props.navigation;
         dispatch(UserActions.raSetPushNews(false));
         console.log('--- set push_news');
       }
       if(nextProps.papp.push_chat !== this.props.papp.push_chat){
         Object.assign(this.props.papp,nextProps.papp);
         console.log('--- up push_chat');
         if(!this.props.papp.push_chat){
           return false;
         }
       }
       if(this.props.papp.push_chat){
         console.log(this.refs.ChatPage)
         if(this.refs.ChatPage)this.refs.ChatPage._pushChat();
         let { dispatch } = this.props.navigation;
         dispatch(UserActions.raSetPushChat(false));
         console.log('--- set push_chat');
       }
       return true;
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
             papp={this.props.papp}
             reduxMsgRead={this._reduxMsgRead}
             navigation={this.props.navigation}
           />
           <ChatPage
             ref='ChatPage'
             tabLabel="私信"
             papp={this.props.papp}
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
      dispatch(UserActions.raMsgRead());
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
        papp: state.papp,
    }),
)(MessageTab);
