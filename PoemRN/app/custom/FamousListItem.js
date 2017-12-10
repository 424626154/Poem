'use strict'
/**
 * 名家元素组件
 * @flow
 */
import React from 'react';
import {
      StyleSheet,
      Text,
      View,
      TouchableOpacity,
     } from 'react-native';
import {UIName,pstyles,PImage,Utils,Global} from '../AppUtil';
const boundary = 80;
type Props = {
    onPressItem:Function,
    id:string,
    item:Object,
};
export default class FamousListItem extends React.PureComponent<Props> {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.item);
    };
    render() {
        let item = this.props.item;
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.fitem}>
                  <View style={pstyles.poem}>
                    <Text style={[pstyles.poem_title,{fontFamily:Global.font}]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[pstyles.poem_content,{fontFamily:Global.font,textAlign:'center'}]}
                      numberOfLines={8}
                      ellipsizeMode='tail'
                    >
                      {item.content}
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
});
