'use strict';
/**
 * 发布作品tab
 * @flow
 */
 import React from 'react';
 import { Icon } from 'react-native-elements';
 import {
   View ,
 } from 'react-native';
import {connect} from 'react-redux';
import{UIName,Utils} from '../AppUtil'
import{
      StyleConfig,
      Global,
      Permission,
    } from '../AppUtil';
type Props = {

};

type State = {

};
class WorksTab extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title: '',
        tabBarOnPress:(({previousScene,scene,jumpToIndex})=>{
            // navigation.navigate(UIName.AddPoemUI);
            // console.log(navigation)
            if(!Utils.isLogin(navigation)){
                return;
            }
            // console.log(scene)
            // console.log(previousScene)
            // console.log('------navigation.state.key')
            // console.log(navigation.state.key);
            if(!Utils.getPermission(Permission.WRITE,Global.per)){
                 navigation.navigate(UIName.AgreementUI,{toui:UIName.AddPoemUI});
            } else{
                 navigation.navigate(UIName.AddPoemUI,{ftype:0});
            }
        }),
        tabBarIcon: ({ tintColor }) => (
          <View style={{backgroundColor:'#ff00ff',width:50,height:50}}>
            <Icon
              name='add-box'
              size={50}
              type="MaterialIcons"
              color={StyleConfig.C_FFCA28}
            />
          </View>
        )
     });
     render(){
       return(
         <View></View>
       )
     }
}

export default connect(
   state => ({
       papp: state.papp,
       mypoems:state.poems.mypoems,
   }),
)(WorksTab);
