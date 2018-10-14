'use strict';
/**
 * 名家
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

import FamousListItem from '../custom/FamousListItem';

type Props = {
    papp:Object,
    navigation:any,
};

type State = {
    sourceData:Array<Object>,
    selected:Map<string, boolean>,
    refreshing:boolean,
    type:number,
    label:string,
};
class FamousUI extends React.Component<Props,State> {
   static navigationOptions = ({navigation}) => ({
         title:navigation.state.params.nav_title,
         headerTintColor:HeaderConfig.headerTintColor,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(<NavBack navigation={navigation}/>),
      });
      refresh_time:any;
      // 数据容器，用来存储数据
      constructor(props) {
          super(props);
          let params = this.props.navigation.state.params;
          let type = params.type;
          let label = params.label;
          this.state = {
              // 存储数据的状态
              sourceData : [],
              selected: (new Map(): Map<string, boolean>),
              refreshing: false,
              type:type,
              label:label,
          }
          this.props.navigation.setParams({nav_title:label});
      }
    // 当视图全部渲染完毕之后执行该生命周期方法
     componentDidMount() {
         this._requestNOPoem();
     }
     componentWillUnmount(){
       this.refresh_time && clearTimeout(this.refresh_time);
     }
     shouldComponentUpdate(nextProps, nextState){
       //切换用户id
       return true;
     }
   render() {
     const { navigate } = this.props.navigation;
     return (
       <View style={pstyles.container}>
       <FlatList
                 style={pstyles.flatlist}
                 data={ this.state.sourceData }
                 extraData={ this.state.selected }
                 keyExtractor={ this._keyExtractor }
                 renderItem={ this._renderItem }
                 // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
                 onEndReachedThreshold={0.1}
                 // 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
                 onEndReached={ this._onEndReached }
                 // ListHeaderComponent={ this._renderHeader }
                 // ListFooterComponent={ this._renderFooter }
                 ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                 ListEmptyComponent={ this._renderEmptyView }
                 refreshing={ this.state.refreshing }
                 onRefresh={ this._renderRefresh }
                 // 是一个可选的优化，用于避免动态测量内容，+1是加上分割线的高度
                 // getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
             />
       </View>
     );
   }
   /**
     * 此函数用于为给定的item生成一个不重复的Key。
     * Key的作用是使React能够区分同类元素的不同个体，以便在刷新时能够确定其变化的位置，减少重新渲染的开销。
     * 若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标
     *
     * @param item
     * @param index
     * @private
     */
    // 这里指定使用数组下标作为唯一索引
    _keyExtractor = (item, index) => index+'';

    /**
     * 使用箭头函数防止不必要的re-render；
     * 如果使用bind方式来绑定onPressItem，每次都会生成一个新的函数，导致props在===比较时返回false，
     * 从而触发自身的一次不必要的重新render，也就是FlatListItem组件每次都会重新渲染。
     *
     * @param id
     * @private
     */
    _onPressItem = (id: string,item:Object) => {
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return {selected}
        });
        this.props.navigation.navigate(UIName.PoemUI,{id:item.id});
    };
    // 加载item布局
    _renderItem = ({item}) =>{
        return(
            <FamousListItem
                id={item.id}
                onPressItem={ this._onPressItem }
                selected={ !!this.state.selected.get(item.id) }
                item={item}
            />
        );
    };
    // Header布局
    _renderHeader = () => (
        <View><Text>Header</Text></View>
    );

    // Footer布局
    _renderFooter = () => (
        <View><Text>Footer</Text></View>
    );

    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={pstyles.separator}></View>
    );

    // 空布局
    _renderEmptyView = () => (
        <View style={pstyles.empty}>
         <Text style={pstyles.empty_font}>暂无作品
         </Text>
        </View>
    );
   // 下拉刷新
  _renderRefresh = () => {
       this._requestNOPoem();
  };

  // 上拉加载更多
  _onEndReached = () => {
    console.log('-----------WorksTab_onEndReached--------------');
     this._startRefres();
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[this.state.sourceData.length-1].id;
     }
     var json = JSON.stringify({
       id:fromid,
       type:this.state.type,
       label:this.state.label,
     });
     HttpUtil.post(HttpUtil.FAMOUS_HOPOEM,json).then(res=>{
       if(res.code == 0){
           var opoems = res.data;
            if(opoems.length > 0){
              let temp_opoems = this.state.sourceData;
              temp_opoems = temp_opoems.concat(opoems);
              this.setState({
                sourceData: temp_opoems
              });
            }
       }else{
        showToast(res.errmsg);
       }
       this._endRefres()
     }).catch(err=>{
       console.log(err);
     })
  };
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
   _getExtend(item:Object):Object{
     let extend = {}
     if(item.extend){
       extend = JSON.parse(item.extend);
     }
     // console.log('------_getExtend')
     // console.log(extend)
     return extend;
   }
   /**
    * 请求最新作品
    */
   _requestNOPoem(){
      this._startRefres();
      var fromid = 0;
      if(this.state.sourceData.length > 0 ){
        fromid = this.state.sourceData[0].id;
      }
      var json = JSON.stringify({
        id:fromid,
        type:this.state.type,
        label:this.state.label,
      });
      HttpUtil.post(HttpUtil.FAMOUS_NOPOEM,json).then(res=>{
        if(res.code == 0 ){
          var opoems = res.data;
           if(opoems.length > 0){
             let temp_opoems = this.state.sourceData;
             temp_opoems = opoems.concat(temp_opoems);
             this.setState({
               sourceData:temp_opoems,
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
   add:{
     position: 'absolute',
     bottom: 15,
     right: 15,
     width: 44,
     height: 44,
   },
 });
 export default connect(
     state => ({
         papp: state.papp,
     }),
 )(FamousUI);
