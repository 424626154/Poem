'use strict'
/**
 * 徽章tem
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
    Global,
    StyleConfig
    } from '../AppUtil';
 type Props = {
   onPress:any,
 };
 export default class BadgeItem extends React.Component<Props> {
   _onPress = () => {
     this.props.onPress(this.props.item)
   };
    render(){
      const item = this.props.item;
      return(
          <TouchableOpacity style={styles.item_bg} onPress={this._onPress}>
            <View style={styles.item}>
              {this._renderSeal(item)}
              <Text style={styles.condition}>{item.condition}</Text>
              <Text style={styles.ceiling}>{item.complete+'/'+item.ceiling}</Text>
            </View>
          </TouchableOpacity>
        )
    }
    /**
     * 印章
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    _renderSeal = (item) => {
      var temp_arry = item.title.split('');
      var temp_index0 = temp_arry.length>0?temp_arry[0]:''
      var temp_index1 = temp_arry.length>1?temp_arry[1]:''
      var temp_index2 = temp_arry.length>2?temp_arry[2]:''
      var temp_index3 = temp_arry.length>3?temp_arry[3]:''
      return (
        <View style={[styles.seal_border,{borderColor:this._renderSealBgColor(item)}]}>
          <View style={[styles.seal_bg,{backgroundColor:this._renderSealBgColor(item)}]}>
            <View style={styles.seal_index}>
            <Text style={[styles.title,{color:this._renderSealColor()}]}>{temp_index2}</Text>
            <Text style={[styles.title,{color:this._renderSealColor()}]}>{temp_index0}</Text>
            </View>
            <View style={styles.seal_index}>
            <Text style={[styles.title,{color:this._renderSealColor()}]}>{temp_index3}</Text>
            <Text style={[styles.title,{color:this._renderSealColor()}]}>{temp_index1}</Text>
            </View>
          </View>
        </View>
        )
    }

    _renderSealBgColor(item){
      return item.complete?StyleConfig.C_FF4040:StyleConfig.C_D4D4D4;
    }

    _renderSealColor(){
      return StyleConfig.C_FFFFFF
    }

 }

const styles = StyleSheet.create({
  item_bg:{
    padding:10,
  },
  item:{
    width:(Global.width-60)/2,
    alignItems:'center',
    justifyContent:'center',
    padding:10,
    borderColor:StyleConfig.C_D4D4D4,
    borderWidth:1,
    borderRadius:6,
    height:140,
  },
  title:{
    fontSize:StyleConfig.F_22,
    color:StyleConfig.C_232323,
    fontFamily:StyleConfig.SentyZHAO,
  },
  condition:{
    fontSize:StyleConfig.F_16,
    color:StyleConfig.C_7B8992
  },
  ceiling:{
    fontSize:StyleConfig.F_14,
    color:StyleConfig.C_D4D4D4
  },
  seal_index:{
    flexDirection:'row',
  },
  seal_bg:{
    width:60,
    height:60,
    alignItems:'center',
    justifyContent:'center',
  },
  seal_border:{
    width:70,
    height:70,
    alignItems:'center',
    justifyContent:'center',
    borderWidth:2,
  }
})
