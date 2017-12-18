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
   TextInput,
   Keyboard,
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
    label:string,
    search:string,
    tips:string,
    clear:boolean,
};
class SearchFamousUI extends React.Component<Props,State> {
   static navigationOptions = ({navigation}) => ({
         header:null,
      });
      refresh_time:number;
      keyboardDidShowListener:any;
      keyboardDidHideListener:any;
      keyBoardIsShow:boolean;
      _keyboardDidShow:Function;
      _keyboardDidHide:Function;
      // 数据容器，用来存储数据
      constructor(props) {
          super(props);
          this.state = {
              // 存储数据的状态
              sourceData : [],
              selected: (new Map(): Map<string, boolean>),
              refreshing: false,
              label:'',
              search:'',
              tips:'',
              clear:false,
          }
          this._keyboardDidShow = this._keyboardDidShow.bind(this);
          this._keyboardDidHide = this._keyboardDidHide.bind(this);
      }
    // 当视图全部渲染完毕之后执行该生命周期方法
     componentDidMount() {
       this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
       this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
     }
     componentWillUnmount(){
       this.keyboardDidShowListener.remove();
       this.keyboardDidHideListener.remove();
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
         {this._renderSearch()}
         {this._renderSearchTips()}
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
       </View>
     );
   }
   _renderSearch(){
     return(
       <View style={styles.nav}>
         <TouchableOpacity
           style={{flex:1}}
           onPress={()=>{
               this.props.navigation.navigate(UIName.SearchFamousUI)
           }}
         >
         <View style={styles.search}>
           <Icon
             name='search'
             size={26}
             type="MaterialIcons"
             color={StyleConfig.C_D4D4D4}
             />
             <TextInput
               style={styles.search_input}
               underlineColorAndroid={'transparent'}
               placeholder={'请输入搜索内容'}
               onChangeText={(text) =>{
                 let tips = '';
                 if(text){
                      if(!this.state.clear){
                        this.setState({clear:true});
                      }
                      tips =  '搜索"'+text+'"';
                  }else{
                      if(this.state.clear){
                        this.setState({clear:false});
                      }
                  }
                  this.setState({search:text,tips:tips});
               }}
               value={this.state.search}
               returnKeyType={'go'}
               blurOnSubmit={false}
               autoFocus={true}
               onSubmitEditing={() => {
                 this._onSearch()
               }}
             />
             {this._renderClear()}
         </View>
       </TouchableOpacity>
         <TouchableOpacity style={styles.nav_right}
           onPress={()=>{
               this.props.navigation.goBack();
           }}
           >
           <Text style={styles.nav_right_font}>取消</Text>
         </TouchableOpacity>
       </View>
     )
   }
   _renderSearchTips(){
     if(this.state.tips){
       return(
         <TouchableOpacity style={styles.tips}
           onPress={()=>{
             this._onSearch();
           }}>
           <Text style={styles.tips_font}>{this.state.tips}</Text>
         </TouchableOpacity>
       )
     }else{
       return null;
     }
   }
   _renderClear(){
       if(this.state.clear){
         return(
           <TouchableOpacity
               onPress={()=>{
                   this.setState({search:'',tips:'',clear:false,});
               }}
               >
             <Icon
               name='clear'
               size={26}
               type="MaterialIcons"
               color={StyleConfig.C_D4D4D4}
             />
           </TouchableOpacity>
         )
     }else{
         return null;
     }
   }
   _keyboardDidShow () {
        this.keyBoardIsShow = true;
    }

    _keyboardDidHide () {
        this.keyBoardIsShow = true;
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

  };

  // 上拉加载更多
  _onEndReached = () => {
    console.log('-----------WorksTab_onEndReached--------------');
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
  _onSearch(){
    if (this.keyBoardIsShow) {
        Keyboard.dismiss();
     }
    if(!this.state.search){
      return
    }
    var json = JSON.stringify({
      search:this.state.search,
    });
    HttpUtil.post(HttpUtil.FAMOUS_SEARCH,json).then(res=>{
      if(res.code == 0){
          var opoems = res.data;
           if(opoems.length > 0){
             this.setState({
               sourceData: opoems
             });
           }else{
             this.setState({
               sourceData: []
             });
           }
      }else{
       showToast(res.errmsg);
      }
      this._endRefres()
    }).catch(err=>{
      console.log(err);
    })
  }
 }

 const styles = StyleSheet.create({
   nav:{
     flexDirection:'row',
     height:74,
     paddingTop:30,
     borderBottomWidth:1,
     borderBottomColor:StyleConfig.C_D4D4D4,
     paddingLeft:10,
     paddingBottom:10,
   },
   nav_right:{
     width:50,
     alignItems:'center',
     justifyContent:'center',
   },
   nav_right_font:{
       fontSize:18,
       color:StyleConfig.C_333333,
   },
   search:{
     flex:1,
     flexDirection:'row',
     backgroundColor:StyleConfig.C_EDEDED,
     borderWidth:1,
     borderRadius:6,
     borderColor:StyleConfig.C_EDEDED,
     alignItems:'center',
     // justifyContent:'center',
   },
   search_input:{
      flex:1,
   },
   tips:{
     padding:10,
     alignItems:'center',
     borderBottomWidth:1,
     borderBottomColor:StyleConfig.C_D4D4D4,
   },
   tips_font:{
     fontSize:16,
     color:StyleConfig.C_333333,
   }
 });
 export default connect(
     state => ({
         papp: state.papp,
     }),
 )(SearchFamousUI);
