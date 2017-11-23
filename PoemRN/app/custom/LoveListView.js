'use strict'
/**
 * 详情页点赞列表组件
 */
import React from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
} from 'react-native';
import {Icon } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import {
      StyleConfig,
      Utils,
      pstyles
    } from '../AppUtil';

class LoveListView extends React.Component{
  loves = [];
  constructor(props){
    super(props);
    this.state = {
      loves:[],
    }
  }
  componentDidMount(){
    this.loadPages();
  }
  componentWillUpdate(){

  }
  render(){
    console.log('------LoveListView() render');
    return (
      <TouchableOpacity key={'loves'} style={styles.love_bg}
        onPress={()=>{
          this._onLoves();
        }}>
          {this.state.loves.map((elem, index) => {
           return elem;
         }) }
      </TouchableOpacity>
      );
  }
  loadPages(){
    console.log('------LoveListView() loadPages')
    var temp_loves = this.props.loves||[];
    console.log(temp_loves)
    this.loves = [];
    if(temp_loves.length > 0){
      this.loves.push(this._renderHead());
    }
    var max_num = 5;
    for (var i = 0; i < temp_loves.length; i++) {
      if(i >= max_num){
        break;
      }
      var love = temp_loves[i];
      love.key = 'loves_'+i;
      let end_index = temp_loves.length-1;
      if(temp_loves.length > max_num){
        end_index = max_num-1;
      }
      love.type = i == end_index?1:2;
      this.loves.push(this._renderItem(love));
    }
    if(temp_loves.length > max_num){
      this.loves.push(this._renderFooter());
    }
    this.setState({
      loves:this.loves,
    })
  }
  _onLoveItem(item){
    this.props.onLoveItem(item);
  }
  _onLove(){
      this.props.onLove();
  };
  _onLoves(){
      this.props.onLoves();
  };
  _renderHead(){
    return(
      <TouchableOpacity
        key={'loves_head'}
        style={{paddingRight:6,}}
        onPress={()=>{
          this._onLove()
        }}>
        <Icon key={'love_icon'}
          name='thumb-up'
          size={20}
          type="MaterialIcons"
          color={this._renderLoveColor()}
          />
        </TouchableOpacity>
    )
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
              { item.pseudonym }
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
                { item.pseudonym }
              </Text>
            </TouchableOpacity>
          <Text style={styles.love_p}>，</Text>
        </View>
      )
    }
  }
  _renderFooter(){
    return(
      <View key={ 'loves_footer' } style={{flexDirection:'row'}}>
          <TouchableOpacity
            onPress={()=>{
              this._onLoves();
            }}>
            <Text style={styles.love_name}>
              ...
            </Text>
          </TouchableOpacity>
      </View>
    )
  }
  _renderLoveColor(){
    return this.props.poem.love > 0 ? '#1e8ae8':'#7b8992';
  }
}


const styles = StyleSheet.create({
  love_bg:{//点赞列表背景
    padding:10,
    flexDirection:'row',
    justifyContent:'flex-start',
    flexWrap:'wrap',
  },
  love_name:{
      fontSize:18,
      color:StyleConfig.C_1E8AE8,
  },
  love_p:{
    color:'#000000',
    fontWeight:'bold',
    paddingTop:4,
  },
});
export default LoveListView;
