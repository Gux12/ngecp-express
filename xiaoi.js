const express = require('express');
const router = express.Router();
const http = require('http');
const querystring = require('querystring');
const xml2js = require('xml2js').parseString;

router.post('', function(req, res) {

    tokenpost = req.body;
    var reqJsonData = querystring.stringify(tokenpost);
    console.log(tokenpost);
    console.log(reqJsonData);
    // the post options  
    var tokenoptionspost = {
        host: 'cluster.xiaoi.com',
        port: '80',
        path: '/robot/app/qhdxzljqr/ask.action?' + reqJsonData,
        method: 'POST',
        header: {
            'Content-Type': 'text/json;utf-8;charset=utf-8',
            'Content-Length': Buffer.byteLength(reqJsonData)
        }
    };
    console.log(tokenoptionspost);
    var reqPost = http.request(tokenoptionspost, function(resPost) {
        console.log(`STATUS: ${resPost.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(resPost.headers)}`);
        resPost.setEncoding('utf8');
        resPost.on('data', function(d) {
            xml2js(d, function(err, result) {
                console.dir(JSON.stringify(result));
                res.send(result);
            });
            console.log(`BODY: ${d}`);
        });
        resPost.on('end', function() {
            console.log('No more data in response.');
        });
    });

    reqPost.on('error', function(e) {
        console.log(`problem with request: ${e.message}`);
    });
    // reqPost.write(reqJsonData);
    reqPost.end();

});

module.exports = router;