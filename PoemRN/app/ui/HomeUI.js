// 欣赏
import React from 'react';
import { Icon } from 'react-native-elements';
import {
      StyleSheet,
      Platform,
      Text,
      View,
      FlatList,
      TouchableOpacity,
      Alert,
      AsyncStorage,
      DeviceEventEmitter,
     } from 'react-native';
import {CachedImage} from "react-native-img-cache";
import HTMLView from 'react-native-htmlview';

import SQLite from '../db/Sqlite';
const sqlite = new SQLite();
import Utils from '../utils/Utils';
import HttpUtil from '../utils/HttpUtil';
import Emitter from '../utils/Emitter';
import Global from '../Global';
import pstyles from '../style/PStyles';
import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';


const nothead = require('../images/ic_account_circle_black.png');

// 封装Item组件
class FlatListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
        this.props.navigate('DetailsUI',{id:this.props.id});
    };
    renderNode(node, index, siblings, parent, defaultRenderer) {
        // console.log('@@@@@@name:'+node.name);
        // console.log('@@@@@@attribs:'+JSON.stringify(node.attribs));
        if (node.name == 'div') {
            const specialSyle = node.attribs.style
            if(specialSyle == 'text-align: center;'){
              specialSyle = {textAlign:'center',};
              return (
                <Text key={index} style={specialSyle}>
                  {defaultRenderer(node.children, parent)}
                </Text>
              )
            }
          }
        if(node.name == 'span'){
          const specialSyle = node.attribs.style
          if(specialSyle == 'font-size: 1em;'){
            specialSyle = {fontSize:22,};
            return (
              <Text key={index} style={specialSyle}>
                {defaultRenderer(node.children, parent)}
              </Text>
            )
          }
        }
      }
    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
            >
            <View style={styles.fitem}>
              {/* 个人信息 */}
              <TouchableOpacity
                onPress={()=>{
                  this.props.navigate('PersonalUI',{userid:this.props.item.userid});
                }}>
              <View style={styles.fitem_header}>
                <CachedImage
                  style={pstyles.small_head}
                  source={this.props.headurl}
                  />
                <View style={styles.fitem_header_info}>
                  <Text style={styles.fitem_name}>
                    {this.props.pseudonym}
                  </Text>
                  <Text style={styles.fitem_time}>
                    {this.props.time}
                  </Text>
                </View>
              </View>
              </TouchableOpacity>
              {/* 诗歌 */}
              <View style={pstyles.htmlview_bg}>
                <HTMLView
                    style={pstyles.htmlview}
                    value={this.props.poem}
                    renderNode={this.renderNode}
                    />
              </View>
              {/* menu */}
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
                          {this.renderCommentnum(this.props.commentnum)}
                        </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={()=>Alert.alert('点赞')}>
                    <View style={styles.menu_item}>
                      <Icon
                        name='thumb-up'
                        size={30}
                        type="MaterialIcons"
                        color={'#7b8992'}
                        />
                        <Text style={styles.menu_font}>
                          {this.renderLivenum(this.props.livenum)}
                        </Text>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
            </TouchableOpacity>
        );
    }

    renderCommentnum(commentnum){
      return commentnum > 0 ? commentnum:'';
    }
    renderLivenum(livenum){
      return livenum > 0 ? livenum:'';
    }
}

