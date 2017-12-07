'use strict'
/**
 * action types
 * @flow
 */
export const MSGREAD = 'msgread';//读消息
export const AUTO_LOGIN = 'auto_login';
export const UP_USER_INFO = 'up_user_info';//更新用户信息
export const LOGOUT = 'logout';//退出登录
export const LOGIN = 'login';//登录
export const PUSHID = 'pushid';//推送id
export const PERMISSION = 'permission';//修改权限

export const UP_HOME_POEMS = 'up_home_poems';
export const HEAD_HOME_POEMS = 'head_home_poems';
export const FOOTER_HOME_POEMS = 'footer_home_poems';
export const UP_MY_POEMS = 'up_my_poems';
export const UP_POEM_INFO = 'up_poem_info';
export const ADDPOEM = 'addpoem';
export const SETPOEM = 'setpoem';
export const LOVEME = 'loveme';//给自己点赞
// export const REFCOMMENT = 'refcomment';//刷新评论
export const UP_POEM_LC = 'up_poem_lc';//刷新评论点赞数
export const DELPOEM = 'delpoem';
export const UPFONT = 'upfont';//修改字体

export const UPCOMMNUM = 'upcommnum';//修正评论数

export const SET_PUSH_NEWS = 'set_push_news';
export const SET_PUSH_CHAT = 'set_push_chat';
export const SET_CHAT_USER = 'set_chat_user';
export const SET_PUSH_CHAT_USER = 'set_push_chat_user';
