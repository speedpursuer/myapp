var express = require('express');
var path = require('path');
var request = require('request');
var router = express.Router();
var redis = require("redis"),
    client = redis.createClient();

// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
// router.use(function(req, res, next) {
//     console.log('Time:', Date.now());
//     next();
// });

function getShopIDFromDocID(docID) {
    var divider = "_";
    var firstIndex = docID.indexOf(divider);
    var lastIndex = docID.lastIndexOf(divider);
    // console.log("firstIndex: " + firstIndex);
    // console.log("lastIndex: " + lastIndex);

    return 'shop' + docID.substring(firstIndex,lastIndex);
    // console.log("UUID: " + UUID);
}

/* GET home page. */
router.get('/share/:id', function(req, res, next) {
    // console.log("id = " + req.params.id);
    var serverURL = 'http://121.40.197.226:8000/eservice/_all_docs?include_docs=true';
    // var docID = 'article_14a8f67e7501408d9dbbd90483c34d16_2017-05-02-15:24:39';
    var docID = req.params.id;
    // var uri = serverURL + docID;
    var auth = {
        'user': 'eservice_user',
        'pass': 'xiaodianzhang123'
    };

    request({
            method: 'POST',
            uri: serverURL,
            auth: auth,
            json: {keys: [docID, getShopIDFromDocID(docID)]}
        },
        function(error, response, body) {

            if (error) {
                console.log(error);
                next(error);                
            }

            // console.log("Body = " + body);

            // console.log("response = " + response);

            // console.log(body.rows);

            // var doc = JSON.parse('{"rows":[{"key":"shop_b2db86caf5a74b4d8a645d61ce5ede9c","id":"shop_b2db86caf5a74b4d8a645d61ce5ede9c","value":{"rev":"1-aba616e905c320d45fcfd1a127abf60d"},"doc":{"_id":"shop_b2db86caf5a74b4d8a645d61ce5ede9c","_rev":"1-aba616e905c320d45fcfd1a127abf60d","address":"上海市闵行区申长路688号虹桥天地B2","avatarURL":"b2db86caf5a74b4d8a645d61ce5ede9c/avatar","isFromLocal":true,"lat":31.1931,"lng":121.315,"name":"美车堂","owner":"user_b2db86caf5a74b4d8a645d61ce5ede9c","phone":"50339999","type":"shop"}},{"key":"article_cacd701d09ba43a7940d31261c5cfd4e_2017-05-08-15:41:13","id":"article_cacd701d09ba43a7940d31261c5cfd4e_2017-05-08-15:41:13","value":{"rev":"3-968bbb3329f914241cc194d401820bbf"},"doc":{"_id":"article_cacd701d09ba43a7940d31261c5cfd4e_2017-05-08-15:41:13","_rev":"3-968bbb3329f914241cc194d401820bbf","category":"默认分类","entryList":[{"desc":"","height":1104,"imageURL":"cacd701d09ba43a7940d31261c5cfd4e/1480abaa110a16b8af059b64ab0175fc","uploaded":true,"width":828}],"owner":"user_cacd701d09ba43a7940d31261c5cfd4e","thumbURL":"cacd701d09ba43a7940d31261c5cfd4e/1480abaa110a16b8af059b64ab0175fc","title":"宝宝2","type":"article"}}],"total_rows":2,"update_seq":169}');
            
            // console.log("doc = " + doc);

            // console.log(doc.rows);

            // return;

            var list = body.rows;

            if(list.length == 0 || (list.length > 0 && list[0].id != docID)) {
                // res.send('此页面不存在');
                res.render('error', {
                    message: '此页面不存在',
                    error: {}
                });
                return;
            }

            var doc = list[0].doc;
            var shop = list.length == 2? list[1].doc: null;

            // if(doc.rest) {
            if(false) {
                res.render('food', {
                    thumb: 'http://cdn.carlub.cn/'+doc.thumbURL+'.jpg',
                    url: req.protocol + '://' + 'www.carlub.cn' + req.originalUrl,
                    title: doc.title,
                    contents: doc.entryList,
                    rest: doc.rest
                });
            }else {
                client.get(doc._id, function (err, reply) {
                    var count = 0;
                    if(!err && reply) {
                        count = reply;
                    }

                    var title = doc.title.replace(/\n\r?/g, ' ');

                    // for(entry in doc.entryList) {
                    //     if(entry.desc) {
                    //         entry.desc = entry.desc.replace(/\n\r?/g, '<br />');
                    //     }
                    // }
                    client.incr(doc._id);

                    res.render('index', {
                        articleID: doc._id,
                        thumb: 'http://cdn.carlub.cn/'+doc.thumbURL+'.jpg',
                        url: req.protocol + '://' + 'www.carlub.cn' + req.originalUrl,
                        title: title,
                        contents: doc.entryList,
                        shopEnabled: doc.isShopEnabled,
                        shop: shop,
                        count: count
                        // shop: {
                        //     address: "上海市闵行区申长路688号虹桥天地B2",
                        //     avatarURL: "b2db86caf5a74b4d8a645d61ce5ede9c/avatar",
                        //     isFromLocal: false,
                        //     lat: 31.1931,
                        //     lng: 121.315,
                        //     name: "美车堂",                    
                        //     phone: "50339999",
                        //     type: "shop"
                        // }
                    });      
                });
            }
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

router.get('/visit/:id', function(req, res) {
    var docID = req.params.id;
    client.incr(docID, function(err, reply) {
        // reply is null when the key is missing
        var result = {};
        if(err) {
            result.err = true;
        }else {
            result.docID = docID
        }
        res.json(result);
    });    
});

router.get('/count/:id', function(req, res) {
    var docID = req.params.id;
    client.get(docID, function (err, reply) {
        var count = 0;
        if(!err && reply) {
            count = reply;
        }
        // console.log("reply: " + reply);
        // if(err || reply.toString())
        res.json({count: count});        
    });    
});

client.on("error", function (err) {
    console.log("Error " + err);
});

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
