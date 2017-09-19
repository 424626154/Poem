import React from 'react';
import {
  Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TabNavigator,StackNavigator } from 'react-navigation';
var SQLite = require('react-native-sqlite-storage');

import {WorksTab} from './tabs/WorksTab';//作品
import {ReadingTab} from './tabs/ReadingTab';//欣赏
import {MyTab} from './tabs/MyTab';//我的
import {AddPoemUI} from './ui/AddPoemUI';//添加诗词
import {LoginUI} from './ui/LoginUI';
import {RegisterUI} from './ui/RegisterUI';

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
    tabBarVisible:false,
});

const App = StackNavigator({
  Main: {
    screen: Tabs,
    // navigationOptions:{
    //   header:null,
    // }
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
  }
},{
  initialRouteName: 'Main', // 默认显示界面
})

export {App} ;
