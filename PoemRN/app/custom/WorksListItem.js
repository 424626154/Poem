'use strict'
/**
 * 作品元素组件
 */
import React from 'react';
import {
      StyleSheet,
      Text,
      View,
      TouchableOpacity,
     } from 'react-native';
import {UIName,pstyles,PImage} from '../AppUtil';

export default class WorksListItem extends React.PureComponent {
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
                  <View style={styles.poem}>
                    <Text style={styles.poem_title}>{item.title}</Text>
                    <Text
                      numberOfLines={8}
                      ellipsizeMode='tail'
                      style={styles.poem_content}
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
});
