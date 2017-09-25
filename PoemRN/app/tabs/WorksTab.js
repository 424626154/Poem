// 作品
import React from 'react';
import { Icon } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View ,
  TouchableOpacity,
  Alert,
  FlatList,
  DeviceEventEmitter,
  AsyncStorage,
} from 'react-native';
import HTMLView from 'react-native-htmlview';

import SQLite from '../db/Sqlite';
const sqlite = new SQLite();
import PoemModel from '../db/PoemModel';

import Utils from '../utils/Utils';
import HttpUtil from '../utils/HttpUtil';
import Emitter from '../utils/Emitter';
import Global from '../Global';

// 封装Item组件
class FlatListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
        this.props.navigate('DetailsUI',{id:this.props.id,ftype:1});
    };
    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.fitem}>
                  {/* 诗歌 */}
                  <View style={styles.poem_bg}>
                  <HTMLView
                      value={this.props.poem}
                      />
                  </View>
                  <View style={styles.fitem_more}>
                    <Text style={styles.fitem_time}>
                      {this.props.time}
                    </Text>
                  </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class WorksTab extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title: '作品',
        headerTintColor:'#ffffff',
        headerTitleStyle:{
          fontSize:20,
          alignSelf:'center',
        },
        headerStyle:{
          backgroundColor:'#1e8ae8',
        },
     });
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
        sqlite.createTable();
        DeviceEventEmitter.addListener('AddPoem', (poem)=>{
          this._eventAddPoem(poem)
        });
        DeviceEventEmitter.addListener('DelPoem', (id)=>{
          this._eventDeletePoem(id)
        });
        DeviceEventEmitter.addListener('UpPoem', (poem)=>{
          this._eventUpPoem(poem)
        });
        AsyncStorage.getItem('userid',(error,userid)=>{
          if(!error){
            var islogin = false;
            if(userid){
              islogin = true;
              this._requestUserInfo(userid);
            }
            if(islogin){
              sqlite.queryPoems().then((results)=>{
                  this.dataContainer = results;
                  this.setState({
                    sourceData: this.dataContainer,
                    userid:userid
                  });
                })
            }
            this.setState({
              islogin:islogin,
            })
          }
        })
    }

    componentWillUnMount(){
      sqlite.close()
      DeviceEventEmitter.remove();
    }

  render() {
    const { navigate } = this.props.navigation;
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
                refreshing={ this.state.refreshing }
                onRefresh={ this._renderRefresh }
                // 是一个可选的优化，用于避免动态测量内容，+1是加上分割线的高度
                getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
            />

        <TouchableOpacity style={styles.add} onPress={()=>{
          this.onAdd(navigate)
        }}>
        {this._renderAdd()}
      </TouchableOpacity>
      </View>
    );
  }
  /**
    * 此函数用于为给定的item生成一个不重复的Key。
    * Key的作用是使React能够区分同类元素的不同个体，以便在刷新时能够确定其变化的位置，减少重新渲染的开销。
    * 若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标
    *
    * @param item
    * @param index
    * @private
    */
   // 这里指定使用数组下标作为唯一索引
   _keyExtractor = (item, index) => index;

   /**
    * 使用箭头函数防止不必要的re-render；
    * 如果使用bind方式来绑定onPressItem，每次都会生成一个新的函数，导致props在===比较时返回false，
    * 从而触发自身的一次不必要的重新render，也就是FlatListItem组件每次都会重新渲染。
    *
    * @param id
    * @private
    */
   _onPressItem = (id: string) => {
       this.setState((state) => {
           const selected = new Map(state.selected);
           selected.set(id, !selected.get(id));
           return {selected}
       });
   };
   // 加载item布局
   _renderItem = ({item}) =>{
       return(
           <FlatListItem
               id={item.id}
               onPressItem={ this._onPressItem }
               selected={ !!this.state.selected.get(item.id) }
               name= { item.name }
               poem={item.poem}
               time={Utils.dateStr(item.time)}
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
      if(!this.state.islogin){
        return;
      }
     this.setState({refreshing: true}) // 开始刷新
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[0].id;
     }
     var url = 'http://192.168.1.6:3000/poem/newestpoem';
     var json = JSON.stringify({
       id:fromid,
       userid:this.state.userid,
     });
     var that = this;
     fetch(url,{
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: json,
       })
       .then((response) => response.json())
       .then((responseJson) => {
         if(responseJson.code == 0){
             var poems = responseJson.data;
              if(poems.length > 0){
                this.dataContainer = poems.concat(this.dataContainer);
                this.setState({
                  sourceData: this.dataContainer
                });
                sqlite.savePoems(poems).then((results)=>{
                  console.log('下拉数据保存成功:'+results)
                }).catch((err)=>{
                  console.log(err);
                })
              }
         }else{
           alert(responseJson.errmsg);
         }
         that.setState({refreshing: false});
       })
       .catch((error) => {
         console.error(error);
       });
 };

 // 上拉加载更多
 _onEndReached = () => {
   if(!this.state.islogin){
     return;
   }
    this.setState({refreshing: true})
    var fromid = 0;
    if(this.state.sourceData.length > 0 ){
      fromid = this.state.sourceData[this.state.sourceData.length-1].id;
    }
    var url = 'http://192.168.1.6:3000/poem/historypoem';
    var json = JSON.stringify({
      id:fromid,
      userid:this.state.userid,
    });
    var that = this;
    fetch(url,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: json,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.code == 0){
            var poems = responseJson.data;
             if(poems.length > 0){
               this.dataContainer = this.dataContainer.concat(poems);
               this.setState({
                 sourceData: this.dataContainer
               });
               sqlite.savePoems(poems).then((results)=>{
                 console.log('上拉数据保存成功:'+results)
               }).catch((err)=>{
                 console.log(err);
               })
             }
        }else{
          alert(responseJson.errmsg);
        }
        that.setState({refreshing: false});
      })
      .catch((error) => {
        console.error(error);
      });
 };
  // 添加按钮
  _renderAdd(){
    return(
      <Icon
        name='add-box'
        size={44}
        type="MaterialIcons"
        color={'#1e8ae8'}
      />
    )
  }

  onAdd(navigate){
    navigate('AddPoemUI')
  }
  //添加监听
  _eventAddPoem(poem){
    let sourceData = this.state.sourceData;
    sourceData.unshift(poem);
    this.setState({
        sourceData: sourceData,
    });
  }
  //删除监听
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
  //修改监听
  _eventUpPoem(poem){
    let sourceData = this.state.sourceData
    for(var i = 0 ; i < sourceData.length ; i ++ ){
      if(sourceData[i].id == poem.id){
        sourceData[i].poem = poem.poem
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
        Global.loadUser(res.data);
        Utils.log('_requestUserInfo',Global.user)
        DeviceEventEmitter.emit(Emitter.UPINFO,res.data);
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }


}
const markdownStyles = {
  heading1: {
    fontSize: 24,
    color: 'purple',
  },
  link: {
    color: 'pink',
  },
  mailTo: {
    color: 'orange',
  },
  text: {
    color: '#555555',
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  add:{
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 44,
    height: 44,
  },
  fitem:{
      flex:1,
      padding:10,
  },
  fitem_more:{
    alignItems:'flex-end'
  },
  fitem_time:{
    fontSize:14,
    color:'#d4d4d4',
    marginTop:4,
  },
  poem_bg:{

  },
  poem:{

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
  }
});

export {WorksTab};
