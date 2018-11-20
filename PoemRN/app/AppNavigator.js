'use strict'
/**
 * Navigator
 * @flow
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator,createStackNavigator } from 'react-navigation';

import { connect } from 'react-redux';
import {
  createReactNavigationReduxMiddleware,
  reduxifyNavigator,
  } from 'react-navigation-redux-helpers';

import{
    StyleConfig,
    UIName,
  } from './AppUtil';

import HomeTab from './tabs/HomeTab';
import MessageTab from './tabs/MessageTab';
import MyTab from './tabs/MyTab';
import WorksTab from './tabs/WorksTab';
import AddPoemTab from './tabs/AddPoemTab';
import FamousTab from './tabs/FamousTab';
import DiscussTab from './tabs/DiscussTab';

import AddPoemUI from './ui/AddPoemUI';//添加诗词
import LoginUI from './ui/LoginUI';
import RegisterUI from './ui/RegisterUI';
import DetailsUI from './ui/DetailsUI';
// import ModifyPoemUI from './ui/ModifyPoemUI';
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
import PoemLabelUI from './ui/PoemLabelUI';
import AnnotationUI from './ui/AnnotationUI';
import BannerWebUI from './ui/BannerWebUI';
import SnapshotUI from './ui/SnapshotUI';
import FontUI from './ui/FontUI';
import FamousUI from './ui/FamousUI';
import SearchFamousUI from './ui/SearchFamousUI';
import PoemUI from './ui/PoemUI';
import CommentsUI from './ui/CommentsUI';
import StarUI from './ui/StarUI';
import ReadSetUI from './ui/ReadSetUI';
import DiscussUI from './ui/DiscussUI';
import PhotosUI from './ui/PhotosUI';
import AddDiscussUI from './ui/AddDiscussUI';
import GalleryUI from './ui/GalleryUI';
import WebUI from './ui/WebUI';
import MyDiscussUI from './ui/MyDiscussUI';
// const fade = (props) => {
//     const {position, scene} = props
//
//     const index = scene.index
//
//     const translateX = 0
//     const translateY = 0
//
//     const opacity = position.interpolate({
//         inputRange: [index - 0.7, index, index + 0.7],
//         outputRange: [0.3, 1, 0.3]
//     })
//
//     return {
//         opacity,
//         transform: [{translateX}, {translateY}]
//     }
// }

const Tabs = createBottomTabNavigator({
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
  DiscussTab: {
    screen: DiscussTab,
    navigationOptions: {
        tabBarLabel: '想法',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name='lightbulb-outline'
            size={26}
            type="MaterialIcons"
            color={tintColor}
          />
        ),
      }
  },
  FamousTab: {
    screen: FamousTab,
    navigationOptions: {
        tabBarLabel: '收录',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name='import-contacts'
            size={26}
            type="MaterialIcons"
            color={tintColor}
          />
        ),
      }
  },
  // AddPoemTab:{
  //   screen: AddPoemTab,
  //   navigationOptions: {
  //       tabBarLabel: '',
  //       // tabBarIcon: ({ tintColor, focused }) => (
  //       //   <Icon
  //       //     name='add-box'
  //       //     size={26}
  //       //     type="MaterialIcons"
  //       //     color={tintColor}
  //       //   />
  //       // ),
  //       tabBarOptions:{
  //         showLabel:false,
  //       }
  //     },
  // },
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
  },
},{
    tabBarPosition: 'bottom',
    tabBarOptions:{
        showIcon: true,
        indicatorStyle: {height: 0},
        labelStyle:{
          margin:0,
        },
        style: {
          backgroundColor:StyleConfig.C_FFFFFF,
        },
        activeTintColor:StyleConfig.C_333333,
        inactiveTintColor:'#bfbfbf',
    },
    swipeEnabled:false,
    // tabBarVisible:false,
    // backBehavior:'none',
    lazy:true,
    // tabBarComponent: ({jumpToIndex, ...props, navigation}) => (
    //     <TabBarBottom
    //         {...props}
    //         jumpToIndex={index => {
    //             if (index === 2) {
    //                 navigation.navigate(UIName.AddPoemUI,{ftype:0})
    //             }
    //             else {
    //                 jumpToIndex(index)
    //             }
    //         }}
    //     />
    // )
});



const RootNavigator = createStackNavigator({
  Main: {
    screen: Tabs,
    navigationOptions:{
      header:null,
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
  // ModifyPoemUI:{
  //   screen:ModifyPoemUI,
  // },
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
  },
  PoemLabelUI:{
    screen:PoemLabelUI,
  },
  AnnotationUI:{
    screen:AnnotationUI,
  },
  BannerWebUI:{
    screen:BannerWebUI,
  },
  SnapshotUI:{
    screen:SnapshotUI,
  },
  FontUI:{
    screen:FontUI,
  },
  FamousUI:{
    screen:FamousUI,
  },
  SearchFamousUI:{
    screen:SearchFamousUI,
  },
  PoemUI:{
    screen:PoemUI,
  },
  CommentsUI:{
    screen:CommentsUI,
  },
  StarUI:{
    screen:StarUI,
  },
  ReadSetUI:{
    screen:ReadSetUI,
  },
  DiscussUI:{
    screen:DiscussUI,
  },
  PhotosUI:{
    screen:PhotosUI,
  },
  AddDiscussUI:{
    screen:AddDiscussUI,
  },
  GalleryUI:{
    screen:GalleryUI,
  },
  WebUI:{
    screen:WebUI,
  },
  MyDiscussUI:{
    screen:MyDiscussUI,
  }
},{
  initialRouteName: 'Main', // 默认显示界面
})

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav,
});
//
const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export {AppNavigator,middleware,RootNavigator} ;
