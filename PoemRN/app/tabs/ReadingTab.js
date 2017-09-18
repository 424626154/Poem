// 欣赏
import React from 'react';
import { Icon } from 'react-native-elements';
import {
      StyleSheet,
      Text,
      View,
      FlatList,
      TouchableOpacity,
      Alert,
     } from 'react-native';
// 封装Item组件
class FlatListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
        Alert.alert('详情')
    };
    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
            >
            <View style={styles.fitem}>
              {/* 个人信息 */}
              <TouchableOpacity
                onPress={()=>Alert.alert('个人')}>
              <View style={styles.fitem_header}>
                <Icon
                  reverse
                  name='person'
                  type='MaterialIcons'
                  color='#176eb9'
                  size={20}
                />
                <View style={styles.fitem_header_info}>
                  <Text style={styles.fitem_name}>
                    {this.props.name}
                  </Text>
                  <Text style={styles.fitem_time}>
                    1小时前
                  </Text>
                </View>
              </View>
              </TouchableOpacity>
              {/* 诗歌 */}
              <View style={styles.poem_bg}>
                <Text style={styles.poem}>
                    {this.props.poem}
                </Text>
              </View>
              {/* menu */}
              <View style={styles.menu}>
                  <TouchableOpacity
                    onPress={()=>Alert.alert('评论')}>
                    <View style={styles.menu_item}>
                      <Icon
                        name='sms'
                        size={30}
                        type="MaterialIcons"
                        color={'#7b8992'}
                        />
                        <Text style={styles.menu_font}>
                          1
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
                          1
                        </Text>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
            </TouchableOpacity>
        );
    }
}

class ReadingTab extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title: '欣赏',
        headerTintColor:'#ffffff',
        headerTitleStyle:{fontSize:20},
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
             sourceData : []
             ,selected: (new Map(): Map<String, boolean>)
             ,refreshing: false
         }
     }
   // 当视图全部渲染完毕之后执行该生命周期方法
    componentDidMount() {
        // 创造模拟数据
        for (let i = 0; i < 10; i ++) {
            let obj = {
                id: i,
                name: 'name'+1,
                poem:'在StackNavigator中注册后的组件都有navigation这个属性. navigation又有5个参',
            };
            //  将模拟数据存入数据容器中
            this.dataContainer.push(obj);
        }
        // 将存储的数据赋予状态并更新页面
        this.setState({
            sourceData: this.dataContainer
        });
    }
  render() {
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
                // onEndReached={ this._onEndReached }
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
       <View><Text>EmptyView</Text></View>
   );
     // 下拉刷新
 _renderRefresh = () => {
     this.setState({refreshing: true}) // 开始刷新
     // 这里模拟请求网络，拿到数据，1s后停止刷新
     setTimeout(() => {
         // TODO 提示没有可刷新的内容！
         this.setState({refreshing: false});
     }, 1000);
 };

 // 上拉加载更多
 _onEndReached = () => {
     // 以下是制造新数据
     let newData = [];
     for (let i = 20; i < 30; i ++) {
         let obj = {
             id: i,
             name: 'name'+1,
             poem:'poem',
         };
         newData.push(obj);
     }
     // 将新数据添加到数据容器中
     this.dataContainer = this.dataContainer.concat(newData);
     // 将新数据集合赋予数据状态并更新页面
     this.setState({
         sourceData: this.dataContainer
     });
 };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  }
});

export {ReadingTab};
