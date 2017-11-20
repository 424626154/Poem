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
import * as Actions from '../redux/actions/Actions';

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
  Global,
  pstyles,
  HomePoemDao,
  goPersonalUI,
} from '../AppUtil';


class HomeTab extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title: '首页',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:null,
     });
     // 数据容器，用来存储数据
     dataContainer = [];
     navigate = null;
     constructor(props) {
         super(props);
         console.log('---HomeTab()---')
         let papp = this.props.papp;
         this.papp = papp;
         const {navigate } = this.props.navigation;
         this.navigate = navigate;
         this.state = {
             // 存储数据的状态
             sourceData : [],
             selected: (new Map(): Map<String, boolean>),
             refreshing: false,
             userid:'',
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
        dispatch(Actions.onMsgRead());
       },500);
      HomePoemDao.deleteHomePoems();
      this._initPoems();
    }
    componentWillUnmount(){
      DeviceEventEmitter.removeAllListeners();
      this.timer && clearTimeout(this.timer);
    }
  shouldComponentUpdate(nextProps, nextState){
    //切换用户id
    if(!Object.is(nextProps.papp.userid,this.props.papp.userid)){
      console.log('---up papp');
      this.papp = this.props.papp;
      this._initPoems();
    }
    return true;
  }
  render() {
    return (
      <View style={styles.container}>
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
                refreshing={this.state.refreshing}
                onRefresh={ this._renderRefresh }
                // 是一个可选的优化，用于避免动态测量内容，+1是加上分割线的高度
                getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
            />
      </View>
    );
  }
  /**
   * 渲染自定义nav
   */
  _renderNav(){
    return(
      <View style={styles.header}>
          {this._renderNavOS()}
          <View style={styles.header_bg}>
            <TouchableOpacity  style={styles.header_left}
            onPress={()=>{
              this.navigate('DrawerOpen');
            }}>
              <Icon
                name='reorder'
                size={26}
                type="MaterialIcons"
                color={StyleConfig.C_FFFFFF}
              />
            </TouchableOpacity>
            <Text style={styles.header_title}>Poem</Text>
            <View style={styles.header_right}>
              <TouchableOpacity  style={styles.header_left}
              onPress={()=>{
                if(!Utils.isLogin(this.props.navigation))return;
                this.navigate(UIName.AddPoemUI);
              }}>
                <Icon
                  name='queue'
                  size={26}
                  type="MaterialIcons"
                  color={StyleConfig.C_FFFFFF}
                />
              </TouchableOpacity>
            </View>
          </View>
      </View>
    )
  }
  /**
   * 渲染自定义nav系统区分
   */
  _renderNavOS(){
    if(Platform.OS === 'ios'){
        return(<View style={HeaderConfig.iosNavStyle}></View>)
      }else{
        return(<View></View>)
      }
  }

   _keyExtractor = (item, index) => index;

   _onPressItem = (id: string) => {
       this.setState((state) => {
           const selected = new Map(state.selected);
           selected.set(id, !selected.get(id));
           return {selected}
       });
      this.navigate(UIName.DetailsUI,{id:id});
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
       <View style={{ height:1, backgroundColor:'#d4d4d4' }}></View>
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
     if(this.state.refreshing||1 == 1){
       return;
     }
     this.setState({refreshing: true});
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
                this.dataContainer = this.dataContainer.concat(temp_pems);
                this.setState({
                  sourceData: this.dataContainer
                });
              }
         }else{
           Alert.alert(res.errmsg);
         }
         this.setState({refreshing: false});
       })
       .catch((error) => {
         console.error(error);
       });
   };
   /**
    * 点击评论
    */
   _onComment(item){
     this.navigate(UIName.DetailsUI,{id:item.id,ftype:1});
   }
   /**
    * 点赞
    */
  _onLove(item){
    if(!Utils.isLogin(this.props.navigation))return;
    var onlove = item.mylove == 0 ?1:0;
    var json = JSON.stringify({
      id:item.id,
      userid:this.papp.userid,
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
  _eventDeletePoem(id){
    let sourceData = this.state.sourceData
    for(var i = sourceData.length-1 ; i >= 0 ; i -- ){
      if(sourceData[i].id == id){
        sourceData.splice(i,1);
      }
    }
    this.setState({
        sourceData: sourceData
    });
  }

  _initPoems(){
    let homepoems = HomePoemDao.getHomePoems();
    console.log('---_initPoems homepoems---');
    console.log(homepoems);
    if(homepoems.length > 0){
      this.dataContainer = homepoems.concat(this.dataContainer);
    }else{
      this.dataContainer = [];
    }
    this.setState({
      sourceData: this.dataContainer,
      userid:this.papp.userid,
    });
    this._requestInitAllPoem(homepoems);
  }
  /**
   * 初始化时请求
   */
   _requestInitAllPoem(poems){
     this.setState({refreshing: true}) // 开始刷新
     var fromid = 0;
     if(poems.length > 0 ){
       fromid = poems[0].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.state.userid,
     });
     HttpUtil.post(HttpUtil.POEM_NEWEST_ALLPOEM,json).then((res) => {
         if(res.code == 0){
             var poems = res.data;
              if(poems.length > 0){
                let tepm_poems = HomePoemDao.addHomePoems(poems);
                this.dataContainer = tepm_poems.concat(this.dataContainer);
                this.setState({
                  sourceData: this.dataContainer
                });
              }
         }else{
           Alert.alert(res.errmsg);
         }
         this.setState({refreshing: false});
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
    var fromid = 0;
    if(this.state.sourceData.length > 0 ){
      fromid = this.state.sourceData[0].id;
    }
    var json = JSON.stringify({
      id:fromid,
      userid:this.state.userid,
    });
    HttpUtil.post(HttpUtil.POEM_NEWEST_ALLPOEM,json).then((res) => {
        if(res.code == 0){
            var poems = res.data;
            console.log('---_requestNewestAllPoem---')
            console.log(poems)
             if(poems.length > 0){
               let temp_pems = HomePoemDao.addHomePoems(poems);
               this.dataContainer = temp_pems.concat(this.dataContainer);
               this.setState({
                 sourceData: this.dataContainer
               });
             }
        }else{
          Alert.alert(res.errmsg);
        }
        this.setState({refreshing: false});
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
      case Emitter.ADDPOEM:
        this._requestNewestAllPoem();
        break;
      case Emitter.DELPOEM:
        this._eventDeletePoem(id);
        break;
      case Emitter.CLEAR:
        this._initPoems();
        break;
      // case Emitter.DRAWER_CLOSE:
      //   this.props.navigation.navigate('DrawerClose');
      //   break;
      default:
        break;
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
    }),
)(HomeTab);
