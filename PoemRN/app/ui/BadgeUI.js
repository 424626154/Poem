'use strict'
/**
 * 徽章
 * @flow
 */
 import React from 'react';
 import {
        StyleSheet,
         View,
         ScrollView,
         Modal,
         Text,
         TouchableOpacity,
       } from 'react-native';
import { Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import{
        HeaderConfig,
        pstyles,
        HttpUtil,
        showToast,
        StyleConfig,
        Global,
        Utils,
      } from '../AppUtil';
import{
      NavBack,
      BadgeItem,
      }from '../custom/Custom';

type Props = {
    navigation:any
};

type State = {
  badges:Array<Object>,
  modal:boolean,
  curitem:any,
  userid:string,
};
class BadgeUI extends React.Component<Props,State> {
 static navigationOptions = ({navigation}) => ({
       title:'徽章',
       headerTintColor:HeaderConfig.headerTintColor,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(<NavBack navigation={navigation}/>),
       headerRight:(<View style={pstyles.nav_right}/>),
    });

    _onPress:Function;
    constructor(props){
      super(props)
      let params = this.props.navigation.state.params;
      let userid = params.userid;
      this.state = {
        badges:[],
        modal:false,
        userid:userid,
      }
      this._onPress = this._onPress.bind(this);
    }
    componentDidMount(){
      this._requestBadge()
    }
    componentWillUnmount(){

    }
    render(){
      return(
        <View style={pstyles.container}>
          <ScrollView>
               <View style={{padding:10,flexDirection:'row',flexWrap:'wrap'}}>
                   {this.state.badges}
               </View>
           </ScrollView>
           {this._renderModal(this.state.curitem)}
        </View>
      )
    }
    _renderModal(item){
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
            <View style={[pstyles.modal_bg,styles.modal_bg]}>
                {this._renserSealModel(item)}
            </View>
        </Modal>
      )
    }

    _renserSealModel(item){
      if(item){
        return(
          <View style={styles.modal_badge_bg}>
            <View style={styles.modal_badge_close_bg}>
              <TouchableOpacity
                style={styles.modal_badge_close}
                onPress={()=>{
                  this._onCloseModal();
                }}>
                <Icon
                  name='close'
                  size={26}
                  type="MaterialIcons"
                  color={StyleConfig.C_D4D4D4}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modal_badge_content}>
              {this._renderSeal(item)}
              <Text style={styles.condition}>{item.condition}</Text>
              <Text style={styles.comnum}>{'已获得人数'+item.comnum}</Text>
              <Text style={styles.comtime}>{this._renderDate(item.comtime)}</Text>
            </View>
          </View>
          )
      }else{
        return null
      }
    }
    _onShowModel(item){
      this.setState({modal:true,curitem:item})
    }
    _onCloseModal(){
      this.setState({modal:false,curitem:null})
    }

    _renderSeal = (item) => {
      if(item){
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
      }else{
        return null
      }
    }
    _renderSealBgColor(item){
      return item.complete?StyleConfig.C_FF4040:StyleConfig.C_D4D4D4;
    }

    _renderSealColor(){
      return StyleConfig.C_FFFFFF
    }
    _renderDate(itme){
      return itme?'获得日期 '+Utils.timeToYMD(itme):''
    }
    _onPress(item){
      this._onShowModel(item)
    }

    _requestBadge(){
      var json = JSON.stringify({
          userid:this.state.userid
        })
      HttpUtil.post(HttpUtil.BADGE,json).then((result)=>{
        if(result.code == 0){
          var data = result.data;
          var arr=[];
           for(var i=0;i<data.length;i++){
               arr.push( <BadgeItem
                 onPress={this._onPress}
                 item={data[i]}
                 key={'badge_'+i}/>)
           }
           this.setState({badges:arr})
        }else{
          showToast(result.errmsg);
        }
      }).catch((err)=>{
        console.error(err);
      })
    }
}

const styles = StyleSheet.create({
  modal_bg:{
    justifyContent:'center',
    alignItems:'center',
  },
  modal_badge_bg:{
    backgroundColor:StyleConfig.C_FFFFFF,
    borderRadius:10,
    borderColor:StyleConfig.C_D4D4D4,
    borderWidth:1,
    paddingLeft:10,
    paddingRight:10,
    width:Global.width/2,
  },
  modal_badge_content:{
    justifyContent:'center',
    alignItems:'center',
    paddingTop:30,
    paddingBottom:30,
  },
  condition:{
    fontSize:StyleConfig.F_16,
    color:StyleConfig.C_7B8992,
    paddingTop:20,
  },
  comnum:{
    fontSize:StyleConfig.F_12,
    color:StyleConfig.C_D4D4D4,
    paddingTop:10,
  },
  comtime:{
    fontSize:StyleConfig.F_12,
    color:StyleConfig.C_232323,
    paddingTop:10,
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
  },
  modal_badge_close_bg:{
    height:40,
    flexDirection:'row',
    justifyContent:'flex-end',
  },
  modal_badge_close:{
    width:40,
    height:40,
    justifyContent:'center',
    alignItems:'flex-end',
  }
});
export default  connect(
    state => ({
        papp: state.papp,
    }),
)(BadgeUI);
