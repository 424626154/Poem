/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {App} from './app/App'

export default class PoemRN extends Component {
  render() {
    return (
      <App uriPrefix={'poem://'}/>
    );
  }
}

AppRegistry.registerComponent('PoemRN', () => PoemRN);
