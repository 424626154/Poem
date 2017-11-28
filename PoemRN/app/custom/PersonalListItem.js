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
 import {StyleConfig,UIName,pstyles,PImage} from '../AppUtil';
 type Props = {
    onPressItem:Function,
    id:string,
    poem:Object,
    time:string,
 };
class PersonalListItem extends React.PureComponent<Props> {
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
                  <View style={styles.poem}>
                    <Text style={pstyles.poem_title}>
                      {this.props.poem.title}
                    </Text>
                    <Text
                      style={pstyles.poem_content}
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
      backgroundColor:StyleConfig.C_FFFFFF,
  },
  fitem_more:{
    alignItems:'flex-end'
  },
  fitem_time:{
    fontSize:14,
    color:StyleConfig.C_D4D4D4,
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
