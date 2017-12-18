'use strict'
/**
 * 消息页
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

import DynastyListItem from './DynastyListItem';
type Props = {
      navigation:any,
      papp:Object,
};

type State = {
    sourceData:Array<Object>,
    selected:Map<string, boolean>,
    refreshing:boolean,
    isSwiping:boolean,
};

type Dynasty = {
    dynasty:string,
    authors:Array<string>,
    authors_str:string,
}
class DynastyPage extends React.Component<Props,State>{
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
      this._loadDynasty();
      this._requestOPLabels();
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
         暂无内容
       </Text>
      </View>
  );
  _onPressItem = (id:string,item:Object) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      this.props.navigation.navigate(UIName.FamousUI,{type:1,label:item.dynasty})
  };
  _renderItem = ({item}) =>{
      return(
          <DynastyListItem
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
    this._requestOPLabels();
  }
  //上拉刷新
  _onEndReached = () => {
    console.log('---_onEndReached');
  }
  _loadDynasty(){

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
  _requestOPLabels(){
    this._startRefres();
    var fromid = 0;
    let authors = this.state.sourceData;
    if(authors.length > 0 ){
      fromid = authors[0].id;
    }
    var json = JSON.stringify({
      fromid:fromid,
      type:0,
    });
    HttpUtil.post(HttpUtil.FAMOUS_OPLABELS,json).then((res) => {
        if(res.code == 0){
          let temp_authors = res.data;
          let temp_dynastys = [];
          for (var i = temp_authors.length - 1; i >= 0; i--) {
            let isdynasty = false;
            for(var j = 0 ; j < temp_dynastys.length;j++){
              if(temp_dynastys[j].dynasty == temp_authors[i].dynasty){
                let dynasty = temp_dynastys[j];
                console.log(typeof(dynasty));
                let authors = dynasty.authors;
                authors = authors.concat([temp_authors[i].author]);
                let authors_str = '';
                for(var k = 0 ; k < authors.length ; k++){
                  authors_str += authors[k];
                  if(k != authors.length - 1){
                    authors_str += ',';
                  }
                }
                console.log(authors_str)
                dynasty.authors_str = authors_str;
                dynasty.authors = authors;
                temp_dynastys[j] = dynasty;
                isdynasty = true;
                break;
              }
            }
            if(!isdynasty){
              let  dynasty = {
                dynasty:temp_authors[i].dynasty,
                authors_str:temp_authors[i].author,
                authors:[temp_authors[i].author],
              }
              temp_dynastys.push(dynasty);
            }
            temp_authors.splice(i,1);
          }
          console.log(temp_dynastys)
          this.setState({
            sourceData: temp_dynastys,
          });
        }else{
          showToast(res.errmsg)
        }
        this._endRefres();
    })
    .catch((error) => {
      console.error(error);
    });
  }

}

const styles = StyleSheet.create({

});

export default DynastyPage;
