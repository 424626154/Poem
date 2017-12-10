'use strict'
/**
 * 作品详情页
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
} from 'react-native';
import {connect} from 'react-redux';
import * as PoemsActions from '../redux/actions/PoemsActions';
import * as UserActions from '../redux/actions/UserActions';
import { captureRef } from "react-native-view-shot";
import {
  CommentListItem,
  LoveListView,
} from '../custom/Custom';
import {
      StyleConfig,
      HeaderConfig,
      StorageConfig,
      UIName,
      Utils,
      HttpUtil,
      pstyles,
      goPersonalUI,
      HomePoemDao,
      Global,
      PImage,
      showToast,
      ImageConfig,
      } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
const boundary = 0;
type Props = {
    navigation:any,
    mypoem:Object,
    papp:Object,
};

type State = {
    id:string,
    ftype:number,//1评论入口 0默认
    ptype:number,//0 用户 1 官方
    refreshing:boolean,
    sourceData:Array<Object>,
    loves:Array<Object>,
    selected:Map<string, boolean>,
    labels:Array<Object>,
    extend:Object,
    photo:string,
    isphoto:boolean,
    loveani:Animated.Value,
    modal:boolean,
};

class DetailsUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
    title: '详情',
    headerTintColor:HeaderConfig.headerTintColor,
    headerTitleStyle:HeaderConfig.headerTitleStyle,
    headerStyle:HeaderConfig.headerStyle,
    headerLeft:(<NavBack navigation={navigation}/>),
  });
  dataContainer = [];
  navigate = null;
  _onLove:Function;
  _onLoveItem:Function;
  _onLoves:Function;
  _onPoemLayout:Function;
  _onPersonal:Function;
  _onDelComment:Function;
  _onComment:Function;
  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    let poem = {userid:'',content:'',lovenum:0,commentnum:0,love:0};
    // Object.assign(this.props.mypoem,poem);
    this.state = {
        id:params.id,
        ftype:params.ftype,
        ptype:params.ptype||0,
        sourceData : [],
        selected: (new Map(): Map<string, boolean>),
        refreshing: false,
        loves:[],//点赞列表
        labels:[],
        extend:{},
        photo:'',
        isphoto:false,
        loveani:new Animated.Value(1),
        modal:false,
    }
    this._onLove = this._onLove.bind(this);
    this._onLoveItem = this._onLoveItem.bind(this);
    this._onLoves= this._onLoves.bind(this);
    this._onPoemLayout = this._onPoemLayout.bind(this);
    this._onPersonal = this._onPersonal.bind(this);
    this._onDelComment = this._onDelComment.bind(this);
    this._onComment = this._onComment.bind(this);
  }

  componentDidMount(){
    this._requestPoem();
    // this._requestLoves();
    this._requestLoveComment()
    // this._requestNewestComment();
  }

  componentWillUnmount(){

  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.mypoem != this.props.mypoem){
      console.log('------DetailsUI() shouldComponentUpdate');
      console.log('------change mypoem');
      console.log('------nextProps.mypoem');
      console.log(nextProps.mypoem)
      console.log('------this.props.mypoem');
      console.log(this.props.mypoem)
      let extend = this._getExtend(nextProps.mypoem);
      let isphoto = this._isPhoto(extend);
      let photo = '';
      if(isphoto){
        photo = extend.photo;
      }
      this.setState({extend:extend,photo:photo,isphoto:isphoto});
      this._loadLabels(extend);
    }
    return true;
  }
  render(){
    return(
      <View
        style={pstyles.container}>
      <ScrollView
        ref="ScrollView">
        <View
          ref="poemsnapshot"
          style={{backgroundColor:StyleConfig.C_FFFFFF}}
          onLayout={this._onPoemLayout}
        >
        {this._renderPoem()}
        {this._renderLabels()}
        {this._renderAnnotation()}
        </View>
        {/* --点赞列表-- */}
        {/* <View
          ref="love"
        >
        {this._renderLove()}
        </View> */}
        <View style={{height:55}}></View>
        {/* ---评论列表--- */}
        {/* <FlatList
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
                  getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
              /> */}
      </ScrollView>
      {/* ---menu--- */}
      {this._renderMenu()}
      {this._renderModal()}
      </View>
    )
  }
  _renderPoem(){
    if(this.state.isphoto){
      return(
        <View
          ref="poem"
          style={[pstyles.poem,{paddingTop:0}]}>
          <View style={[pstyles.photo,{paddingTop:0}]}>
            <PImage
              style={this._getStyle(this.state.extend)}
              source={Utils.getPhoto(this.state.photo?this.state.photo+'_big':'')}
              noborder={true}
              />
          </View>
          <Text style={[pstyles.poem_title,{fontFamily:Global.font}]}>
            {this.props.mypoem.title}
          </Text>
          <Text style={[pstyles.poem_content,{fontFamily:Global.font,textAlign:this._renderAlign(this.props.mypoem)}]}>
            {this.props.mypoem.content}
          </Text>
        </View>
      )
    }else{
      return(
        <View
          ref="poem"
          style={pstyles.poem}>
          <Text style={[pstyles.poem_title,{fontFamily:Global.font}]}>
            {this.props.mypoem.title}
          </Text>
          <Text style={[pstyles.poem_content,{fontFamily:Global.font,textAlign:this._renderAlign(this.props.mypoem)}]}>
            {this.props.mypoem.content}
          </Text>
        </View>
      )
    }
  }
  _renderLabels(){
    return(
      <View style={styles.labels}>
          {this.state.labels.map((item, index) => {
            return(
              <View
                key={item.key}
                style={styles.labelbg}>
                <Text style={styles.label}>
                  {item.name}
                </Text>
              </View>
            )
          })}
      </View>
    )
  }
  _renderAnnotation(){
    if(this.state.extend.annotation){
        return(
          <View style={styles.annotation_bg}>
            <Text style={styles.annotation}>
              {this.state.extend.annotation}
            </Text>
          </View>
        )
      }else{
        return null;
      }
  }
  /**
   * 功能视图
   */
  _renderMenu(){
      return(
        <View
          ref="menu"
          style={styles.menu}
        >
            {/* 评论 */}
            <TouchableOpacity
              onPress={()=>{
                if(Utils.isLogin(this.props.navigation)){
                  this.props.navigation.navigate(UIName.CommentsUI,{id:this.state.id,cid:0,onComment:this._onComment})
                }
              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='sms'
                  size={26}
                  type="MaterialIcons"
                  color={StyleConfig.C_D4D4D4}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderCommentnum(this.props.mypoem.commentnum)}
                  </Text>
              </View>
            </TouchableOpacity>
            {/* 点赞 */}
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
                    {this._renderLovenum(this.props.mypoem.lovenum)}
                  </Text>
              </View>
            </TouchableOpacity>
            {/* 截图 */}
            <TouchableOpacity
                onPress={()=>{
                  captureRef(this.refs.poemsnapshot, {format: 'png', quality: 1}).then(
                      (uri) =>{
                        // alert(uri)
                        this.refs.poemsnapshot.measure((x,y,width,height,px,py)=>{
                          console.log('x:',x)
                          console.log('y:',y)
                          console.log('width:',width)
                          console.log('height:',height)
                          console.log('px:',px)
                          console.log('py:',py)
                          this.props.navigation.navigate(UIName.SnapshotUI,{uri:uri,imgw:width,imgh:height})
                        });
                      }
                  ).catch(
                      (error) => alert(error)
                  );
                }}>
              <View style={styles.menu_item}>
                <Icon
                  name='collections'
                  size={26}
                  type="MaterialIcons"
                  color={StyleConfig.C_D4D4D4}
                  />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={()=>{
                  this._onShowModel();
                }}>
              <View style={styles.menu_item}>
                <Icon
                  name='apps'
                  size={26}
                  type="MaterialIcons"
                  color={StyleConfig.C_D4D4D4}
                  />
              </View>
            </TouchableOpacity>
        </View>
      )
  }
  /**
   * menu 区别
   */
  _renderMenuDis(){
    if(this.props.mypoem.userid == this.props.papp.userid){
        return(
          <View style={{flexDirection:'row'}}>
            {/* 修改 */}
            <View style={styles.modal_item_bg}>
              <TouchableOpacity
                style={styles.modal_item}
                onPress={()=>{
                  this._onCloseModal();
                  this.props.navigation.navigate(UIName.AddPoemUI,{ftype:1,id:this.state.id,poem:this.props.mypoem})
                }}>
                  <Icon
                    name='border-color'
                    size={26}
                    type="MaterialIcons"
                    color={StyleConfig.C_D4D4D4}
                    />
              </TouchableOpacity>
            </View>
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
                              this._onDeletePoem()
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
                this._onStar(this.props.mypoem.id);
              }}>
                <Icon
                  name={this.props.mypoem.star == 1?'star':'star-border'}
                  size={26}
                  type="MaterialIcons"
                  color={StyleConfig.C_D4D4D4}
                  />

            </TouchableOpacity>
          </View>
          <View style={styles.modal_item_bg}>
            <TouchableOpacity
              style={styles.modal_item}
              onPress={()=>{
                this._onCloseModal();
                this._onPersonal(this.props.mypoem.userid);
              }}>
                <Icon
                  name='person'
                  size={26}
                  type="MaterialIcons"
                  color={StyleConfig.C_D4D4D4}
                  />

            </TouchableOpacity>
          </View>
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
          </View>
        </View>
      )
    }
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
          />
      );
  };
  _renderItemSeparatorComponent = ({highlighted}) => (
      <View style={pstyles.separator_not}></View>
  );
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
              {/* 点赞列表 */}
              <View style={styles.modal_item_bg}>
                <TouchableOpacity
                  style={styles.modal_item}
                  onPress={()=>{
                    this._onCloseModal();
                    this._onLoves();
                  }}>
                    <Icon
                      name={this.props.mypoem.love> 0 ?'favorite':'favorite-border'}
                      size={26}
                      type="MaterialIcons"
                      color={StyleConfig.C_D4D4D4}
                      />
                </TouchableOpacity>
              </View>
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
  _renderLoveSource(){
    return this.props.mypoem.love> 0 ?ImageConfig.favorite:ImageConfig.favorite_border;
  }
  _renderLoveStyle(){
    return {
      tintColor:this._renderLoveColor(),
    }
  }
  /**
   * 评论数
   */
  _renderCommentnum(commentnum){
    // console.log('------_renderCommentnum:',commentnum)
    return commentnum > 0 ? commentnum:'';
  }
  _renderAlign(item){
    let align = 'center';
    if(item.extend){
      let extend = JSON.parse(item.extend)
      if(extend.align)align = extend.align
    }
    return align;
  }
  _isPhoto(extend:Object):boolean{
    let isphoto = false;
    if(extend&&extend.photo&&extend.pw&&extend.ph){
      isphoto = true;
    }
    return isphoto;
  }
  _getStyle(extend){
      let style = {resizeMode:'cover',width:Global.width-boundary,height:Global.width-boundary};
      if(extend.pw > extend.ph){
        let style1 = {width:Global.width-boundary,height:(Global.width-boundary)*extend.ph/extend.pw}
        style = Object.assign({},style,style1)
      }
      if(extend.pw < extend.ph){
        let style2 = {width:Global.width-boundary,height:(Global.width-boundary)*extend.ph/extend.pw}
        style = Object.assign({},style,style2)
        console.log('-------_getStyle')
        console.log(style)
      }
      return style;
  }
  _getExtend(item:Object):Object{
    let extend = {}
    if(item&&item.extend){
      extend = JSON.parse(item.extend);
    }
    console.log('------_getExtend')
    console.log(extend)
    return extend;
  }
  _loadLabels(extend:Object){
    let labelsarray = [];
    if(extend&&extend.labels){
      let labels = extend.labels.split(',');
      for(var i = 0 ; i < labels.length;i++){
        labelsarray.push({key:i,name:labels[i]})
      }
    }
    console.log('------labelsarray')
    console.log(labelsarray)
    this.setState({labels:labelsarray})
  }
  _renderEmptyView = () => (
    <View style={styles.empty}>
     {/* <Text style={styles.empty_font}>暂无内容
     </Text> */}
    </View>
  );
  /**
   * 点赞数
   */
  _renderLovenum(lovenum){
    return lovenum > 0 ? lovenum:'';
  }
  /**
   * 点赞颜色
   */
  _renderLoveColor(){
    return this.props.mypoem.love > 0 ? StyleConfig.C_000000:StyleConfig.C_D4D4D4;
  }
  /**
   * 点赞列表
   */
  _renderLove(){
    return(
      <LoveListView
        ref='lovelistview'
        loves={this.state.loves}
        poem={this.props.mypoem}
        onLove={this._onLove}
        onLoves={this._onLoves}
        onLoveItem={this._onLoveItem}
        />
    )
  }
  _onPoemLayout(event){
    if(this.state.ftype == 1){
      //使用大括号是为了限制let结构赋值得到的变量的作用域，因为接来下还要结构解构赋值一次
      //  {
         //获取根View的宽高，以及左上角的坐标值
         let {x, y, width, height} = event.nativeEvent.layout;
         if(this.props.mypoem.content){
           this.refs.ScrollView.scrollTo({x: 0, y: height, animated: false})
         }
      //  }
    }
  }
  _keyExtractor = (item, index) => index+'';
  _onPressItem = (id:string,item) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      // console.log(this)
      if(Utils.isLogin(this.props.navigation)){
          this.props.navigation.navigate(UIName.CommentUI,{id:item.pid,cid:item.id,cpseudonym:item.pseudonym,onComment:this._onComment});
      }
  };
  _onPersonal(userid){
    console.log(userid)
    goPersonalUI(this.props.navigation.navigate,userid);
  }
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
                pid:comment.pid,
                userid:this.props.papp.userid,
              });
              HttpUtil.post(HttpUtil.POEM_DELCOMMENT,json).then((res)=>{
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
                  if(del_num > 0){
                    let poem = this.props.mypoem;
                    let commentnum = poem.commentnum >= del_num?poem.commentnum-del_num:0;
                    poem.commentnum = commentnum;
                    // console.log(commentnum)
                    let { dispatch } = this.props.navigation;
                    dispatch(PoemsActions.raUpPoemLC(poem));
                  }


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

  _onComment(comment:Object){
    console.log('-----_onComment');
    console.log(comment);
    // this._requestNewestComment();
    // this._requestLoveComment();
    this.dataContainer = [comment].concat(this.dataContainer);
    this.setState({
      sourceData: this.dataContainer
    });
    let poem = this.props.mypoem;
    poem.commentnum = poem.commentnum+1;
    let { dispatch } = this.props.navigation;
    dispatch(PoemsActions.raUpPoemLC(poem));
  }
  _onShowModel(){
    this.setState({modal:true})
  }
  _onCloseModal(){
    this.setState({modal:false})
  }
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
      pid:this.state.id,
    });
    HttpUtil.post(HttpUtil.POEM_HISTORY_COMMENT,json).then((data)=>{
      if(data.code == 0){
          var comments = data.data;
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
   * 删除作品
   */
  _onDeletePoem(){
    if(!this.props.papp.userid){
      return;
    }
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.props.papp.userid,
    });
    HttpUtil.post(HttpUtil.POEM_DELPOEM,json).then((data)=>{
      if(data.code == 0){
        let poem = data.data;
        let { dispatch } = this.props.navigation;
        dispatch(PoemsActions.raDelPoem(poem));
     	  this.props.navigation.goBack();
      }else{
        showToast(data.errmsg);
      }
    }).catch((err)=>{
        console.error(err);
    });
  }
  /**
   * 点赞
   */
  _onLove(){
    if(this.props.mypoem.mylove == 0){
      console.log('_onLoveAni')
      this._onLoveAni()
    }
    if(!Utils.isLogin(this.props.navigation)){
        return;
    }
    var onlove = this.props.mypoem.love == 0 ?1:0;
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.props.papp.userid,
      love:onlove,
    });
    HttpUtil.post(HttpUtil.POEM_LOVEPOEM,json).then((result)=>{
      if(result.code == 0){
        var love = result.data;
        console.log('result love:'+JSON.stringify(love));
        let id  = love.id;
        var loves = this.state.loves;
        if(love.love == 0){//删除
          if(loves.length > 0 ){
            for(var i = loves.length-1 ; i >= 0 ; i -- ){
              if(loves[i].id == id){
                loves.splice(i,1);
              }
            }
          }
        }else{
            var isexist = false;
            for(var i = loves.length-1 ; i >= 0 ; i -- ){
              if(loves[i].id == id){
                isexist = true;
                break;
              }
            }
            if(!isexist){
              loves.push(love);
            }
        }
        var poem = this.props.mypoem;
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
        this.setState({
          loves:loves,
        });
        HomePoemDao.updateHomePoemLove(poem);
        let { dispatch } = this.props.navigation;
        dispatch(PoemsActions.raLoveMe(poem));
        // this.refs.lovelistview.loadPages();
      }else{
        showToast(result.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
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
  /**
   * 点赞列表
   */
  _onLoves(){
    this.props.navigation.navigate(UIName.LovesUI,{id:this.state.id})
  }
  _onStar(id){
    if(!Utils.isLogin(this.props.navigation)){
      return;
    }
    let star = this.props.mypoem.star == 1?0:1;
    var json = JSON.stringify({
      type:1,
      userid:this.props.papp.userid,
      sid:this.props.mypoem.id,
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
        dispatch(PoemsActions.raUpStart(1,this.props.mypoem.id,star));
        showToast(tips)
      }else{
        showToast(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
  _onReport(){
    if(!Utils.isLogin(this.props.navigation)){
        return;
    }
    this.props.navigation.navigate(UIName.ReportUI,{title:'举报作品',type:1,rid:this.state.id,ruserid:this.props.mypoem.userid});
  }
  /**
   * 点赞元素
   */
  _onLoveItem(item){
    if(item.userid == this.props.papp.userid){
      return;
    }
    goPersonalUI(this.props.navigation.navigate,item.userid);
  }
  /**
   * 作品信息
   */
  _requestPoem(){
      var json = JSON.stringify({
        pid:this.state.id,
        userid:this.props.papp.userid,
      });
      HttpUtil.post(HttpUtil.POEM_INFO,json).then(res=>{
        if(res.code == 0){
          var poem = res.data;
          let { dispatch } = this.props.navigation;
          dispatch(PoemsActions.raSetPoem(poem));
        }else{
          showToast(res.errmsg);
        }
      }).catch(err=>{
        console.error(err);
      })
  }
  /**
   * 请求点赞列表
   */
  _requestLoves(){
    var json = JSON.stringify({
      id:this.state.id,
    });
    // console.log('_requestLoves:'+json);
    HttpUtil.post(HttpUtil.POEM_LOVES,json).then((data)=>{
        if(data.code == 0){
          var loves = data.data;
          this.setState({
            loves:loves,
          })
          this.refs.lovelistview.loadPages();
        }else{
          showToast(data.errmsg);
        }
    }).catch((err)=>{
      console.error(err);
    });
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
      pid:this.state.id,
    });
    HttpUtil.post(HttpUtil.POEM_NEWEST_COMMENT,json).then((data)=>{
      // console.log(HttpUtil.POEM_NEWEST_COMMENT+':'+data);
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
      pid:this.state.id,
    })
    HttpUtil.post(HttpUtil.POEM_LOVE_COMMENT,json).then(res=>{
      if(res.code == 0){
          var poem = this.props.mypoem;
          var data = res.data;
          if(poem.id == data.id){
            poem.lovenum = data.lovenum;
            poem.commentnum = data.commentnum;
            let { dispatch } = this.props.navigation;
            dispatch(PoemsActions.raUpPoemLC(poem));
          }
      }else{
        showToast(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
}

const styles = StyleSheet.create({
  menu:{
    flexDirection:'row',
    height:50,
    width:Global.width,
    justifyContent:'space-around',
    position: 'absolute',
    bottom:0,
    borderTopWidth:1,
    borderTopColor:StyleConfig.C_D4D4D4,
    backgroundColor:StyleConfig.C_FFFFFF,
  },
  menu_item:{
    flex: 1,
    width:Global.width/5,
    flexDirection:'row',
    padding:10,
  },
  menu_font:{
    fontSize:18,
    color:StyleConfig.C_D4D4D4,
    marginLeft:4,
    // backgroundColor:'#ff00ff',
  },
  modal_item_bg:{
    padding:10,
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
  empty:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
  },
  empty_font:{
    marginTop:160,
    fontSize:18,
    color:StyleConfig.C_D4D4D4,
  },
  labels:{
    flexDirection:'row',
    flexWrap:'wrap',
    paddingLeft:10,
    paddingRight:10,
  },
  labelbg:{
    padding:4,
  },
  label:{
    fontSize:18,
    paddingLeft:6,
    paddingRight:6,
    paddingTop:2,
    paddingBottom:2,
    color:StyleConfig.C_000000,
    borderColor:StyleConfig.C_000000,
    borderWidth:1,
    borderRadius:4,
  },
  annotation_bg:{
    padding:10,
  },
  annotation:{
    fontSize:18,
    color:StyleConfig.C_D4D4D4
  },
  love:{
    width:26,
    height:26,
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
  model_cancel_bg:{
    height:50,width:Global.width,
    backgroundColor:'#ff00ff',
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
  modal_items_bg:{
    padding:20,
    flexDirection:'row'
  },
})

export default connect(
    state => ({
        papp: state.papp,
        mypoem:state.poems.mypoem,
    }),
)(DetailsUI);
