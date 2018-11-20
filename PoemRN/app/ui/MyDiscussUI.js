'use strict'
/**
 * 想法列表
 * @flow
 */
import React from 'react';
import {
        StyleSheet,
        View,
        TouchableOpacity,
        Text,
        TextInput,
        FlatList,
      } from 'react-native';
import {connect} from 'react-redux';
import { Icon } from 'react-native-elements';

import {
        StyleConfig,
        HeaderConfig,
        HttpUtil,
        Utils,
        pstyles,
        PImage,
        UIName,
        showToast,
        Global,
        UIUtil,
      } from '../AppUtil';
import{
      NavBack,
      MyDiscussListItem,
      }from '../custom/Custom';

type Props = {
    navigation:any,
    app:Object,
};

type State = {
    userid:string,
    refreshing:boolean,
    sourceData:Array<Object>,
    selected:Map<string, boolean>,
    count:number,
};

class MyDiscussUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title: '想法',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(<View style={pstyles.nav_right}/>)
     });
  dataContainer = [];
  refresh_time:any;
  constructor(props){
    super(props)
    let params = this.props.navigation.state.params;
    let userid = params.userid;
    this.state = {
      userid:userid,
      sourceData : [],
      selected: (new Map(): Map<string, boolean>),
      refreshing: false,
      count:0,
    }
  }
  componentDidMount(){
    console.log('------MyDiscussUI() componentDidMount-----')
    const { navigate } = this.props.navigation;
    this._requestNewestPoem();
  }
  componentWillUnmount(){
    this.refresh_time && clearTimeout(this.refresh_time);
  }
  shouldComponentUpdate(nextProps, nextState){
    console.log('------MyDiscussUI() shouldComponentUpdate')
    return true;
  }
  render(){
    return(
      <View style={pstyles.container}>
        {/* {this._renderHead()} */}
        <FlatList
                  data={ this.state.sourceData }
                  extraData={ this.state.selected }
                  keyExtractor={ this._keyExtractor }
                  renderItem={ this._renderItem }
                  onEndReachedThreshold={0.1}
                  onEndReached={ this._onEndReached }
                  ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                  ListEmptyComponent={ this._renderEmptyView }
                  refreshing={ this.state.refreshing }
                  onRefresh={ this._renderRefresh }
              />
      </View>
    )
  }
  _keyExtractor = (item, index) => index+'';
  _onPressItem = (id: string) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      this.props.navigation.navigate(UIName.DiscussUI,{id:id});
  };
  _renderItem = ({item}) =>{
    let headurl = Utils.getHead(item.head);
    return(
        <MyDiscussListItem
            id={item.id}
            onPressItem={ this._onPressItem }
            selected={ !!this.state.selected.get(item.id) }
            headurl={headurl}
            time={Utils.dateStr(item.time)}
            item={item}
            photos={UIUtil.getDiscussPhotos(item)}
            onShowPhotos={(index,photos)=>{
              this.props.navigation.navigate(UIName.PhotosUI,{index:index,photos:photos})
            }}
        />
    );
  };
  // 自定义分割线
  _renderItemSeparatorComponent = ({highlighted}) => (
      <View style={pstyles.separator}></View>
  );

  // 空布局
  _renderEmptyView = () => (
      <View style={pstyles.empty}>
       <Text style={pstyles.empty_font}>暂无内容
       </Text>
      </View>
  );
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
  _renderRefresh = () => {
    if(!this.state.userid){
      return;
    }
    this._requestNewestPoem();
  };
  // 上拉加载更多
  _onEndReached = () => {
      if(this.state.sourceData.length >= this.state.count){
        return;
      }
      if(!this.state.userid){
        return;
      }
     this._startRefres();
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[this.state.sourceData.length-1].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.state.userid,
     });
     HttpUtil.post(HttpUtil.DISCUSS_HMYDISCUSS,json).then(res=>{
       if(res.code == 0){
           var data = res.data;
           var discuss = data.discuss;
           var count = data.count;
            if(discuss.length > 0){
              this.dataContainer = this.dataContainer.concat(discuss);
              this.setState({
                sourceData: this.dataContainer,
                count:count,
              });
            }
       }else{
         showToast(res.errmsg);
       }
       this._endRefres();
     }).catch(err=>{
       console.log(err);
     })
  };
  _requestNewestPoem(){
    console.log('------_requestNewestPoem')
    if(!this.state.userid){
      return;
    }
     this._startRefres();
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[0].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.state.userid,
     });
     HttpUtil.post(HttpUtil.DISCUSS_NMYDISCUSS,json).then(res=>{
       if(res.code == 0 ){
           var data = res.data;
           var discuss = data.discuss;
           var count = data.count;
          if(discuss.length > 0){
            this.dataContainer = discuss.concat(this.dataContainer);
            this.setState({
              sourceData: this.dataContainer,
              count:count,
            });
          }
       }else{
         showToast(res.errmsg);
       }
       this._endRefres();
     }).catch(err=>{
       console.error(err);
     });
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: StyleConfig.C_FFFFFF,
  },
  personal:{
    flexDirection:'row',
    padding:10,
  },
  head_bg:{
    flex:1,
    padding:10,
  },
  head:{
    height:80,
    width:80,
  },
  name:{
    fontSize:20,
    color:StyleConfig.C_232323,
  },
  //关注按钮
  follow:{
    // flex:1,
    flexDirection:'row',
    // paddingBottom:14,
    // alignItems:'flex-end',
    justifyContent:'flex-end',
    paddingRight:10,
  },
  follow_button:{
    width:80,
    height:30,
    backgroundColor:StyleConfig.C_FFFFFF,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:8,
    borderWidth:1,
    borderColor:StyleConfig.C_D4D4D4,
  },
  follow_font:{
    fontSize:StyleConfig.F_18,
    color:StyleConfig.C_232323,
    fontWeight:'bold',
  },
  //关注
  follow_bg:{
    flexDirection:'row',
    padding:10,
  },
  follow_item_bg:{
    padding:10,
    width:Global.width/3,
    alignItems:'center',
  },
  follow_item_num:{
    fontSize:StyleConfig.F_14,
    color:StyleConfig.C_232323,
  },
  follow_item_font:{
    marginTop:6,
    fontSize:StyleConfig.F_12,
    color:StyleConfig.C_232323,
  },
  personal_more:{

  },
  line:{
    height:10,
    backgroundColor:StyleConfig.C_D4D4D4,
  }
})
export default connect(
    state => ({
        app: state.papp,
    }),
)(MyDiscussUI);
