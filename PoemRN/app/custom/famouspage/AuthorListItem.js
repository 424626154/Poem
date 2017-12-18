'use strict'
/**
 * 名家-作者
 * @flow
 */
import React from 'react';
import {
      StyleSheet,
      Text,
      View,
      TouchableOpacity,
     } from 'react-native';
import {UIName,pstyles,PImage,Utils,Global,StyleConfig} from '../../AppUtil';

type Props = {
    onPressItem:Function,
    id:string,
    item:Object,
};
export default class AuthorListItem extends React.PureComponent<Props> {
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
                <View style={styles.item}>
                  <Text style={styles.author}>
                    {item.author}
                  </Text>
                  <View style={{height:10}}></View>
                  <Text
                    style={styles.profile}
                    numberOfLines={2}
                    >
                    {item.profile}
                  </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
  item:{
      flex:1,
      padding:10,
  },
  author:{
      fontSize:22,
      color:StyleConfig.C_333333,
  },
  profile:{
    fontSize:15,
    color:StyleConfig.C_333333,
  },
});
