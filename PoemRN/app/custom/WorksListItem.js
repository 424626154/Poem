'use strict'
/**
 * 作品元素组件
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
    extend:Object,
    time:string,
};
export default class WorksListItem extends React.PureComponent<Props> {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.item);
    };
    render() {
        let item = this.props.item;
        let extend = this.props.extend;
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.fitem}>
                  {/* 诗歌 */}
                  {this._renderPoem(item,extend)}
                  <View style={styles.fitem_more}>
                    <Text style={styles.fitem_time}>
                      {this.props.time}
                    </Text>
                  </View>
                </View>
            </TouchableOpacity>
        );
    }
    _renderAlign(item){
      let align = 'center';
      if(item.extend){
        let extend = JSON.parse(item.extend)
        if(extend.align)align = extend.align
      }
      return align;
    }
    _renderPoem(item,extend){
      if(this._isPhoto(extend)){
        return(
          <View style={pstyles.poem}>
            <View style={pstyles.photo}>
              <PImage
                style={this._getStyle(extend)}
                source={Utils.getPhoto(extend.photo)}
                noborder={true}
                />
            </View>
              <Text style={[pstyles.poem_title,{fontFamily:Global.font}]}>
                {item.title}
              </Text>
              <Text
                style={[pstyles.poem_content,{fontFamily:Global.font,textAlign:this._renderAlign(extend)}]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {item.content}
              </Text>
          </View>
        )
      }else{
        return(
          <View style={pstyles.poem}>
            <Text style={[pstyles.poem_title,{fontFamily:Global.font}]}>
              {item.title}
            </Text>
            <Text
              style={[pstyles.poem_content,{fontFamily:Global.font,textAlign:this._renderAlign(extend)}]}
              numberOfLines={8}
              ellipsizeMode='tail'
            >
              {item.content}
            </Text>
          </View>
        )
      }
    }
    _isPhoto(extend){
      let isphoto = false;
      if(extend&&extend.photo&&extend.pw&&extend.ph){
        isphoto = true;
      }
      return isphoto;
    }
    _getStyle(extend){
      let width = Global.width;
      let height = Global.width*9/16;
      let style = {resizeMode:'cover',width:width,height:height};
      return style;
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
