'use strict'
/**
 * 主页
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
      Animated,
     } from 'react-native';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
import * as PoemsActions from '../redux/actions/PoemsActions';
import HomeListItem from '../custom/HomeListItem';
import Banner from '../custom/Banner';

import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  ImageConfig,
  UIName,
  Utils,
  HttpUtil,
  pstyles,
  HomePoemDao,
  goPersonalUI,
  shallowEqual,
  showToast,
  Global,
  Permission,
} from '../AppUtil';
const timeout  = 5000;
type Props = {
    navigation:any,
    papp:Object,
    homepoems:Array<Object>,
};

type State = {
    // sourceData:Array<Object>,
    selected:Map<string, boolean>,
    refreshing:boolean,
    banners:Array<Object>,
    addbox:Animated.Value,
};

class HomeTab extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title: '首页',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:null,
        tabBarOnPress:(({previousScene,scene,jumpToIndex})=>{
            let index = scene.index;
            if(navigation.state.params){
              navigation.state.params.onAddAni();
            }
            jumpToIndex(index);
        }),
     });
     _onLove:Function;
     _onComment:Function;
     _onPersonal:Function;
     _onBannerItem:Function;
     _onAddAni:Function;
     timer:number;
     refresh_time:number;
     state = {
         // 存储数据的状态
         // sourceData : [],
         selected: (new Map(): Map<string, boolean>),
         refreshing: false,
         banners:[],
         addbox:new Animated.Value(1),
     }
     // 数据容器，用来存储数据
     constructor(props) {
         super(props);
         // console.log('---HomeTab()---')
         this._onLove = this._onLove.bind(this);
         this._onComment = this._onComment.bind(this);
         this._onPersonal = this._onPersonal.bind(this);
         this._onBannerItem = this._onBannerItem.bind(this);
         this._onAddAni = this._onAddAni.bind(this);
     }
   // 当视图全部渲染完毕之后执行该生命周期方法
    componentDidMount() {
      this.props.navigation.setParams({onAddAni:this._onAddAni});
      this._onAddAni();
      this.timer = setTimeout(
      () => {
        let { dispatch } = this.props.navigation;
        dispatch(UserActions.raMsgRead());
       },500);
      HomePoemDao.deleteHomePoems();
      this._initPoems();
      this._requestBanners();
    }
    componentWillUnmount(){
      this.timer && clearTimeout(this.timer);
      this.refresh_time && clearTimeout(this.refresh_time);
    }
  shouldComponentUpdate(nextProps, nextState){
    //切换用户id
    if(nextProps.papp.userid !== this.props.papp.userid){
      console.log('------HomeTab() shouldComponentUpdate');
      console.log('------change userid');
      console.log('------nextProps.papp.userid:',nextProps.papp.userid);
      console.log('------this.props.papp.userid:',this.props.papp.userid);
      this._initPoems();
    }
    return true;
  }
  render() {
    return (
      <View style={pstyles.container}>
      <FlatList
                style={{backgroundColor:'#e7e7e7'}}
                data={this.props.homepoems }
                extraData={ this.state.selected }
                keyExtractor={ this._keyExtractor }
                renderItem={ this._renderItem }
                // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
                onEndReachedThreshold={0.1}
                // 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
                onEndReached={ this._onEndReached }
                ListHeaderComponent={ this._renderBanner }
                // ListFooterComponent={ this._renderFooter }
                ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                ListEmptyComponent={ this._renderEmptyView }
                refreshing={this.state.refreshing}
                onRefresh={ this._renderRefresh }
                // 是一个可选的优化，用于避免动态测量内容，+1是加上分割线的高度
                getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
            />
        <TouchableOpacity style={styles.add} onPress={()=>{
            this._onAdd()
          }}>
          {this._renderAdd()}
        </TouchableOpacity>
      </View>
    );
  }
  _onAddAni() {
    this.state.addbox.setValue(0.3);
    Animated.spring(
      this.state.addbox,
      {
        toValue: 1,
        friction: 7,//摩擦力值  默认为7
        tension:40,//弹跳的速度值  默认为40
      }
    ).start()
  }
  /**
   * 添加按钮
   */
  _renderAdd(){
    return(
      <Animated.Image
        source={ImageConfig.addbox}
        style={[styles.addbox,{transform: [{scale: this.state.addbox}]}]}
      />
    )
  }
   _keyExtractor = (item, index) => index+'';

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
               extend={this._getExtend(item)}
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
       <View style={pstyles.separator_transparent}></View>
   );
   _renderBanner = () => (
       <Banner
         banners={this.state.banners}
         onBannerItem={this._onBannerItem}
       />
   );
   _onBannerItem(item){
     if(item){
       if(item.type == 1){
         this.props.navigation.navigate(UIName.BannerWebUI,{banner:item})
       }else if(item.type == 2){
         this.props.navigation.navigate(UIName.DetailsUI,{id:item.pid});
       }else if(item.type == 3){
         this.props.navigation.navigate(UIName.PoemUI,{id:item.pid});
       }
     }
   }
   // 空布局
   _renderEmptyView = () => (
     <View style={styles.empty}>
      <Text style={styles.empty_font}>暂无作品
      </Text>
     </View>
   );
     // 下拉刷新
   _renderRefresh = () => {
     console.log('------_renderRefresh-----')
     this._requestNewestAllPoem();
   };

   // 上拉加载更多
   _onEndReached = () => {
     console.log('------_onEndReached-----')
     this._startRefres();
     var fromid = 0;
     // if(this.state.sourceData.length > 0 ){
     //   fromid = this.state.sourceData[this.state.sourceData.length-1].id;
     // }
     let homepoems = this.props.homepoems;
     if(homepoems.length > 0){
       fromid = homepoems[homepoems.length-1].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.props.papp.userid,
     });
      // console.log(json);
     HttpUtil.post(HttpUtil.POEM_HISTORY_ALLPOEM,json).then((res) => {
         if(res.code == 0){
             var poems = res.data;
              if(poems.length > 0){
                console.log('---------poems')
                console.log(poems)
                let temp_pems = HomePoemDao.addHomePoems(poems);
                console.log(temp_pems)
                // let homepoems = copyArray(this.props.homepoems);
                // homepoems = homepoems.concat(temp_pems);
                let { dispatch } = this.props.navigation;
                // dispatch(PoemsActions.raUpHomePoems(homepoems));
                dispatch(PoemsActions.raFooterHomePoems(temp_pems));
                // this.setState({
                //   sourceData: homepoems,
                // });
              }
         }else{
           showToast(res.errmsg);
         }
        this._endRefres();
       })
       .catch((error) => {
         console.error(error);
       });
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
   /**
    * 点击评论
    */
   _onComment(item){
     this.props.navigation.navigate(UIName.CommentsUI,{id:item.id,ftype:1});
   }
   _onAdd(){
     if(!Utils.isLogin(this.props.navigation)){
         return;
     }
       console.log('---per',this.props.papp.user.per)
       if(!Utils.getPermission(Permission.WRITE,this.props.papp.user.per)){
            this.props.navigation.navigate(UIName.AgreementUI,{toui:UIName.AddPoemUI});
       } else{
            this.props.navigation.navigate(UIName.AddPoemUI,{ftype:0});
       }
   }
   /**
    * 点赞
    */
  _onLove(item){
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
        // let sourceData = this.state.sourceData;
        let sourceData = this.props.homepoems;
        let isRefresh = false;
        let poem = {};
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
            poem = sourceData[i];
            isRefresh = true;
            HomePoemDao.updateHomePoemLove(sourceData[i]);
          }
        }
        if(isRefresh){
          let { dispatch } = this.props.navigation;
          dispatch(PoemsActions.raLoveMe(poem));
        }
      }else{
        showToast(result.errmsg);
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
   _getExtend(item:Object):Object{
     let extend = {}
     if(item.extend){
       extend = JSON.parse(item.extend);
     }
     // console.log('------_getExtend')
     // console.log(extend)
     return extend;
   }
  _initPoems(){
    console.log('---_initPoems homepoems---');
    HomePoemDao.deleteHomePoems();
    let homepoems = [];
    let { dispatch } = this.props.navigation;
    dispatch(PoemsActions.raUpHomePoems(homepoems));
    // this.setState({
    //   sourceData: homepoems,
    // });
    this._requestInitAllPoem(homepoems);
  }
  /**
   * 初始化时请求
   */
   _requestInitAllPoem(poems){
     console.log('------_requestInitAllPoem')
     console.log(this.props.papp)
     this._startRefres();
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
                let tepm_poems = HomePoemDao.addHomePoems(poems);
                // console.log('@@@@@@5')
                // let homepoems = copyArray(this.props.homepoems);
                // homepoems = tepm_poems.concat(homepoems);
                // this.setState({
                //   sourceData: homepoems,
                // });
                let { dispatch } = this.props.navigation;
                // dispatch(PoemsActions.raUpHomePoems(homepoems));
                dispatch(PoemsActions.raHeadHomePoems(tepm_poems));
              }
         }else{
           showToast(res.errmsg);
         }
         this._endRefres();
       })
       .catch((error) => {
         console.error(error);
       });
   }

  /**
   * 请求最新的作品集
   */
  _requestNewestAllPoem(){
    this._startRefres();
    var fromid = 0;
    // if(this.state.sourceData.length > 0 ){
    //   fromid = this.state.sourceData[0].id;
    // }
    let homepoems = this.props.homepoems;
    if(homepoems.length > 0 ){
      fromid = homepoems[0].id;
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
               // console.log('@@@@@@6')
               // let homepoems = copyArray(this.props.homepoems);
               // homepoems = temp_pems.concat(homepoems);
               // let { dispatch } = this.props.navigation;
               // dispatch(PoemsActions.raUpHomePoems(homepoems));
               // this.setState({
               //   sourceData: homepoems,
               // });
               let { dispatch } = this.props.navigation;
               dispatch(PoemsActions.raHeadHomePoems(homepoems));
             }
        }else{
          showToast(res.errmsg);
        }
        this._endRefres();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  _requestBanners(){
    let fromid = 0;
    if(this.state.banners.length > 0){
      fromid = this.state.banners[this.state.banners.length-1].id;
    }
    var json = JSON.stringify({
      id:fromid,
    });
    HttpUtil.post(HttpUtil.BANNER_ALL,json).then((res) => {
        if(res.code == 0){
            var banners = res.data;
            console.log('---_requestBanners---')
            console.log(banners)
             if(banners.length > 0){
               let temp_banners = this.state.banners;
               temp_banners = banners.concat(temp_banners)
               for(var i = 0 ; i < temp_banners.length ; i++){
                 temp_banners[i].key = 'banner_'+i;
               }
               this.setState({banners:temp_banners});
             }
        }else{
          showToast(res.errmsg);
        }
        this._endRefres();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

const styles = StyleSheet.create({
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
  add:{
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 44,
    height: 44,
  },
  addbox:{
    width:44,
    height:44,
    tintColor:StyleConfig.C_FFCA28,
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
  wrapper: {

  },
  slide1: {
    height:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    height:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    height:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});
export default connect(
    state => ({
        papp: state.papp,
        homepoems:state.poems.homepoems,
    }),
)(HomeTab);
