var express = require('express');
var router = express.Router();
var http = require('http');
var rf = require("fs");
var BufferHelper = require('bufferhelper');
var audio;
router.post('', function(req, res) {
    var bufferHelper = new BufferHelper();
    req.on('data', function(chunk) {
        bufferHelper.concat(chunk);
    })
    req.on('end', function() {
        // var audio = req._readableState.buffer;
        // post = querystring.parse(post);
        var data = bufferHelper.toBuffer();
        // console.log(data);
        // console.log(size);
        var audio = [data];
        var token;
        var tokenpostheaders = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        };
        // the post options  
        var tokenoptionspost = {
            host: 'openapi.baidu.com',
            port: '80',
            path: '/oauth/2.0/token?grant_type=client_credentials&client_id=XRC0hIYvB73wvsTGOH4ETyCx&client_secret=NEahsdAX6Vx7exNpwUnr163brGTQFr68',
            method: 'POST',
            header: tokenpostheaders
        };
        // do the POST call  
        // 服务器端发送REST请求  
        var tokenreqPost = http.request(tokenoptionspost, function(tokenreqPost) {
            tokenreqPost.on('data', function(d) {
                json = eval('(' + d + ')');
                // 发送音频请求，获取字符串
                // Request of JSON data  
                // 接收客户端的JSON数据  
                var buffer = {
                        "format": "wav",
                        "rate": 16000,
                        "channel": 1,
                        "token": json.access_token,
                        "cuid": "baidu_workshop",
                        "len": "",
                        "speech": "",
                    }
                    // 直接load音频文件
                    // var data = rf.readFileSync("public/audio/test.wav");
                    // buffer.speech = new Buffer(data).toString('base64');
                    // buffer.len = Buffer.byteLength(data);
                    // 用前端传来的blob
                buffer.speech = new Buffer(audio[0]).toString('base64');
                buffer.len = new Buffer(audio[0]).byteLength;
                //json转换为字符串
                //
                var reqJosnData = JSON.stringify(buffer);
                // console.log(buffer);
                // do a POST request  
                // prepare the header  
                var postheaders = {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
                };

                // the post options  
                var optionspost = {
                    host: 'vop.baidu.com',
                    port: '80',
                    path: '/server_api',
                    method: 'POST',
                    headers: postheaders
                };

                // do the POST call  
                var reqPost = http.request(optionspost, function(resPost) {
                    resPost.on('data', function(d) {
                        res.send(d);
                    });
                });

                // write the json data  
                // 发送REST请求时传入JSON数据  
                reqPost.write(reqJosnData);
                reqPost.end();
                reqPost.on('error', function(e) {
                    console.error(e);
                });
            });
        });
        tokenreqPost.end();
        tokenreqPost.on('error', function(e) {
            console.error(e);
        });
    });
});

// router.post('/audio', function(req, res) {
//     req.on('readable', function() {
//         audio = req.read();
//         // audio = buf.toString('base64');
//         res.send('ok!');
//     });
// });

module.exports = router;
