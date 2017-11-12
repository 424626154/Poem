import React from 'react';
import {
  StyleSheet,
  View,
  DeviceEventEmitter,
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
        if(this.props.papp.num > 0){
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
    /**
     * 解析观察者
     */
    _parseObserver(obj){
      var action = obj.action;
      var param = obj.param;
      console.log('---_parseObserver')
      console.log(action)
      console.log(param)
      switch (action) {
        case Emitter.MSGROT:
          let num = param.num;
          this.setState({num:num});
          break;
        default:
          break;
      }
    }
}
const styles = StyleSheet.create({
  dot:{
    position: 'absolute',
    top: -15,
    right: -20,
    height:12,
    width:12,
  },
});

export default connect(
    state => ({
        papp: state.papp,
    }),
)(TabBarIcon);
