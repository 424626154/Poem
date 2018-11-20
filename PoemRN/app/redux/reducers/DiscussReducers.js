'use strict';
/**
 * Poem Reducers
 * @flow
 */
import * as TYPES from '../actions/ActionTypes';

const initialState = {
	discuss:[],
	mydisuss:{},
	d_count:0,
};

export default function discuss(state:any=initialState, action:any){
	// console.log('-----discuss')
	// console.log(action.type)
	switch(action.type){
		case TYPES.ADDDISCUSS:
		 return Object.assign({}, state, {
			 discuss:[action.temp].concat(state.discuss),
		 });
		 case TYPES.HEAD_DISCUSS:
				if(action.temps.length >0){
					let temps = action.temps.concat(state.discuss);
					return Object.assign({}, state, {
							 discuss:temps,
							 d_count:action.count,
					 });
				}
			 return state;
			 case TYPES.FOOTER_DISCUSS:
						 if(action.temps.length >0){
							 let forms = state.discuss.concat(action.temps);
							 return Object.assign({}, state, {
										discuss:forms,
										d_count:action.count,
								});
						 }
						return state;
		 case TYPES.UP_DISCUSS:
			 return Object.assign({}, state, {
				discuss:action.temps,
			});
			case TYPES.DLOVEME:
				var discuss = state.discuss;
				var clone1 = false;
				for(var i = 0 ; i < discuss.length ; i ++ ){
					if(discuss[i].id == action.temp.id){
						discuss[i].mylove = action.temp.mylove;
						discuss[i].lovenum = action.temp.lovenum;
						clone1 = true;
					}
				}
				discuss = Object.assign([], discuss);
				var mydisuss = state.mydisuss;
				var clone2 = false;
				if(mydisuss.id == action.temp.id){
					mydisuss.love = action.temp.love;
					clone2 = true;
					mydisuss = Object.assign({}, mydisuss);
				}
				if(clone1&&clone2){
					return Object.assign({}, state, {
						discuss:discuss,
						mydisuss:mydisuss,
					});
				}else if(clone1){
					return Object.assign({}, state, {
						discuss:discuss,
					});
				}else if(clone2){
					return Object.assign({}, state, {
						mydisuss:mydisuss,
					});
				}
				return state;
		case TYPES.SETDISCUSS:
				// console.log('------PoemsReducers')
				// console.log('----action')
				// console.log(action)
				return Object.assign({}, state, {
					mydisuss:action.temp,
				});
		case TYPES.DELDISCUSS:
					var discuss = state.discuss;
					let del1 = false;
					for(var i = discuss.length-1 ; i >= 0 ; i -- ){
			      if(discuss[i].id == action.temp.id){
			        discuss.splice(i,1);
							del1 = true;
			      }
			    }
					if(del1){
						discuss = Object.assign([], discuss);
					}
					if(del1){
						return Object.assign({}, state, {
							discuss:discuss,
						});
					}
					return state;
		case TYPES.UPDCOMMNUM:
				var discuss = state.discuss;
				var updiscuss= false;
				for(var i = 0 ; i < discuss.length ; i ++ ){
					if(discuss[i].id == action.id&&discuss[i].commentnum != action.commentnum){
						discuss[i].commentnum = action.commentnum;
						updiscuss = true;
						console.log('-----change discuss')
					}
				}
				var upmydiscuss = false;
				var mydisuss = state.mydisuss;
				if(mydisuss.id == action.id && mydisuss.commentnum != action.commentnum){
						mydisuss.commentnum = action.commentnum;
						upmydiscuss = true;
				}
				if(updiscuss&&upmydiscuss){
					discuss = Object.assign([], discuss);
					mydisuss = Object.assign({}, mydisuss);
					return Object.assign({}, state, {
						discuss:discuss,
						mydisuss:mydisuss,
					});
				}else if(updiscuss){
					discuss = Object.assign([], discuss);
					return Object.assign({}, state, {
						discuss:discuss,
					});
				}else if(upmydiscuss){
					mydisuss = Object.assign({}, mydisuss);
					return Object.assign({}, state, {
						mydisuss:mydisuss,
					});
				}
				return state;
		case TYPES.UPDSTAR:
				var mydisuss = state.mydisuss
				if(mydisuss.id == action.sid){
					mydisuss.star = action.star;
					mydisuss = Object.assign({}, mydisuss);
					return Object.assign({}, state, {
						mydisuss:mydisuss,
					});
				}
				return state;
     default:
 			return state;
 	}
 }
