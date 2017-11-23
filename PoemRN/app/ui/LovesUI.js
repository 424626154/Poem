import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        TouchableOpacity,
        DeviceEventEmitter,
        Alert,
        FlatList,
      } from 'react-native';
import { SocialIcon } from 'react-native-elements';

import{
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  pstyles,
  Utils,
  Emitter,
  HttpUtil,
  goPersonalUI,
} from '../AppUtil';
import LovesListItem from '../custom/LovesListItem';

export default class LovesUI extends React.Component {
 static navigationOptions = ({navigation}) => ({
       title:'点赞',
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
          id:params.id,
        });
    }
    componentDidMount(){
        this._requestLoves();
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
    _onPressItem = (id: string,love:Object) => {
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return {selected}
        });
        goPersonalUI(this.props.navigation.navigate,love.userid);
    };
    _renderItem = ({item}) =>{
        return(
            <LovesListItem
                id={item.id}
                onPressItem={ this._onPressItem }
                selected={ !!this.state.selected.get(item.id) }
                love= {item}
                head={Utils.getHead(item.head)}
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
    _requestLoves(){
      var json = JSON.stringify({
        id:this.state.id,
      });
      HttpUtil.post(HttpUtil.POEM_LOVES,json).then(res=>{
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
}

const styles = StyleSheet.create({

});
