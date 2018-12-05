'use strict'
/**
 * 徽章
 * @flow
 */
 import React from 'react';
 import {
     StyleSheet,
         View,
       } from 'react-native';
import {connect} from 'react-redux';
import{
        HeaderConfig,
        pstyles,
      } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';

type Props = {
    navigation:any
};

type State = {

};
class ExampleUI extends React.Component<Props,State> {
 static navigationOptions = ({navigation}) => ({
       title:'ExampleUI',
       headerTintColor:HeaderConfig.headerTintColor,
       headerTitleStyle:HeaderConfig.headerTitleStyle,
       headerStyle:HeaderConfig.headerStyle,
       headerLeft:(<NavBack navigation={navigation}/>),
       headerRight:(<View style={pstyles.nav_right}/>),
    });
    constructor(props){
      super(props)
    }
    componentDidMount(){

    }
    componentWillUnmount(){

    }
    render(){
      return(
        <View style={pstyles.container}>

        </View>
      )
    }

}

const styles = StyleSheet.create({

});
export default  connect(
    state => ({
        papp: state.papp,
    }),
)(ExampleUI);
