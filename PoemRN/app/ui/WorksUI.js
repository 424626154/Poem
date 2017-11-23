'use strict';
/**
 * 我的作品
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
  Emitter,
  UIName,
} from '../AppUtil'
import WorksListItem from '../custom/WorksListItem';
 /**
  * 我的作品列表
  */
class WorksUI extends React.Component {
   static navigationOptions = ({navigation}) => ({
         title: '作品',
         headerTintColor:StyleConfig.C_FFFFFF,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(
           <TouchableOpacity  onPress={()=>navigation.goBack()}>
             <Text style={pstyles.nav_left}>返回</Text>
           </TouchableOpacity>
         ),
      });

      // 数据容器，用来存储数据
      constructor(props) {
          super(props);
          this.state = {
              // 存储数据的状态
              sourceData : [],
              selected: (new Map(): Map<String, boolean>),
              refreshing: false,
          }
      }
    // 当视图全部渲染完毕之后执行该生命周期方法
     componentDidMount() {
         if(this.props.papp.userid){
           // this._queryPoems();
           this._requestNewestPoem();
         }
     }
     componentWillUnmount(){
     }
     shouldComponentUpdate(nextProps, nextState){
       console.log('------WorksUI() shouldComponentUpdate ')
       //切换用户id
       if(nextProps.papp.userid !== this.props.papp.userid){
         Object.assign(this.props.papp,nextProps.papp);
         if(this.props.papp.userid){
           this._queryPoems();
         }else{
           let { dispatch } = this.props.navigation;
           dispatch(PoemsActions.raUpMyPoems([]));
           this.setState({
             sourceData: [],
           });
         }
       }
       if(nextProps.papp.user.per,this.props.papp.user.per){
         Object.assign(this.props.papp,nextProps.papp);
       }
       if(nextProps.mypoems !== this.props.mypoems){
         console.log('--- up mypoems');
         console.log(this.state.sourceData)
         Object.assign(this.props.mypoems,nextProps.mypoems);
         let mypoems = Object.assign([], this.props.mypoems);//此次需要用const 用let不刷新
         this.setState({
           sourceData:mypoems,
         })
         console.log(mypoems)
       }
       return true;
     }
   render() {
     const { navigate } = this.props.navigation;
     return (
       <View style={pstyles.container}>
       <FlatList
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

         <TouchableOpacity style={styles.add} onPress={()=>{
           this.onAdd()
         }}>
         {this._renderAdd()}
       </TouchableOpacity>
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
    _keyExtractor = (item, index) => index;

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
        this.props.navigation.navigate(UIName.DetailsUI,{id:item.id});
    };
    // 加载item布局
    _renderItem = ({item}) =>{
        return(
            <WorksListItem
                id={item.id}
                onPressItem={ this._onPressItem }
                selected={ !!this.state.selected.get(item.id) }
                item={item}
                time={Utils.dateStr(item.time)}
                navigate = {this.props.navigation.navigate}
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
        <View style={{ height:1, backgroundColor:'#d4d4d4' }}></View>
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
       if(!this.props.papp.userid){
         return;
       }
       this._requestNewestPoem();
  };

  // 上拉加载更多
  _onEndReached = () => {
    console.log('-----------WorksTab_onEndReached--------------');
      if(!this.props.papp.userid){
        return;
      }
     this.setState({refreshing: true})
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[this.state.sourceData.length-1].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.props.papp.userid,
     });
     HttpUtil.post(HttpUtil.POEM_HISTORY_POEM,json).then(res=>{
       if(res.code == 0){
           var poems = res.data;
            if(poems.length > 0){
              let mypoems = Object.assign([], this.props.mypoems);
              mypoems = mypoems.concat(poems);
              let { dispatch } = this.props.navigation;
              dispatch(PoemsActions.raUpMyPoems(mypoems));
              this.setState({
                sourceData: mypoems
              });
            }
       }else{
         Alert.alert(res.errmsg);
       }
       this.setState({refreshing: false});
     }).catch(err=>{
       console.log(err);
     })
  };
   /**
    * 添加按钮
    */
   _renderAdd(){
     return(
       <Icon
         name='add-box'
         size={44}
         type="MaterialIcons"
         color={'#1e8ae8'}
       />
     )
   }

   onAdd(){
     if(this.props.papp.userid){
       console.log('---per',this.props.papp.user.per)
       if(!Utils.getPermission(Permission.WRITE,this.props.papp.user.per)){
            this.props.navigation.navigate(UIName.AgreementUI,{toui:UIName.AddPoemUI});
       } else{
            this.props.navigation.navigate(UIName.AddPoemUI);
       }
     }
   }
   /**
    * 初始化作品数据
    */
   _queryPoems(){
      this._requestNewestPoem();
   }
   /**
    * 请求最新作品
    */
   _requestNewestPoem(){
       if(!this.props.papp.userid){
         return;
       }
      this.setState({refreshing: true});
      var fromid = 0;
      if(this.state.sourceData.length > 0 ){
        fromid = this.state.sourceData[0].id;
      }
      var json = JSON.stringify({
        id:fromid,
        userid:this.props.papp.userid,
      });
      HttpUtil.post(HttpUtil.POEM_NEWEST_POEM,json).then(res=>{
        if(res.code == 0 ){
          var poems = res.data;
           if(poems.length > 0){
             let mypoems = Object.assign([], this.props.mypoems);
             mypoems = poems.concat(mypoems);
             let { dispatch } = this.props.navigation;
             dispatch(PoemsActions.raUpMyPoems(mypoems));
             this.setState({
               sourceData:mypoems,
             });
           }
        }else{
          Alert.alert(res.errmsg);
        }
        this.setState({refreshing: false});
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
         mypoems:state.poems.mypoems,
     }),
 )(WorksUI);
