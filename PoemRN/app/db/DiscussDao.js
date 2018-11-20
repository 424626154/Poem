'use strict'
/**
 * 主页作品DAO
 * @flow
 */
import realm from './RealmDB';
import RealmName from './RealmName';
import uuid from 'uuid';
import {
  Global
} from '../AppUtil';
class DiscussDao{
  isAccount(){
    return Global.userid||'';
  }
  addDiscuss(forms:Array<Object>){
    let temp_chats = [];
    try {
      realm.write(() => {
        for(var i = 0 ; i < forms.length ; i++){
          let temp_form = forms[i];
          let msg = {
                rid:uuid.v1(),
                id: temp_form.id,
                account:this.isAccount(),
                userid:temp_form.userid,
                head:temp_form.head||'',
                nickname:temp_form.nickname||'',
                title: temp_form.title,
                content:temp_form.content,
                extend:temp_form.extend,
                lovenum:temp_form.lovenum,
                commentnum:temp_form.commentnum,
                mylove:temp_form.mylove,
                // del:temp_homepoem.del,
                time:temp_form.time,
            };
          realm.create(RealmName.Discuss, msg);
          temp_chats[i] = msg;
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      return temp_chats;
    }
  }
  updateDiscussLove(item:Object){
    console.log(item);
    try {
      realm.write(()=> {
          let rid = '';
          let filtered = 'account = "'+this.isAccount()+'" AND id = "'+item.id+'"';
          let forms = realm.objects(RealmName.Discuss).filtered(filtered);
          if(forms.length > 0){
            rid = this.realmsToObjs(forms)[0].rid
          }
          console.log('---rid:',rid);
          if(rid){
            realm.create(RealmName.Discuss, {
              rid: rid,
              lovenum: item.lovenum,
              mylove:item.mylove
            }, true);
          }
      });
    } catch (e) {
      console.error(e);
    } finally {

    }
  }
  getDiscuss(){
    let forms = [];
    try{
      let realmForms= realm.objects(RealmName.Discuss).filtered('account = "'+this.isAccount()+'"');
      // .sorted('id');
      realmForms.map(function(realmForm) {
          if (typeof realmForm.snapshot == 'function') {
              realmForm = realmForm.snapshot();
          }
          let form = Object.assign({}, realmForm);
          forms.push(form);
      });
    }catch(e){
      console.error(e);
    }
    return forms;
  }
  deleteOneDiscuss(rid:string){
      try {
        realm.write(() => {
            // let msgToBeDeleted = realm.objectForPrimaryKey(RealmName.HomePoem, id);
            // if(msgToBeDeleted){
            //     realm.delete(msgToBeDeleted);
            // }
            let del = realm.create(RealmName.Discuss, {rid: rid});
            realm.delete(del);
        });
      } catch (e) {
          console.error(e);
      } finally {

      }
   }

   deleteDiscuss(){
     try {
       realm.write(() => {
          let filtered = 'account = "'+this.isAccount()+'"' ;
          // console.log('--- HomePoemDao() deleteHomePoems filtered:'+filtered)
          let all = realm.objects(RealmName.Discuss).filtered(filtered);
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
          let all = realm.objects(RealmName.Discuss);
          realm.delete(all);
       });
     } catch (e) {
         console.error(e);
     } finally {

     }
   }

   realmsToObjs(realms:Array<Object>){
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

export default new DiscussDao();
