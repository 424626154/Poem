'use strict'
/**
 * 作品添加注释
 * @flow
 */
 import React from 'react';
 import {
   StyleSheet,
   Text,
   View ,
   TextInput,
   TouchableOpacity,
 } from 'react-native';
 import {
   StyleConfig,
   HeaderConfig,
   pstyles,
   showToast,
   Utils,
   ImageConfig,
   Storage,
   } from '../AppUtil';
 import{
       NavBack,
       }from '../custom/Custom';
 import { Icon } from 'react-native-elements';

 type Props = {
       navigation:any,
      onChangeAnnotation:Function,
 };
 type State = {
      annotation:string
 };

 export default class AnnotationlUI extends React.Component<Props,State> {
   static navigationOptions = ({navigation}) => ({
         title: '注释',
         headerTintColor:HeaderConfig.headerTintColor,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(<NavBack navigation={navigation}/>),
         headerRight:(
           <TouchableOpacity  onPress={()=>navigation.state.params._onSave()}>
             <Text style={pstyles.nav_right}>保存</Text>
           </TouchableOpacity>
         ),
      });
    _onSave:Function;
    constructor(props:Props){
      super(props);
      let params = this.props.navigation.state.params;
      let annotation = params.annotation
      this.state = {
        annotation:annotation||'',
      }
      this._onSave = this._onSave.bind(this);
    }
    componentDidMount(){
      this.props.navigation.setParams({_onSave:this._onSave})

    }

    componentWillUnmount(){

    }
    render(){
      return(
        <View style={pstyles.container}>
          <TextInput
            style={styles.input}
            placeholder={'请输入注释内容...'}
            multiline={true}
            onChangeText={(text) => this.setState({annotation:text})}
            value={this.state.annotation}
            />
        </View>
      )
    }
    _onSave(){
      let params = this.props.navigation.state.params;
      params.onChangeAnnotation&&params.onChangeAnnotation(this.state.annotation)
      this.props.navigation.goBack();
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
