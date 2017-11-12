'use strict'
/**
 * 作品详情页
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
  DeviceEventEmitter,
  FlatList,
  ScrollView,
} from 'react-native';
// import { bindActionCreators } from 'redux';
// import {connect} from 'react-redux';
import * as Actions from '../redux/actions/Actions'

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
  Emitter,
  Global,
  pstyles,
  goPersonalUI
} from '../AppUtil';

class DetailsUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
    title: '详情',
    headerTintColor:StyleConfig.C_FFFFFF,
    headerTitleStyle:HeaderConfig.headerTitleStyle,
    headerStyle:HeaderConfig.headerStyle,
    headerLeft:(
      <TouchableOpacity  onPress={()=>navigation.goBack()}>
        <Text style={styles.nav_left}>返回</Text>
      </TouchableOpacity>
    ),
  });
  dataContainer = [];
  navigate = null;
  constructor(props){
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    let params = this.props.navigation.state.params;
    this.state = {
        id:params.id,
        poem:{userid:'',content:'',lovenum:0,commentnum:0,love:0},
        userid:Global.user.userid,
        ftype:params.ftype,
        sourceData : [],
        selected: (new Map(): Map<String, boolean>),
        refreshing: false,
        loves:[],//点赞列表
    }
    this._onLove = this._onLove.bind(this);
    this._onLoveItem = this._onLoveItem.bind(this);
    this._onLoves= this._onLoves.bind(this);
    this._onPoemLayout = this._onPoemLayout.bind(this);
  }

  componentDidMount(){
    this._requestPoem();
    this._requestLoves();
    this._requestNewestComment();
    DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
       this._analysisObserver(obj);
    });
  }

  componentWillUnmount(){
    DeviceEventEmitter.removeAllListeners();
  }
  render(){
    return(
      <ScrollView
        ref="ScrollView"
        style={styles.container}>
        <View
          ref="poem"
          style={styles.poem}
          onLayout={this._onPoemLayout}>
          <Text style={styles.poem_title}>{this.state.poem.title}</Text>
          <Text style={styles.poem_content}>
            {this.state.poem.content}
          </Text>
        </View>
        {/* ---menu--- */}
        {this._renderMenu()}
        {/* --点赞列表-- */}
        <View
          ref="love"
        >
        {this._renderLove()}
        </View>
        {/* ---评论列表--- */}
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
      </ScrollView>
    )
  }
  /**
   * 功能视图
   */
  _renderMenu(){
    if(this.state.poem.userid == Global.user.userid){
      return(
        <View
          ref="menu"
          style={styles.menu}
        >
            <TouchableOpacity
              onPress={()=>{
                this.navigate(UIName.ModifyPoemUI,{id:this.state.id,poem:this.state.poem})
              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='receipt'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>Alert.alert(
              '删除',
              '是否确认删除？',
              [
                {text: '取消', style: 'cancel'},
                {text: '确认', onPress: () => {
                  this._onDeletePoem()
                }},
              ],
              { cancelable: false }
            )}>
              <View style={styles.menu_item}>
                <Icon
                  name='delete'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                if(Utils.isLogin(this.props.navigation)){
                  this.navigate(UIName.CommentUI,{id:this.state.id,cid:0})
                }
              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='sms'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderCommentnum(this.state.poem.commentnum)}
                  </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                this._onLove();
              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='thumb-up'
                  size={30}
                  type="MaterialIcons"
                  color={this._renderLoveColor()}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderLovenum(this.state.poem.lovenum)}
                  </Text>
              </View>
            </TouchableOpacity>
        </View>
      )
    }else{
      return(
        <View
          ref="menu"
          style={styles.menu}
        >
            <TouchableOpacity
              onPress={()=>{
                if(Utils.isLogin(this.props.navigation)){
                  this.navigate(UIName.CommentUI,{id:this.state.id});
                }
              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='sms'
                  size={30}
                  type="MaterialIcons"
                  color={'#7b8992'}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderCommentnum(this.state.poem.commentnum)}
                  </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                this._onLove();
              }}>
              <View style={styles.menu_item}>
                <Icon
                  name='thumb-up'
                  size={30}
                  type="MaterialIcons"
                  color={this._renderLoveColor()}
                  />
                  <Text style={styles.menu_font}>
                    {this._renderLovenum(this.state.poem.lovenum)}
                  </Text>
              </View>
            </TouchableOpacity>
        </View>
      )
    }
  }
  /**
   * 评论数
   */
  _renderCommentnum(commentnum){
    return commentnum > 0 ? commentnum:'';
  }
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
    return this.state.poem.love > 0 ? StyleConfig.C_1E8AE8:StyleConfig.C_7B8992;
  }
  /**
   * 点赞列表
   */
  _renderLove(){
    return(
      <LoveListView
        ref='lovelistview'
        loves={this.state.loves}
        poem={this.state.poem}
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
         if(this.state.poem.content){
           this.refs.ScrollView.scrollTo({x: 0, y: height+10, animated: false})
         }
      //  }
    }
  }
  _keyExtractor = (item, index) => index;
  _onPressItem = (id: string) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      if(Utils.isLogin(this.state.navigation)){
          this.props.navigate(UIName.CommentUI,{id:this.props.comment.pid,cid:this.props.comment.id,cpseudonym:this.props.comment.pseudonym});
      }
  };
  _renderItem = ({item}) =>{
      return(
          <CommentListItem
              id={item.id}
              onPressItem={ this._onPressItem }
              selected={ !!this.state.selected.get(item.id) }
              comment= {item}
              time={Utils.dateStr(item.time)}
              navigate = {this.navigate}
          />
      );
  };
  _renderItemSeparatorComponent = ({highlighted}) => (
      <View style={{ height:1}}></View>
  );
  // 下拉刷新
  _renderRefresh = () => {
     this._requestNewestComment();
  }
  // 上拉刷新
  _onEndReached = () => {
    this.setState({refreshing: true}) // 开始刷新
    var fromid = 0;
    if(this.state.sourceData.length > 0 ){
      fromid = this.state.sourceData[0].id;
    }
    var json = JSON.stringify({
      id:fromid,
      pid:this.state.id,
    });
   var that = this;
    HttpUtil.post(HttpUtil.POEM_NEWEST_COMMENT,json).then((data)=>{
      // console.log(HttpUtil.POEM_NEWEST_COMMENT+':'+data);
      if(data.code == 0){
          var comments = data.data;
           if(comments.length > 0){
             this.dataContainer = this.dataContainer.concat(comments);
             this.setState({
               sourceData: this.dataContainer
             });
           }
      }else{
        Alert.alert(data.errmsg);
      }
      that.setState({refreshing: false});
    }).catch((err)=>{
      console.error(err);
    })
  }
  /**
   * 删除作品
   */
  _onDeletePoem(){
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.state.userid,
    });
    HttpUtil.post(HttpUtil.POEM_DELPOEM,json).then((data)=>{
      if(data.code == 0){
        var poem = data.data;
        DeviceEventEmitter.emit('DelPoem',this.state.id);
     	  this.props.navigation.goBack();
      }else{
        Alert.alert(data.errmsg);
      }
    }).catch((err)=>{
        Alert.alert('删除诗歌失败:',err);
    });
  }
  /**
   * 点赞
   */
  _onLove(){
    if(!Utils.isLogin(this.props.navigation)){
        return;
    }
    console.log(this)
    var onlove = this.state.poem.love == 0 ?1:0;
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.state.userid,
      love:onlove,
    });
    // this.props.onLike(json);
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
        var poem = this.state.poem;
        var lovenum = poem.lovenum;
        if(love.love == 1){
          lovenum += 1;
        }else{
          if(lovenum > 0 ){
            lovenum -= 1;
          }
        }
        poem.lovenum = lovenum;
        poem.love = love.love;
        this.setState({
          loves:loves,
          poem:poem,
        });
        this.refs.lovelistview.loadPages();
        this._requestLoveComment();
      }else{
        Alert.alert(result.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }
  /**
   * 点赞列表
   */
  _onLoves(){
    this.navigate(UIName.LovesUI,{id:this.state.id})
  }
  /**
   * 点赞元素
   */
  _onLoveItem(item){
    if(item.userid == this.state.userid){
      return;
    }
    goPersonalUI(this.navigate,item.userid);
  }
  /**
   * 作品信息
   */
  _requestPoem(){
      var json = JSON.stringify({
        pid:this.state.id,
        userid:Global.user.userid,
      });
      HttpUtil.post(HttpUtil.POEM_INFO,json).then(res=>{
        if(res.code == 0){
          var poem = res.data;
          this.setState({
              poem:poem,
          });
        }else{
          Alert.alert(res.errmsg);
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
          Alert.alert(data.errmsg);
        }
    }).catch((err)=>{
      console.error(err);
    });
  }
  /**
   * 请求评论列表
   */
  _requestNewestComment(){
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
        Alert.alert(data.errmsg);
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
          var poem = this.state.poem;
          var data = res.data;
          if(poem.id == data.id){
            poem.lovenum = data.lovenum;
            poem.commentnum = data.commentnum;
            this.setState({
              poem:poem,
            });
          }
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }

  _analysisObserver(obj){
    var action = obj.action;
    var param = obj.param;
    switch (action) {
      case Emitter.UPPOEM:// 刷新作品
          var temp_poem = this.state.poem;
          if(temp_poem.id == param.id){
            temp_poem.title = param.title;
            temp_poem.content = param.content;
            this.setState({
              poem:temp_poem,
            })
          }
          break;
      case Emitter.COMMENT:// 评论监听
          let sourceData = this.state.sourceData;
          sourceData.unshift(param);
          this.setState({
            sourceData: this.dataContainer,
          });
          this._requestLoveComment();
          break;
      case Emitter.LOGIN:
          this.setState({
            userid:Global.user.userid,
          });
          break;
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding:10,
  },
  nav_left:{
    fontSize:18,
    color:'#ffffff',
    marginLeft:10,
  },
  menu:{
    paddingLeft:60,
    flexDirection:'row',
    justifyContent:'flex-end',
  },
  menu_item:{
    flexDirection:'row',
    padding:10,
  },
  poem:{

  },
  poem_title:{
    fontSize:30,
    textAlign:'center',
  },
  poem_content:{
    fontSize:20,
    textAlign:'center',
  },
})
function mapStateToProps(state) {
  return {

  };
}

export default DetailsUI;
// export default connect(
//     state => ({
//         love: state.love
//     }),
//     dispatch => bindActionCreators(Actions, dispatch)
// )(DetailsUI);
