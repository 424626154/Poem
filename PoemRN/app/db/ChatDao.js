'use strict'
/**
 * 私信dao
 */
 import realm from './RealmDB';
 import RealmName from './RealmName';
 import uuid from 'uuid';
 import {
   Global
 } from '../AppUtil';

 class ChatDao {
   isAccount(){
     // console.log('------ChatDao() Global.userid:',Global.userid)
     return Global.userid||'';
   }
   /**
    * 添加私信
     * @param {Object} chat  私信对象
    * @param {int} style 布局样式 0 左 1右
    */
   addChat(temp_chat,style,send){
     let chat = {
           rid:uuid.v1(),
           account:this.isAccount(),
           chatuid:temp_chat.tuserid,
           type:temp_chat.type,
           fuserid:temp_chat.fuserid,
           tuserid:temp_chat.tuserid,
           msg:temp_chat.msg,
           style:style,
           send:send,
           read:1,
           time:temp_chat.time,
       };
     try {
       realm.write(() => {
         realm.create(RealmName.Chat, chat);
       });
     } catch (e) {
       console.log(e);
     } finally {
       return chat;
     }
   }
   /**
    * 添加私信 复数
     * @param {Object} chats  私信对象 数组
    * @param {int} style 布局样式 0 左 1右
    */
   addChats(chats,style){
     let temp_chats = [];
     try {
       realm.write(() => {
         for(var i = 0 ; i < chats.length ; i++){
           let temp_chat= chats[i];
           let msg = {
                 rid:uuid.v1(),
                 id: temp_chat.id,
                 account:this.isAccount(),
                 chatuid:temp_chat.fuserid,
                 type:temp_chat.type,
                 fuserid:temp_chat.fuserid,
                 tuserid:temp_chat.tuserid,
                 msg:temp_chat.msg,
                 extend:temp_chat.extend,
                 style:style,
                 read:temp_chat.read||0,
                 time:temp_chat.time,
             };
           realm.create(RealmName.Chat, msg);
           temp_chats[i] = msg;
         }
       });
     } catch (e) {
       console.log(e);
     } finally {
        return temp_chats;
     }
   }
   /**
    * 查询私信
    * @param  {string} chatuid 对方账号 userid
    * @return {Objects} chats
    */
   queryChats(chatuid){
     let chats = [];
     try{
       let filtered = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
      //  console.log('---filtered:'+filtered);
       let realmChat = realm.objects(RealmName.Chat).filtered(filtered).slice();
       console.log('-----ChatDao() queryChats')
       console.log(realmChat)
       realmChat.sort((a, b) => {
         return a.time < b.time;
       });
       realmChat.map(function(realmChat) {
           if (typeof realmChat.snapshot == 'function') {
               realmChat = realmChat.snapshot();
           }
           let chat = Object.assign({}, realmChat);
           chats.push(chat);
       });
     }catch(e){
       console.error(e);
     }
     console.log(chats)
     return chats;
   }
   /**
    * 查询未读
    */
    queryUnreadChats(chatuid){
      let chats = [];
      try{
        let filtered = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'" AND read = 0';
       //  console.log('---filtered:'+filtered);
        let realmChat = realm.objects(RealmName.Chat).filtered(filtered).slice();
        realmChat.sort((a, b) => {
          return a.time < b.time;
        });
        realmChat.map(function(realmChat) {
            if (typeof realmChat.snapshot == 'function') {
                realmChat = realmChat.snapshot();
            }
            let chat = Object.assign({}, realmChat);
            chats.push(chat);
        });
      }catch(e){
        console.error(e);
      }
      return chats;
    }
   /**
    * 更新发送状态
    */
   updateChatSend(rid,id,extend,send){
     try {
       realm.write(()=> {
           realm.create(RealmName.Chat, {
             rid: rid,
             id:id,
             extend:extend,
             send: send,
           }, true);
       });
     } catch (e) {
       console.error(e);
     } finally {

     }
   }
   setChatRead(rids,read){
     try {
       realm.write(()=> {
         for(var i = 0 ;i < rids.length;i ++){
           let rid = rids[i];
           realm.create(RealmName.Chat, {
             rid: rid,
             read:read,
           }, true);
         }
       });
     } catch (e) {
       console.error(e);
     } finally {

     }
   }
   getUnreadNum(chauid){
     let num  = 0;
      try {
        realm.write(()=>{
          let filtered = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'" AND read = 0';
          num = realm.objects(RealmName.Chat).filtered(filtered).length;
        })
      } catch (e) {
        console.error(e);
      } finally {
        return num;
      }
   }
   getAllUnreadNum(){
     let num  = 0;
      try {
        realm.write(()=>{
          let filtered = 'account = "'+this.isAccount()+'" AND read = 0';
          num = realm.objects(RealmName.Chat).filtered(filtered).length;
        })
      } catch (e) {
        console.error(e);
      } finally {
        return num;
      }
   }
   /**
    * 删除私信
    */
   deletaFUidChat(chatuid){
     try {
       realm.write(() => {
           let filtered = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
           let chats = realm.objects(RealmName.Chat).filtered(filtered);
            realm.delete(chats);
       });
     } catch (e) {
         console.error(e);
     } finally {

     }
   }
   deleteChat(rid){
     try {
       realm.write(() => {
           console.log('------ ChatDao() deleteChat')
           let filtered = 'account = "'+this.isAccount()+'" AND rid = "'+rid+'"';
           let chats = realm.objects(RealmName.Chat).filtered(filtered);
           let chatuid = '';
           if(chats.length > 0 ){
             chatuid = chats.slice(0,1)[0].chatuid;
             console.log(chats.slice(0,1)[0].chatuid)
           }
           realm.delete(chats);
           if(chatuid){
             let filtered1 = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
             let chats1 = realm.objects(RealmName.Chat).filtered(filtered1).slice();
             if(chats1.length > 0){
               console.log('------- up chatlist')
               // console.log(chats1);
               // console.log(chats1.length)
               chats1.sort((a, b) => {
                 return a.time < b.time;
               });
               // console.log(chats1.slice(-1));
               let lastchat = chats1.slice(0,1)[0];
               console.log(lastchat);
               let msg = lastchat.msg;
               let chatlist_rid = '';
               let filtered2 = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
               let chatlist = realm.objects(RealmName.ChatList).filtered(filtered2);
               if(chatlist.length > 0){
                 chatlist_rid = chatlist.slice(0,1)[0].rid
               }
               console.log(chatlist_rid)
               if(chatlist_rid&&msg){
                 realm.create(RealmName.ChatList, {rid:chatlist_rid,msg:msg},true);
               }
             }else{
               console.log('------- delete chatlist')
               let filtered3 = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
               let chats = realm.objects(RealmName.ChatList).filtered(filtered3);
                realm.delete(chats);
             }
           }

            // let filtered1 = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'" AND read = 0';
            // let num = realm.objects(RealmName.Chat).filtered(filtered1).length;
            //
       });
     } catch (e) {
         console.error(e);
     } finally {

     }
   }
   deleteAllChat(){
     try {
       realm.write(() => {
          let all = realm.objects(RealmName.Chat);
          realm.delete(all);
       });
     } catch (e) {
         console.error(e);
     } finally {

     }
   }
   /**
    * 添加私信列表组
    */
   addChatLists(chats){
     console.log('---addChatLists---')
     console.log(chats)
     let temp_chats = [];
     try {
       realm.write(() => {
         for(var i = 0 ; i < chats.length ; i++){
           let temp_chat= chats[i];
           let chatuid = temp_chat.fuserid;
           let rid = uuid.v1();
           let filtered = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
          //  console.log(filtered);
           let chatlist = realm.objects(RealmName.ChatList).filtered(filtered);
           if(chatlist.length > 0){
             rid = this.realmsToObjs(chatlist)[0].rid
           }
           let filtered1 = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'" AND read = 0';
           let num = realm.objects(RealmName.Chat).filtered(filtered1).length;
           console.log(chatlist);
           console.log(num);
           let msg = {
                 rid:rid,
                 id: temp_chat.id,
                 account:this.isAccount(),
                 chatuid:chatuid,
                 fuserid:temp_chat.fuserid,
                 tuserid:temp_chat.tuserid,
                 head:temp_chat.head,
                 pseudonym:temp_chat.pseudonym,
                 msg:temp_chat.msg,
                 extend:temp_chat.extend,
                 num:num,
                 time:temp_chat.time,
             };
             console.log(msg)
            if(chatlist.length > 0){
              console.log('-------存在更新')
              realm.create(RealmName.ChatList, msg,true);
            }else{
              console.log('-------不存在创建')
              realm.create(RealmName.ChatList, msg);
            }
           temp_chats[i] = msg;
         }
       });
     } catch (e) {
       console.log(e);
     } finally {
        return temp_chats;
     }
   }
   /**
    * 用户添加列表
    */
   addChatList(temp_chat){
     try {
       realm.write(() => {
           let chatuid = temp_chat.tuserid;
           let rid = uuid.v1();
           let num = 0;
           let filtered = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
           console.log(filtered);
           let chatlists = realm.objects(RealmName.ChatList).filtered(filtered);
           if(chatlists.length > 0){
             rid = this.realmsToObjs(chatlists)[0].rid;
             num = this.realmsToObjs(chatlists)[0].num;
           }
           console.log(chatlists);
           let msg = {
                 rid:rid,
                 id: temp_chat.id||0,
                 account:this.isAccount(),
                 chatuid:chatuid,
                 fuserid:temp_chat.fuserid,
                 tuserid:temp_chat.tuserid,
                 head:temp_chat.head,
                 pseudonym:temp_chat.pseudonym,
                 msg:temp_chat.msg,
                 extend:temp_chat.extend||'',
                 num:num,
                 time:temp_chat.time,
             };
             console.log(msg)
            if(chatlists.length > 0){
              console.log('-------存在更新')
              realm.create(RealmName.ChatList, msg,true);
            }else{
              console.log('-------不存在创建')
              realm.create(RealmName.ChatList, msg);
            }
       });
     } catch (e) {
       console.log(e);
     } finally {

     }
   }
   /**
    * 查询私信列表
    */
   queryChatLists(){
     let chats = [];
     try{
       let filtered = 'account = "'+this.isAccount()+'"';
      //  console.log('---filtered:'+filtered);
       let realmChat = realm.objects(RealmName.ChatList).filtered(filtered).slice();
       realmChat.sort((a, b) => {
         return a.time < b.time;
       });
       realmChat.map(function(realmChat) {
           if (typeof realmChat.snapshot == 'function') {
               realmChat = realmChat.snapshot();
           }
           let chat = Object.assign({}, realmChat);
           chats.push(chat);
       });
     }catch(e){
       console.error(e);
     }
     console.log('---queryChatLists---')
     console.log(chats)
     return chats;
   }
   /**
    * 删除私信列表
    */
   deletaFUidChatList(chatuid){
     try {
       realm.write(() => {
           let filtered = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
           let chats = realm.objects(RealmName.ChatList).filtered(filtered);
            realm.delete(chats);
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
   updateChatListNum(chatuid){
     console.log('---updateChatListNum---')
     let lastnum = 0;
     try {
        realm.write(()=>{
          let filtered = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'" AND read = 0';
          console.log(filtered)
          let num = realm.objects(RealmName.Chat).filtered(filtered).length;
          let filtered1 = 'account = "'+this.isAccount()+'" AND chatuid = "'+chatuid+'"';
          let chalists = realm.objects(RealmName.ChatList).filtered(filtered1).slice();
          let rid = '';
          if(chalists.length > 0){
            rid = chalists[0].rid;
          }
          if(rid){
            realm.create(RealmName.ChatList, {
              rid: rid,
              num:num,
            }, true);
          }
          lastnum = num;
        });
     } catch (e) {
       console.error(e)
     } finally {
       return lastnum;
     }
   }

   deleteAllChatList(){
     try {
       realm.write(() => {
          let all = realm.objects(RealmName.ChatList);
          realm.delete(all);
       });
     } catch (e) {
         console.error(e);
     } finally {

     }
   }
 }

 export default new ChatDao();
