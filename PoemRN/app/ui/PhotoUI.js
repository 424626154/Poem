import React from 'react';
import {
  StyleSheet,
  View ,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import{
  PImage,
  Utils,
}from '../AppUtil';
const {width, height} = Dimensions.get('window');
export default class PhotoUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
    header:null,
  });
  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    let photo = params.photo;
    console.log('-----PhotoUI() photo:',photo);
    this.state = {
      photo:Utils.getHead(photo+'_big'),
    }
  }
  render(){
    return(
      <TouchableOpacity style={styles.container}
        onPress={()=>{
          const { goBack } = this.props.navigation;
          goBack();
        }}
        >
          <PImage
            style={styles.photo}
            source={this.state.photo}
          />
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00000088',
      alignItems:'center',
      justifyContent:'center',
    },
    photo:{
      backgroundColor: '#ffffff',
      width:width,
      height:width,
    },
})
