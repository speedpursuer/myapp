var express = require('express');
var path = require('path');
var request = require('request');
var router = express.Router();

// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
// router.use(function(req, res, next) {
//     console.log('Time:', Date.now());
//     next();
// });

/* GET home page. */
router.get('/:id', function(req, res, next) {
    console.log("id = " + req.params.id);
    var serverURL = 'http://121.40.197.226:8000/eservice/';
    // var docID = 'article_14a8f67e7501408d9dbbd90483c34d16_2017-05-02-15:24:39';
    var docID = req.params.id;
    var uri = serverURL + docID;
    var auth = {
        'user': 'eservice_user',
        'pass': 'xiaodianzhang123'
    };

    request({
            method: 'GET',
            uri: uri,
            auth: auth
        },
        function(error, response, body) {

            if (error) {
                next(error);                
            }

            // console.log("Body = " + body);

            var doc = JSON.parse(body);

            if(doc.error) {
                // res.send('此页面不存在');
                res.render('error', {
                    message: 'Page Not Found',
                    error: {}
                });
                return;
            }

            // console.log(doc);

            // var newList = [];

            // var limit = doc.entryList.length;

            // for(i in doc.entryList) {
            // for(var i=0; i<limit; i++) {
            //     var newItem = {
            //         "url": "http://eserviceimg.oss-cn-shanghai.aliyuncs.com/" + doc.entryList[i].imageURL + ".jpg",
            //         "desc": doc.entryList[i].desc
            //     };
            //     newList.push(newItem);
            // }

            res.render('index', {
		        title: doc.title,
		        contents: doc.entryList
		    });
        }
    );

    // res.render('index', {
    //     title: 'Express test',
    //     contents: [{
    //         image: 'http://www.modelclub.cn/assets/img/pro/index/post/6/1468.jpg',
    //         desc: '你用iPhone了吗? 虽然长期以来，苹果似乎一直和游戏机市场不搭边，但iPod和iPhone的出现却改变了这种局面。'
    //     }, {
    //         image: 'https://tse1-mm.cn.bing.net/th?id=OIP.MOkFtetrBNn8fMz0bnUXsQEsEs&w=300&h=300&p=0&pid=1.1',
    //         desc: '你用iPhone了吗? 虽然长期以来，苹果似乎一直和游戏机市场不搭边，但iPod和iPhone的出现却改变了这种局面。'
    //     }, {
    //         image: 'https://tse1-mm.cn.bing.net/th?id=OIP.MOkFtetrBNn8fMz0bnUXsQEsEs&w=300&h=300&p=0&pid=1.1',
    //         desc: '你用iPhone了吗? 虽然长期以来，苹果似乎一直和游戏机市场不搭边，但iPod和iPhone的出现却改变了这种局面。'
    //     }]
    // });
    
    // res.sendFile('/html/article.html');
    // res.sendFile('/public/stylesheets/style.css');
    // res.sendFile(path.join(__dirname, '../public/html', 'article.html'));
});

// /user 节点接受 PUT 请求
// router.get('/user', function(req, res) {
//     res.send('Got a PUT request at /user');
// });


// var cb0 = function(req, res, next) {
//     console.log('CB0');
//     next();
// }

// var cb1 = function(req, res, next) {
//     console.log('CB1');
//     next();
// }

// router.get('/example/d', [cb0, cb1], function(req, res, next) {
//     console.log('response will be sent by the next function ...');
//     next();
// }, function(req, res) {
//     res.send('Hello from D!');
// });

// // 一个中间件栈，显示任何指向 /user/:id 的 HTTP 请求的信息
// router.use('/user/:id', function(req, res, next) {
//     console.log('Request URL:', req.originalUrl);
//     next();
// }, function(req, res, next) {
//     console.log('Request Type:', req.method);
//     next();
// });

// // 一个中间件栈，处理指向 /user/:id 的 GET 请求
// router.get('/user/:id', function(req, res, next) {
//     // 如果 user id 为 0, 跳到下一个路由
//     if (req.params.id == 0) next('route');
//     // 负责将控制权交给栈中下一个中间件
//     else next(); //
// }, function(req, res, next) {
//     // 渲染常规页面
//     res.render('regular');
// });

// // 处理 /user/:id， 渲染一个特殊页面
// router.get('/user/:id', function(req, res, next) {
//     console.log(req.params.id);
//     res.render('special');
// });

module.exports = router;
