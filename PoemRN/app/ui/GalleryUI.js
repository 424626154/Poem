'use strict'
/**
 * 图片浏览
 * @flow
 */
import React from 'react';
import {
      StyleSheet,
      View,
     } from 'react-native';
import{
   NavBack,
   }from '../custom/Custom';
import {connect} from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';

import {
  StyleConfig,
  HeaderConfig,
  pstyles,
  ImageConfig,
} from '../AppUtil';
type Props = {
    navigation:any,
};

type State = {
    // images:Array<any>,
    index:number,
};

var images = [];

class GalleryUI extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title: '查看',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(<View style={pstyles.nav_right}/>)
     });
     state = {
       // images:[],
       index:1,
     }
     // 数据容器，用来存储数据
     constructor(props) {
         super(props);
     }
   // 当视图全部渲染完毕之后执行该生命周期方法
    componentDidMount() {
      let params = this.props.navigation.state.params;
      var temp_images = params.images;
      var index = params.index?params.index:0;
      images = temp_images;
      console.log(temp_images)
      if(temp_images){
        this.setState({
          // images:temp_images,
          index:index,
        })
      }
    }
    componentWillUnmount(){

    }
    render() {
      return (
        <View style={pstyles.container}>
          {/* <ImageViewer
            imageUrls={this.state.images}
            index={this.state.index}/> */}
            <ImageViewer
              index={this.state.index}
              imageUrls={images}/>
        </View>
      )
    }
}

const styles = StyleSheet.create({

});
export default connect(
    state => ({

    }),
)(GalleryUI);
