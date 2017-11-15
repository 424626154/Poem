'use strict'
/**
 * 点赞组件item
 */
 import React from 'react';
 import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
 } from 'react-native';
import { SocialIcon } from 'react-native-elements';

 import {
       StyleConfig,
       pstyles,
       PImage,
     } from '../AppUtil';

export default class FollowListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
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
                    <SocialIcon
                      title={this.props.followbut}
                      button={true}
                      onPress={()=>{
                        this.props.onFollow(this.props);
                      }}
                      fontStyle={styles.follow_font}
                      light
                      style={styles.follow_button}
                      />
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
  },
  follow_font:{
    fontSize:StyleConfig.F_18,
    color:StyleConfig.C_1E8AE8,
    marginLeft:-2,
  },
});
