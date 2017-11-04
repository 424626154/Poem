/**
 * 我的作品
 */
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
 // import HTMLView from 'react-native-htmlview';

 import pstyles from '../style/PStyles';
 import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
 import Utils from '../utils/Utils';
 import HttpUtil from '../utils/HttpUtil';
 import Emitter from '../utils/Emitter';
 import Global from '../Global';

 /**
  * 作品元素组件
  */
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
                   {/* 诗歌 */}
                   {/* <View style={pstyles.htmlview_bg}>
                   <HTMLView
                       style={pstyles.htmlview}
                       value={this.props.poem}
                       renderNode={this.renderNode}
                       />
                   </View> */}
                   <View style={styles.poem}>
                     <Text style={styles.poem_title}>{this.props.title}</Text>
                     <Text style={styles.poem_content}
                     >{this.props.content}</Text>
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
 /**
  * 我的作品列表
  */
 class WorksUI extends React.Component {
   static navigationOptions = ({navigation}) => ({
         title: '作品',
         headerTintColor:StyleConfig.C_FFFFFF,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(
           <TouchableOpacity  onPress={()=>navigation.goBack()}>
             <Text style={pstyles.nav_left}>返回</Text>
           </TouchableOpacity>
         ),
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
         DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
            this._analysisObserver(obj);
         });
         AsyncStorage.getItem(StorageConfig.USERID,(error,userid)=>{
           if(!error){
             this.setState({
               userid:userid,
             });
             if(userid){
               // this._queryPoems();
               this._requestNewestPoem();
             }
           }
         })
     }
     componentWillUnmount(){
       DeviceEventEmitter.removeAllListeners();
     }

   render() {
     const { navigate } = this.props.navigation;
     return (
       <View style={pstyles.container}>
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
                 // getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index, index } )}
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
                title={item.title}
                content={item.content}
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
        <View style={pstyles.empty}>
         <Text style={pstyles.empty_font}>暂无作品
         </Text>
        </View>
    );
   // 下拉刷新
  _renderRefresh = () => {
       if(!this.state.userid){
         return;
       }
       this._requestNewestPoem();
  };

  // 上拉加载更多
  _onEndReached = () => {
    console.log('-----------WorksTab_onEndReached--------------');
      if(!this.state.userid){
        return;
      }
     this.setState({refreshing: true})
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[this.state.sourceData.length-1].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.state.userid,
     });
     HttpUtil.post(HttpUtil.POEM_HISTORY_POEM,json).then(res=>{
       if(res.code == 0){
           var poems = res.data;
            if(poems.length > 0){
              this.dataContainer = this.dataContainer.concat(poems);
              this.setState({
                sourceData: this.dataContainer
              });
            }
       }else{
         Alert.alert(res.errmsg);
       }
       this.setState({refreshing: false});
     }).catch(err=>{
       console.log(err);
     })
  };
   /**
    * 添加按钮
    */
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
   /**
    * 初始化作品数据
    */
   _queryPoems(){
      this._requestNewestPoem();
   }
   /**
    * 添加作品监听
    */
   _eventAddPoem(poem){
     this.dataContainer = [poem].concat(this.dataContainer);
     this.setState({
         sourceData: this.dataContainer,
     });
   }
   /**
    * 删除作品监听
    */
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
    * 修改作品监听
    */
   _eventUpPoem(poem){
     let sourceData = this.state.sourceData
     for(var i = 0 ; i < sourceData.length ; i ++ ){
       if(sourceData[i].id == poem.id){
         sourceData[i].title = poem.title;
         sourceData[i].content = poem.content;
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
    * 请求最新作品
    */
   _requestNewestPoem(){
       if(!this.state.userid){
         return;
       }
      this.setState({refreshing: true});
      var fromid = 0;
      if(this.state.sourceData.length > 0 ){
        fromid = this.state.sourceData[0].id;
      }
      var json = JSON.stringify({
        id:fromid,
        userid:this.state.userid,
      });
      HttpUtil.post(HttpUtil.POEM_NEWEST_POEM,json).then(res=>{
        if(res.code == 0 ){
          var poems = res.data;
           if(poems.length > 0){
             this.dataContainer = poems.concat(this.dataContainer);
             this.setState({
               sourceData: this.dataContainer
             });
           }
        }else{
          Alert.alert(res.errmsg);
        }
        this.setState({refreshing: false});
      }).catch(err=>{
        console.error(err);
      });
   }
   _analysisObserver(obj){
     var action = obj.action;
     var param = obj.param;
     switch (action) {
       case Emitter.LOGIN:
         this.setState({
           userid:Global.user.userid,
         })
         this._queryPoems();
         this._requestUserInfo(Global.user.userid);
         break;
       case Emitter.LOGOUT:
         this.setState({
           userid:Global.user.userid,
         })
         this.dataContainer = [];
         this.setState({
           sourceData: this.dataContainer,
         });
         break;
       case Emitter.ADDPOEM:
         this._eventAddPoem(param);
         break;
       case Emitter.DELPOEM:
         this._eventDeletePoem(param.id)
         break;
       case Emitter.UPPOEM:
         this._eventUpPoem(param)
         break;
       default:
         break;
     }
   }
 }

 const styles = StyleSheet.create({
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
 });

 export {WorksUI};
