import React from 'react';
class BaseUI extends React.Component{
    constructor(props) {
      super(props);
      console.log('------BaseUI() constructor')
      let papp = this.props.papp;
      console.log(papp);
    }
}
export default BaseUI;
