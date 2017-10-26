import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TabNavigator,StackNavigator,DrawerNavigator } from 'react-navigation';

// import {LoadUI} from './ui/LoadUI';//加载页
import {WorksTab} from './tabs/WorksTab';//作品
import {ReadingTab} from './tabs/ReadingTab';//欣赏
import {MyTab} from './tabs/MyTab';//我的
import {AddPoemUI} from './ui/AddPoemUI';//添加诗词
import {LoginUI} from './ui/LoginUI';
import {RegisterUI} from './ui/RegisterUI';
import DetailsUI from './ui/DetailsUI';
import {ModifyPoemUI} from './ui/ModifyPoemUI';
import {CommentUI} from './ui/CommentUI';
import {PerfectUI} from './ui/PerfectUI';
import {PersonalUI} from './ui/PersonalUI';
import {FollowUI} from './ui/FollowUI';
import {HomeUI} from './ui/HomeUI';
import {MyUI} from './ui/MyUI';
import {WorksUI} from './ui/WorksUI';
import {SettingUI} from './ui/SettingUI';
import LovesUI from './ui/LovesUI';

import {Drawer} from './drawer/Drawer';

const Tabs = TabNavigator({
  WorksTab: {
    screen: WorksTab,
    navigationOptions: {
        tabBarLabel: '作品',
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
  ReadingTab: {
    screen: ReadingTab,
    navigationOptions: {
        tabBarLabel: '欣赏',
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
        }
    },
    // tabBarVisible:false,
    lazy:true,
});


const DrawerNav = DrawerNavigator({
  HomeUI: {
    screen: HomeUI,
  },
},{
  drawerWidth: 200,
  drawerPosition: 'left',
  contentComponent: props => <Drawer {...props}/>,
  drawerBackgroundColor: 'transparent'
});
const AppNavigator = StackNavigator({
  // LoadUI:{
  //   screen: LoadUI,
  //   navigationOptions:{
  //     header:null,
  //   }
  // },
  Main: {
    screen: DrawerNav,
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
  MyUI:{
    screen:MyUI,
  },
  WorksUI:{
    screen:WorksUI,
  },
  SettingUI:{
    screen:SettingUI,
  },
  LovesUI:{
    screen:LovesUI,
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
});

export {AppNavigator} ;
