'use strict'
/**
 * 阅读设置
 * @flow
 */
import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        TouchableOpacity,
        Alert,
        ScrollView,
        RefreshControl,
      } from 'react-native';
import {connect} from 'react-redux';
import { ButtonGroup,Icon,Slider} from 'react-native-elements';
import * as PoemsActions from '../redux/actions/PoemsActions';
import {
        StyleConfig,
        HeaderConfig,
        Storage,
        Global,
        UIName,
        HttpUtil,
        pstyles,
        showToast,
      } from '../AppUtil';
import UIUtil from '../utils/UIUtil';
import{
      NavBack,
      }from '../custom/Custom';
type Props = {
    papp:Object,
    navigation:any,
};

type State = {
    firstFSizeIndex:number,//初始值，用于比对
    fSizeIndex:number,//字体大小
    firstFAligIndex:number,
    fAligIndex:number,//字体样式
    firstLineHeight:number,
    lineHeight:number,//行高
};

class ReadSetUI extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title:'阅读设置',
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
     _onSave:Function;
     _onFont:Function;
     _onFontSize:Function;
     _onFontAlig:Function;
     constructor(props){
       super(props);
       this._onFont = this._onFont.bind(this);
       this._onFontSize = this._onFontSize.bind(this);
       this._onFontAlig = this._onFontAlig.bind(this);
       this._onSave = this._onSave.bind(this);
       let fSizeIndex = 1;
       let size = Storage.getFontSize();
       console.log('-----size:'+size)
       if(size == 0){
         fSizeIndex = 0;
       }else if(size == 2){
         fSizeIndex = 2;
       }
       let fAligIndex = 1;
       let align = Storage.getFontAlignment();
       if(align == 'left'){
         fAligIndex = 0;
       }
       let lineHeight = Storage.getLineHeight();
       this.state = {
         firstFSizeIndex:fSizeIndex,
         fSizeIndex:fSizeIndex,
         firstFAligIndex:fAligIndex,
         fAligIndex:fAligIndex,
         firstLineHeight:lineHeight,
         lineHeight:lineHeight,
       }
     }
     componentDidMount(){
       this.props.navigation.setParams({onSave:this._onSave});
     }
     componentWillUnmount(){

     }
     render(){
       return(
         <ScrollView style={styles.container}>
             {this._renderItem('font-download','MaterialIcons','字体样式',this._onFont,false)}
             {this._renderItem('text-size','octicon','字体尺寸',this._onFont,false)}
             {this._renderFontSize()}
             {this._renderItem('text-size','octicon','收录对齐',this._onFont,false)}
             {this._renderFontAlignment()}
             {this._renderItem('text-height','font-awesome','文本行高',this._onFont,false)}
             {this._renderLineHeigt()}
         </ScrollView>
       )
     }
     _renderItem(icon,type,title,func,rot){
       return(
         <TouchableOpacity onPress={()=>{
             func();
         }}>
         <View>
         <View style={styles.item}>
           <Icon
             name={icon}
             size={28}
             type={type}
             color={StyleConfig.C_333333}
           />
           <Text style={styles.item_title}>
             {title}
           </Text>
           </View>
         </View>
         </TouchableOpacity>
       )
     }
     _renderFontSizeItem(tSize,cSize){
       return(
         <View style={styles.fontsize_item}>
           <Text style={{fontSize:tSize}}>标题</Text>
           <Text style={{fontSize:cSize}}>内容</Text>
         </View>
       )
     }
     _renderFontSize(){
       const buttons = [{ element: ()=>this._renderFontSizeItem(18,12)},
         { element: ()=>this._renderFontSizeItem(24,18) },
         { element: ()=>this._renderFontSizeItem(30,24) }]
       return(
         <View style={styles.block}>
           <ButtonGroup
            onPress={this._onFontSize}
            selectedIndex={this.state.fSizeIndex}
            buttons={buttons}
            containerStyle={{height: 80}}
          />
         </View>
       )
     }

     _renderFontAlignmentItem(name){
       return(
         <View style={styles.fontsize_item}>
           <Icon
             name={name}
             size={30}
             type="MaterialIcons"
             color={StyleConfig.C_333333}
           />
         </View>
       )
     }
     _renderFontAlignment(){
       const buttons = [{ element: ()=>this._renderFontAlignmentItem('format-align-left')},
         { element: ()=>this._renderFontAlignmentItem('format-align-center') }]
       return(
         <View style={styles.block}>
           <Text style={styles.tips}>收录中作品的对齐方式</Text>
           <ButtonGroup
            onPress={this._onFontAlig}
            selectedIndex={this.state.fAligIndex}
            buttons={buttons}
            containerStyle={{width:80,height: 40}}
          />
         </View>
       )
     }

     _renderLineHeigt(){
       return(
         <View style={styles.lineheigt_bg}>
          <Slider
            minimumValue={16}
            maximumValue={160}
            step={1}
            minimumTrackTintColor={StyleConfig.C_666666}
            maximumTrackTintColor={StyleConfig.C_D4D4D4}
            thumbTintColor={StyleConfig.C_333333}
            value={this.state.lineHeight}
            onValueChange={(value) => this.setState({lineHeight:value})} />
            <Text style={styles.tips}>行高: {this.state.lineHeight}</Text>
        </View>
       )
     }

     _onFont(){
       this.props.navigation.navigate(UIName.FontUI);
     }
    _onFontSize(index){
      this.setState({fSizeIndex:index})
    }
    _onFontAlig(index){
      this.setState({fAligIndex:index})
    }
    _onSave(){
      let isredux = false;
      if(this.state.fSizeIndex != this.state.firstFSizeIndex){
        Storage.saveFontSize(this.state.fSizeIndex);
        Global.fontSize = this.state.fSizeIndex;
        isredux = true;
      }
      if(this.state.fAligIndex != this.state.firstFAligIndex){
        let align = 'center';
        if(this.state.fAligIndex == 0){
          align = 'left';
        }
        Storage.saveFontAlignment(align)
        Global.fontAlignment = align;
      }
      if(this.state.lineHeight != this.state.firstLineHeight){
        Storage.saveLineHeight(this.state.lineHeight)
        Global.lineHeight = this.state.lineHeight;
        isredux = true;
      }
      if(isredux){
        let { dispatch } = this.props.navigation;
        dispatch(PoemsActions.raUpFont());
      }
      showToast('保存成功');
    }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: StyleConfig.C_EDEDED,
  },
  item:{
    // flex:1,
    flexDirection:'row',
    alignItems:'center',
    height:40,
    backgroundColor:StyleConfig.C_FFFFFF,
    // borderTopWidth:1,
    // borderTopColor:'#d4d4d4',
    // borderBottomWidth:1,
    // borderBottomColor:'#d4d4d4',
    marginTop:10,
    paddingLeft:10,
  },
  item_title:{
    // marginTop:10,
    paddingLeft:10,
    fontSize:16,
    color:StyleConfig.C_333333,
  },
  block:{
    backgroundColor:StyleConfig.C_FFFFFF,
    padding:10,
  },
  fontsize_item:{
    justifyContent:'center',
    alignItems:'center',
  },
  tips:{
    fontSize:14,
    paddingLeft:10,
    paddingBottom:10,
    color:StyleConfig.C_D4D4D4,
  },
  lineheigt_bg:{
    backgroundColor:StyleConfig.C_FFFFFF,
    padding:10,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(ReadSetUI);
