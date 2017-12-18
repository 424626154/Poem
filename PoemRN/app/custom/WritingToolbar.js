'use strict'
/**
 * 写作工具栏
 * @flow
 */
import React from 'react';
import {
        StyleSheet,
        View,
        TouchableOpacity,
        Alert,
        Text,
        Image,
        Modal,
        Dimensions,
      } from 'react-native';
import { Icon } from 'react-native-elements';
const {width, height} = Dimensions.get('window');
import{
      StyleConfig
    } from '../AppUtil';
type Props = {
      align:string,
      onItem:Function,
      onShowSelect:Function,
      onImagePicker:Function,//0相机 1相册
      onLabel:Function,//标签页
      onAnnotation:Function,//注释页
}
type State = {
      align:string,
      model:boolean,
      photo:boolean,
      select:boolean,
      pstyle:number,
}
const pstyle1 = 1;//横
const pstyle2 = 2;//方
const pstyle3 = 3;//竖
// 'auto', 'left', 'right', 'center'
export default class WritingToolbar extends React.Component<Props,State>{
    // constructor(props){
    //   super(props)
    //   this.callbackSelected = this.callbackSelected.bind(this);
    // }
    state = {
      align:this.props.align||'center',
      model:false,
      photo:false,
      select:false,
      pstyle:0,
    }
    dialog:any;
    callbackSelected:Function;
    render(){
      return(
        <View>
          {this._renderModel()}
          <View style={styles.bg}>
            <TouchableOpacity style={styles.item}
              onPress={()=>{
                this.setState({align:'left'})
                this.props.onItem('left');
              }}>
              <Icon
                name='format-align-left'
                size={30}
                type="MaterialIcons"
                color={this._renderIcon('left')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}
              onPress={()=>{
                this.setState({align:'center'})
                this.props.onItem('center');
              }}>
              <Icon
                name='format-align-center'
                size={30}
                type="MaterialIcons"
                color={this._renderIcon('center')}
              />
            </TouchableOpacity>
            {/* 添加照片 */}
            {this._renderToolItem('crop-original',()=>{
              // console.log('------_onShowPhoto')
              this._onShowPhoto();
            })}
            {/* 添加标签 */}
            {this._renderToolItem('label',()=>{
              this.props.onLabel();
            })}
            {/* 添加注释 */}
            {this._renderToolItem('date-range',()=>{
              this.props.onAnnotation();
            })}
            {/* {this._renderModel()} */}
          </View>
        </View>
      )
    }
    /**
    *功能栏icon
    */
    _renderToolItem(icon:string,func:Function){
      return(
        <TouchableOpacity style={styles.item}
          onPress={()=>{
            func()
          }}>
          <Icon
            name={icon}
            size={30}
            type="MaterialIcons"
            color={StyleConfig.C_333333}
          />
        </TouchableOpacity>
      )
    }
    _renderIcon(item_align){
      return this.state.align == item_align?StyleConfig.C_333333:StyleConfig.C_D4D4D4;
    }
    _renderModel(){
      // return(
        // <Modal
        //   transparent={true}
        //   animationType={'slide'}
        //   visible={this.state.model}
        //   onRequestClose={()=>{
        //       this._onCloseModel();
        //       console.log('-----onRequestClose')
        //   }}
        //   onShow={()=>{
        //       console.log('onShow')
        //   }}
        //   >
        console.log('------_renderModel',this.state.model)
        if(this.state.model){
          console.log('------this.state.model',this.state.model)
          console.log('------this.state.photo',this.state.photo)
          return(
            <View >
              {this._renderPhotoModel()}
              {this._renderSelectModle()}
            </View>
          )
        }else{
          return null;
        }
        // </Modal>
      // )
    }
    /**
    *选择照片样式
    */
    _renderPhotoModel(){
        if(this.state.photo){
          return(
              <View style={styles.mbg}>
                {/* 横 */}
                {this._renderItem('crop-landscape', ()=>{
                    this.setState({
                      photo:false,
                      select:true,
                      pstyle:pstyle1,
                    });
                    this.props.onShowSelect();
                })}
                {/* 正 */}
                {this._renderItem('crop-square', ()=>{
                    this.setState({
                      photo:false,
                      select:true,
                      pstyle:pstyle2,
                    });
                    this.props.onShowSelect();
                })}
                {/* 竖 */}
                {this._renderItem('crop-portrait', ()=>{
                    this.setState({
                      photo:false,
                      select:true,
                      pstyle:pstyle3,
                    });
                    this.props.onShowSelect();
                })}
                {this._renderClose(()=>{
                    this._onCloseModel();
                })}
              </View>
          )
        }else{
          return null;
        }
    }
    /**
    *选择拍照方式
    */
    _renderSelectModle(){
      if(this.state.select){
        return(
              <View style={styles.mbg}>
                {/* 相机 */}
                {this._renderItem('photo-camera', ()=>{
                    this._onCloseModel();
                    this.props.onImagePicker(0,this.state.pstyle);
                })}
                {/* 相册 */}
                {this._renderItem('photo', ()=>{
                    this._onCloseModel();
                    this.props.onImagePicker(1,this.state.pstyle);
                })}
                {this._renderBack(()=>{
                    this.setState({photo:true,select:false});
                })}
                {this._renderClose(()=>{
                    this._onCloseModel();
                })}
              </View>
        )
      }else{
        return null;
      }
    }
    _renderItem(icon:string,func:Function){
      return(
        <TouchableOpacity style={styles.item}
          onPress={()=>{
            func()
          }}>
          <Icon
            name={icon}
            size={30}
            type="MaterialIcons"
            color={StyleConfig.C_333333}
          />
        </TouchableOpacity>
      )
    }
    _renderBack(func:Function){
      return(
        <TouchableOpacity style={styles.back}
          onPress={()=>{
            func()
          }}>
          <Icon
            name='reply'
            size={30}
            type="MaterialIcons"
            color={StyleConfig.C_333333}
          />
        </TouchableOpacity>
      )
    }
    _renderClose(func:Function){
      return(
        <TouchableOpacity style={styles.close}
          onPress={()=>{
            func()
          }}>
          <Icon
            name='close'
            size={30}
            type="MaterialIcons"
            color={StyleConfig.C_333333}
          />
        </TouchableOpacity>
      )
    }

    _onShowPhoto(){
      this.setState({
        model:true,
        photo:true,
        select:false,
      })
    }
    _onCloseModel(){
      console.log('-----_onCloseModel')
      this.setState({
        model:false,
        photo:false,
        select:false,
      })
    }
}

const styles = StyleSheet.create({
  bg:{
    height:40,
    flexDirection:'row',
    backgroundColor:StyleConfig.C_FFFFFF,
    borderTopWidth:1,
    borderTopColor:StyleConfig.C_D4D4D4,
    paddingLeft:10,
    paddingRight:10,
  },
  item:{
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  close:{
    position: 'absolute',
    alignItems:'center',
    justifyContent:'center',
    right:0,
    top:4,
    width:40,
    height:40,
  },
  back:{
    position: 'absolute',
    alignItems:'center',
    justifyContent:'center',
    right:40,
    top:4,
    width:40,
    height:40,
  },
  modal:{
    // height:80,
    // backgroundColor:'#ff00ff',
  },
  mbg:{
    width:width,
    flexDirection:'row',
    backgroundColor:StyleConfig.C_FFFFFF,
    borderTopWidth:1,
    borderTopColor:StyleConfig.C_D4D4D4,
    paddingLeft:10,
    paddingRight:10,
    // position: 'absolute',
    // bottom:40,
  }
})
