import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        Image,
        TouchableOpacity,
        DeviceEventEmitter,
        AsyncStorage,
        Alert,
        FlatList,
      } from 'react-native';

import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
import pstyles from '../style/PStyles';
import Utils from '../utils/Utils';
import Global from '../Global';
import Emitter from '../utils/Emitter';
import HttpUtil from '../utils/HttpUtil';
import SQLite from '../db/Sqlite';
const sqlite = new SQLite();

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
                <View style={styles.fitem}>
                    <Text style={styles.fitem_time}>
                      qqqqqq
                    </Text>
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
       headerLeft:(
         <TouchableOpacity  onPress={()=>navigation.goBack()}>
           <Text style={pstyles.nav_left}>返回</Text>
         </TouchableOpacity>
       ),
       headerStyle:{
         backgroundColor:'#1e8ae8',
       },
    });
    dataContainer = [];
    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        this.state = ({
          sourceData : [],
          selected: (new Map(): Map<String, boolean>),
          refreshing: false,
          type:params.type,
          userid:Global.user.userid,
        });
    }
    componentDidMount(){
        this._requestFollow();
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
         <Text style={pstyles.empty_font}>暂无作品
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
                name= { item.name }
                poem={item.poem}
                time={Utils.dateStr(item.time)}
                navigate = {this.props.navigation.navigate}
            />
        );
    };
    //下拉刷新
    _renderRefresh = () => {
    }
    //上拉刷新
    _onEndReached = () => {
    }

    _requestFollow(){
      var json = JSON.stringify({
        userid:this.state.userid,
        type:this.state.type,
      })
      HttpUtil.post(HttpUtil.USER_FOLLOWS,json).then(res=>{
          if(res.code == 0 ){
              var follows = res.data;
              this.dataContainer = follows;
              this.setState({
                sourceData: this.dataContainer
              });
              if(this.state.type == 1){
                sqlite.saveFollowMes(follows).then(res=>{}).catch(err=>{
                  console.error(err);
                });
              }else{
                sqlite.saveMeFollows(follows).then(res=>{}).catch(err=>{
                  console.error(err);
                });
              }
          }else{
            Alert.alert(res.errmsg);
          }
      }).catch(err=>{
        console.error(err);
      })
    }
}

const styles = StyleSheet.create({

});

export {FollowUI};
