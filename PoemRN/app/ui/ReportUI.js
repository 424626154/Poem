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
    checked1:boolean,
    checked2:boolean,
    checked3:boolean,
    check_title1:string,
    check_title2:string,
    check_title3:string,
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
       let ruserid = params.ruserid;
       let rid = params.rid;
       console.log('---rid:',rid)
       // type 1 举报作品
       this.state = {
         custom:'',
         type:type,
         check_title1:'侵犯我的权益',
         check_title2:'内容质量低下',
         check_title3:'涉及辱骂，歧视，挑衅等',
         ruserid:ruserid,
         rid:rid,
         checked1:false,
         checked2:false,
         checked3:false,
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
                <View style={styles.select}>
                  <CheckBox
                  style={styles.check}
                  title={this.state.check_title1}
                  checkedColor={StyleConfig.C_000000}
                  checked={this.state.checked1}
                  onPress={() => this.setState({
                      checked1: !this.state.checked1
                  })}
                  />
                </View>
                <View style={styles.select}>
                  <CheckBox
                  style={styles.check}
                  title={this.state.check_title2}
                  checkedColor={StyleConfig.C_000000}
                  checked={this.state.checked2}
                  onPress={() => this.setState({
                      checked2: !this.state.checked2
                  })}
                  />
                </View>
                <View style={styles.select}>
                  <CheckBox
                  style={styles.check}
                  title={this.state.check_title3}
                  checkedColor={StyleConfig.C_000000}
                  checked={this.state.checked3}
                  onPress={() => this.setState({
                      checked3: !this.state.checked3
                  })}
                  />
                </View>
                <View style={styles.custom_bg}>
                  <TextInput
                    style={styles.custom}
                    underlineColorAndroid={'transparent'}
                    numberOfLines={5}
                    multiline={true}
                    maxLength={200}
                    placeholder={'自定义举报内容'}
                    onChangeText={(text) => this.setState({custom:text})}
                  />
                </View>
              </View>
          </View>
      )
    }
    onSubmit(){
      let report = '';
      if(this.state.checked1){
        report += this.state.check_title1;
      }
      if(this.state.checked2){
        if(report){
          report += '|';
        }
        report += this.state.check_title2;
      }
      if(this.state.checked3){
        if(report){
          report += '|';
        }
        report += this.state.check_title3;
      }
      let custom = this.state.custom;
      console.log(report)
      console.log(custom)
      if(!report&&!custom){
        Alert.alert('请填写举报理由')
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
