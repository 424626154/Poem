'use strict'
/**
 * 评论
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View ,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
import{
      StyleConfig,
      HeaderConfig,
      StorageConfig,
      UIName,
      HttpUtil,
      pstyles,
      showToast,
    } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';

type Props = {
    navigation:any,
    papp:Object,
};

type State = {
      id:string,
      cid:string,
      comment:string,
      placeholder:string,
};

class CommentUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title: '评论',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(
          <TouchableOpacity  onPress={()=>navigation.state.params._onRelease()}>
            <Text style={pstyles.nav_right}>发布</Text>
          </TouchableOpacity>
        ),
     });
  _onRelease:Function;
  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    console.log(params);
    var placeholder = '发表评论...';
    if(params.cid > 0 ){
      placeholder = '回复'+params.cpseudonym+'...';
    }
    this.state = {
      id:params.id,
      cid:params.cid,
      placeholder:placeholder,
      comment:'',
    }
    this._onRelease = this._onRelease.bind(this);
  }

  componentDidMount(){
    this.props.navigation.setParams({_onRelease:this._onRelease})

  }

  componentWillUnmount(){

  }
  render(){
    const { navigate } = this.props.navigation;
    return(
      <View style={pstyles.container}>
          <TextInput
            style={styles.input}
            placeholder={this.state.placeholder}
            multiline={true}
            onChangeText={(text) => this.setState({comment:text})}
            value={this.state.comment}
            />
      </View>
    )
  }
  //发布
  _onRelease(){
    if(!this.props.papp.userid){
      return;
    }
    var json = JSON.stringify({
      id:this.state.id,
      userid:this.props.papp.userid,
      cid:this.state.cid,
      comment:this.state.comment,
    })
    // console.log(json);
    HttpUtil.post(HttpUtil.POEM_COMMENTPOEM,json).then((data)=>{
      if(data.code == 0){
        var comment = data.data;
        let { dispatch } = this.props.navigation;
        dispatch(UserActions.raRefComment(true));
        showToast('评论成功')
        this.props.navigation.goBack();
      }else{
        showToast(data.errmsg);
      }
    }).catch((err)=>{
      console.error(err);
    })
  }

}

const styles = StyleSheet.create({
  input:{
    flex:1,
    textAlign:'left',
    textAlignVertical:'top',
    fontSize:18,
    padding:10,
  }
})
export default connect(
    state => ({
        papp: state.papp,
    }),
)(CommentUI);
