'use strict'
/**
 * TabBarIcon
 * @flow
 */
import React from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
    pstyles,
    StyleConfig,
  } from '../AppUtil';
type Props = {
    navigation:any,
};
export default class NavBack extends React.Component<Props>{
  render(){
    return(
      <TouchableOpacity
        style={pstyles.nav_left}
        onPress={()=>this.props.navigation.goBack()}>
        <Icon
          name='navigate-before'
          size={26}
          type="MaterialIcons"
          color={StyleConfig.C_333333}
          />
      </TouchableOpacity>
    )
  }
}
