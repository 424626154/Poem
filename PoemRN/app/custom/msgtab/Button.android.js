'use strict'
/**
 * 消息tab android按钮
 */
const React = require('react');
const ReactNative = require('react-native');
const {
  TouchableNativeFeedback,
  View,
} = ReactNative;

const Button = (props) => {
  return <TouchableNativeFeedback
    delayPressIn={0}
    background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
    {...props}
  >
    {props.children}
  </TouchableNativeFeedback>;
};

module.exports = Button;
