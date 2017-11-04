'use strict'
/**
 * 消息DAO
 */
import realm from './RealmDB';
import RealmName from './RealmName';
console.log('---realm path---');
console.log(JSON.stringify(realm.path));
class MessageDao{
  addMessages(messages){
    try {
      realm.write(() => {
        for(var i = 0 ; i < messages.length ; i++){
          let temp_msg = messages[i];
          let msg = {
                id: temp_msg.id,
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
          realm.create(RealmName.Message, {id: message.id, state: message.state}, true)
      });
    } catch (e) {
      console.error(e);
    } finally {

    }
  }
  getMessages(){
    let msgs = [];
    try{
      let realmMsg = realm.objects(RealmName.Message);
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

  deleteMessage(id){
      try {
        realm.write(() => {
            let msgToBeDeleted = realm.objectForPrimaryKey(RealmName.Message, id);
            if(msgToBeDeleted){
                realm.delete(msgToBeDeleted);
            }
        });
      } catch (e) {
          console.error(e);
      } finally {

      }
   }

   getUnreadNum(){
     try {
        return realm.objects(RealmName.Message).filtered('state = 0').length;
     } catch (e) {
       console.error(e);
     } finally {

     }
   }
}

export default new MessageDao();
