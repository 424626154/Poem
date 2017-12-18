'use strict'
/**
 * 查看大图
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  View ,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import{
      StyleConfig,
      PImage,
      Utils,
    }from '../AppUtil';
const {width, height} = Dimensions.get('window');
const big_head = require('../images/big_head.png');
type Props = {
    navigation:any,
};

type State = {
    small_photo:any,
    photo:any,
};
export default class PhotoUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
    header:null,
  });

  state = {
    small_photo:Utils.getHead(this.props.navigation.state.params.photo),
    photo:Utils.getHead(this.props.navigation.state.params.photo+'_big'),
  }

  render(){
    return(
      <TouchableOpacity style={styles.container}
        onPress={()=>{
          const { goBack } = this.props.navigation;
          goBack();
        }}
        >
          <View style={styles.bg}>
          <PImage
            style={styles.bg_head}
            source={this.state.small_photo}
            padding={0}
            borderRadius={0}
            noborder={true}
          />
          <PImage
            style={styles.photo}
            source={this.state.photo}
            padding={0}
            borderRadius={0}
            noborder={true}
          />
        </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00000088',
      alignItems:'center',
      justifyContent:'center',
    },
    bg:{
      backgroundColor: StyleConfig.C_FFFFFF,
      width:width,
      height:width,
    },
    bg_head:{
      position: 'absolute',
      width:width,
      height:width,
    },
    photo:{
      width:width,
      height:width,
    },
})
