import React from 'react';
import {
  StyleSheet,
  View ,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import{
  PImage,
  Utils,
}from '../AppUtil';
const {width, height} = Dimensions.get('window');
const big_head = require('../images/big_head.png');
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
          <View style={styles.bg}>
          <Image
            style={styles.bg_head}
            source={big_head}
            resizeMode={Image.resizeMode.cover}
          />
          <PImage
            style={styles.photo}
            source={this.state.photo}
          />
        </View>
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
    bg:{
      backgroundColor: '#ffffff',
      width:width,
      height:width,
    },
    bg_head:{
      position: 'absolute',
      width:width,
      height:width,
    },
    photo:{
      width:width,
      height:width,
    },
})
