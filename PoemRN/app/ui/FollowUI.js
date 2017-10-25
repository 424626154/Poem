import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        TouchableOpacity,
        DeviceEventEmitter,
        AsyncStorage,
        Alert,
        FlatList,
      } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import {CachedImage} from "react-native-img-cache";

import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
import pstyles from '../style/PStyles';
import Utils from '../utils/Utils';
import Global from '../Global';
import Emitter from '../utils/Emitter';
import HttpUtil from '../utils/HttpUtil';
// import SQLite from '../db/Sqlite';
// const sqlite = new SQLite();

class FollowListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };
    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.follow}>
                    <CachedImage
                      style={pstyles.small_head}
                      source={this.props.head}
                      />
                    <Text style={styles.follow_pseudonym}>
                      {this.props.follow.pseudonym}
                    </Text>
                    <SocialIcon
                      title={this.props.followbut}
                      button={true}
                      onPress={()=>{
                        this.props.onFollow(this.props);
                      }}
                      fontStyle={styles.follow_font}
                      light
                      style={styles.follow_button}
                      />
                </View>
            </TouchableOpacity>
        );
    }
}

class FollowUI extends React.Component {
 static navigationOptions = ({navigation}) => ({
       title:navigation.state.params.title,
       headerTintColor:StyleConfig.C_FFFFFF,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(
         <TouchableOpacity  onPress={()=>navigation.goBack()}>
           <Text style={pstyles.nav_left}>返回</Text>
         </TouchableOpacity>
       ),
    });
    navigate = this.props.navigation.navigate;
    dataContainer = [];
    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        this.state = ({
          sourceData : [],
          selected: (new Map(): Map<String, boolean>),
          refreshing: false,
          type:params.type,
          userid:params.userid,
        });
    }
    componentDidMount(){
        this._requestFollows();
    }
    componentWillUnMount(){

    }
    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={pstyles.container}>
          <FlatList
                    data={ this.state.sourceData }
                    extraData={ this.state.selected }
                    keyExtractor={ (item, index) => index}
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
        <View style={{ height:1, backgroundColor:StyleConfig.C_D4D4D4 }}></View>
    );
    // 空布局
    _renderEmptyView = () => (
        <View style={pstyles.empty}>
         <Text style={pstyles.empty_font}>
         </Text>
        </View>
    );
    _onPressItem = (id: string) => {
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return {selected}
        });
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
      if(user.fansid == Global.user.userid){
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
      var json = JSON.stringify({
        myid:Global.user.userid,
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
    _onFollow(props){
      let user = props.follow;
      if(user.fransid == Global.user.userid){
        return;
      }
      this._requestFollow(user);
    }
    _requestFollow(user){
      var json = JSON.stringify({
        userid:Global.user.userid,
        fansid:user.fansid,
        op:user.fstate == 0?1:0,
      })
      HttpUtil.post(HttpUtil.USER_FOLLOW,json).then(res=>{
        if(res.code == 0 ){
          let user = res.data;
          for(var id = 0 ; i < this.dataContainer.length;i++){
            if(this.dataContainer[i].fansid == user.fansid){
              this.dataContainer[i].fstate = user.fstate;
              this.dataContainer[i].tstate = user.tstate;
              break;
            }
          }
          this.setState({
            sourceData: this.dataContainer
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
    follow_pseudonym:{
      flex:1,
      fontSize:StyleConfig.F_18,
      color:StyleConfig.C_000000,
      padding:4,
    },
    follow_button:{
      width:80,
      height:30,
    },
    follow_font:{
      fontSize:StyleConfig.F_18,
      color:StyleConfig.C_1E8AE8,
      marginLeft:-2,
    },
});

export {FollowUI};
