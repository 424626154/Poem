import React, { Component } from 'react';

export default class Poem extends Component {

  render(){
    return null;
  }
  loadPoem(poem){
    this.id = poem.id;
    this.userid = poem.userid;
    this.poem = poem.poem;
    this.time = poem.time;
  }
  loadAllPoem(poem){
    this.id = poem.id;
    this.userid = poem.userid;
    this.poem = poem.poem;
    this.time = poem.time;
    this.livenum = livenum;
  }
  setId(id){
    this.id = id;
  }

  getId(id){
    return this.id;
  }
  setUserId(userid){
    this.userid = userid;
  }
  getUserId(userid){
    return this.userid;
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
  setLivenum(livenum){
    this.livenum = livenum;
  }
  getLivenum(livenum){
    return this.livenum;
  }
  setCommentnum(commentnum){
    this.commentnum =commentnum;
  }
  getCommentnum(commentnum){
    return this.commentnum;
  }

};
