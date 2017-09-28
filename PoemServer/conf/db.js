// conf/db.js
// MySQL数据库联接配置
module.exports = {
    mysql: {
        host: '127.0.0.1', 
        user: 'root',
        password: '890503',
        database:'poem',
        port: 3306,
        multipleStatements:true,
    },
    tables:{
    	USER_TABLE:'users',
    	POEM_TABLE:'poem',
    	LOVE_TABLE:'love',
    	COMMENT_TABLE:'comment',
    	FOLLOW_TABLE:'follow',
    }
};