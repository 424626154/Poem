'use strict'
/**
 * 想法
 * @flow
 */
import React from 'react';
import{
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  }from 'react-native';
import {
  StyleConfig,
  HeaderConfig,
  pstyles,
  Utils,
  UIName,
  ImageConfig,
  HttpUtil,
  UIUtil,
  showToast,
  goPersonalUI,
  DiscussDao,
  } from '../AppUtil';
import{
   HeaderTabbar,
   DiscussListItem,
   }from '../custom/Custom';
import {connect} from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import * as DiscussActions from '../redux/actions/DiscussActions';
type Props = {
    papp:Object,
    navigation:any,
    discuss:Array<Object>,
    d_count:number,
};

type State = {
    selected:Map<string, boolean>,
    refreshing:boolean,
    banners:Array<Object>,
};

class DiscussTab extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title: '想法',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:null,
     });
     _renderItem:Function;
     _onAdd:Function;
     _onComment:Function;
     _onPersonal:Function;
     _onLove:Function;
     _onShowPhotos:Function;
     _onBannerItem:Function;
     _onBannerMore:Function;
     refresh_time:any;
     timer:any;
     state = {
         // 存储数据的状态
         banners : [],
         selected: (new Map(): Map<string, boolean>),
         refreshing: false,
     }
     constructor(props){
      super(props);
      this._renderItem = this._renderItem.bind(this);
      this._onAdd = this._onAdd.bind(this);
      this._onLove = this._onLove.bind(this);
      this._onComment = this._onComment.bind(this);
      this._onPersonal = this._onPersonal.bind(this);
      this._onShowPhotos = this._onShowPhotos.bind(this);
      // this._onBannerItem = this._onBannerItem.bind(this);
      // this._onBannerMore = this._onBannerMore.bind(this);
    }
    // 当视图全部渲染完毕之后执行该生命周期方法
    componentDidMount() {
      this.timer = setTimeout(
      () => {
        let { dispatch } = this.props.navigation;
        // dispatch(UserActions.raMsgRead());
       },500);
      DiscussDao.deleteDiscuss();
      this._initForms();
      // this._requestBanners();
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
        this._initForms();
      }
      return true;
    }
     render() {
       return (
         <SafeAreaView
           style={pstyles.safearea}>
           <View style={pstyles.container}>
             <HeaderTabbar
               navigation={this.props.navigation}
               title={'想法'}
               navMore={null}/>
               <FlatList
                   data={this.props.discuss}
                   extraData={ this.state.selected }
                   keyExtractor={(item, index) => index+''}
                   renderItem={ this._renderItem }
                   // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
                   onEndReachedThreshold={0.1}
                   // ListHeaderComponent={ this._renderBanner }
                   // 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
                   onEndReached={ this._onEndReached }
                   // ListHeaderComponent={ }
                   // ListFooterComponent={ this._renderFooter }
                   ItemSeparatorComponent={({highlighted}) => (
                        <View style={pstyles.separator}></View>
                    )}
                   ListEmptyComponent={() => (
                      <View style={pstyles.empty}>
                       <Text style={pstyles.empty_font}>暂无内容
                       </Text>
                      </View>
                    )}
                   refreshing={this.state.refreshing}
                   onRefresh={ this._renderRefresh }
                   // 是一个可选的优化，用于避免动态测量内容，+1是加上分割线的高度
                   getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
               />
               {this._renderAdd()}
           </View>
        </SafeAreaView>
       )
     }
     _renderAdd(){
       return(
         <TouchableOpacity style={styles.add}
            onPress={()=>{
              this._onAdd();
            }}
           >
           {/* <Icon
             name='library-books'
             size={45}
             type="MaterialIcons"
             color={StyleConfig.C_1DBD5B}
           /> */}
           <Image
             style={{width:45,height:45,tintColor:StyleConfig.C_4C97FF}}
             source={ImageConfig.add}
           />
         </TouchableOpacity>
       )
     }
     _onAdd(){
       if(Utils.isLogin(this.props.navigation)){
         this.props.navigation.navigate(UIName.AddDiscussUI,{ftype:0})
       }
     }

     _renderItem = ({item}) =>{
          let headurl = Utils.getHead(item.head);
          return(
              <DiscussListItem
                  id={item.id}
                  onPressItem={ this._onPressItem }
                  selected={ !!this.state.selected.get(item.id) }
                  headurl={headurl}
                  time={Utils.dateStr(item.time)}
                  item={item}
                  onLove={this._onLove}
                  onComment={this._onComment}
                  onPersonal={this._onPersonal}
                  photos={UIUtil.getDiscussPhotos(item)}
                  onShowPhotos={this._onShowPhotos}
              />
          );
      };

      _onEndReached = () => {
        // console.log('------_onEndReached');
        // console.log(this.props)
        if(this.props.discuss.length >= this.props.d_count){
          return;
        }
       this._startRefres();
        var fromid = 0;
        // if(this.state.sourceData.length > 0 ){
        //   fromid = this.state.sourceData[this.state.sourceData.length-1].id;
        // }
        let forms = this.props.discuss;
        if(forms.length > 0){
          fromid = forms[forms.length-1].id;
        }
        var json = JSON.stringify({
          id:fromid,
          userid:this.props.papp.userid,
        });
         // console.log(json);
        HttpUtil.post(HttpUtil.DISCUSS_HDISCUSS,json).then((res) => {
            if(res.code == 0){
                var data = res.data ;
                var forms = data.discuss;
                var count = data.count;
                 if(forms.length > 0){
                   // console.log('---------forms')
                   // console.log(forms)
                   let temp_pems = DiscussDao.addDiscuss(forms);
                   let { dispatch } = this.props.navigation;
                   dispatch(DiscussActions.raFooterDiscuss(temp_pems,count));
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

     _renderRefresh = ()=>{
       this._requestNForms();
     }
     _onPressItem = (id: string) => {
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return {selected}
        });
       this.props.navigation.navigate(UIName.DiscussUI,{id:id});
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
      * 点赞
      */
      _onLove(item){
        if(!Utils.isLogin(this.props.navigation))return;
        var onlove = item.mylove == 0 ?1:0;
        var json = JSON.stringify({
          id:item.id,
          type:HttpUtil.ID,
          userid:this.props.papp.userid,
          love:onlove,
        });
        HttpUtil.post(HttpUtil.LOVE_LOVE,json).then((result)=>{
          if(result.code == 0){
            var love = result.data;
            // let sourceData = this.state.sourceData;
            let sourceData = this.props.discuss;
            let isRefresh = false;
            let form = {};
            for(var i = 0 ; i < sourceData.length ; i ++ ){
              if(sourceData[i].id == love.iid){
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
                form = sourceData[i];
                isRefresh = true;
                DiscussDao.updateDiscussLove(sourceData[i]);
              }
            }
            if(isRefresh){
              let { dispatch } = this.props.navigation;
              dispatch(DiscussActions.raDLoveMe(form));
            }
          }else{
            showToast(result.errmsg);
          }
        }).catch((err)=>{
          console.error(err);
        })
      }
      /**
       * 点击评论
       */
      _onComment(item){
        this.props.navigation.navigate(UIName.DiscussUI,{id:item.id,ftype:1});
      }
       /**
      * 点击人物
      */
      _onPersonal(userid){
        goPersonalUI(this.props.navigation.navigate,userid);
      }
      _onShowPhotos(index,photos){
       this.props.navigation.navigate(UIName.PhotosUI,{index:index,photos:photos})
     }
      _initForms(){
       DiscussDao.deleteDiscuss();
       let forms = [];
       let { dispatch } = this.props.navigation;
       dispatch(DiscussActions.raUpDiscuss(forms));
       this._requestNDiscuss(forms);
      }
      /**
     * 初始化时请求
     */
     _requestNDiscuss(forms){
       this._startRefres();
       var fromid = 0;
       if(forms.length > 0 ){
         fromid = forms[0].id;
       }
       var json = JSON.stringify({
         id:fromid,
         userid:this.props.papp.userid,
       });
       HttpUtil.post(HttpUtil.DISCUSS_NDISCUSS,json).then((res) => {
           if(res.code == 0){
               var data = res.data;
               var discuss = data.discuss;
               var d_count = data.count;
                if(discuss.length > 0){
                  let tepm_poems = DiscussDao.addDiscuss(discuss);
                  let { dispatch } = this.props.navigation;
                  dispatch(DiscussActions.raHeadDiscuss(tepm_poems,d_count));
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
      _requestNForms(){
        this._startRefres();
        var fromid = 0;
        let forms = this.props.discuss;
        if(forms.length > 0 ){
          fromid = forms[0].id;
        }
        var json = JSON.stringify({
          id:fromid,
          userid:this.props.papp.userid,
        });
        HttpUtil.post(HttpUtil.DISCUSS_NDISCUSS,json).then((res) => {
            if(res.code == 0){
                var data = res.data;
                var count = data.count;
                var forms = data.discuss;
                 if(forms.length > 0){
                   let temp_pems = DiscussDao.addDiscuss(forms);
                   let { dispatch } = this.props.navigation;
                   dispatch(DiscussActions.raHeadDiscuss(forms,count));
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
  add:{
      position: 'absolute',
      bottom: 8,
      right: 8,
      width: 45,
      height: 45,
    }
});
export default connect(
    state => ({
      discuss:state.discuss.discuss,
      d_count:state.discuss.d_count,
      papp:state.papp,
    }),
)(DiscussTab);
