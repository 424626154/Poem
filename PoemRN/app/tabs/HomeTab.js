'use strict'
/**
 * 主页
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
      DeviceEventEmitter,
     } from 'react-native';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
import * as PoemsActions from '../redux/actions/PoemsActions';

import { Icon } from 'react-native-elements';
import HomeListItem from '../custom/HomeListItem';
import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  ImageConfig,
  UIName,
  Utils,
  HttpUtil,
  Emitter,
  pstyles,
  HomePoemDao,
  goPersonalUI,
} from '../AppUtil';
const timeout  = 5000;

class HomeTab extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title: '首页',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:null,
     });
     // 数据容器，用来存储数据
     constructor(props) {
         super(props);
         // console.log('---HomeTab()---')
         this.state = {
             // 存储数据的状态
             sourceData : [],
             selected: (new Map(): Map<String, boolean>),
             refreshing: false,
         }
         this._onLove = this._onLove.bind(this);
         this._onComment = this._onComment.bind(this);
         this._onPersonal = this._onPersonal.bind(this);
     }
   // 当视图全部渲染完毕之后执行该生命周期方法
    componentDidMount() {
      DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
         this._parseObserver(obj);
      });
      this.timer = setTimeout(
      () => {
        let { dispatch } = this.props.navigation;
        dispatch(UserActions.raMsgRead());
       },500);
      HomePoemDao.deleteHomePoems();
      this._initPoems();
    }
    componentWillUnmount(){
      DeviceEventEmitter.removeAllListeners();
      this.timer && clearTimeout(this.timer);
      this.net_time && clearTimeout(this.net_time);
    }
  shouldComponentUpdate(nextProps, nextState){
    // console.log('---HomeTab() shouldComponentUpdate');
    // console.log(nextProps)
    // console.log(this.props)
    //切换用户id
    if(nextProps.papp.userid !== this.props.papp.userid){
      console.log('---HomeTab() shouldComponentUpdate');
      console.log('--- up papp');
      Object.assign(this.props.papp,nextProps.papp);
      // console.log(nextProps.papp)
      // console.log(this.props.papp)
      this._initPoems();
    }
    if(nextProps.homepoems !== this.props.homepoems){
      console.log('---HomeTab() shouldComponentUpdate');
      console.log('--- up homepoems');
      Object.assign(this.props.homepoems,nextProps.homepoems);
      const homepoems = this.props.homepoems;
      console.log(homepoems)
      this.setState({
        sourceData:homepoems,
      })
    }
    return true;
  }
  render() {
    return (
      <View style={pstyles.container}>
      <FlatList
                style={{backgroundColor:'#e7e7e7'}}
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
                refreshing={this.state.refreshing}
                onRefresh={ this._renderRefresh }
                // 是一个可选的优化，用于避免动态测量内容，+1是加上分割线的高度
                getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
            />
      </View>
    );
  }
   _keyExtractor = (item, index) => index;

   _onPressItem = (id: string) => {
       this.setState((state) => {
           const selected = new Map(state.selected);
           selected.set(id, !selected.get(id));
           return {selected}
       });
      this.props.navigation.navigate(UIName.DetailsUI,{id:id});
   };
   // 加载item布局
   _renderItem = ({item}) =>{
       let headurl = Utils.getHead(item.head);
       return(
           <HomeListItem
               id={item.id}
               onPressItem={ this._onPressItem }
               selected={ !!this.state.selected.get(item.id) }
               headurl={headurl}
               time={Utils.dateStr(item.time)}
               item={item}
               onLove={this._onLove}
               onComment={this._onComment}
               onPersonal={this._onPersonal}
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
       <View style={{ height:6, backgroundColor:'transparent' }}></View>
   );
   // 空布局
   _renderEmptyView = () => (
     <View style={styles.empty}>
      <Text style={styles.empty_font}>暂无作品
      </Text>
     </View>
   );
     // 下拉刷新
   _renderRefresh = () => {
     if(this.state.refreshing){
       return;
     }
     this._requestNewestAllPoem();
   };

   // 上拉加载更多
   _onEndReached = () => {
     if(this.state.refreshing){
       return;
     }
     this.setState({refreshing: true});
     this.net_time = setTimeout(()=>{
       this.setState({refreshing: false})
     },timeout);
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[this.state.sourceData.length-1].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.state.userid,
     });
      // console.log(json);
     HttpUtil.post(HttpUtil.POEM_HISTORY_ALLPOEM,json).then((res) => {
         if(res.code == 0){
             var poems = res.data;
              if(poems.length > 0){
                let temp_pems = HomePoemDao.addHomePoems(poems);
                let  homepoems = this.props.homepoems
                homepoems = homepoems.concat(temp_pems);
                let { dispatch } = this.props.navigation;
                dispatch(PoemsActions.raUpHomePoems(homepoems));
                this.setState({
                  sourceData: homepoems,
                });
              }
         }else{
           Alert.alert(res.errmsg);
         }
        this.setState({refreshing: false});
        this.net_time && clearTimeout(this.net_time);
       })
       .catch((error) => {
         console.error(error);
       });
   };
   /**
    * 点击评论
    */
   _onComment(item){
     this.props.navigation.navigate(UIName.DetailsUI,{id:item.id,ftype:1});
   }
   /**
    * 点赞
    */
  _onLove(item){
    if(!this.props.papp.userid){
      return
    }
    if(!Utils.isLogin(this.props.navigation))return;
    var onlove = item.mylove == 0 ?1:0;
    var json = JSON.stringify({
      id:item.id,
      userid:this.props.papp.userid,
      love:onlove,
    });
    HttpUtil.post(HttpUtil.POEM_LOVEPOEM,json).then((result)=>{
      if(result.code == 0){
        var love = result.data;
        let sourceData = this.state.sourceData;
        var isRefresh = false;
        for(var i = 0 ; i < sourceData.length ; i ++ ){
          if(sourceData[i].id == love.pid){
            var lovenum = sourceData[i].lovenum;
            if(love.love == 1){
              lovenum += 1;
            }else{
              if(lovenum > 0 ){
                lovenum -= 1;
              }
            }
            sourceData[i].lovenum = lovenum;
            sourceData[i].mylove = love.love;
            isRefresh = true;
            HomePoemDao.updateHomePoemLove(sourceData[i]);
          }
        }
        if(isRefresh){
          let { dispatch } = this.props.navigation;
          dispatch(PoemsActions.raUpHomePoems(sourceData));
          this.setState({
              sourceData: sourceData
          });
        }
      }else{
        Alert.alert(result.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }
  /**
   * 点击人物
   */
  _onPersonal(userid){
     goPersonalUI(this.props.navigation.navigate,userid);
   }
  _initPoems(){
    console.log('---_initPoems homepoems---');
    HomePoemDao.deleteHomePoems();
    const homepoems = [];
    let { dispatch } = this.props.navigation;
    dispatch(PoemsActions.raUpHomePoems(homepoems));
    this.setState({
      sourceData: homepoems,
    });
    this._requestInitAllPoem(homepoems);
  }
  /**
   * 初始化时请求
   */
   _requestInitAllPoem(poems){
     console.log('------_requestInitAllPoem')
     console.log(this.props.papp)
     this.setState({refreshing: true}) // 开始刷新
     this.net_time = setTimeout(()=>{
       this.setState({refreshing: false})
     },timeout);
     var fromid = 0;
     if(poems.length > 0 ){
       fromid = poems[0].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.props.papp.userid,
     });
     HttpUtil.post(HttpUtil.POEM_NEWEST_ALLPOEM,json).then((res) => {
         if(res.code == 0){
             var poems = res.data;
              if(poems.length > 0){
                const tepm_poems = HomePoemDao.addHomePoems(poems);
                let homepoems = this.props.homepoems;
                homepoems = tepm_poems.concat(homepoems);
                let { dispatch } = this.props.navigation;
                dispatch(PoemsActions.raUpHomePoems(homepoems));
                this.setState({
                  sourceData: homepoems,
                });
              }
         }else{
           Alert.alert(res.errmsg);
         }
         this.setState({refreshing: false});
         this.net_time && clearTimeout(this.net_time);
       })
       .catch((error) => {
         console.error(error);
       });
   }

  /**
   * 请求最新的作品集
   */
  _requestNewestAllPoem(){
    this.setState({refreshing: true}) // 开始刷新
    this.net_time = setTimeout(()=>{
      this.setState({refreshing: false})
    },timeout);
    var fromid = 0;
    if(this.state.sourceData.length > 0 ){
      fromid = this.state.sourceData[0].id;
    }
    var json = JSON.stringify({
      id:fromid,
      userid:this.props.papp.userid,
    });
    HttpUtil.post(HttpUtil.POEM_NEWEST_ALLPOEM,json).then((res) => {
        if(res.code == 0){
            var poems = res.data;
            console.log('---_requestNewestAllPoem---')
            console.log(poems)
             if(poems.length > 0){
               let temp_pems = HomePoemDao.addHomePoems(poems);
               const  homepoems = this.props.homepoems;
               homepoems = temp_pems.concat(homepoems);
               let { dispatch } = this.props.navigation;
               dispatch(PoemsActions.raUpHomePoems(homepoems));
               this.setState({
                 sourceData: homepoems,
               });
             }
        }else{
          Alert.alert(res.errmsg);
        }
        this.setState({refreshing: false});
        this.net_time && clearTimeout(this.net_time);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  /**
   * 解析广播数据
   */
  _parseObserver(obj){
    var action = obj.action;
    var param = obj.param;
    console.log('------HomeTab() _parseObserver')
    console.log(action)
    console.log(param)
    switch (action) {
      case Emitter.CLEAR:
        this._initPoems();
        break;
      default:
        break;
    }
  }

}

const styles = StyleSheet.create({
  header:{
    paddingTop:4,
    paddingBottom:4,
    backgroundColor:StyleConfig.C_1E8AE8,
  },
  header_bg:{
    flexDirection:'row',
    alignItems:'center',
    height:40,
  },
  header_left:{
    justifyContent:'center',
    width:40,
    height:40,
  },
  header_right:{
    justifyContent:'center',
    width:40,
    height:40,
  },
  header_title:{
    flex:1,
    fontSize:StyleConfig.F_22,
    textAlign:'center',
    color:StyleConfig.C_FFFFFF,
  },
  empty:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
  },
  empty_font:{
    marginTop:160,
    fontSize:18,
    color:'#d4d4d4',
  },
});
export default connect(
    state => ({
        papp: state.papp,
        homepoems:state.poems.homepoems,
    }),
)(HomeTab);
