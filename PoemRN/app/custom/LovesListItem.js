'use strict'
/**
 * 点赞列表
 * @flow
 */
 import React from 'react';
 import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
 } from 'react-native';
 import {
       StyleConfig,
       Utils,
       pstyles,
       PImage
     } from '../AppUtil';

type Props = {
    onPressItem:Function,
    id:string,
    love:Object,
    head:any,
};

export default class LovesListItem extends React.PureComponent<Props> {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.love);
    };
    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.love}>
                    <PImage
                      style={pstyles.small_head}
                      source={this.props.head}
                      />
                    <Text style={styles.follow_pseudonym}>
                      {this.props.love.pseudonym}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
  love:{
    flex:1,
    flexDirection:'row',
    padding:10,
  },
  follow_head:{
    height:60,
    width:60,
  },
  follow_button:{
    width:80,
    height:30,
  },
  follow_pseudonym:{
    flex:1,
    fontSize:StyleConfig.F_18,
    color:StyleConfig.C_000000,
    padding:4,
  },
})
