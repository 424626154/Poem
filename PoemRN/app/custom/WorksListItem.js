'use strict'
/**
 * 作品元素组件
 * @flow
 */
import React from 'react';
import {
      StyleSheet,
      Text,
      View,
      TouchableOpacity,
     } from 'react-native';
import {UIName,pstyles,PImage} from '../AppUtil';
type Props = {
    onPressItem:Function,
    id:string,
    item:Object,
    time:string,
};
export default class WorksListItem extends React.PureComponent<Props> {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.item);
    };
    render() {
      const item = this.props.item;
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.fitem}>
                  {/* 诗歌 */}
                  <View style={pstyles.poem}>
                    <Text style={pstyles.poem_title}>
                      {item.title}
                    </Text>
                    <Text
                      numberOfLines={8}
                      ellipsizeMode='tail'
                      style={[pstyles.poem_content,{textAlign:this._renderAlign(item)}]}
                    >
                      {item.content}
                    </Text>
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
    _renderAlign(item){
      let align = 'center';
      if(item.extend){
        let extend = JSON.parse(item.extend)
        if(extend.align)align = extend.align
      }
      return align;
    }
}

const styles = StyleSheet.create({
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
});
