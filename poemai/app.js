var nodejieba = require("nodejieba");
var natural = require('natural');
var oplabelDao = require('./dao/oplabelDao');
var opoemDao = require('./dao/opoemDao');
var utils = require('./utils/utils');

// var classifier = new natural.BayesClassifier();

// classifier.addDocument(nodejieba.cut("红掌拨清波"), 'poem');

// classifier.train();

// console.log(classifier.classify(nodejieba.cut('红掌拨清波')));

// function randomPoems(callback){
// 	oplabelDao.queryAuthors(function(err,result){
// 		if(err){
// 			// console.error(err)
// 			callback(err,null)
// 		}else{
// 			// console.log(result)
// 			if(result.length>0){
// 				var index = utils.randomFrom(0,result.length);
// 				var rid = result[index].id;
// 				var author = result[index].author;
// 				console.log(author);
// 				opoemDao.querySearchOPoem(author,function(err,result){
// 					// if(err){
// 					// 	console.error(err)
// 					// }else{
// 					// 	console.log(result);
// 					// }
// 					callback(err,result)
// 				});
// 			}
// 		}
// 	})
// }

// function addPoems(poems){
// 	if(poems.length > 0){
// 		for(var i = 0 ; i < poems.length ; i ++){
// 			classifier.addDocument(nodejieba.cut(poems[i].content), 'poem');
// 		}
// 	}
// 	classifier.train();
// }

// randomPoems(function(err,result){
// 	if(err){
// 		console.error(err)
// 	}else{
// 		if(result.length > 0){
// 			addPoems(result)
// 			var index = utils.randomFrom(0,result.length);
// 			var content = result[index].content;
// 			// console.log(content)
// 			// console.log(classifier.classify(nodejieba.cut(content)));
// 			console.log(classifier.classify(nodejieba.cut('你好')));
// 		}
// 	}
// })

var NGramsZH = natural.NGramsZH;
console.log(NGramsZH.bigrams('中文测试'));
console.log(NGramsZH.bigrams(['中',  '文',  '测', '试']));
console.log(NGramsZH.trigrams('中文测试'));
console.log(NGramsZH.trigrams(['中',  '文', '测',  '试']));
console.log(NGramsZH.ngrams('一个中文测试', 4));
console.log(NGramsZH.ngrams(['一', '个', '中', '文', '测',
    '试'], 4));

