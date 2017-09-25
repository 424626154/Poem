// 作品详情
import React from 'react';
import { Button,Icon } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View ,
  Alert,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
  AsyncStorage,
  FlatList,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import Utils from '../utils/Utils';
import SQLite from '../db/Sqlite';
const sqlite = new SQLite();
import HttpUtil  from '../utils/HttpUtil';

// 封装Item组件
class FlatListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
        this.props.navigate('CommentUI',{id:this.props.comment.pid,replyid:this.props.comment.id});
    };

    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.fitem}>
                    {this._loadComment(this.props.comment)}
                </View>
            </TouchableOpacity>
        );
    }
    _loadComment(comment){
      var comment_html = '';
      if(comment.replyid > 0){
          comment_html =  '<div><span><comment_font0>'+comment.userid+'</comment_font0></span>&nbsp;<span><comment_font1>回复</comment_font1></span>&nbsp;<span><comment_font0>'+comment.replyuser+'</comment_font0></span><span><comment_font1>&nbsp;:&nbsp;'+comment.comment+'</comment_font1></span></div>';
      }else{
          comment_html =  '<div><span><comment_font0>'+comment.userid+'</comment_font0></span><span><comment_font1>&nbsp;:&nbsp;'+comment.comment+'</comment_font1></span></div>';
      }
      // console.log('comment_html:'+comment_html)
      return(
        <View style={styles.comment}>
          <HTMLView
              style={{flex:1,margin:0,}}
              value={comment_html}
              stylesheet={styles}
              />
        </View>
      )
    }
}
/**
 * 点赞列表
 */
class LoveListView extends React.Component{
  pages = [];
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.loadPages();
  }
  componentWillUpdate(){
    this.loadPages();
  }
  render(){
    return (
      <View style={styles.love_bg}>
        {this.pages.map((elem, index) => {
            return elem;
          }) }
      </View>
      );
  }
  loadPages(){
    var loves = this.props.loves||[];
    this.pages = [];
    for (var i = 0; i < loves.length; i++) {
      var love = loves[i];
      love.key = i;
      love.type = i == loves.length -1?1:0;
      this.pages.push(this._renderItem(love));
    }
  }
  _onLoveItem(item){
    Alert.alert(item.userid);
  }
  _renderItem(item){
    if(item.type == 1){
      return(
        <View key={ item.key } style={{flexDirection:'row'}}>
          <TouchableOpacity
            onPress={()=>{
              this._onLoveItem(item)
            }}>
            <Text style={styles.love_name}>
              { item.userid }
            </Text>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(
        <View key={ item.key } style={{flexDirection:'row'}}>
            <TouchableOpacity
              onPress={()=>{
                this._onLoveItem(item)
              }}>
              <Text style={styles.love_name}>
                { item.userid }
              </Text>
            </TouchableOpacity>
          <Text style={styles.love_p}>,</Text>
        </View>
      )
    }
  }
}

class DetailsUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
    title: '详情',
    headerTintColor:'#ffffff',
    headerTitleStyle:{fontSize:20},
    headerLeft:(
      <TouchableOpacity  onPress={()=>navigation.goBack()}>
        <Text style={styles.nav_left}>返回</Text>
      </TouchableOpacity>
    ),
    headerStyle:{
      backgroundColor:'#1e8ae8',
    },
  });

  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    console.log(params);
    this.state = {
        id:params.id,
        poem:{poem:'',lovenum:0,commentnum:0},
        userid:'',
        ftype:params.ftype,
        islogin:false,
        sourceData : [],
        selected: (new Map(): Map<String, boolean>),
        refreshing: false,
        love:0,
        loves:[],//点赞列表
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('userid',(error,userid)=>{
      if(!error){
        var islogin = false;
        if(userid){
          islogin = true;
        }
        this.setState({
          islogin:islogin,
          userid:userid,
        })
        if(islogin){
          this._requestMylove();
        }
        if(this.state.ftype == 2){
          sqlite.queryAllPoem(this.state.id).then((peom)=>{
              console.log('queryAllPoem:'+JSON.stringify(peom));
              this.setState({
                poem: peom,
              });
            }).catch((err)=>{
              console.error(err);
            });
        }else{
          sqlite.queryPoem(this.state.id).then((peom)=>{
              console.log('queryPoem:'+JSON.stringify(peom));
              this.setState({
                poem: peom,
              });
            }).catch((err)=>{
              console.error(err);
            });
        }
      }
    })
    sqlite.queryComments(this.state.id).then((comments)=>{
      this.dataContainer = comments;
      this.setState({
        sourceData: this.dataContainer,
      });
    })
    this._requestLoves()
    DeviceEventEmitter.addListener('UpPoem', (poem)=>{
        temp_poem = this.state.poem;
        if(temp_poem.id == poem.id){
          temp_poem.poem = poem.poem;
          this.setState({
            poem:temp_poem,
          })
        }
    });
    DeviceEventEmitter.addListener('Comment',(comment)=>{
      let sourceData = this.state.sourceData;
      sourceData.unshift(comment);
      this.setState({
        sourceData: this.dataContainer,
      });
    })
  }

  componentWillUnMount(){
    DeviceEventEmitter.remove();
  }

  render(){
    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
        <View>
        <HTMLView
            value={this.state.poem.poem}
            />
        </View>
        {/* ---menu--- */}
        {this._renderMenu()}
        {/* --点赞列表-- */}
        {this._renderLove()}
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
      </View>
    )
  }
  /**
   * 功能视图
   */
  _renderMenu(){
    if(this.state.userid == this.state.poem.userid){
      return(
        <View style={styles.menu}>
            <TouchableOpacity
              onPress={()=>{
                this.props.navigation.navigate('ModifyPoemUI',{id:this.state.id,ftype:this.state.ftype})
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
                  this.props.navigation.navigate('CommentUI',{id:this.state.id,replyid:0})
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
        <View style={styles.menu}>
            <TouchableOpacity
              onPress={()=>{
                this.props.navigate('DetailsUI',{id:this.props.id});
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
  _renderCommentnum(commentnum){
    return commentnum > 0 ? commentnum:'';
  }
  _renderLovenum(lovenum){
    return lovenum > 0 ? lovenum:'';
  }
  _renderLoveColor(){
    return this.state.love > 0 ? '#1e8ae8':'#7b8992';
  }
  /**
   * 点赞列表
   */
  _renderLove(){
    return(
      <LoveListView
        loves={this.state.loves}
        />
    )
  }
  _keyExtractor = (item, index) => index;
  _onPressItem = (id: string) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
  };
  _renderItem = ({item}) =>{
      return(
          <FlatListItem
              id={item.id}
              onPressItem={ this._onPressItem }
              selected={ !!this.state.selected.get(item.id) }
              comment= {item}
              time={Utils.dateStr(item.time)}
              navigate = {this.props.navigation.navigate}
          />
      );
  };
  _renderItemSeparatorComponent = ({highlighted}) => (
      <View style={{ height:1}}></View>
  );
  // 下拉刷新
  _renderRefresh = () => {
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
       console.log(HttpUtil.POEM_NEWEST_COMMENT+':'+data);
       if(data.code == 0){
           var comments = data.data;
            if(comments.length > 0){
              sqlite.saveComments(comments).then((results)=>{
                console.log('下拉数据保存成功:'+results)
              }).catch((err)=>{
                console.log(err);
              })
              this.dataContainer = comments.concat(this.dataContainer);
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
      console.log(HttpUtil.POEM_NEWEST_COMMENT+':'+data);
      if(data.code == 0){
          var comments = data.data;
           if(comments.length > 0){
             sqlite.saveComments(comments).then((results)=>{
               console.log('上拉数据保存成功:'+results)
             }).catch((err)=>{
               console.log(err);
             })
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
        sqlite.queryAllPoemNum(poem).then((num)=>{
            if(num > 0 ){
              sqlite.deleteAllPoem(poem.id)
            }
        }).catch((err)=>{
          console.error(err)
        })
        sqlite.queryPoemNum(poem).then((num)=>{
          if(num > 0 ){
            sqlite.deletePoem(poem.id)
          }
        }).catch((err)=>{
          console.error(err)
        })
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
    var onlove = this.state.love == 0 ?1:0;
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.state.userid,
      love:onlove,
    });
    HttpUtil.post(HttpUtil.POEM_LOVEPOEM,json).then((result)=>{
      if(result.code == 0){
        var love = result.data;
        console.log('result love:'+JSON.stringify(love));
        let id  = love.id;
        sqlite.AddLove(love)
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
        this.setState({
          loves:loves,
          love:love.love,
          poem:poem,
        })
      }else{
        Alert.alert(result.errmsg);
      }
    }).catch((err)=>{
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
    console.log('_requestLoves:'+json);
    HttpUtil.post(HttpUtil.POEM_LOVES,json).then((data)=>{
        if(data.code == 0){
          var loves = data.data;
          this.setState({
            loves:loves,
          })
          sqlite.deleteLoves().then(()=>{
              sqlite.saveLoves(loves).then(()=>{

              }).catch((err)=>{
                console.error(err);
              })
          }).catch((err)=>{
            console.error(err);
          })
        }else{
          Alert.alert(data.errmsg);
        }
    }).catch((err)=>{
      console.error(err);
    });
  }
  /**
   * 我的点赞信息
   */
  _requestMylove(){
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.state.userid,
    });
    console.log('_requestLoves:'+json);
    HttpUtil.post(HttpUtil.POEM_MYLOVE,json).then((data)=>{
        if(data.code == 0){
          var love = data.data;
          if(love.id > 0){
            this.setState({
              love:love.love,
            })
          }
        }else{
          Alert.alert(data.errmsg);
        }
    }).catch((err)=>{
      console.error(err);
    });
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
  comment:{
    flexDirection:'row',
    padding:4,
  },
  comment_font0:{
    fontSize:16,
    color:'#000000',
  },
  comment_font1:{
    fontSize:18,
    color:'#d4d4d4',
  },
  love_bg:{//点赞列表背景
    padding:10,
    flexDirection:'row',
    justifyContent:'flex-start',
    flexWrap:'wrap',
  },
  love_name:{

  },
  love_p:{
    color:'#d4d4d4',
  }
})

export {DetailsUI};
