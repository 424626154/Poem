'use strict'
/**
 * 主页作品DAO
 */
import realm from './RealmDB';
import RealmName from './RealmName';
import uuid from 'uuid';
import {
  Global
} from '../AppUtil';
class HomePoemDao{
  isAccount(){
    return Global.userid||'';
  }
  addHomePoems(homepoems){
    let temp_chats = [];
    try {
      realm.write(() => {
        for(var i = 0 ; i < homepoems.length ; i++){
          let temp_homepoem = homepoems[i];
          let msg = {
                rid:uuid.v1(),
                id: temp_homepoem.id,
                account:this.isAccount(),
                userid:temp_homepoem.userid,
                head:temp_homepoem.head,
                pseudonym:temp_homepoem.pseudonym,
                title: temp_homepoem.title,
                content: temp_homepoem.content,
                lovenum:temp_homepoem.lovenum,
                commentnum:temp_homepoem.commentnum,
                mylove:temp_homepoem.mylove,
                // del:temp_homepoem.del,
                time:temp_homepoem.time,
            };
          realm.create(RealmName.HomePoem, msg);
          temp_chats[i] = msg;
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      return temp_chats;
    }
  }
  updateHomePoemLove(poem){
    console.log(poem);
    try {
      realm.write(()=> {
          let rid = '';
          let filtered = 'account = "'+this.isAccount()+'" AND id = "'+poem.id+'"';
          let homepoems = realm.objects(RealmName.HomePoem).filtered(filtered);
          if(homepoems.length > 0){
            rid = this.realmsToObjs(homepoems)[0].rid
          }
          console.log('---rid:',rid);
          if(rid){
            realm.create(RealmName.HomePoem, {
              rid: rid,
              lovenum: poem.lovenum,
              mylove:poem.mylove
            }, true);
          }
      });
    } catch (e) {
      console.error(e);
    } finally {

    }
  }
  getHomePoems(){
    let homepoems = [];
    try{
      let realmHomePoem = realm.objects(RealmName.HomePoem).filtered('account = "'+this.isAccount()+'"');
      // .sorted('id');
      realmHomePoem.map(function(realmHomePoem) {
          if (typeof realmHomePoem.snapshot == 'function') {
              realmHomePoem = realmHomePoem.snapshot();
          }
          let homepoem = Object.assign({}, realmHomePoem);
          homepoems.push(homepoem);
      });
    }catch(e){
      console.error(e);
    }
    return homepoems;
  }
  deleteMessage(rid){
      try {
        realm.write(() => {
            // let msgToBeDeleted = realm.objectForPrimaryKey(RealmName.HomePoem, id);
            // if(msgToBeDeleted){
            //     realm.delete(msgToBeDeleted);
            // }
            let del = realm.create(RealmName.HomePoem, {rid: rid});
            realm.delete(del);
        });
      } catch (e) {
          console.error(e);
      } finally {

      }
   }

   deleteHomePoems(){
     try {
       realm.write(() => {
          let filtered = 'account = "'+this.isAccount()+'"' ;
          // console.log('--- HomePoemDao() deleteHomePoems filtered:'+filtered)
          let all = realm.objects(RealmName.HomePoem).filtered(filtered);
          realm.delete(all);
       });
     } catch (e) {
         console.error(e);
     } finally {

     }
   }
   deleteAll(){
     try {
       realm.write(() => {
          let all = realm.objects(RealmName.HomePoem);
          realm.delete(all);
       });
     } catch (e) {
         console.error(e);
     } finally {

     }
   }

   realmsToObjs(realms){
     let objs = [];
     realms.map(function(realms) {
         if (typeof realms.snapshot == 'function') {
             realms = realms.snapshot();
         }
         let obj = Object.assign({}, realms);
         objs.push(obj);
     });
     return objs;
   }
}

export default new HomePoemDao();
