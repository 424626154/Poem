'use strict'
/**
 * 作品标签
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View ,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {
  StyleConfig,
  HeaderConfig,
  pstyles,
  showToast,
  Utils,
  ImageConfig,
  Storage,
  } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
import { Icon } from 'react-native-elements';
import PeomLabelListItem from '../custom/PoemLabelListItem';
const label_max = 5;
type Props = {
      navigation:any,
      labels:string,
      onChangeLabels:Function,
};
type State = {
    addlabel:string,
    labelviews:Array<Object>,
    labels:Array<string>,
    historys:Array<string>,
    historysdata:Array<Object>,
    label_clear:boolean,
    selected:Map<string, boolean>,
};

export default class PoemLabelUI extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title: '标签',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
     });

    // _onAddLabel:Function;
    _onDeleteHistory:Function;
    _renderHItem:Function;
    constructor(props:Props) {
        super(props);
     // this._renderHItem = this._renderHItem.bind(this);
     // this._onAddLabel = this._onAddLabel.bind(this);
     this._onDeleteHistory = this._onDeleteHistory.bind(this);
   }
   state = {
      addlabel:'',
      labelviews:[],
      labels:[],
      historys:[],
      historysdata:[],
      label_clear:false,
      selected: (new Map(): Map<string, boolean>),
    }

    shouldComponentUpdate(nextProps:Props, nextState:State){
      console.log('---PoemLabelUI() shouldComponentUpdate');
      console.log(nextProps)
      console.log(nextState)
      if(nextState.labels != this.state.labels){
        console.log('------loadLabels')
        this.loadLabels(nextState.labels);
      }
      return true;
    }
   componentDidMount(){
     let params = this.props.navigation.state.params;
     if(params.labels){
       let labels = params.labels.split(',')
       console.log('------PoemLabelUI')
       console.log(labels)
       this.setState({labels:labels})
       console.log(this.state.labels)
     }
      let historys_str = Storage.getLabelHistory();
      if(historys_str){
        let historys = historys_str.split(',')
        let historysdata = [];
        for (var i = 0; i < historys.length; i++) {
          historysdata.push({key:i,name:historys[i]});
        }
        console.log(historys)
        console.log(historysdata)
        if(historys.length > 0){
          this.setState({historys:historys,historysdata:historysdata})
        }
      }
   }
   componentWillUnmount(){

   }
  render(){
    return(
      <View style={pstyles.container}>
          {/* 标签输入页 */}
          <View style={styles.addlabelbg}>
            <TextInput
              ref='addlabel'
              style={styles.addlabel}
              underlineColorAndroid={'transparent'}
              placeholder={'请输入标签,最长10个字'}
              onChangeText={(text) => {
                this.setState({addlabel:text})
                if(text){
                    if(!this.state.label_clear){
                      this.setState({label_clear:true});
                    }
                }else{
                    if(this.state.label_clear){
                      this.setState({label_clear:false});
                    }
                }
              }}
              value={this.state.addlabel}
              returnKeyType={'done'}
              blurOnSubmit={false}
              autoFocus={true}
              onFocus={()=>{
                this._reloadFocus()
              }}
            />
            {this._renderLabelClear()}
            <TouchableOpacity
              style={styles.addlabebut}
              onPress={()=>{
                  this._onAddLabel(this.state.addlabel);
                  this.setState({addlabel:'',label_clear:false,});
              }}
              >
            <Icon
              name='add-box'
              size={30}
              type="MaterialIcons"
              color={StyleConfig.C_000000}
            />
          </TouchableOpacity>
          </View>
          {/* 标签显示页 */}
          <View>
            <Text style={styles.tips}>{'最多可添加'+label_max+'个标签'}</Text>
            {this._renderLabels()}
          </View>
          {/* 标签历史 */}
          <View style={styles.history}>
            <View style={styles.history_bg}>
              <Text style={styles.history_title}>搜索历史</Text>
              <TouchableOpacity
                onPress={()=>{
                  this._onClearHistory();
                }}>
                <Text style={styles.history_clear}>清除历史</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={this.state.historysdata}
              extraData={ this.state.selected }
              keyExtractor={(item, index) => index+'' }
              renderItem={this._renderHItem}
              ItemSeparatorComponent={({highlighted}) => (<View style={pstyles.separator}></View>)}
            />
          </View>
      </View>
    )
  }
  loadLabels(labels:Array<string>){
    let labelviews = [];
    for (var i = 0; i < labels.length; i++) {
      let key = 'labels_'+i;
      var label = {name:labels[i],key:key}
      labelviews.push(this._renderItem(label));
    }
    this.setState({
      labelviews:labelviews,
    })
  }
  _renderLabels(){
    // this.loadLabels();
    return (
      <View style={styles.labels}>
          {this.state.labelviews.map((elem, index) => {return elem;})}
      </View>
    )
  }
  _reloadFocus(){
    if(this.refs.addlabel.isFocused()){
        let label_clear = true;
        if(!this.state.phone){
          label_clear = false;
        }
        this.setState({
          label_clear:label_clear,
        })
    }else{
      this.setState({
        label_clear:false,
      })
    }
  }
  _renderLabelClear(){
        if(this.state.label_clear){
          return(
            <TouchableOpacity
              style={styles.label_clear}
                onPress={()=>{
                    this.setState({addlabel:'',label_clear:false,});
                }}
                >
              <Icon
                name='clear'
                size={28}
                type="MaterialIcons"
                color={StyleConfig.C_D4D4D4}
              />
            </TouchableOpacity>
          )
      }else{
          return null;
      }
  }
  _renderItem(item:Object){
    return(
      <View key={ item.key } >
        <TouchableOpacity
          style={styles.labelbg}
          onPress={()=>{
              this._onDelete(item);
          }}>
          <Text style={styles.label}>
            { item.name }
          </Text>
          <Image
            style={styles.clear}
            source={ImageConfig.clear}/>
        </TouchableOpacity>
      </View>
    )
  }
  _renderHItem = ({item}:Object)=>{
    return(
      <PeomLabelListItem
        id={item.key}
        item={item}
        selected={ !!this.state.selected.get(item.id) }
        onPressItem={this._onPressItem}
        onDeleteHistory={this._onDeleteHistory}
      />
    )
  }
  _onPressItem = (id: string,item:Object) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
     this._onAddLabel(item.name)
  };
  /**
   * 转成labels字符串
   */
  // _getLabelsStr(){
  //   let labels_str = '';
  //   for(var i = 0 ; i < this.state.labels.length ; i ++){
  //     labels_str += this.state.labels[i];
  //     if(i < this.state.labels.length-1){
  //       labels_str += ',';
  //     }
  //   }
  //   return labels_str;
  // }
  /**
   * 历史字符串
   */
  _getArrayStr(array:Array<string>){
    let historys_str = '';
    if(array){
      for(var i = 0 ; i < array.length ; i ++){
        historys_str += array[i];
        if(i < array.length-1){
          historys_str += ',';
        }
      }
    }
    return historys_str;
  }
  /**
  *标签是否重复
  */
  _isRepeat(label:string){
    let isrepeat = false;
    for(var i = 0 ; i < this.state.labels.length ; i ++){
      if(this.state.labels[i] == label){
        isrepeat = true;
        break;
      }
    }
    return isrepeat;
  }
  _onAddLabel(addlabel:string){
    // s.split(",");
    if(!addlabel){
      showToast('填写标签内容')
      return;
    }
    if(this.state.labels.length >= label_max){
        showToast('最多添加'+label_max+'个标签');
        return;
    }
    let strlen = Utils.strlen(addlabel);
    // console.log(strlen);
    if(strlen > 20){
      showToast('标签过长')
      return;
    }
    if(this._isRepeat(addlabel)){
      showToast('标签已存在')
      return;
    }
    let labels = [...this.state.labels];
    labels.push(addlabel);
    this.setState({labels:labels})
    console.log('------_onAddLabel')
    let labels_str  = this._getArrayStr(labels)
    console.log(labels_str);
    let params = this.props.navigation.state.params;
    params.onChangeLabels&&params.onChangeLabels(labels_str)
    this._addHistory(addlabel);
  }
  _addHistory(addlabel:string){
    if(!addlabel){
      return;
    }
    let ispush = true;
    let historys = [...this.state.historys];
    for(var i = 0 ; i < historys.length ; i ++){
      if(historys[i] == addlabel){
        ispush = false;
        break;
      }
    }
    if(ispush){
      historys.push(addlabel);
      let historysdata = [...this.state.historysdata];
      historysdata.push({key:this.state.historys.length,name:this.state.addlabel})
      console.log(historysdata)
      this.setState({historysdata:historysdata,historys:historys})
      let  historys_str = this._getArrayStr(historys);
      Storage.saveLabelHistory(historys_str);
      console.log('-----_addHistory historys_str')
      console.log(historys_str)
    }
  }
  _onDelete(item:Object){
    console.log('-----_onDelete')
    if(this.state.labels.length < 0){
      return;
    }
    let labels = [...this.state.labels];
    for(var i = labels.length-1 ; i >= 0 ; i --){
      if(labels[i] == item.name){
        labels.splice(i,1);
      }
    }
    this.setState({labels:labels})
    let labels_str  = this._getArrayStr(labels)
    console.log(labels_str);
    let params = this.props.navigation.state.params;
    params.onChangeLabels&&params.onChangeLabels(labels_str)
  }
  _onDeleteHistory(item:Object){
    let dellable = item.name;
    if(this.state.historysdata.length < 0){
      return;
    }
    let isdel = false;
    let historys = [...this.state.historys];
    for(var i = historys.length-1 ; i >= 0 ; i --){
      if(historys[i] == dellable){
        historys.splice(i,1);
        isdel = true;
      }
    }
    let historysdata = [...this.state.historysdata];
    for(var i = historysdata.length-1 ; i >= 0 ; i --){
      if(historysdata[i].name == dellable){
        historysdata.splice(i,1);
        isdel = true;
      }
    }
    if(isdel){
        this.setState({historys:historys,historysdata:historysdata})
        let historys_str = this._getArrayStr(historys);
        Storage.saveLabelHistory(historys_str);
    }
  }
  _onClearHistory(){
    this.setState({historys:[],historysdata:[]})
    Storage.saveLabelHistory('');
  }
}

