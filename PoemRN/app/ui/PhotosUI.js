'use strict'
/**
 * 相册
 * @flow
 */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  } from 'react-native';
import { Icon } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Utils,HttpUtil} from '../AppUtil';
// const images = [{
//     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
// }, {
//     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
// }, {
//     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
// }]
type Props = {
      navigation:any,
}
type State = {
    images:Array<Object>,
    index:number,
}
export default class PhotosUI extends React.Component<Props,State> {
    constructor(props:Props) {
        super(props);
        let params = this.props.navigation.state.params;
        let photos =  params.photos;
        let index = params.index;
        let images = [];
        if(photos.length > 0 ){
          for(var i = 0 ; i < photos.length ;i++){
            let photo = photos[i];
            let image = {
              url:HttpUtil.getHeadurl(photo.photo),
              width:photo.pw,
              height:photo.ph,
            }
            images.push(image)
          }
        }
        console.log(images)
        this.state = {
          images:images,
          index:index
        }
    }
    render(){
        return (
            <Modal visible={true} transparent={true}>
                <ImageViewer
                  // renderHeader={this._renderHeader}
                  imageUrls={this.state.images}
                  index={this.state.index}
                  saveToLocalByLongPress={false}
                  onClick={()=>{
                    console.log('------onClick');
                    this.props.navigation.goBack();
                  }}
                />
            </Modal>
        )
    }
    _renderHeader(){
      return(
        <View>
          <TouchableOpacity
            style={{ position: 'absolute',
                  top: 30,
                  right: 8,
                backgroundColor:'#FF00FF'}}
            onPress={()=>{
                this.props.navigation.goBack();
            }}>
            <Icon
              name='close'
              size={26}
              type="MaterialIcons"
              color={'#ffffff'}
            />
          </TouchableOpacity>
        </View>
      )
    }
}
