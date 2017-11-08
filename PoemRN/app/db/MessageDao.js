'use strict'
/**
 * 消息DAO
 */
import realm from './RealmDB';
import RealmName from './RealmName';
import uuid from 'uuid';
import {
  Global,
} from '../AppUtil';

console.log('---realm path---');
console.log(JSON.stringify(realm.path));
class MessageDao{
  isAccount(){
    return Global.user.userid||'';
  }
  addMessages(messages){
    try {
      realm.write(() => {
        for(var i = 0 ; i < messages.length ; i++){
          let temp_msg = messages[i];
          let msg = {
                rid:uuid.v1(),
                id: temp_msg.id,
                account:this.isAccount(),
                title: temp_msg.title,
                content: temp_msg.content,
                type:temp_msg.type,
                extend:temp_msg.extend,
                state:temp_msg.state,
                userid:temp_msg.userid,
                time:temp_msg.time,
            };
          realm.create(RealmName.Message, msg);
        }
      });
    } catch (e) {
      console.log(e);
    } finally {

    }
  }
  updateMessageState(message){
    try {
      realm.write(()=> {
          realm.create(RealmName.Message, {rid: message.rid,state: message.state}, true)
      });
    } catch (e) {
      console.error(e);
    } finally {

    }
  }
  getMessages(){
    let msgs = [];
    try{
      let realmMsg = realm.objects(RealmName.Message).filtered('account = "'+this.isAccount()+'"');
      realmMsg.map(function(realmMsg) {
          if (typeof realmMsg.snapshot == 'function') {
              realmMsg = realmMsg.snapshot();
          }
          let msg = Object.assign({}, realmMsg);
          msgs.push(msg);
      });
    }catch(e){
      console.error(e);
    }
    return msgs;
  }

  deleteMessage(rid){
      try {
        realm.write(() => {
            // let msgToBeDeleted = realm.objectForPrimaryKey(RealmName.Message, id);
            // if(msgToBeDeleted){
            //     realm.delete(msgToBeDeleted);
            // }
            let del = realm.create(RealmName.Message, {rid: rid});
            realm.delete(del);
        });
      } catch (e) {
          console.error(e);
      } finally {

      }
   }

   getUnreadNum(){
     try {
        return realm.objects(RealmName.Message).filtered('state = 0 AND account = "'+this.isAccount()+'"').length;
     } catch (e) {
       console.error(e);
     } finally {

     }
   }

   deleteAll(){
     try {
       realm.write(() => {
          let all = realm.objects(RealmName.Message);
          realm.delete(all);
       });
     } catch (e) {
         console.error(e);
     } finally {

     }
   }
}

export default new MessageDao();
