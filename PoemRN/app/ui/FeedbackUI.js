'use strict'
/**
 * 意见反馈
 * @flow
 */
import React from 'react';
import{
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    TextInput,
    Alert,
    } from 'react-native';
import {connect} from 'react-redux';
import{
      StyleConfig,
      HeaderConfig,
      pstyles,
      HttpUtil,
    } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
type Props = {
    navigation:any,
    papp:Object,
};

type State = {
    feedback:string,
    contact:string,
};

class FeedbackUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title:'意见反馈',
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
   _onSubmit:Function;
  constructor(props){
    super(props);
    this.state = {
      feedback:'',
      contact:'',
    }
    this._onSubmit = this._onSubmit.bind(this);
  }
  componentDidMount(){
      this.props.navigation.setParams({onSubmit:this._onSubmit});
  }
  componentWillUnmount(){

  }
  render(){
    return(
      <View style={[pstyles.container,{backgroundColor: StyleConfig.C_EDEDED,padding:10}]}>
        <TextInput
          style={styles.feedback}
          underlineColorAndroid={'transparent'}
          numberOfLines={10}
          multiline={true}
          maxLength={300}
          placeholder={'请输入产品意见，我们将不断优化体验'}
          onChangeText={(text) => this.setState({feedback:text})}
        />
        <TextInput
          style={styles.contact}
          underlineColorAndroid={'transparent'}
          numberOfLines={1}
          placeholder={'可输入您的手机/邮箱等(选填)'}
          onChangeText={(text) => this.setState({contact:text})}
        />
      </View>
    )
  }

  _onSubmit(){
    this._requestFeedback();
  }

  _requestFeedback(){
    if(!this.state.feedback){
      Alert.alert('请输入您的宝贵意见');
      return;
    }
    var json = JSON.stringify({
      userid:this.props.papp.userid,
      feedback:this.state.feedback,
      contact:this.state.contact,
    });
    HttpUtil.post(HttpUtil.MESSAGE_FEEDBACK,json).then(res=>{
        if(res.code == 0){
          console.log(res.data);
          Alert.alert('感谢您的宝贵意见!');
          this.props.navigation.goBack();
        }else{
          Alert.alert(res.errmsg);
        }
      }).catch(err=>{
        console.error(err);
      });
  }

}

const styles = StyleSheet.create({
      feedback:{
        height:100,
        backgroundColor:StyleConfig.C_FFFFFF,
        borderColor: StyleConfig.C_D4D4D4,
        borderWidth: 1,
        borderRadius:5,
        fontSize:18,
        padding:5,
      },
      contact:{
        backgroundColor:StyleConfig.C_FFFFFF,
        borderColor: StyleConfig.C_D4D4D4,
        borderWidth: 1,
        borderRadius:5,
        fontSize:18,
        padding:10,
        marginTop:20
      }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(FeedbackUI);
