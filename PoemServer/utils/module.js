/**
 * 模块定义类
 */

var LoveExtend = function(title,userid,head,pseudonym,pid){
	this.title = title||'';
	this.userid = userid||'';
	this.head = head||'';
	this.pseudonym = pseudonym||'';
	this.pid = pid||'';
}
var CommentExtend = function(title,userid,head,pseudonym,pid,cid,comment){
	this.title = title||'';
	this.userid = userid||'';
	this.head = head||'';
	this.pseudonym = pseudonym||'';
	this.pid = pid||'';
	this.cid = cid||'';
	this.comment = comment||'';
}
var FollowExtend = function(userid,head,pseudonym){
	this.userid = userid||'';
	this.head = head||'';
	this.pseudonym = pseudonym||'';
}

var Message = function(type,userid,title,content,extend){
	this.type = type||0;
	this.userid = userid||'';
	this.title = title||'';
	this.content = content||'';
	this.extend = extend||{};
}

var MessageType = function(){

}
MessageType.SYS_MSG = 0;//系统消息
MessageType.LOVE_MSG = 1;//点赞
MessageType.COMMENT_MSG = 2;//评论
MessageType.FOLLOW_MSG = 3;//关注


var PushType = function(){

}
PushType.NEWS = 'news';
PushType.CHAT = 'chat';

module.exports = {
	LoveExtend,
	CommentExtend,
	FollowExtend,
	Message,
	MessageType,
	PushType,
};