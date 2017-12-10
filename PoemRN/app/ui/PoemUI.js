'use strict'
/**
 * 作品详情页
 * @flow
 */
import React from 'react';
import { Icon } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View ,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import { captureRef } from "react-native-view-shot";
import {
  CommentListItem,
  LoveListView,
} from '../custom/Custom';
import {
      StyleConfig,
      HeaderConfig,
      StorageConfig,
      UIName,
      Utils,
      HttpUtil,
      pstyles,
      goPersonalUI,
      HomePoemDao,
      Global,
      PImage,
      showToast,
      ImageConfig,
      } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
type Props = {
    navigation:any,
    papp:Object,
};

type State = {
    id:number,
    poem:Object,
    modal:boolean,
    author:Object,
};
class PoemUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
    title: '详情',
    headerTintColor:HeaderConfig.headerTintColor,
    headerTitleStyle:HeaderConfig.headerTitleStyle,
    headerStyle:HeaderConfig.headerStyle,
    headerLeft:(<NavBack navigation={navigation}/>),
  });
  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      id:params.id||0,
      poem:{title:'',content:''},
      modal:false,
      author:{author:'',profile:''},
    }
  }
  componentDidMount(){
    this._requestOPoem();
  }

  componentWillUnmount(){

  }
  render(){
    return(
      <View
        style={pstyles.container}
      >
        <ScrollView
          ref="ScrollView"
        >
          <View
            ref="poemsnapshot"
            style={{backgroundColor:StyleConfig.C_FFFFFF}}
          >
          {this._renderPoem()}
          </View>
        </ScrollView>
        {this._renderMenu()}
        {this._renderModal()}
      </View>
    )
  }
  _renderPoem(){
    return(
      <View
        ref="poem"
        style={pstyles.poem}>
        <Text style={[pstyles.poem_title,{fontFamily:Global.font}]}>
          {this.state.poem.title}
        </Text>
        <Text style={[pstyles.poem_content,{fontFamily:Global.font}]}>
          {this.state.poem.content}
        </Text>
      </View>
    )
  }
  _renderMenu(){
    return(
      <View
        style={styles.menu}>
        {/* 收藏 */}
        <TouchableOpacity
            onPress={()=>{
              this._onStar();
            }}>
          <View style={styles.menu_item}>
            <Icon
              name={this.state.poem.star == 1?'star':'star-border'}
              size={26}
              type="MaterialIcons"
              color={StyleConfig.C_D4D4D4}
              />
          </View>
        </TouchableOpacity>
        {/* 截图 */}
        <TouchableOpacity
            onPress={()=>{
              captureRef(this.refs.poemsnapshot, {format: 'png', quality: 1}).then(
                  (uri) =>{
                    this.refs.poemsnapshot.measure((x,y,width,height,px,py)=>{
                      this.props.navigation.navigate(UIName.SnapshotUI,{uri:uri,imgw:width,imgh:height})
                    });
                  }
              ).catch(
                  (error) => alert(error)
              );
            }}>
          <View style={styles.menu_item}>
            <Icon
              name='collections'
              size={26}
              type="MaterialIcons"
              color={StyleConfig.C_D4D4D4}
              />
          </View>
        </TouchableOpacity>
        {/* 作者 */}
        <TouchableOpacity
            onPress={()=>{
              this._requestOLabel()
              this._onShowModel();
            }}>
          <View style={styles.menu_item}>
            <Icon
              name='person'
              size={26}
              type="MaterialIcons"
              color={StyleConfig.C_D4D4D4}
              />
          </View>
        </TouchableOpacity>
        {/* 名言报错 */}
        <TouchableOpacity
            onPress={()=>{
              if(Utils.isLogin(this.props.navigation)){
                  this.props.navigation.navigate(UIName.ReportUI,{title:'名言报错',type:2,rid:this.state.id});
              }
            }}>
          <View style={styles.menu_item}>
            <Icon
              name='error-outline'
              size={26}
              type="MaterialIcons"
              color={StyleConfig.C_D4D4D4}
              />
          </View>
        </TouchableOpacity>
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
            <ScrollView style={styles.modal_author_bg}>
              <Text style={styles.modal_author}>{this.state.author.author}</Text>
              <Text  style={styles.modal_profile}>{this.state.author.profile}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.model_cancel_bg}
              onPress={()=>{
                this._onCloseModal();
              }}>
              <Text style={styles.modal_cancel_font}>关闭</Text>
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
  _onStar(){
    if(!Utils.isLogin(this.props.navigation)){
      return;
    }
    let star = this.state.poem.star == 1?0:1;
    var json = JSON.stringify({
      type:2,
      userid:this.props.papp.userid,
      sid:this.state.poem.id,
      star:star,
    });
    HttpUtil.post(HttpUtil.STATR, json)
    .then(res=>{
      if(res.code == 0){
        let tips = '取消收藏'
        if(star == 1){
            tips = '收藏成功';
        }
        let poem = this.state.poem;
        poem.star = star;
        this.setState({poem:poem})
        showToast(tips)
      }else{
        showToast(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
  _requestOPoem(){
    if(!this.state.id){
      showToast('id错误!')
    }
    var json = JSON.stringify({
      userid:this.props.papp.userid,
      id:this.state.id,
    })
    HttpUtil.post(HttpUtil.FAMOUS_OPOEM, json).then(res=>{
      if(res.code == 0 ){
        let poem = res.data;
        this.setState({poem:poem});
      }else{
        showToast(res.errmsg);
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  _requestOLabel(){
    if(!this.state.poem.author){
      return;
    }
    var json = JSON.stringify({
      author:this.state.poem.author,
    })
    HttpUtil.post(HttpUtil.FAMOUS_AUTHOR, json)
    .then(res=>{
      if(res.code == 0){
          let author = res.data;
          this.setState({author:author})
      }else{
        showToast(res.errmsg)
      }
    })
    .catch(err=>{
      console.error(err);
    })
  }


}
const styles = StyleSheet.create({
  menu:{
    height:50,
    width:Global.width,
    flexDirection:'row',
    position: 'absolute',
    bottom:0,
    borderTopWidth:1,
    borderTopColor:StyleConfig.C_D4D4D4,
    backgroundColor:StyleConfig.C_FFFFFF,
  },
  menu_item:{
    height:50,
    width:Global.width/4,
    padding:10,
    alignItems:'center',
    justifyContent: 'center',
  },
  menu_font:{
    fontSize:18,
    color:StyleConfig.C_D4D4D4,
    marginLeft:4,
    width:18,
    // backgroundColor:'#ff00ff',
  },
  empty:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
  },
  empty_font:{
    marginTop:160,
    fontSize:18,
    color:StyleConfig.C_D4D4D4,
  },
  labels:{
    flexDirection:'row',
    flexWrap:'wrap',
    paddingLeft:10,
    paddingRight:10,
  },
  labelbg:{
    padding:4,
  },
  label:{
    fontSize:18,
    paddingLeft:6,
    paddingRight:6,
    paddingTop:2,
    paddingBottom:2,
    color:StyleConfig.C_000000,
    borderColor:StyleConfig.C_000000,
    borderWidth:1,
    borderRadius:4,
  },
  annotation_bg:{
    padding:10,
  },
  annotation:{
    fontSize:18,
    color:StyleConfig.C_D4D4D4
  },
  love:{
    width:26,
    height:26,
  },
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
    backgroundColor:'#ff00ff',
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
  modal_author_bg:{
    padding:20,
    // maxHeight:100,
  },
  modal_author:{
    fontSize:22,
    color:StyleConfig.C_000000,
  },
  modal_profile:{
    marginTop:10,
    fontSize:18,
    color:StyleConfig.C_000000,
  },
})

export default connect(
    state => ({
        papp: state.papp,
    }),
)(PoemUI);
