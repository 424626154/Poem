'use strict'
/**
 * 主页作品DAO
 */
import realm from './RealmDB';
import RealmName from './RealmName';

class HomePoemDao{
  addHomePoems(homepoems){
    try {
      realm.write(() => {
        for(var i = 0 ; i < homepoems.length ; i++){
          let temp_homepoem = homepoems[i];
          let msg = {
                id: temp_homepoem.id,
                title: temp_homepoem.title,
                content: temp_homepoem.content,
                userid:temp_homepoem.userid,
                lovenum:temp_homepoem.lovenum,
                commentnum:temp_homepoem.commentnum,
                mylove:temp_homepoem.mylove,
                // del:temp_homepoem.del,
                time:temp_homepoem.time,
            };
          realm.create(RealmName.HomePoem, msg);
        }
      });
    } catch (e) {
      console.log(e);
    } finally {

    }
  }
  updateHomePoemLove(homepoem){
    try {
      realm.write(()=> {
          realm.create(RealmName.HomePoem, {
            id: homepoem.id,
            lovenum: homepoem.lovenum,
            mylove:homepoem.mylove
          }, true);
      });
    } catch (e) {
      console.error(e);
    } finally {

    }
  }
  getHomePoems(){
    let homepoems = [];
    try{
      let realmHomePoem = realm.objects(RealmName.HomePoem);
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
  deleteMessage(id){
      try {
        realm.write(() => {
            let msgToBeDeleted = realm.objectForPrimaryKey(RealmName.HomePoem, id);
            if(msgToBeDeleted){
                realm.delete(msgToBeDeleted);
            }
        });
      } catch (e) {
          console.error(e);
      } finally {

      }
   }
}

export default new HomePoemDao();
