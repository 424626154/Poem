import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
}from 'react-native';
import { Icon } from 'react-native-elements';
import {
  Emitter,
  MessageDao,
  ChatDao,
} from '../AppUtil'
import {connect} from 'react-redux';

class TabBarIcon extends React.Component{
    constructor(props){
      super(props);
    }
    componentDidMount(){

    }
    componentWillUpdate(){

    }
    render(){
      return(
        <View>
          <Icon
            name='message'
            size={26}
            type="MaterialIcons"
            color={this.props.tintColor}
          />
          {this._renderRot()}
        </View>
      )
    }
    _renderRot(){
      // console.log('------TabBarIcon() _renderRot')
      // console.log(this.props)
        if(this.props.papp.num){
          console.log('------TabBarIcon() num:',this.props.papp.num)
          return(
            <View style={styles.dot}>
              <Icon
                name="brightness-1"
                size={6}
                type="MaterialIcons"
                color={"#ff4040"}
              />
            </View>
          )
        }else{
          return null;
        }
    }
}
const styles = StyleSheet.create({
  dot:{
    position: 'absolute',
    ...Platform.select({
        ios:{
          top: -14,
          right: -16,
        },
        android:{
          top: 0,
          right: -1,
        }
    }),
    height:8,
    width:8,
  },
});

export default connect(
    state => ({
        papp: state.papp,
    }),
)(TabBarIcon);
