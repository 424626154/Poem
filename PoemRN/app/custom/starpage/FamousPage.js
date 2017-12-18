'use strict'
/**
 * 作者
 * @flow
 */
import React from 'react';
import {
      StyleSheet,
      Platform,
      Text,
      View,
      FlatList,
      TouchableOpacity,
      Alert,
     } from 'react-native';

import {
      StyleConfig,
      UIName,
      HttpUtil,
      pstyles,
      goPersonalUI,
      showToast,
     } from '../../AppUtil';

import FamousListItem from '../FamousListItem';
type Props = {
      navigation:any,
      papp:Object,
      userid:string,
};

type State = {
    sourceData:Array<Object>,
    selected:Map<string, boolean>,
    refreshing:boolean,
    isSwiping:boolean,
};
class FamousPage extends React.Component<Props,State>{
  // 数据容器，用来存储数据
  dataContainer = [];
  refresh_time:number;
  state = {
      // 存储数据的状态
      sourceData : [],
      selected: (new Map(): Map<string, boolean>),
      refreshing: false,
      isSwiping:false,
  }
  componentDidMount(){
    //因为tab采用lazy加载方式，所以第一次需要在此处调用
      this._loadFamous();
      this._requestNStar();
  }
  componentWillUnmount(){
      this.refresh_time && clearTimeout(this.refresh_time);
  }
  render(){
    return(
      <FlatList
            data={ this.state.sourceData }
            extraData={ this.state.selected }
            keyExtractor={ (item, index) => index+''}
            renderItem={ this._renderItem }
            onEndReachedThreshold={0.1}
            onEndReached={ this._onEndReached }
            ItemSeparatorComponent={ this._renderItemSeparatorComponent }
            ListEmptyComponent={ this._renderEmptyView }
            refreshing={ this.state.refreshing }
            onRefresh={ this._renderRefresh }
        />
    )
  }

  // 自定义分割线
  _renderItemSeparatorComponent = ({highlighted}) => (
      <View style={{ height:1, backgroundColor:StyleConfig.C_D4D4D4 }}></View>
  );
  // 空布局
  _renderEmptyView = () => (
      <View style={pstyles.empty}>
       <Text style={pstyles.empty_font}>
         暂无收藏
       </Text>
      </View>
  );
  _onPressItem = (id:string,item:Object) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      this.props.navigation.navigate(UIName.PoemUI,{id:id})
  };
  _renderItem = ({item}) =>{
      return(
          <FamousListItem
              id={item.id}
              onPressItem={ this._onPressItem }
              selected={ !!this.state.selected.get(item.id) }
              item= {item}
          />
      );
  };
  //下拉刷新
  _renderRefresh = () => {
    console.log('---_renderRefresh');
    this._requestNStar();
  }
  //上拉刷新
  _onEndReached = () => {
    console.log('---_onEndReached');
    this._requestHStar();
  }
  _loadFamous(){

  }
  _startRefres(){
    this.setState({refreshing: true})
    this.refresh_time = setTimeout(
    () => {
      if(this.state.refreshing){
        this.setState({refreshing: false})
      }
    },3000);
  }
  _endRefres(){
    this.setState({refreshing: false});
    this.refresh_time&&clearTimeout(this.refresh_time);
  }
  _requestNStar(){
    this._startRefres();
    let fromid = 0;
    let stars = this.state.sourceData;
    if(stars.length > 0 ){
      fromid = stars[0].id;
    }
    var json = JSON.stringify({
      userid:this.props.userid,
      id:fromid,
      type:2,
    })
    HttpUtil.post(HttpUtil.NSTARS,json).then(res=>{
      if(res.code == 0 ){
        var temp_stars = res.data;
         if(temp_stars.length > 0){
           let stars = this.state.sourceData;
           stars = stars.concat(temp_stars);
           this.setState({
             sourceData:stars,
           });
         }
      }else{
        showToast(res.errmsg);
      }
      this._endRefres()
    }).catch(err=>{
      console.error(err);
    });
  }
  _requestHStar(){
    this._startRefres();
    let fromid = 0;
    let stars = this.state.sourceData;
    if(stars.length > 0 ){
      fromid = stars[stars.length-1].id;
    }
    var json = JSON.stringify({
      userid:this.props.userid,
      id:fromid,
      type:2,
    })
    HttpUtil.post(HttpUtil.HSTARS,json).then(res=>{
      if(res.code == 0 ){
        let temp_stars = res.data;
         if(temp_stars.length > 0){
           let stars = this.state.sourceData;
           stars = temp_stars.concat(stars);
           this.setState({
             sourceData:stars,
           });
         }
      }else{
        showToast(res.errmsg);
      }
      this._endRefres()
    }).catch(err=>{
      console.error(err);
    });
  }
}

const styles = StyleSheet.create({

});

export default FamousPage;