const styles = StyleSheet.create({
    addlabelbg:{
      flexDirection:'row',
      borderBottomColor:StyleConfig.C_D4D4D4,
      borderBottomWidth:1,
      height:40,
    },
    addlabel:{
      flex:1,
      padding:10,
      fontSize:18,
    },
    addlabebut:{
      width:40,
      height:40,
      alignItems:'center',
      justifyContent:'center',
    },
    label_clear:{
      alignItems:'center',
      justifyContent:'center',
    },
    tips:{
      padding:10,
      fontSize:16,
      color:StyleConfig.C_232323,
    },
    labels:{
      flexDirection:'row',
      flexWrap:'wrap',
    },
    labelbg:{
      padding:10
    },
    label:{
      fontSize:18,
      paddingLeft:6,
      paddingRight:6,
      paddingTop:2,
      paddingBottom:2,
      color:StyleConfig.C_000000,
      borderColor:StyleConfig.C_000000,
      borderWidth:1,
      borderRadius:4,
    },
    clear:{
        width:14,
        height:14,
        position: 'absolute',
        right:4,
        top:4,
    },
    history:{

    },
    history_bg:{
      flexDirection:'row',
      justifyContent:'space-between',
      padding:10,
      borderBottomWidth:1,
      borderBottomColor:StyleConfig.C_D4D4D4,
    },
    history_title:{
        color:StyleConfig.C_D4D4D4,
        fontSize:20,
    },
    history_clear:{
      color:StyleConfig.C_232323,
      fontSize:20,
    },
});
