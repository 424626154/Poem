'use strict'
/**
 * 想法详情
 * @flow
 */
import React from 'react';
import { Icon } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View ,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Animated,
  Modal,
  Platform,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import * as DiscussActions from '../redux/actions/DiscussActions';
import * as UserActions from '../redux/actions/UserActions';
import { captureRef } from "react-native-view-shot";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Hyperlink from 'react-native-hyperlink';
import {
  CommentListItem,
} from '../custom/Custom';
import {
      StyleConfig,
      HeaderConfig,
      UIName,
      Utils,
      HttpUtil,
      pstyles,
      goPersonalUI,
      Global,
      UIUtil,
      PImage,
      showToast,
      ImageConfig,
      DiscussDao,
      } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
const boundary = 0;
type Props = {
    navigation:any,
    mydisuss:Object,
    papp:Object,
};

type State = {
    id:string,
    ftype:number,//1评论入口 0默认
    loveani:Animated.Value,
    placeholder:string,
    ctips:string,//回复提示
    cid:number,//回复id
    cnickname:string,//回复笔名
    comment:string,//提交内容
    refreshing:boolean,
    sourceData:Array<Object>,
    selected:Map<string, boolean>,
    selected1:Map<string, boolean>,
    modal:boolean,
    photos:Array<Object>,
};

class DiscussUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
    title: '想法',
    headerTintColor:HeaderConfig.headerTintColor,
    headerTitleStyle:HeaderConfig.headerTitleStyle,
    headerStyle:HeaderConfig.headerStyle,
    headerLeft:(<NavBack navigation={navigation}/>),
    headerRight:(
       <TouchableOpacity  onPress={()=>navigation.state.params.onMore()}>
         <View
           style={{paddingRight:10}}>
           <Icon
             name='more-horiz'
             size={26}
             type="MaterialIcons"
             color={StyleConfig.C_D4D4D4}
             />
         </View>
       </TouchableOpacity>
     ),
  });
  dataContainer = [];
  _onDiscussLayout:Function;
  _onPersonal:Function;
  _onRelease:Function;
  _onDelComment:Function;
  _onLoveComment:Function;
  _onMore:Function;
  keyboardDidShowListener:any;
  keyboardDidHideListener:any;
  keyBoardIsShow:boolean;
  _keyboardDidShow:Function;
  _keyboardDidHide:Function;
  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    let poem = {userid:'',name:'',content:'',lovenum:0,commentnum:0,love:0};
    // Object.assign(this.props.mypoem,poem);
    this.state = {
        id:params.id,
        ftype:params.ftype||0,
        loveani:new Animated.Value(1),
        placeholder:'发表评论...',
        ctips:'',
        cid:0,
        cnickname:'',
        comment:'',
        sourceData : [],
        selected: (new Map(): Map<string, boolean>),
        selected1: (new Map(): Map<string, boolean>),
        refreshing: false,
        modal:false,
        photos:[],
    }
    this._onDiscussLayout = this._onDiscussLayout.bind(this);
    this._onPersonal = this._onPersonal.bind(this);
    this._onRelease = this._onRelease.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this._onDelComment = this._onDelComment.bind(this);
    this._onLoveComment = this._onLoveComment.bind(this);
    this._onMore = this._onMore.bind(this);
  }

  componentDidMount(){
    this.props.navigation.setParams({onMore:this._onMore});
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this._requestDiscuss();
    this._requestLoveComment();
    this._requestNewestComment();
  }

  componentWillUnmount(){
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  render(){
    return(
      <SafeAreaView
        style={pstyles.safearea}>
        <View
          style={pstyles.container}>
          <ScrollView
            ref="ScrollView">
            <View
              ref="poemsnapshot"
              style={{backgroundColor:StyleConfig.C_FFFFFF}}
              onLayout={this._onDiscussLayout}
            >
            {this._renderUser()}
            <View style={styles.line}/>
            {this._renderDiscuss()}
            {this._renderMenu()}
            </View>
            {this._renderCommentHead()}
            <FlatList
                      data={ this.state.sourceData }
                      extraData={ this.state.selected }
                      keyExtractor={(item, index) => index+''}
                      renderItem={ this._renderItem }
                      // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
                      onEndReachedThreshold={0.1}
                      // 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
                      onEndReached={ this._onEndReached }
                      // ListHeaderComponent={ this._renderHeader }
                      // ListFooterComponent={ this._renderFooter }
                      ItemSeparatorComponent={({highlighted}) => (
                          <View style={pstyles.separator_not}></View>
                      )}
                      ListEmptyComponent={() => (
                        <View style={pstyles.empty}>
                         <Text style={pstyles.empty_font}>暂无评论</Text>
                        </View>
                      )}
                      refreshing={ this.state.refreshing }
                      onRefresh={ this._renderRefresh }
                      // 是一个可选的优化，用于避免动态测量内容，+1是加上分割线的高度
                      getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
                  />
            <View style={{height:55}}></View>
          </ScrollView>
          {this._renderSubmit()}
          {this._renderModal()}
          {Platform.OS === 'ios' && <KeyboardSpacer/>}
        </View>
      </SafeAreaView>
    )
  }
  _keyboardDidShow () {
       this.keyBoardIsShow = true;
   }

   _keyboardDidHide () {
       this.keyBoardIsShow = true;
   }
   _onHideKey(){
     if (this.keyBoardIsShow) {
         Keyboard.dismiss();
      }
   }
  _renderUser(){
    return(
      <View style={styles.header}>
        <TouchableOpacity
          style={{flexDirection:'row',alignItems:'center'}}
          onPress={()=>{
            this._onPersonal(this.props.mydisuss.userid);
          }}>
        <PImage
          style={pstyles.small_head}
          source={Utils.getHead(this.props.mydisuss.head)}
          // borderRadius={5}
          noborder={true}
          />
        <View style={styles.header_info}>
          <Text style={styles.name}>
            {this.props.mydisuss.nickname}
          </Text>
          <Text style={styles.time}>
            {Utils.dateStr(this.props.mydisuss.time)}
          </Text>
        </View>
        </TouchableOpacity>
      </View>
    )
  }
  _renderDiscuss(){
   return(
      <View
        style={[styles.discuss,{backgroundColor:'#ffffff'}]}>
        <Text style={styles.title}>
          {this.props.mydisuss.title}
        </Text>
        <Hyperlink
          linkStyle={pstyles.link}
          // linkText={ url =>{
          //   return '∽'+url;
          // }}
          onPress={ (url, text) =>{
            this.props.navigation.navigate(UIName.WebUI,{url:url,title:text})
          }}>
          <Text
            style={styles.content}>
            {this.props.mydisuss.content}
          </Text>
        </Hyperlink>
        {this._renderPhotos()}
      </View>
    )
  }
  _renderPhotos(){
    if(this.state.photos.length > 0){
      return(
        <View style={styles.photos_bg}>
          <FlatList
                    data={ this.state.photos }
                    extraData={ this.state.selected1 }
                    keyExtractor={(item, index) => index+''}
                    renderItem={ this._renderPhotoItem }
            />
        </View>
      )
    }else{
      return null;
    }
  }
  _renderPhotoItem = ({item}) =>{
      return(
        <TouchableOpacity
          onPress={()=>{
            this.props.navigation.navigate(UIName.GalleryUI,{index:item.id,images:this.state.photos})
          }}
          >
          <PImage
            style={this._getThumbnail(item)}
            source={{uri:item.pbigurl}}
            // borderRadius={5}
            noborder={true}/>
        </TouchableOpacity>
      )
  }
  _getThumbnail(item){
    let width = Global.width-20;
    let height = width*item.ph/item.pw;
    return {width:width,height:height}
  }
  _renderMenu(){
    return(
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={()=>{
            this._onLove();
          }}>
          <View style={styles.menu_item}>
              <Animated.Image
                source={this._renderLoveSource()}
                style={[styles.love,
                  this._renderLoveStyle(),
                  {transform: [{scale: this.state.loveani}]}
                ]}/>
                <Text style={styles.menu_font}>
                  {'点赞'}
                </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>{
            this._onStart();
          }}>
          <View style={styles.menu_item}>
            <Icon
              name={this.props.mydisuss.star == 1?'star':'star-border'}
              size={26}
              type="MaterialIcons"
              color={this.props.mydisuss.star == 1?StyleConfig.C_FF9900:StyleConfig.C_D4D4D4}
              />
              <Text style={styles.menu_font}>
                {'收藏'}
              </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  _renderLoveColor(){
    return this.props.mydisuss.love > 0 ? StyleConfig.C_FF5555:StyleConfig.C_D4D4D4;
  }
  _renderLoveSource(){
    // console.log('------_renderLoveSource')
    // console.log(this.props.mydisuss.love)
    return this.props.mydisuss.love > 0 ?ImageConfig.favorite:ImageConfig.favorite_border;
  }
  _renderLoveStyle(){
    return {
      tintColor:this._renderLoveColor(),
    }
  }
  _renderCommentHead(){
    return(
      <View style={styles.comment_head}>
        <Text style={styles.chead_lfont}>{this.props.mydisuss.commentnum+'评论'}</Text>
        <TouchableOpacity
          onPress={()=>{
            this._onLoves()
          }}
          >
            <Text style={styles.chead_rfont}>{this.props.mydisuss.lovenum+'点赞'}</Text>
          </TouchableOpacity>
      </View>
    )
  }
  _renderModal(){
    return(
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.modal}
        onRequestClose={()=>{
            console.log('-----onRequestClose')
        }}
        onShow={()=>{
            console.log('onShow')
        }}
        >
          <View style={styles.modal_bg}>

          </View>
          <View style={styles.modal_con}>
            <View style={styles.modal_items_bg}>
              {this._renderMenuDis()}
            </View>
            <TouchableOpacity
              style={styles.model_cancel_bg}
              onPress={()=>{
                this._onCloseModal();
              }}>
              <Text style={styles.modal_cancel_font}>取消</Text>
            </TouchableOpacity>
          </View>
      </Modal>
    )
  }
  /**
   * menu 区别
   */
  _renderMenuDis(){
    if(this.props.mydisuss.userid == this.props.papp.userid){
        return(
          <View style={{flexDirection:'row'}}>
            {/* 删除 */}
            <View style={styles.modal_item_bg}>
                <TouchableOpacity
                    style={styles.modal_item}
                    onPress={()=>{
                      this._onCloseModal();
                      setTimeout(()=>{
                        Alert.alert(
                          '删除',
                          '是否确认删除？',
                          [
                            {text: '取消', style: 'cancel'},
                            {text: '确认', onPress: () => {
                              this._onDelDiscuss()
                            }},
                          ],
                          { cancelable: false }
                        )
                      },100);
                    }}>
                    <Icon
                      name='delete'
                      size={26}
                      type="MaterialIcons"
                      color={StyleConfig.C_D4D4D4}
                      />
                </TouchableOpacity>
                <Text style={styles.modal_item_font}>删除</Text>
            </View>
          </View>
        )
    }else{
      return(
        <View style={{flexDirection:'row'}}>
          <View style={styles.modal_item_bg}>
            <TouchableOpacity
              style={styles.modal_item}
              onPress={()=>{
                this._onCloseModal();
                this._onReport();
              }}>
              <Icon
                name='new-releases'
                size={26}
                type="MaterialIcons"
                color={StyleConfig.C_D4D4D4}
                />
            </TouchableOpacity>
            <Text style={styles.modal_item_font}>举报</Text>
          </View>
        </View>
      )
    }
  }

  _renderSubmit(){
    return(
      <View>
        {this._renderCTips()}
        <View style={styles.submit}>
          <TextInput
            ref='cinput'
            style={styles.input}
            placeholder={this.state.placeholder}
            multiline={true}
            onChangeText={(text) => this.setState({comment:text})}
            value={this.state.comment}
            />
          <TouchableOpacity
            onPress={()=>{
              this._onRelease()
            }}>
            <Text>{'发布'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  _renderCTips(){
    if(this.state.cid > 0 ){
      return(
        <TouchableOpacity style={styles.ctips}
          onPress={()=>{
            this._onCanelComment();
          }}
          >
          <Text style={styles.ctips_left}>
            {this.state.ctips}
          </Text>
          <Text style={styles.ctips_right}>{'取消回复'}</Text>
        </TouchableOpacity>
      )
    }else{
      return null;
    }
  }
  _onLoveAni(){
      this.state.loveani.setValue(0.6);
      Animated.spring(
        this.state.loveani,
        {
          toValue: 1,
          friction: 7,//摩擦力值  默认为7
          tension:40,//弹跳的速度值  默认为40
        }
      ).start()
  }
  _onLove(){
    if(this.props.mydisuss.mylove == 0){
      console.log('_onLoveAni')
      this._onLoveAni()
    }
    if(!Utils.isLogin(this.props.navigation)){
        return;
    }
    var onlove = this.props.mydisuss.love == 0 ?1:0;
    var json = JSON.stringify({
      id:this.state.id,
      type:HttpUtil.ID,
      userid:this.props.papp.userid,
      love:onlove,
    });
    HttpUtil.post(HttpUtil.LOVE_LOVE,json).then((result)=>{
      if(result.code == 0){
        var love = result.data;
        console.log('result love:'+JSON.stringify(love));
        let id  = love.id;
        var poem = this.props.mydisuss;
        var lovenum = poem.lovenum;
        if(love.love == 1){
          lovenum += 1;
        }else{
          if(lovenum > 0 ){
            lovenum -= 1;
          }
        }
        poem.lovenum = lovenum;
        poem.mylove = poem.love = love.love;
        DiscussDao.updateDiscussLove(poem);
        let { dispatch } = this.props.navigation;
        dispatch(DiscussActions.raDLoveMe(poem));
        // this.refs.lovelistview.loadPages();
      }else{
        showToast(result.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }
  _onLoves(){
    this.props.navigation.navigate(UIName.LovesUI,{id:this.state.id,type:HttpUtil.ID})
  }
  _onStart(){
    if(!Utils.isLogin(this.props.navigation)){
      return;
    }
    let star = this.props.mydisuss.star == 1?0:1;
    var json = JSON.stringify({
      type:HttpUtil.ID,
      userid:this.props.papp.userid,
      sid:this.props.mydisuss.id,
      star:star,
    });
    HttpUtil.post(HttpUtil.STATR, json)
    .then(res=>{
      if(res.code == 0){
        let tips = '取消收藏'
        if(star == 1){
            tips = '收藏成功';
        }
        let { dispatch } = this.props.navigation;
        dispatch(DiscussActions.raUpStart(this.props.mydisuss.id,star));
        showToast(tips)
      }else{
        showToast(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
  _onCanelComment(){
    this._renderTips(0,'');
  }
  _renderTips(cid,cnickname){
    var placeholder = '发表评论...';
    var ctips = '';
    if(cid > 0 ){
      placeholder = '回复...';
      ctips = '正在回复['+cnickname+']';
      this.refs.cinput.focus();
    }else{
      this._onHideKey();
    }
    this.setState({cid:cid,cnickname:cnickname,placeholder:placeholder,ctips:ctips,comment:''});
  }
  _renderItem = ({item}) =>{
      return(
          <CommentListItem
              id={item.id}
              onPressItem={ this._onPressItem }
              selected={ !!this.state.selected.get(item.id) }
              comment= {item}
              headurl={Utils.getHead(item.head)}
              time={Utils.dateStr(item.time)}
              onPersonal={this._onPersonal}
              userid={this.props.papp.userid}
              onDelComment={this._onDelComment}
              onLoveComment={this._onLoveComment}
              fromType={1}
          />
      );
  };
  _onDelComment(comment:Object){
    if(comment.userid == this.props.papp.userid){
      Alert.alert(
        '删除评论',
        '是否确认删除？',
        [
          {text: '取消', style: 'cancel'},
          {text: '确认', onPress: () => {
              var json = JSON.stringify({
                id:comment.id,
                type:HttpUtil.ID,
                iid:comment.iid,
                userid:this.props.papp.userid,
              });
              HttpUtil.post(HttpUtil.COMMENT_DEL,json).then((res)=>{
                if(res.code == 0){
                  let id = res.data.id;
                  let comments = this.state.sourceData;
                  let del_num = 0;
                  for(var i = comments.length-1;i >= 0 ; i --){
                    if(comments[i].id == id){
                      comments.splice(i, 1);
                      del_num += 1;
                    }
                  }
                  this.setState({sourceData:comments});
                  this._requestLoveComment()
                }else{
                  showToast(res.errmsg);
                }
              }).catch((err)=>{
                  console.error(err);
              });
          }},
        ],
        { cancelable: false }
      )
    }
  }

  _onLoveComment(comment:Object){
    if(!Utils.isLogin(this.props.navigation)){
        return;
    }
    var onlove = comment.love == 1 ?0:1;
    console.log('---comment.love:'+comment.love )
    console.log('---onlove:'+onlove)
    var json = JSON.stringify({
      iid:this.state.id,
      icid:comment.id,
      userid:this.props.papp.userid,
      love:onlove,
      type:HttpUtil.ID,
    });
    HttpUtil.post(HttpUtil.LOVE_LOVECOMMENT,json).then((result)=>{
      if(result.code == 0){
        var love = result.data;
        console.log('result love:'+JSON.stringify(love));
        let id  = love.id;
        var lovenum = comment.lovenum;
        if(love.love == 1){
          lovenum += 1;
        }else{
          if(lovenum > 0 ){
            lovenum -= 1;
          }
        }
        comment.lovenum = lovenum;
        comment.love = love.love;
        var comments = this.state.sourceData;
        console.log(comment)
        for(var i = 0 ; i < comments.length ; i++){
          if(comments[i].id == comment.id){
            comments[i].lovenum = comment.lovenum;
            comments[i].love = comment.love;
            console.log('-------')
            console.log(comments[i])
          }
        }
        comments = [...comments];
        this.setState({sourceData:comments})
      }else{
        showToast(result.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }
  _onPressItem = (id:string,item) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      this._renderTips(item.id,item.nickname);
  };
  // 下拉刷新
  _renderRefresh = () => {
      console.log('------_requestNewestComment tag2');
     this._requestNewestComment();
  }
  // 上拉刷新
  _onEndReached = () => {
    if(this.state.refreshing){
      return;
    }
    console.log('---DetailsUI() POEM_HISTORY_COMMENT')
    this.setState({refreshing: true}) // 开始刷新
    var fromid = 0;
    var fromid = 0;
    if(this.state.sourceData.length > 0 ){
      fromid = this.state.sourceData[this.state.sourceData.length-1].id;
    }
    var json = JSON.stringify({
      id:fromid,
      type:HttpUtil.ID,
      iid:this.state.id,
    });
    HttpUtil.post(HttpUtil.COMMENT_HISTORY,json).then((data)=>{
      if(data.code == 0){
          var comments = data.data;
          console.log(data)
           if(comments.length > 0){
             this.dataContainer = this.dataContainer.concat(comments);
             this.setState({
               sourceData: this.dataContainer
             });
           }
      }else{
        showToast(data.errmsg);
      }
      this.setState({refreshing: false});
    }).catch((err)=>{
      console.error(err);
    })
  }
  /**
   * 请求评论列表
   */
  _requestNewestComment(){
    if(this.state.refreshing){
      return;
    }
    console.log('---DetailsUI() _requestNewestComment')
    this.setState({refreshing: true}) // 开始刷新
    var fromid = 0;
    if(this.state.sourceData.length > 0 ){
      fromid = this.state.sourceData[0].id;
    }
    var json = JSON.stringify({
      id:fromid,
      type:HttpUtil.ID,
      iid:this.state.id,
    });
    HttpUtil.post(HttpUtil.COMMENT_LATEST,json).then((data)=>{
      // console.log(HttpUtil.POEM_NEWEST_COMMENT+':'+data);
      console.log('---'+HttpUtil.COMMENT_LATEST)
      console.log(data)
      if(data.code == 0){
          var comments = data.data;
           if(comments.length > 0){
             this.dataContainer = comments.concat(this.dataContainer);
             this.setState({
               sourceData: this.dataContainer
             });
           }
      }else{
        showToast(data.errmsg);
      }
      this.setState({refreshing: false});
    }).catch((err)=>{
      console.error(err);
    })
  }
  /**
   * 请求点单数和评论数
   */
  _requestLoveComment(){
    var json = JSON.stringify({
      id:this.state.id,
      type:HttpUtil.ID,
    })
    HttpUtil.post(HttpUtil.LOVE_LCNUM,json).then(res=>{
      if(res.code == 0){
          var poem = res.data;
          let { dispatch } = this.props.navigation;
          dispatch(DiscussActions.raUpCommNum(poem.id,poem.commentnum));
      }else{
        showToast(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
  _onDiscussLayout(event){
    if(this.state.ftype == 1){
      //使用大括号是为了限制let结构赋值得到的变量的作用域，因为接来下还要结构解构赋值一次
      //  {
         //获取根View的宽高，以及左上角的坐标值
         let {x, y, width, height} = event.nativeEvent.layout;
         if(this.props.mydisuss.content){
           this.refs.ScrollView.scrollTo({x: 0, y: height, animated: false})
         }
      //  }
    }
  }
  _onPersonal(userid){
    goPersonalUI(this.props.navigation.navigate,userid);
  }
  _onRelease(){
    if(!Utils.isLogin(this.props.navigation)){
        return;
    }
    // if(!this.props.papp.userid){
    //   return;
    // }
    if(!this.state.comment){
      showToast('请输入内容');
      return;
    }
    var json = JSON.stringify({
      id:this.state.id,
      type:HttpUtil.ID,
      userid:this.props.papp.userid,
      cid:this.state.cid,
      comment:this.state.comment,
    })
    // console.log(json);
    HttpUtil.post(HttpUtil.COMMENT_ADD,json).then((data)=>{
      if(data.code == 0){
        var comment = data.data;
        let comments = this.state.sourceData;
        comments = [comment].concat(comments);
        this.setState({sourceData:comments})
        this._requestLoveComment();
        showToast('评论成功');
        this._renderTips(0,'');
        console.log(this.state.comment)
      }else{
        showToast(data.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }
  _requestDiscuss(){
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.props.papp.userid,
    });
    HttpUtil.post(HttpUtil.DISCUSS_INFO,json).then(res=>{
      if(res.code == 0){
        var poem = res.data;
        let photos = UIUtil.getDiscussPhotos(poem);
        this.setState({photos:photos})
        let { dispatch } = this.props.navigation;
        dispatch(DiscussActions.raSetDiscuss(poem));
      }else{
        showToast(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
  _onMore(){
    this._onShowModel();
  }
  _onShowModel(){
    this.setState({modal:true})
  }
  _onCloseModal(){
    this.setState({modal:false})
  }
  _onReport(){
    if(!Utils.isLogin(this.props.navigation)){
        return;
    }
    this.props.navigation.navigate(UIName.ReportUI,{title:'举报想法',type:1,rid:this.state.id,ruserid:this.props.mydisuss.userid});
  }
  _onDelDiscuss(){
    if(!this.props.papp.userid){
      return;
    }
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.props.papp.userid,
    });
    HttpUtil.post(HttpUtil.DISCUSS_DEL,json).then((data)=>{
      if(data.code == 0){
        let poem = data.data;
        let { dispatch } = this.props.navigation;
        dispatch(DiscussActions.raDelDiscuss(poem));
     	  this.props.navigation.goBack();
      }else{
        showToast(data.errmsg);
      }
    }).catch((err)=>{
        console.error(err);
    });
  }

}

const styles = StyleSheet.create({
  header:{
    flex:1,
    flexDirection:'row',
    padding:10,
  },
  header_info:{
    paddingLeft:4,
  },
  name:{
    marginLeft:6,
    fontSize:16,
    color:StyleConfig.C_232323,
  },
  time:{
    marginLeft:6,
    fontSize:14,
    color:StyleConfig.C_D4D4D4,
  },
  line:{
    height:1,
    backgroundColor:StyleConfig.C_D4D4D4,
    marginLeft:10,
    marginRight:10,
  },
  discuss:{
    padding:10,
  },
  title:{
    fontSize:24,
    textAlign:'left',
  },
  content:{
    fontSize:18,
    textAlign:'left',
  },
  submit:{
    padding:10,
    flexDirection:'row',
    backgroundColor:StyleConfig.C_FFFFFF,
    borderTopColor:StyleConfig.C_D4D4D4,
    borderTopWidth:1,
    alignItems:'center',
    justifyContent:'center',
  },
  ctips:{
      flexDirection:'row',
      padding:10,
      alignItems:'center',
      justifyContent:'space-between',
      backgroundColor:StyleConfig.C_FFFFFF,
  },
  ctips_left:{
      fontSize:14,
      color:StyleConfig.C_7B8992,
  },
  ctips_right:{
    fontSize:14,
    color:StyleConfig.C_7B8992,
  },
  input:{
    flex:1,
    maxHeight:100,
  },
  modal_item_bg:{
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  modal_item:{
    width:60,
    height:60,
    borderWidth:1,
    borderColor:StyleConfig.C_D4D4D4,
    borderRadius:30,
    alignItems:'center',
    justifyContent: 'center',
  },
  modal_item_font:{
    marginTop:6,
    fontSize:14,
    color:StyleConfig.C_D4D4D4,
  },
  model_cancel_bg:{
    height:50,width:Global.width,
    borderTopWidth:1,
    borderTopColor:StyleConfig.C_D4D4D4,
    backgroundColor:StyleConfig.C_FFFFFF,
    alignItems:'center',
    justifyContent: 'center',
  },
  modal_cancel_font:{
    fontSize:20,
    color:StyleConfig.C_D4D4D4
  },
  modal_bg:{
    flex:1,
    backgroundColor:'#00000044'
  },
  modal_con:{
    position: 'absolute',
    bottom:0,
    backgroundColor:StyleConfig.C_FFFFFF
  },
  modal_items_bg:{
    padding:20,
    flexDirection:'row'
  },
  photos_bg:{
    paddingTop:10,
  },
  menu:{
    flexDirection:'row',
    padding:10,
    justifyContent:'flex-end'
  },
  menu_item:{
    flexDirection:'row',
    padding:10,
    justifyContent:'center',
    alignItems:'center',
  },
  menu_font:{
    fontSize:18,
    color:StyleConfig.C_D4D4D4,
    marginLeft:4,
  },
  love:{
    width:26,
    height:26,
  },
  comment_head:{
    // flex:1,
    flexDirection:'row',
    // alignItems:'center',
    justifyContent:'space-between',
    padding:10,
    borderBottomColor:StyleConfig.C_D4D4D4,
    borderBottomWidth:1,
    // marginBottom:10,
    backgroundColor:StyleConfig.C_FFFFFF,
  },
  chead_lfont:{
    fontSize:18,
    color:StyleConfig.C_D4D4D4,
  },
  chead_rfont:{
    fontSize:18,
    color:StyleConfig.C_D4D4D4,
  },
});

export default connect(
    state => ({
        papp: state.papp,
        mydisuss:state.discuss.mydisuss,
    }),
)(DiscussUI);
