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
      Modal,
      ScrollView,
     } from 'react-native';
import {connect} from 'react-redux';
import ImageZoom from 'react-native-image-pan-zoom';
import { Icon } from 'react-native-elements';
import ShareUtile from '../umeng/ShareUtil';
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
    modal:boolean,
}

class SnapshotUI extends React.Component<Props,State>{
   static navigationOptions = ({navigation}) => ({
         title:'预览',
         headerTintColor:HeaderConfig.headerTintColor,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(<NavBack navigation={navigation}/>),
         headerRight:(
           <TouchableOpacity  onPress={()=>navigation.state.params.onMore()}>
             <View
               style={{paddingRight:10}}>
               <Icon
                 name='more-horiz'
                 size={26}
                 type="MaterialIcons"
                 color={StyleConfig.C_333333}
                 />
             </View>
           </TouchableOpacity>
         ),
      });
    _onMore:Function;
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
          modal:false,
        }
        console.log('-----uri:',uri)
        this._onMore = this._onMore.bind(this);
    }
    componentDidMount(){
       this.props.navigation.setParams({onMore:this._onMore});
    }
    render(){
      return(
        <View style={[pstyles.container,{backgroundColor:StyleConfig.C_EDEDED}]}>
          <ImageZoom
               cropWidth={Global.width}
               cropHeight={Global.height-60}
               imageWidth={this.state.imgw}
               imageHeight={this.state.imgh}>
                <Image style={{width:this.state.imgw, height:this.state.imgh}}
                       source={{uri:this.state.uri}}/>
            </ImageZoom>
          {this._renderModal()}
        </View>
      )
    }
    _renderModal(){
      return(
        <Modal
          transparent={true}
          animationType={'slide'}
          visible={this.state.modal}
          onRequestClose={()=>{
              console.log('-----onRequestClose')
          }}
          onShow={()=>{
              console.log('onShow')
          }}
          >
            <View style={styles.modal_bg}>

            </View>
            <View style={styles.modal_con}>
              <ScrollView
                horizontal={true}
                style={styles.modal_items_bg}>
                {/* 微信好友 */}
                <View style={styles.modal_item_bg}>
                  <TouchableOpacity
                    style={styles.modal_item}
                    onPress={()=>{
                      this._onCloseModal();
                      this._onShare(2);
                    }}>
                    <Image
                      style={styles.modal_item_icon}
                      source={require('../images/wechat.png')}/>
                  </TouchableOpacity>
                  <Text style={styles.modal_item_font}>微信好友</Text>
                </View>
                {/* 微信朋友圈 */}
                <View style={styles.modal_item_bg}>
                  <TouchableOpacity
                    style={styles.modal_item}
                    onPress={()=>{
                      this._onCloseModal();
                      this._onShare(3);
                    }}>
                    <Image
                      style={styles.modal_item_icon}
                      source={require('../images/wxcircle.png')}/>
                  </TouchableOpacity>
                  <Text style={styles.modal_item_font}>微信朋友圈</Text>
                </View>
                {/* qq好友 */}
                <View style={styles.modal_item_bg}>
                  <TouchableOpacity
                    style={styles.modal_item}
                    onPress={()=>{
                      this._onCloseModal();
                      this._onShare(0);
                    }}>
                    <Image
                      style={styles.modal_item_icon}
                      source={require('../images/qq.png')}/>
                  </TouchableOpacity>
                  <Text style={styles.modal_item_font}>QQ</Text>
                </View>
                {/* qq朋友圈 */}
                <View style={styles.modal_item_bg}>
                  <TouchableOpacity
                    style={styles.modal_item}
                    onPress={()=>{
                      this._onCloseModal();
                      this._onShare(4);
                    }}>
                    <Image
                      style={styles.modal_item_icon}
                      source={require('../images/qzone.png')}/>
                  </TouchableOpacity>
                  <Text style={styles.modal_item_font}>QQ空间</Text>
                </View>
                <View style={styles.modal_item_bg}>
                  <TouchableOpacity
                    style={styles.modal_item}
                    onPress={()=>{
                      this._onCloseModal();
                      this._onShare(1);
                    }}>
                    <Image
                      style={styles.modal_item_icon}
                      source={require('../images/sina.png')}/>
                  </TouchableOpacity>
                  <Text style={styles.modal_item_font}>新浪微博</Text>
                </View>
                {/* 截图 */}
                <View style={styles.modal_item_bg}>
                  <TouchableOpacity
                    style={styles.modal_item}
                    onPress={()=>{
                      this._onCloseModal();
                      CameraRoll.saveToCameraRoll(this.state.uri).then(result=>{
                        // console.log(result)
                        showToast('截图已保存在:'+result)
                      }).catch(err=>{
                        showToast(err)
                      })
                    }}>
                      <Icon
                        name={'photo-library'}
                        size={26}
                        type="MaterialIcons"
                        color={StyleConfig.C_D4D4D4}
                        />
                  </TouchableOpacity>
                  <Text style={styles.modal_item_font}>保存到手机</Text>
                </View>
                <View style={{width:40}}></View>
              </ScrollView>
              <TouchableOpacity
                style={styles.model_cancel_bg}
                onPress={()=>{
                  this._onCloseModal();
                }}>
                <Text style={styles.modal_cancel_font}>取消</Text>
              </TouchableOpacity>
            </View>
        </Modal>
      )
    }
    _onShowModel(){
      this.setState({modal:true})
    }
    _onCloseModal(){
      this.setState({modal:false})
    }
    _onMore(){
      this.setState({modal:true})
    }
    _onShare(platform){
      console.log(this.state.uri)
      let url = this.state.uri;
      // let file_url = 'file://';
      // console.log(url.indexOf(file_url));
      // console.log(url.replace(file_url,''));
      ShareUtile.share('',url,'','',platform,(code,message) =>{
            console.log(message)
            console.log(code)
            if(code == 200){
              showToast('分享成功')
            }else{
              showToast(message)
            }
        });
    }
 }

 const styles = StyleSheet.create({
   modal_bg:{
     flex:1,
     backgroundColor:'#00000044'
   },
   modal_con:{
     position: 'absolute',
     bottom:0,
     backgroundColor:StyleConfig.C_FFFFFF
   },
   model_cancel_bg:{
     height:50,width:Global.width,
     borderTopWidth:1,
     borderTopColor:StyleConfig.C_D4D4D4,
     backgroundColor:StyleConfig.C_FFFFFF,
     alignItems:'center',
     justifyContent: 'center',
   },
   modal_cancel_font:{
     fontSize:20,
     color:StyleConfig.C_D4D4D4
   },
   modal_items_bg:{
     padding:20,
     // flexDirection:'row'
   },
   modal_item_bg:{
     padding:10,
     alignItems:'center',
     justifyContent:'center',
   },
   modal_item:{
     width:60,
     height:60,
     borderWidth:1,
     borderColor:StyleConfig.C_D4D4D4,
     borderRadius:30,
     alignItems:'center',
     justifyContent: 'center',
   },
   modal_item_icon:{
     width:40,
     height:40,
   },
   modal_item_font:{
     marginTop:6,
     fontSize:14,
     color:StyleConfig.C_D4D4D4,
   },
 });
 export default connect(
     state => ({
         papp: state.papp,
     }),
 )(SnapshotUI);
