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
import { CheckBox } from 'react-native-elements';
import {
        StyleConfig,
        HeaderConfig,
        pstyles,
        HttpUtil,
        showToast,
      }from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
type Props = {
    navigation:any,
    papp:Object,
};

type State = {
    type:number,
    checkeds:Array<boolean>,
    checktitles:Array<string>,
    custom:string,
    rid:string,
    ruserid:string,
};
class ReportUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title:navigation.state.params.title,
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(
          <TouchableOpacity  onPress={()=>navigation.state.params.onSubmit()}>
            <Text style={pstyles.nav_right}>提交</Text>
          </TouchableOpacity>
        ),
     });
     onSubmit:Function;
     constructor(props){
       super(props);
       let params = this.props.navigation.state.params;
       let type = params.type;
       let ruserid = params.ruserid||'';
       let rid = params.rid;
       console.log('---rid:',rid)
       // type 1 举报作品 type 2名言报错
       let checktitles = [];
       let checkeds = [];
       if(type == 1){
         checktitles = ['侵犯我的权益','内容质量低下','涉及辱骂，歧视，挑衅等']
         checkeds = [false,false,false]
       }else if(type == 2){
         checktitles = ['侵犯我的权益','内容或格式有误','作者信息有误']
         checkeds = [false,false,false]
       }
       this.state = {
         custom:'',
         type:type,
         ruserid:ruserid,
         rid:rid,
         checktitles:checktitles,
         checkeds:checkeds,
       }
       this.onSubmit = this.onSubmit.bind(this);
     }
     componentDidMount(){
        this.props.navigation.setParams({onSubmit:this.onSubmit});
     }
     componentWillUnmount(){

     }
    render(){
      return(
          <View style={pstyles.container}>
              <View>
                {this.state.checktitles.map((item,index)=>{{
                  return(this._renderItem(index,item))
                }})}
                <View style={styles.custom_bg}>
                  <TextInput
                    style={styles.custom}
                    underlineColorAndroid={'transparent'}
                    numberOfLines={5}
                    multiline={true}
                    maxLength={200}
                    placeholder={'自定义内容'}
                    onChangeText={(text) => this.setState({custom:text})}
                  />
                </View>
              </View>
          </View>
      )
    }
    _renderItem(index,item){
      return(
        <View
          key={'r_'+index}
          style={styles.select}
          >
          <CheckBox
          style={styles.check}
          title={this.state.checktitles[index]}
          checkedColor={StyleConfig.C_000000}
          checked={this.state.checkeds[index]}
          onPress={() =>{
            this._onItem(index);
          }}
          />
        </View>
      )
    }
    _onItem(index){
      let checkeds = this.state.checkeds;
      for(var i = 0 ; i < checkeds.length;i++){
        if(i == index){
          checkeds[i] = !checkeds[i]
        }
      }
      this.setState({checkeds:checkeds})
    }
    onSubmit(){
      let report = '';
      let checkeds = this.state.checkeds;
      for(var i = 0 ; i < checkeds.length;i++){
          if(checkeds[i]){
            report += this.state.checktitles[i];
            report += '|';
          }
      }
      let custom = this.state.custom;
      console.log(report)
      console.log(custom)
      if(!report&&!custom){
        Alert.alert('请选择或填写内容')
        return;
      }
      if(this.state.type == 1&&!this.state.rid){
        console.log('参数错误');
        return;
      }
      if(!this.props.papp.userid){
        console.log('参数错误');
        return;
      }
      let json = JSON.stringify({
        userid:this.props.papp.userid,
        type:this.state.type,
        report:report,
        custom:this.state.custom,
        rid:this.state.rid,
        ruserid:this.state.ruserid,
      })
      HttpUtil.post(HttpUtil.USER_REPORT,json).then(res=>{
          if(res.code == 0 ){
            let tips = res.data.tips;
            showToast(tips);
            this.props.navigation.goBack();
          }else{
            console.log(res.code )
          }
      }).catch(err=>{
        console.error(err);
      })
    }
}

const styles = StyleSheet.create({
    select:{

    },
    check:{

    },
    font:{

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
)(ReportUI);
