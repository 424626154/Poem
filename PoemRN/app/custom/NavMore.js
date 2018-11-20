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
    fuc:Function,
    icon_name:string,
};
export default class NavMore extends React.Component<Props>{
  render(){
    return(
      <TouchableOpacity
        style={pstyles.nav_left}
        onPress={()=>{
          this.props.fuc()
        }}>
        <Icon
          name={this.props.icon_name}
          size={26}
          type="MaterialIcons"
          color={StyleConfig.C_BFBFBF}
          />
      </TouchableOpacity>
    )
  }
}
