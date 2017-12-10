'use strict';
/**
 * 我的收藏
 * @flow
 */
 import React from 'react';
 import { Icon } from 'react-native-elements';
 import {
   StyleSheet,
   Text,
   View ,
   TouchableOpacity,
   Alert,
   FlatList,
 } from 'react-native';
import {connect} from 'react-redux';
import * as PoemsActions from '../redux/actions/PoemsActions';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import WorksPage from '../custom/starpage/WorksPage';
import FamousPage from '../custom/starpage/FamousPage';
import TopTabBar from '../custom/toptabbar/TopTabBar';
import TabBarIcon from '../custom/TabBarIcon';

import{
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  Permission,
  pstyles,
  Utils,
  HttpUtil,
  UIName,
  showToast,
} from '../AppUtil'

import{
    NavBack,
  } from '../custom/Custom';

import WorksListItem from '../custom/WorksListItem';

type Props = {
    papp:Object,
    navigation:any,
};

type State = {
    son_index:number,
    userid:string,
};
class StarUI extends React.Component<Props,State> {
   static navigationOptions = ({navigation}) => ({
         title: '收藏',
         headerTintColor:HeaderConfig.headerTintColor,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(<NavBack navigation={navigation}/>),
      });
      constructor(props) {
          super(props);
          let params = this.props.navigation.state.params;
          let userid = params.userid;
          this.state = {
              son_index:0,
              userid:userid,
          }
      }
    // 当视图全部渲染完毕之后执行该生命周期方法
   componentDidMount() {

   }
   componentWillUnmount(){

   }
   shouldComponentUpdate(nextProps, nextState){

     return true;
   }
   render() {
     const { navigate } = this.props.navigation;
     return (
       <View style={pstyles.container}>
         <ScrollableTabView
           locked={true}
           onChangeTab={(fnc)=>{
             this._onChangeTab(fnc.i);
           }}
           renderTabBar={() => <TopTabBar someProp={'here'} />}>
          <WorksPage
            ref='WorksPage'
            tabLabel="作品"
            userid={this.state.userid}
            papp={this.props.papp}
            navigation={this.props.navigation}
          />
          <FamousPage
            ref='FamousPage'
            tabLabel="名家"
            userid={this.state.userid}
            papp={this.props.papp}
            navigation={this.props.navigation}
          />
        </ScrollableTabView>
       </View>
     );
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
       this.refs.WorksPage&&this.refs.WorksPage._loadWorks();
     }else if(index == 1){
       this.refs.FamousPage&&this.refs.FamousPage._loadFamous();
     }
   }
 }

 const styles = StyleSheet.create({

 });
 export default connect(
     state => ({
         papp: state.papp,
     }),
 )(StarUI);
