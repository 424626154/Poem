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

class PersonalListItem extends React.PureComponent {
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
                  {/* 诗歌 */}
                  <View style={styles.poem_bg}>
                  {/* <HTMLView
                      value={this.props.poem}
                      /> */}
                  <View style={styles.poem}>
                    <Text style={styles.poem_title}>{this.props.poem.title}</Text>
                    <Text
                      style={styles.poem_content}
                      numberOfLines={8}
                    >
                      {this.props.poem.content}
                    </Text>
                  </View>
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
  poem_bg:{

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

export default PersonalListItem;
