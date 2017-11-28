'use strict'
/**
 * 图形组件扩展
 * @flow
 */
import React from 'react';
import {
        StyleSheet,
        View,
      } from 'react-native';
import {CachedImage} from "react-native-img-cache";
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import {
      StyleConfig,
    } from '../Config';
type Props = {
    style:any,
};

type State = {

};
export default class PImage extends React.Component<Props,State>{

  render(){
    // console.log('----PImage render---')
    // console.log(this.props)
       if(typeof(this.props.source) === "number"
        ||this.props.source == undefined){
          if(this.props.noborder){
            return(
              <Image
                style={this.props.style}
                source={this.props.source}
                />
            )
          }else{
            return(
              <View style={[styles.bg,{borderRadius:this.props.borderRadius||8,padding:this.props.padding||2,}]}>
                <Image
                  style={this.props.style}
                  source={this.props.source}
                  />
               </View>
            )
          }
       }else{
         if(this.props.noborder){
           return(
             <CachedImage
                  component={Image}
                  style={this.props.style}
                  source={this.props.source}
                  indicator={Progress.Pie}
                 />
           )
         }else{
           return(
            <View style={[styles.bg,{borderRadius:this.props.borderRadius||8,padding:this.props.padding||2,}]}>
             <CachedImage
                  component={Image}
                  style={this.props.style}
                  source={this.props.source}
                  indicator={Progress.Pie}
                 />
              </View>
           )
         }
       }
   }
}

const styles = StyleSheet.create({
    bg:{
      backgroundColor:StyleConfig.C_FFFFFF,
      borderWidth:1,
      borderColor:StyleConfig.C_000000,
    }
})
