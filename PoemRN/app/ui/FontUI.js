'use strict'
/**
 * 举报页面
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import * as PoemsActions from '../redux/actions/PoemsActions';
import { CheckBox } from 'react-native-elements';
import {
        StyleConfig,
        HeaderConfig,
        pstyles,
        HttpUtil,
        showToast,
        Storage,
        Global,
      }from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
type Props = {
    navigation:any,
    papp:Object,
};

type State = {
    checkeds:Array<boolean>,
    fonts:Array<string>,
    fontFamilys:Array<string>,
};
class FontUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title:'字体样式',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(
          <TouchableOpacity  onPress={()=>navigation.state.params.onSave()}>
            <Text style={pstyles.nav_right}>保存</Text>
          </TouchableOpacity>
        ),
     });
     onSave:Function;
     _renderItem:Function;
     _onCheck:Function;
     constructor(props){
       super(props);
       let fonts = ['汉仪中宋简','方正宋刻本秀楷简体','新蒂赵孟钴体','新蒂小丸子','文泉驿正黑'];
       let checkeds = [false,false,false,false,false];
       let fontFamilys = [StyleConfig.FONT_FAMILY,StyleConfig.FONT_FZSKBXKJW,StyleConfig.SentyZHAO,StyleConfig.AppleColorEmoji,StyleConfig.WenQuanYiZenHei];
       let fontFamily = Global.fontFamily;
       for (var i = 0; i < fontFamilys.length; i++) {
         if(fontFamilys[i] == fontFamily){
           checkeds[i] = true;
         }
       }
       this.state = {
         fonts:fonts,
         checkeds:checkeds,
         fontFamilys:fontFamilys,
       }
       this.onSave = this.onSave.bind(this);
       this._renderItem = this._renderItem.bind(this);
       this._onCheck = this._onCheck.bind(this);
     }
     componentDidMount(){
        this.props.navigation.setParams({onSave:this.onSave});
     }
     componentWillUnmount(){

     }
    render(){
      return(
          <View style={pstyles.container}>
            <Text style={styles.tips}>字体样式修改只对作品和收录中展示内容有效</Text>
            {this.state.fonts.map((item,index)=>{{
              return(this._renderItem(index,this._onCheck))
            }})}
          </View>
      )
    }

    _renderItem(index,onCheck){
      return(
        <View style={styles.select} key={index}>
          <CheckBox
          style={styles.check}
          // title={this.state.check_title2}
          checkedColor={StyleConfig.C_333333}
          checked={this.state.checkeds[index]}
          onPress={() =>{
            onCheck(index)
          }}
          />
          <Text
            style={[styles.font,{fontFamily:this.state.fontFamilys[index]}]}
            >
            {this.state.fonts[index]}
          </Text>
        </View>
      )
    }
    _onCheck(index){
      let checkeds = this.state.checkeds;
      for (var i = 0; i < checkeds.length; i++) {
        if(i == index){
          checkeds[i] = true;
        }else{
          checkeds[i] = false;
        }
      }
      this.setState({checkeds:checkeds})
    }
    onSave(){
      for (var i = 0; i < this.state.checkeds.length; i++) {
        if(this.state.checkeds[i]){
          let fontFamily = this.state.fontFamilys[i]
          Storage.saveFontFamily(fontFamily);
          Global.fontFamily = fontFamily;
        }
      }
      let { dispatch } = this.props.navigation;
      dispatch(PoemsActions.raUpFont());
      this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    tips:{
      fontSize:14,
      padding:10,
      color:StyleConfig.C_D4D4D4,
    },
    select:{

    },
    check:{

    },
    font:{
      fontSize:20,
      position: 'absolute',
      left:50,
      top:14,
    },
    custom_bg:{
      padding:10,
    },
    custom:{
      height:100,
      borderColor: StyleConfig.C_7B8992,
      borderWidth: 1,
      borderRadius:5,
      fontSize:16,
      padding:5,
    }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(FontUI);