class HomeUI extends React.Component {
  // static navigationOptions = ({navigation}) => ({
  //       title: 'Poem',
  //       headerTintColor:StyleConfig.C_FFFFFF,
  //       headerTitleStyle:HeaderConfig.headerTitleStyle,
  //       headerStyle:HeaderConfig.headerStyle,
  //       headerLeft:(
  //         <TouchableOpacity  onPress={()=>navigation.navigate('DrawerOpen')}>
  //           <Icon
  //             name='apps'
  //             size={26}
  //             type="MaterialIcons"
  //             color={StyleConfig.C_FFFFFF}
  //           />
  //         </TouchableOpacity>
  //       ),
  //       drawerLabel: 'HomeUI',
  //    });
     // 数据容器，用来存储数据
     dataContainer = [];
     constructor(props) {
         super(props);
         this.state = {
             // 存储数据的状态
             sourceData : [],
             selected: (new Map(): Map<String, boolean>),
             refreshing: false,
             userid:'',
         }
     }
   // 当视图全部渲染完毕之后执行该生命周期方法
    componentDidMount() {
      DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
         this._analysisObserver(obj);
      });
      AsyncStorage.getItem(StorageConfig.USERID,(error,userid)=>{
        if(!error){
          this.setState({
            userid:userid,
          });
          if(userid){
              this._requestUserInfo(userid);
          }
        }
      })
      this._requestNewestAllPoem();
      // sqlite.queryAllPoems().then((results)=>{
      //     this.dataContainer = results;
      //     this.setState({
      //       sourceData: this.dataContainer,
      //     });
      //   });
    }
    componentWillUnMount(){
      DeviceEventEmitter.remove();
    }
  render() {
    return (
      <View style={styles.container}>
      {this._renderNav()}
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
    );
  }
  _renderNav(){
    return(
      <View style={styles.header}>
          {this._renderNavOS()}
          <View style={styles.header_bg}>
            <TouchableOpacity  style={styles.header_left}
            onPress={()=>this.props.navigation.navigate('DrawerOpen')}>
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
                this.props.navigation.navigate('AddPoemUI')
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
   };
   // 加载item布局
   _renderItem = ({item}) =>{
      let headurl = item.head?{uri:HttpUtil.getHeadurl(item.head)}:nothead;
       return(
           <FlatListItem
               id={item.id}
               onPressItem={ this._onPressItem }
               selected={ !!this.state.selected.get(item.id) }
               pseudonym={ item.pseudonym }
               headurl={headurl}
               poem={item.poem}
               time={Utils.dateStr(item.time)}
               livenum={item.livenum}
               commentnum={item.commentnum}
               item={item}
               navigate = {this.props.navigation.navigate}
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
   this._requestNewestAllPoem();
 };

 // 上拉加载更多
 _onEndReached = () => {
   this.setState({refreshing: true})
   var fromid = 0;
   if(this.state.sourceData.length > 0 ){
     fromid = this.state.sourceData[this.state.sourceData.length-1].id;
   }
   var json = JSON.stringify({
     id:fromid,
     userid:this.state.userid,
   });
   HttpUtil.post(HttpUtil.POEM_HISTORY_ALLPOEM,json).then((res) => {
       if(res.code == 0){
           var poems = res.data;
            if(poems.length > 0){
              this.dataContainer = this.dataContainer.concat(poems);
              this.setState({
                sourceData: this.dataContainer
              });
              // sqlite.saveAllPoems(poems).then((results)=>{
              //   console.log('reading 上拉数据保存成功:'+results)
              // }).catch((err)=>{
              //   console.log(err);
              // })
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
  /**
   * 请求个人信息
   */
  _requestUserInfo(userid){
    Global.user.userid = userid;
    var json = JSON.stringify({
      userid:userid,
    })
    HttpUtil.post(HttpUtil.USER_INFO,json).then(res=>{
      if(res.code == 0){
        Global.user = res.data ;
        Utils.log('_requestUserInfo',Global.user)
        Emitter.emit(Emitter.UPINFO,res.data);
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
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
             if(poems.length > 0){
               this.dataContainer = poems.concat(this.dataContainer);
               this.setState({
                 sourceData: this.dataContainer
               });
              //  sqlite.saveAllPoems(poems).then((results)=>{
              //    console.log('reading 下拉数据保存成功:'+results)
              //  }).catch((err)=>{
              //    console.log(err);
              //  })
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
  _analysisObserver(obj){
    var action = obj.action;
    var param = obj.param;
    switch (action) {
      case Emitter.LOGIN:
        this.setState({
          userid:Global.user.userid,
        })
        this._requestUserInfo(Global.user.userid);
        break;
      case Emitter.LOGOUT:
        this.setState({
          userid:Global.user.userid,
        })
        break;
      case Emitter.ADDPOEM:
        this._requestNewestAllPoem();
        break;
      case Emitter.DELPOEM:
        this._eventDeletePoem(id);
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
  },
  header_left:{
    width:40,
  },
  header_right:{
    width:40,
  },
  header_title:{
    flex:1,
    fontSize:StyleConfig.F_22,
    textAlign:'center',
    color:StyleConfig.C_FFFFFF,
  },
  fitem:{
      flex:1,
      padding:10,
  },
  fitem_header:{
    flex:1,
    flexDirection:'row',
  },
  fitem_header_info:{
    paddingLeft:4,
  },
  fitem_name:{
    fontSize:20,
    color:'#000000'
  },
  fitem_time:{
    fontSize:14,
    color:'#d4d4d4',
    marginTop:4,
  },
  poem_bg:{
    paddingLeft:60,
  },
  poem:{
    fontSize:18,
    color:'#000000',
  },
  menu:{
    paddingLeft:60,
    flexDirection:'row',
  },
  menu_item:{
    flexDirection:'row',
    padding:10,
  },
  menu_font:{
    fontSize:18,
    color:'#7b8992',
    marginLeft:4,
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

export {HomeUI};
