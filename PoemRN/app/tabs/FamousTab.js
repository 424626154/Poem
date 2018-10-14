'use strict'
/**
 * 名家
 * @flow
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Text,
    Alert,
} from 'react-native';

import {
  StyleConfig,
  HeaderConfig,
  UIName,
  HttpUtil,
  pstyles,
  MessageDao,
  goPersonalUI,
} from '../AppUtil';
import { Icon } from 'react-native-elements';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import AuthorPage from '../custom/famouspage/AuthorPage';
import DynastyPage from '../custom/famouspage/DynastyPage';
import TopTabBar from '../custom/toptabbar/TopTabBar';
import TabBarIcon from '../custom/TabBarIcon';

import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
type Props = {
      navigation:any,
      papp:Object,
};

type State = {
    son_index:number,
};
class FamousTab extends Component <Props,State>{
  static navigationOptions = ({navigation}) => ({
        // title:'名家',
        // headerTintColor:HeaderConfig.headerTintColor,
        // headerTitleStyle:HeaderConfig.headerTitleStyle,
        // headerStyle:HeaderConfig.headerStyle,
        // headerLeft:null,
        header:null,
        tabBarLabel: '收录',
        tabBarIcon: ({ tintColor, focused }) => (
          <TabBarIcon
            tintColor={tintColor}/>
        //     <View>
        //       <Icon
        //         name='message'
        //         size={26}
        //         type="MaterialIcons"
        //         color={tintColor}
        //       />
        //     </View>
        ),
        tabBarOnPress:(({ navigation, defaultHandler })=>{
            // console.log('-------tabBarOnPress');
            // console.log(previousScene)
            // console.log(scene)
            // console.log('------FamousTab navigation')
            // console.log(navigation)
            //
            // let index = 0;
            // console.log(scene)
            // if(navigation.state.params){
            //   navigation.state.params.onTabBarPress(index);
            // }
            //
            // jumpToIndex(index);
            defaultHandler();
        }),
     });
     _onTabBarPress: Function;
     constructor(props){
       super(props)
       this.state = {
           son_index:0,
       }
       this._onTabBarPress = this._onTabBarPress.bind(this);
     }
     componentDidMount(){
       this.props.navigation.setParams({onTabBarPress:this._onTabBarPress});
       this.props.navigation.setParams({son_index:this.state.son_index});
     }
     componentWillUnmount(){

     }
     shouldComponentUpdate(nextProps, nextState){
       //切换用户id
       return true;
     }
    render(){
      return(
        <View style={styles.container}>
          {this._renderSearch()}
          <ScrollableTabView
            locked={true}
            onChangeTab={(fnc)=>{
              this._onChangeTab(fnc.i);
            }}
            renderTabBar={() => <TopTabBar someProp={'here'} />}>
           <AuthorPage
             ref='AuthorPage'
             tabLabel="作者"
             papp={this.props.papp}
             navigation={this.props.navigation}
           />
           <DynastyPage
             ref='DynastyPage'
             tabLabel="年代"
             papp={this.props.papp}
             navigation={this.props.navigation}
           />
         </ScrollableTabView>
        </View>
      )
    }
    _renderSearch(){
      return(
        <View style={styles.nav}>
          <TouchableOpacity
            style={{flex:1}}
            onPress={()=>{
                this.props.navigation.navigate(UIName.SearchFamousUI)
            }}
          >
          <View style={styles.search}>
            <Icon
              name='search'
              size={26}
              type="MaterialIcons"
              color={StyleConfig.C_D4D4D4}
              />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nav_right}
          onPress={()=>{
            Alert.alert('免责声明',
            '本app所收录的内容，均来源于互联网以及同行业的站点以及网编自愿者所提供，如果您对本app所收录的内容有任何疑问或问题可通过收录报错或意见反馈与本app沟通处理，若侵删。')
          }}
          >
            <Text style={styles.nav_right_font}>声明</Text>
        </TouchableOpacity>
        </View>
      )
    }
    _onTabBarPress(index){
      this._loadSonTab(this.state.son_index);
    }
    _onChangeTab(index){
      if(index == 0 || index == 1){
        this.setState({
          son_index:index,
        });
        this._loadSonTab(index);
      }
    }
    _loadSonTab(index){
      if(index == 0){
        this.refs.AuthorPage&&this.refs.AuthorPage._loadAuthor();
      }else if(index == 1){
        this.refs.DynastyPage&&this.refs.DynastyPage._loadDynasty();
      }
    }
}

const styles = StyleSheet.create({
  nav:{
    flexDirection:'row',
    height:74,
    paddingTop:30,
    borderBottomWidth:1,
    borderBottomColor:StyleConfig.C_D4D4D4,
    paddingLeft:10,
    paddingBottom:10,
  },
  nav_right:{
    width:50,
    alignItems:'center',
    justifyContent:'center',
  },
  nav_right_font:{
      fontSize:18,
      color:StyleConfig.C_333333,
  },
  search:{
    flex:1,
    backgroundColor:StyleConfig.C_EDEDED,
    borderWidth:1,
    borderRadius:6,
    borderColor:StyleConfig.C_EDEDED,
    alignItems:'center',
    justifyContent:'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(FamousTab);
