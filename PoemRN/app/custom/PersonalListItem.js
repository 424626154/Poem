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
 import {StyleConfig,UIName,pstyles,PImage,Utils,Global} from '../AppUtil';
const boundary = 80;
 type Props = {
    onPressItem:Function,
    id:string,
    item:Object,
    extend:Object,
    time:string,
 };
class PersonalListItem extends React.PureComponent<Props> {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };
    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.fitem}>
                  {/* 诗歌 */}
                  {this._renderPoem(this.props.item,this.props.extend)}
                  <View style={styles.fitem_more}>
                    <Text style={styles.fitem_time}>
                      {this.props.time}
                    </Text>
                  </View>
                </View>
            </TouchableOpacity>
        );
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
        let style = {resizeMode:'cover',width:Global.width-boundary,height:Global.width-boundary};
        if(extend.pw > extend.ph){
          let style1 = {width:Global.width-boundary,height:(Global.width-boundary)*extend.ph/extend.pw}
          style = Object.assign({},style,style1)
        }
        if(extend.pw < extend.ph){
          let style2 = {resizeMode:'cover'}
          style = Object.assign({},style,style2)
          console.log('-------_getStyle')
          console.log(style)
        }
        return style;
    }
    _renderAlign(item){
      let align = 'center';
      if(item.extend){
        let extend = JSON.parse(item.extend)
        if(extend.align)align = extend.align
      }
      return align;
    }
}

const styles = StyleSheet.create({
  fitem:{
      flex:1,
      padding:10,
      backgroundColor:StyleConfig.C_FFFFFF,
  },
  fitem_more:{
    alignItems:'flex-end'
  },
  fitem_time:{
    fontSize:14,
    color:StyleConfig.C_D4D4D4,
    marginTop:4,
  },
  poem_bg:{

  },
  poem:{

  },
  poem_title:{
    fontSize:30,
    textAlign:'center',
  },
  poem_content:{
    fontSize:20,
    textAlign:'center',
  },
});

export default PersonalListItem;
