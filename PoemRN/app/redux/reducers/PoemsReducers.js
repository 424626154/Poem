'use strict';
import * as TYPES from '../actions/ActionTypes';

const initialState = {
	homepoems:[],
	mypoems:[],
	mypoem:{},
};

export default function poems(state=initialState, action){
	switch(action.type){
    case TYPES.UP_HOME_POEMS:
      // console.log('------PoemsReducers')
      // console.log('----action')
      // console.log(action)
      return Object.assign({}, state, {
       homepoems:action.homepoems,
     });
		 case TYPES.UP_MY_POEMS:
       // console.log('------PoemsReducers')
       // console.log('----action')
       // console.log(action)
       return Object.assign({}, state, {
        mypoems:action.mypoems,
      });
		 case TYPES.ADDPOEM:
       // console.log('------PoemsReducers')
       // console.log('----action')
       // console.log(action)
      return Object.assign({}, state, {
        homepoems:[action.poem].concat(state.homepoems),
				mypoems:[action.poem].concat(state.mypoems),
      });
		case TYPES.UP_POEM_INFO:
			// console.log('------PoemsReducers')
			// console.log('----action')
			// console.log(action)
			var temp_poem = {
				title:action.poem.title,
				content:action.poem.content,
			}
			var homepoems = state.homepoems;
			var clone1 = false;
			for(var i = 0 ; i < homepoems.length ; i ++ ){
				if(homepoems[i].id == action.poem.id){
					homepoems[i].title = temp_poem.title;
					homepoems[i].content = temp_poem.content;
					clone1 = true;
				}
			}
			if(clone1){
				homepoems = Object.assign([], homepoems);
			}
			var mypoems = state.mypoems;
			let clone2 = false;
			for(var i = 0 ; i < mypoems.length ; i ++ ){
				if(mypoems[i].id == action.poem.id){
					mypoems[i].title = temp_poem.title;
					mypoems[i].content = temp_poem.content;
					clone2 = true;
				}
			}
			if(clone2){
				mypoems = Object.assign([], mypoems);
			}
			var mypoem = state.mypoem;
			let clone3 = false;
			if(mypoem.id == action.poem.id){
				mypoem = Object.assign({},mypoem,temp_poem);
				clone3 = true;
			}
			if(clone1||clone2||clone3){
				return Object.assign({}, state, {
					homepoems:homepoems,
					mypoems:mypoems,
					mypoem:mypoem,
				});
			}
			return state;
	case TYPES.SETPOEM:
			// console.log('------PoemsReducers')
			// console.log('----action')
			// console.log(action)
			return Object.assign({}, state, {
				mypoem:action.poem,
			});
		case TYPES.LOVEME:
			// console.log('------PoemsReducers')
			// console.log('----action')
			// console.log(action)
			var homepoems = state.homepoems;
			var clone1 = false;
			for(var i = 0 ; i < homepoems.length ; i ++ ){
				if(homepoems[i].id == action.poem.id){
					homepoems[i].mylove = action.poem.mylove;
					clone1 = true;
				}
			}
			if(clone1){
				homepoems = Object.assign([], homepoems);
				return Object.assign({}, state, {
					homepoems:homepoems,
				});
			}
			return state;
		case TYPES.UP_POEM_LC:
			// console.log('------PoemsReducers')
			// console.log('----action')
			// console.log(action)
			var homepoems = state.homepoems;
			var clone1 = false;
			for(var i = 0 ; i < homepoems.length ; i ++ ){
				if(homepoems[i].id == action.poem.id
				&&(homepoems[i].lovenum != action.poem.lovenum
				||homepoems[i].commentnum != action.poem.commentnum)){
					homepoems[i].lovenum = action.poem.lovenum;
					homepoems[i].commentnum = action.poem.commentnum;
					clone1 = true;
				}
			}
			if(clone1){
				homepoems = Object.assign([], homepoems);
				return Object.assign({}, state, {
					homepoems:homepoems,
				});
			}
			return state;
	case TYPES.DELPOEM:
				// console.log('------PoemsReducers')
				// console.log('----action')
				// console.log(action)
				var homepoems = state.homepoems;
				let del1 = false;
				for(var i = homepoems.length-1 ; i >= 0 ; i -- ){
		      if(homepoems[i].id == action.poem.id){
		        homepoems.splice(i,1);
						del1 = true;
		      }
		    }
				if(del1){
					homepoems = Object.assign([], homepoems);
				}
				var mypoems = state.mypoems;
				let del2 = false;
				for(var i = mypoems.length-1 ; i >= 0 ; i -- ){
		      if(mypoems[i].id == action.poem.id){
		        mypoems.splice(i,1);
						del2 = true;
		      }
		    }
				if(del2){
					mypoems = Object.assign([], mypoems);
				}

				if(del1||del2){
					console.log('---del poem')
					return Object.assign({}, state, {
						homepoems:homepoems,
						mypoems:mypoems,
					});
				}
				return state;
		default:
			return state;
	}
}
