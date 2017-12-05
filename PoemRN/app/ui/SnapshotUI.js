'use strict'
/**
 *快照预览
 *@flow
 */
import React from 'react';
import {
      StyleSheet,
      Platform,
      Text,
      View,
      WebView,
      TouchableOpacity,
      Alert,
      Image,
      CameraRoll,
     } from 'react-native';
import {connect} from 'react-redux';
import ImageZoom from 'react-native-image-pan-zoom';
import {
   pstyles,
   HeaderConfig,
   StyleConfig,
   Global,
   showToast,
   } from '../AppUtil';
import{
     NavBack,
     }from '../custom/Custom';
type Props = {
    navigation:any,
}

type State = {
    uri:any,
    imgw:number,
    imgh:number,
}

class SnapshotUI extends React.Component<Props,State>{
   static navigationOptions = ({navigation}) => ({
         title:'作品截图',
         headerTintColor:HeaderConfig.headerTintColor,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(<NavBack navigation={navigation}/>),
         headerRight:(
           <TouchableOpacity  onPress={()=>navigation.state.params.onSave()}>
             <Text style={pstyles.nav_right}>{'保存'}</Text>
           </TouchableOpacity>
         ),
      });
    _onSave:Function;
    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        let uri = params.uri;
        let imgw = params.imgw;
        let imgh = params.imgh;
        let padding = 20;
        if(imgw > Global.width||imgh > Global.height){
          let temp_imgw = imgw;
          let temp_imgh = imgh;
          if(imgw > imgh ){
              temp_imgw = Global.width-20;
              temp_imgh = temp_imgw*imgh/imgw;
          }else{
              temp_imgh = Global.height-60;
              temp_imgw = temp_imgh*imgw/imgh;
          }
          imgw = temp_imgw;
          imgh = temp_imgh;
        }
        console.log('imgw:',imgw)
        console.log('imgh:',imgh)
        console.log('Global.width:',Global.width)
        console.log('Global.height:',Global.height)
        this.state = {
          uri:uri,
          imgw:imgw,
          imgh:imgh,
        }
        console.log('-----uri:',uri)
        this._onSave = this._onSave.bind(this);
    }
    componentDidMount(){
       this.props.navigation.setParams({onSave:this._onSave});
    }
    render(){
      return(
        <View style={[pstyles.container,{backgroundColor:StyleConfig.C_E7E7E7}]}>
          <ImageZoom
               cropWidth={Global.width}
               cropHeight={Global.height-60}
               imageWidth={this.state.imgw}
               imageHeight={this.state.imgh}>
                <Image style={{width:this.state.imgw, height:this.state.imgh}}
                       source={{uri:this.state.uri}}/>
            </ImageZoom>
        </View>
      )
    }
    _onSave(){
      CameraRoll.saveToCameraRoll(this.state.uri).then(result=>{
        showToast('截图已保存在:'+result)
      }).catch(err=>{
        showToast(err)
      })
    }
 }

 const styles = StyleSheet.create({

 });
 export default connect(
     state => ({
         papp: state.papp,
     }),
 )(SnapshotUI);
