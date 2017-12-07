
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
import NewsPage from '../custom/msgpage/NewsPage';
import ChatPage from '../custom/msgpage/ChatPage';
import TopTabBar from '../custom/toptabbar/TopTabBar';
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
       if(nextProps.papp.push_news&&nextProps.papp.push_news !== this.props.papp.push_news){
         console.log('------MessageTab() shouldComponentUpdate ')
         console.log('------change push_news');
         console.log('------nextProps push_news',nextProps.papp.push_news)
         console.log('------this.props push_news',this.props.papp.push_news)
         let { dispatch } = this.props.navigation;
         dispatch(UserActions.raSetPushNews(false));
         this.refs.NewsPage&&this.refs.NewsPage._pushNews();
       }
       if(nextProps.papp.push_chat&&nextProps.papp.push_chat !== this.props.papp.push_chat){
         console.log('------MessageTab() shouldComponentUpdate ')
         console.log('------change push_chat');
         console.log('------nextProps push_chat',nextProps.papp.push_chat)
         console.log('------this.props push_chat',this.props.papp.push_chat)
         let { dispatch } = this.props.navigation;
         dispatch(UserActions.raSetPushChat(false));
         this.refs.ChatPage&&this.refs.ChatPage._pushChat();
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
            renderTabBar={() => <TopTabBar someProp={'here'} />}>
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
