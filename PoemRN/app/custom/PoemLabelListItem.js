'use strict'
/**
 * 添加标签
 * @flow
 */
import React from 'react';
import {
      StyleSheet,
      Text,
      View,
      TouchableOpacity,
     } from 'react-native';
import { Icon } from 'react-native-elements';
import {StyleConfig} from '../AppUtil';
type Props = {
    item:Object,
    id:number;
    onPressItem:Function,
    onDeleteHistory:Function,
}
class PoemLabelListItem extends React.PureComponent<Props> {
    render(){
      let item = this.props.item;
      return(
        <TouchableOpacity
          key={item.key}
          style={styles.hitem}
          onPress={()=>{
              this.props.onPressItem(this.props.id,item);
          }}
          >
          <Text style={styles.hitem_name}>
              {item.name}
          </Text>
          <TouchableOpacity
            style={styles.hitem_clear}
            onPress={()=>{
              this.props.onDeleteHistory(item);
            }}
            >
            <Icon
              name='clear'
              size={30}
              type="MaterialIcons"
              color={StyleConfig.C_D4D4D4}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )
    }
}


const styles = StyleSheet.create({
  hitem:{
    flexDirection:'row',
    justifyContent:'space-between',
    padding:10,
  },
  hitem_name:{
    color:StyleConfig.C_000000,
  },
  hitem_clear:{

  }
});
export default PoemLabelListItem;
