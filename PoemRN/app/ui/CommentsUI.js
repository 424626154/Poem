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
  Keyboard,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import * as PoemsActions from '../redux/actions/PoemsActions';
import * as UserActions from '../redux/actions/UserActions';
import KeyboardSpacer from 'react-native-keyboard-spacer';
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
    refreshing:boolean,
    sourceData:Array<Object>,
    selected:Map<string, boolean>,
    placeholder:string,
    ctips:string,//回复提示
    cid:number,//回复id
    cpseudonym:string,//回复笔名
    comment:string,//提交内容
};

class CommentsUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
    title: '评论',
    headerTintColor:HeaderConfig.headerTintColor,
    headerTitleStyle:HeaderConfig.headerTitleStyle,
    headerStyle:HeaderConfig.headerStyle,
    headerLeft:(<NavBack navigation={navigation}/>),
    headerRight:(
      <TouchableOpacity  onPress={()=>navigation.state.params.onPoem()}>
        <Text style={pstyles.nav_right}>{navigation.state.params.nav_right}</Text>
      </TouchableOpacity>
    ),
  });
  dataContainer = [];
  _onPoem:Function;
  _onPersonal:Function;
  _onDelComment:Function;
  keyboardDidShowListener:any;
  keyboardDidHideListener:any;
  keyBoardIsShow:boolean;
  _keyboardDidShow:Function;
  _keyboardDidHide:Function;
  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    let poem = {userid:'',content:'',lovenum:0,commentnum:0,love:0};
    let ftype = params.ftype||0;
    let nav_right = '';
    if(ftype == 1){
      nav_right = '作品';
    }
    this.state = {
        id:params.id,
        ftype:ftype,
        sourceData : [],
        selected: (new Map(): Map<string, boolean>),
        refreshing: false,
        placeholder:'发表评论...',
        ctips:'',
        cid:0,
        cpseudonym:'',
        comment:'',
    }
    this._onPersonal = this._onPersonal.bind(this);
    this._onDelComment = this._onDelComment.bind(this);
    this._onPoem= this._onPoem.bind(this);
    this.props.navigation.setParams({nav_right:nav_right});
    this.props.navigation.setParams({onPoem:this._onPoem});
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentDidMount(){
    this._requestLoveComment()
    this._requestNewestComment();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount(){
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  shouldComponentUpdate(nextProps, nextState){
    return true;
  }
  render(){
    return(
      <View
        style={pstyles.container}>
        {/* ---评论列表--- */}
        <View style={{flex:1}}>
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
                  getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
              />
        </View>
        {this._renderSubmit()}
        {Platform.OS === 'ios' && <KeyboardSpacer/>}
      </View>
    )
  }
  /**
   * 评论数
   */
  _renderCommentnum(commentnum){
    // console.log('------_renderCommentnum:',commentnum)
    return commentnum > 0 ? commentnum:'';
  }
  _renderEmptyView = () => (
    <View style={pstyles.empty}>
     <Text style={pstyles.empty_font}>暂无评论</Text>
    </View>
  );
  _keyExtractor = (item, index) => index+'';
  _onPressItem = (id:string,item) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      this._renderTips(item.id,item.pseudonym);
  };
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
  _onCanelComment(){
    this._renderTips(0,'');
  }
  _renderTips(cid,cpseudonym){
    var placeholder = '发表评论...';
    var ctips = '';
    if(cid > 0 ){
      placeholder = '回复...';
      ctips = '正在回复['+cpseudonym+']';
      this.refs.cinput.focus();
    }else{
      this._onHideKey();
    }
    this.setState({cid:cid,cpseudonym:cpseudonym,placeholder:placeholder,ctips:ctips,comment:''});
  }
  /**
   * 去往作品
   */
  _onPoem(){
    this.props.navigation.navigate(UIName.DetailsUI,{id:this.state.id,ftype:1});
  }
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
  /**
   * 发布
   */
  _onRelease(){
    if(!this.props.papp.userid){
      return;
    }
    if(!this.state.comment){
      showToast('请输入内容');
      return;
    }
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.props.papp.userid,
      cid:this.state.cid,
      comment:this.state.comment,
    })
    // console.log(json);
    HttpUtil.post(HttpUtil.POEM_COMMENTPOEM,json).then((data)=>{
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
          var poem = res.data;
          let { dispatch } = this.props.navigation;
          dispatch(PoemsActions.raUpCommNum(poem.id,poem.commentnum));
      }else{
        showToast(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
}

const styles = StyleSheet.create({
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
      backgroundColor:StyleConfig.C_E7E7E7,
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
  }
})

export default connect(
    state => ({
        papp: state.papp,
        mypoem:state.poems.mypoem,
    }),
)(CommentsUI);
