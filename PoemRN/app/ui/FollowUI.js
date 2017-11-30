'use strict'
/**
 * 关注
 * @flow
 */
import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        TouchableOpacity,
        Alert,
        FlatList,
      } from 'react-native';
import {connect} from 'react-redux';
import{
      StyleConfig,
      HeaderConfig,
      StorageConfig,
      pstyles,
      Utils,
      HttpUtil,
      goPersonalUI,
      } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
import FollowListItem from '../custom/FollowListItem';
type Props = {
    navigation:any,
    papp:Object,
};

type State = {
      sourceData:Array<Object>,
      selected:Map<string, boolean>,
      refreshing:boolean,
      userid:string,
      type:number,
};
class FollowUI extends React.Component<Props,State> {
 static navigationOptions = ({navigation}) => ({
       title:navigation.state.params.title,
       headerTintColor:HeaderConfig.headerTintColor,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(<NavBack navigation={navigation}/>),
    });
    navigate = this.props.navigation.navigate;
    dataContainer = [];
    _onFollow:Function;
    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        this.state = ({
          sourceData : [],
          selected: (new Map(): Map<string, boolean>),
          refreshing: false,
          type:params.type,
          userid:params.userid,
        });
        this._onFollow = this._onFollow.bind(this);
    }
    componentDidMount(){
        this._requestFollows();
    }
    componentWillUnmount(){

    }
    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={pstyles.container}>
          <FlatList
                    data={ this.state.sourceData }
                    extraData={ this.state.selected }
                    keyExtractor={ (item, index) => index+''}
                    renderItem={ this._renderItem }
                    // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
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
    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={pstyles.separator}></View>
    );
    // 空布局
    _renderEmptyView = () => (
        <View style={pstyles.empty}>
         <Text style={pstyles.empty_font}>
         </Text>
        </View>
    );
    _onPressItem = (id: string,item) => {
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return {selected}
        });
        goPersonalUI(this.props.navigation.navigate,item.fansid)
    };
    _renderItem = ({item}) =>{
        return(
            <FollowListItem
                id={item.id}
                onPressItem={ this._onPressItem }
                selected={ !!this.state.selected.get(item.id) }
                follow= {item}
                head={Utils.getHead(item.head)}
                followbut={this._getFolloBut(item)}
                navigate = {this.props.navigation.navigate}
                onFollow={this._onFollow}
            />
        );
    };
    //下拉刷新
    _renderRefresh = () => {
    }
    //上拉刷新
    _onEndReached = () => {

    }
    _getFolloBut(user){
      var follow = '关注';
      if(user.fansid == this.props.papp.userid){
        return '自己';
      }
      if(user.fstate == 1&&user.state == 1){
        follow = '互相关注'
      }else if(user.fstate == 1){
        follow = '已关注'
      }else if(user.state == 1){
        follow = '关注我的'
      }
      return follow;
    }

    _requestFollows(){
      if(!this.props.papp.userid){
        return;
      }
      var json = JSON.stringify({
        myid:this.props.papp.userid,
        userid:this.state.userid,
        type:this.state.type,
      });
      console.log(json);
      HttpUtil.post(HttpUtil.USER_FOLLOWS,json).then(res=>{
          if(res.code == 0 ){
              var follows = res.data;
              this.dataContainer = follows;
              this.setState({
                sourceData: this.dataContainer
              });
          }else{
            Alert.alert(res.errmsg);
          }
      }).catch(err=>{
        console.error(err);
      })
    }
    _onFollow(user){
      if(user.fransid == this.props.papp.userid){
        return;
      }
      this._requestFollow(user);
    }
    _requestFollow(user){
      if(!this.props.papp.userid){
        return;
      }
      var json = JSON.stringify({
        userid:this.props.papp.userid,
        fansid:user.fansid,
        op:user.fstate == 0?1:0,
      })
      HttpUtil.post(HttpUtil.USER_FOLLOW,json).then(res=>{
        if(res.code == 0 ){
          let user = res.data;
          for(var i = 0 ; i < this.dataContainer.length;i++){
            if(this.dataContainer[i].fansid === user.fansid){
              this.dataContainer[i].fstate = user.fstate;
              this.dataContainer[i].tstate = user.tstate;
              break;
            }
          }
          var list = this.dataContainer;
          this.setState({
            sourceData: list,
          });
        }else{
          Alert.alert(res.errmsg);
        }
      }).catch(err=>{
        console.log(err);
      })
    }
}

const styles = StyleSheet.create({
    follow:{
      flex:1,
      flexDirection:'row',
      padding:10,
    },
    follow_head:{
      height:60,
      width:60,
    },
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(FollowUI);
