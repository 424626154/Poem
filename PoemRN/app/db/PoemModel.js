import React, { Component } from 'react';

export default class Poem extends Component {

  render(){
    return null;
  }

  setId(id){
    this.id = id;
  }

  getId(id){
    return this.id;
  }

  setAuthor(author){
    this.author = author;
  }

  getAuthor(author){
    return this.author;
  }

  setPoem(poem){
    this.poem = poem;
  }

  getPoem(poem){
    return this.poem;
  }
  setTime(time){
    this.time = time;
  }
  getTime(time){
    return this.time;
  }
};
