'use strict'
/**
 * 点赞组件item
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
     pstyles,
     PImage,
   } from '../AppUtil';
type Props = {
   onPressItem:Function,
   onFollow:Function,
   head:any,
   id:number,
   follow:Object,
   followbut:string,
};
export default class FollowListItem extends React.PureComponent<Props> {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.follow);
    };
    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.follow}>
                    <PImage
                      style={pstyles.small_head}
                      source={this.props.head}
                      />
                    <Text style={styles.follow_pseudonym}>
                      {this.props.follow.pseudonym}
                    </Text>
                    <TouchableOpacity
                      style={styles.follow_button}
                      onPress={()=>{
                        this.props.onFollow(this.props.follow);
                      }}>
                      <Text style={styles.follow_font}>
                        {this.props.followbut}
                      </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
  follow:{
    flex:1,
    flexDirection:'row',
    padding:10,
  },
  follow_pseudonym:{
    flex:1,
    fontSize:StyleConfig.F_18,
    color:StyleConfig.C_000000,
    padding:4,
  },
  follow_button:{
    width:80,
    height:30,
    backgroundColor:StyleConfig.C_FFFFFF,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:8,
    borderWidth:1,
    borderColor:StyleConfig.C_000000,
  },
  follow_font:{
    fontSize:StyleConfig.F_18,
    color:StyleConfig.C_000000,
    marginLeft:-2,
  },
});
