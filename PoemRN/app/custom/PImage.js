'use strict'
/**
 * 图形组件扩展
 */
import React from 'react';
// import {
//       Image,
//      } from 'react-native';
import {CachedImage} from "react-native-img-cache";
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

export default class PImage extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    // console.log('----PImage render---')
    // console.log(this.props)
       if(typeof(this.props.source) === "number"){
         return(
           <Image
               style={this.props.style}
               source={this.props.source}
               />
         )
       }else{
         return(
                          //  {...this.props}
           <CachedImage
                component={Image}
                style={this.props.style}
                source={this.props.source}
                indicator={Progress.Pie}
                // indicatorProps={{
                //   size: 80,
                //   borderWidth: 0,
                //   color: 'rgba(150, 150, 150, 1)',
                //   unfilledColor: 'rgba(200, 200, 200, 0.2)'
                // }}
               />
         )
       }
   }
}
