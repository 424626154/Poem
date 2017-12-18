'use strict'
/**
 *广告
 *@flow
 */
import React from 'react';
import {
      StyleSheet,
      Platform,
      Text,
      View,
      TouchableOpacity,
      Alert,
     } from 'react-native';
import Swiper from 'react-native-swiper';
import Carousel from 'react-native-snap-carousel';
import {
    StyleConfig,
    Global,
    Utils,
    } from '../AppUtil';


// const slideWidth = Utils.wp(75);
// const itemHorizontalMargin = Utils.wp(2);

const sliderWidth = Global.width;
const itemWidth = Global.width-10;//slideWidth + itemHorizontalMargin * 2;
const SLIDER_FIRST_ITEM = 1;

type Props = {
    banners:Array<Object>,
    onBannerItem:Function,
}

type State = {
  sliderActiveSlide:number,
    sliderRef:any;
}

export default class Banner extends React.Component<Props,State>{
  _renderItem:Function;
  constructor (props:Props) {
        super(props);
    this.state = {
        sliderActiveSlide:SLIDER_FIRST_ITEM,
        sliderRef: null
    };
    this._renderItem = this._renderItem.bind(this);
  }
  render(){
      if(this.props.banners.length > 0){
        return(
          <View style={styles.banner}>
            {/* <Swiper
               height={40}
               loop={true}
               index={0}
               showsButtons={false}
               autoplay={true}
               autoplayTimeout={10}
               onIndexChanged={(index)=>{
                 // console.log(index)
               }}
               showsPagination={false}
               // dot={<View style={{backgroundColor:StyleConfig.C_EDEDED, width: 8 ,height: 8 ,borderRadius: 4, marginLeft: 3, marginRight: 3}} />}
               // activeDot={<View style={{backgroundColor: StyleConfig.C_D4D4D4, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3}} />}
               // paginationStyle={{position: 'absolute', bottom: 5,height: 13}}
               // autoplayDirection={false}
              >
              {this.props.banners.map((item, i) =>
                  this._renderSwiperItem(item, i)
                )}
            </Swiper> */}
            <Carousel
              ref={(c) => { if (!this.state.sliderRef) { this.setState({ sliderRef: c }); } }}
              data={this.props.banners}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              hasParallaxImages={true}
              firstItem={SLIDER_FIRST_ITEM}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.7}
              enableMomentum={false}
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContentContainer}
              loop={true}
              loopClonesPerSide={2}
              autoplay={true}
              autoplayDelay={5000}
              autoplayInterval={3000}
              onSnapToItem={(index) => this.setState({ sliderActiveSlide: index }) }
            />
          </View>
        )
      }else{
        return null;
      }
  }

  // _renderSwiperItem(item, key) {
  _renderItem ({item, index}) {
    // console.log('-----_renderSwiperItem')
    // console.log(key)
    // console.log(item)
   return (
     <TouchableOpacity
       style={styles.banner_item_bg}
     onPress={()=>{
       this.props.onBannerItem(item)
     }}
     key={'banner_'+index}>
     <View  style={styles.banner_item}>
       <Text
         style={styles.banner_item_title}
         numberOfLines={1}
         ellipsizeMode='tail'
         >
         {item.title}
       </Text>
       <View style={{height:6,}}></View>
       <Text
         style={styles.banner_item_content}
         numberOfLines={1}
         ellipsizeMode='tail'
         >
         {item.content}
       </Text>
     </View>
     </TouchableOpacity>
   );
  }


}

const styles = StyleSheet.create({
  banner:{
    height:70,
    width:Global.width,
    borderBottomWidth:1,
    borderBottomColor:StyleConfig.C_EDEDED,
  },
  banner_item_bg:{
    // paddingTo
    height:70,
    justifyContent:'center',
    alignItems:'center',
  },
  banner_item:{
    width:itemWidth,
    height:62,
    paddingLeft:10,
    paddingRight:10,
    justifyContent:'center',
    alignItems:'flex-start',
    backgroundColor:StyleConfig.C_FFFFFF,
    borderRadius:5,
    borderWidth:1,
    borderColor:StyleConfig.C_D4D4D4,
  },
  banner_item_title:{
      fontSize:18,
      color:StyleConfig.C_333333,
  },
  banner_item_content:{
    fontSize:16,
    color:StyleConfig.C_D4D4D4,
  },
  slider:{

  },
  sliderContentContainer:{

  },
});
