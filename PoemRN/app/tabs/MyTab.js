// 我的
import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        Image,
        TouchableOpacity,
      } from 'react-native';
import { Icon } from 'react-native-elements';

class MyTab extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title: '我的',
        headerTintColor:'#ffffff',
        headerTitleStyle:{fontSize:20},
        headerStyle:{
          backgroundColor:'#1e8ae8',
        },
     });
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>navigate('LoginUI')}>
          <View style={styles.header}>
            <View style={styles.personal}>
              <Icon
                reverse
                name='person'
                type='MaterialIcons'
                color='#176eb9'
              />
              <View style={styles.head_bg}>
                <Text style={styles.name}>
                  name
                </Text>
              </View>
              <View style={styles.personal_more}>
                <Icon
                  name='chevron-right'
                  size={30}
                  type="MaterialIcons"
                  color={'#ffffff'}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  nav:{
    height:26,
  },
  header:{
    backgroundColor: '#1e8ae8',
  },
  header_title:{
    fontSize:20,
    color:'#ffffff',
    textAlign:'center',
  },
  personal:{
    flexDirection:'row',
    padding:10,
  },
  head_bg:{
    flex:1,
    padding:10,
  },
  head:{

  },
  name:{
    fontSize:20,
    color:'#ffffff',
  },
  personal_more:{
    justifyContent:'center',
  }
});

export {MyTab};
