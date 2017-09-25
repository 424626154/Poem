const Global = {
    user:{
      userid:'',
      head:'',
      pseudonym:'',
    }
};

Global.loadUser = function(fuser,tuser){
  Global.user.head = fuser.head;
  Global.user.pseudonym = fuser.pseudonym;
}

export default Global;
