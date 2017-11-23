import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TabNavigator,StackNavigator } from 'react-navigation';

import HomeTab from './tabs/HomeTab';
import MessageTab from './tabs/MessageTab';
import MyTab from './tabs/MyTab';

import AddPoemUI from './ui/AddPoemUI';//添加诗词
import LoginUI from './ui/LoginUI';
import RegisterUI from './ui/RegisterUI';
import DetailsUI from './ui/DetailsUI';
import ModifyPoemUI from './ui/ModifyPoemUI';
import CommentUI from './ui/CommentUI';
import PerfectUI from './ui/PerfectUI';
import PersonalUI from './ui/PersonalUI';
import FollowUI from './ui/FollowUI';
import WorksUI from './ui/WorksUI';
import SettingUI from './ui/SettingUI';
import LovesUI from './ui/LovesUI';
import MsgContentUI from './ui/MsgContentUI';
import ChatUI from './ui/ChatUI';
import FeedbackUI from './ui/FeedbackUI';
import ForgetUI from './ui/ForgetUI';
import PhotoUI from './ui/PhotoUI';
import AgreementUI from './ui/AgreementUI';
import ReportUI from './ui/ReportUI';
import ProtocolUI from './ui/ProtocolUI';


const Tabs = TabNavigator({
  HomeTab: {
    screen: HomeTab,
    navigationOptions: {
        tabBarLabel: '首页',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name='home'
            size={26}
            type="MaterialIcons"
            color={tintColor}
          />
        ),
      }
  },
  MessageTab: {
    screen: MessageTab,
    // navigationOptions: {
    //     tabBarLabel: '消息',
    //     tabBarIcon: ({ tintColor, focused }) => (
    //         <Icon
    //           name='message'
    //           size={26}
    //           type="MaterialIcons"
    //           color={tintColor}
    //         />
    //     ),
    //   }
  },
  MyTab: {
    screen: MyTab,
    navigationOptions: {
        tabBarLabel: '我的',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name='perm-identity'
            size={26}
            type="MaterialIcons"
            color={tintColor}
          />
        ),
      }
  }
},{
    tabBarPosition: 'bottom',
    tabBarOptions:{
        showIcon: true,
        indicatorStyle: {height: 0},
        labelStyle:{
          margin:0,
        },
    },
    swipeEnabled:false,
    // tabBarVisible:false,
    backBehavior:'none',
    lazy:true,
});



const AppNavigator = StackNavigator({
  Main: {
    screen: Tabs,
    navigationOptions:{
      // header:null,
    }
  },
  AddPoemUI:{
    screen:AddPoemUI,
    path:'ui/addpoem',
  },
  LoginUI:{
    screen:LoginUI,
    path:'ui/login',
  },
  RegisterUI:{
    screen:RegisterUI,
  },
  DetailsUI:{
    screen:DetailsUI,
  },
  ModifyPoemUI:{
    screen:ModifyPoemUI,
  },
  CommentUI:{
    screen:CommentUI,
  },
  PerfectUI:{
    screen:PerfectUI,
  },
  PersonalUI:{
    screen:PersonalUI,
  },
  FollowUI:{
    screen:FollowUI,
  },
  WorksUI:{
    screen:WorksUI,
  },
  SettingUI:{
    screen:SettingUI,
  },
  LovesUI:{
    screen:LovesUI,
  },
  MsgContentUI:{
    screen:MsgContentUI,
  },
  ChatUI:{
    screen:ChatUI,
  },
  FeedbackUI:{
    screen:FeedbackUI,
  },
  ForgetUI:{
    screen:ForgetUI,
  },
  PhotoUI:{
    screen:PhotoUI,
  },
  AgreementUI:{
    screen:AgreementUI,
  },
  ReportUI:{
    screen:ReportUI,
  },
  ProtocolUI:{
    screen:ProtocolUI,
  }
},{
  initialRouteName: 'Main', // 默认显示界面
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  nav:{
    height:26,
  },
  header:{
    backgroundColor: '#1e8ae8',
  },
  header_title:{
    fontSize:20,
    color:'#ffffff',
    textAlign:'center',
  },
  personal:{
    flexDirection:'row',
    padding:10,
  },
  head_bg:{
    flex:1,
    padding:10,
  },
  head:{
    height:80,
    width:80,
  },
  name:{
    fontSize:20,
    color:'#ffffff',
  },
  personal_more:{
    justifyContent:'center',
  },
  interval:{
    height:10,
  },
  label:{
    alignItems:'center',
    height:40,
    borderTopWidth:1,
    borderTopColor:'#d4d4d4',
    borderBottomWidth:1,
    borderBottomColor:'#d4d4d4',
  },
  logout:{
    marginTop:10,
    fontSize:22,
    color:'#d4d4d4',
  },
  dot:{
    position: 'absolute',
    top: -15,
    right: -20,
    height:12,
    width:12,
  }
});

export {AppNavigator} ;
