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

var Message = function(type,userid,title,content,extend){
	this.type = type||'';
	this.userid = userid||'';
	this.title = title||'';
	this.content = content||'';
	this.extend = extend||'';
}

var MessageType = function(){

}
MessageType.SYS_MSG = 0;
MessageType.LOVE_MSG = 1;
MessageType.COMMENT_MSG = 2;

module.exports = {
	LoveExtend,
	CommentExtend,
	Message,
	MessageType,
};