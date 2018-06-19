var express = require('express');
var http = require('http');
var qs = require('querystring');
var router = express.Router();
var io = require('socket.io-emitter')({host: '127.0.0.1', port: 6379});
var agenda = require('../lib/agenda');
/* GET users listing. */
router.get('/inform', function (req, res, next) {
    //res.send('respond with a resource');
    var data = {
        a: 123
    };//这是需要提交的数据

    var content = qs.stringify(data);

    var options = {
        hostname: 'syt.local',
        port: 80,
        path: '/kefu/call/inform_callback',
        method: 'GET'
    };
    setInterval(function () {
        //io.emit('chat message', new Date);
        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                var data = JSON.parse(chunk);
                if (typeof data === 'object') {
                    io.to('kefu').broadcast.emit('informOrder', data);
                } else {
                    res.json({"status": "error", "error_msg": "the respones body is not json format"});
                }
            });
        });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            res.json({"status": "error", "error_msg": e.message});
        });
        req.end();
    }, 10000);

});
/**
 * Post request
 * {"method":<method>, "appkey":<app-key>, "seckey":<secret-key>, "topic":<topic>,"event":<event>, "msg":<message>}
 */

router.post('/', function (req, res, next) {
    //TODO 请求合法性检测
//console.log(req.body.topic);
    switch (req.body.method) {
        case 'publish': //发布消息
            publish(req, res);
            break;
        case 'prepublish'://预发布消息
            prepublish(req, res);
            break;
        default :
            res.json({"status": "error", "error_msg": "the request json format error"});
            break;
    }
});
//发布一个消息
function publish(req, res) {
    if (req.body.topic === undefined || req.body.topic === '') {
        res.json({"status": "error", "error_msg": "topic is undefined"});
    }
    if (req.body.event === undefined) {
        res.json({"status": "error", "error_msg": "event is undefined"});
    }
    io.to(req.body.topic).broadcast.emit(req.body.event, req.body.msg);
    if(req.body.msg.next!==undefined){
        nextrun(req.body);
    }
    res.json({"status": "success"});
}
/**
 * {msg:}
 * @param req
 * @param res
 */
function prepublish(req, res){
    if (req.body.topic === undefined || req.body.topic === '') {
        res.json({"status": "error", "error_msg": "topic is undefined"});
    }
    if (req.body.event === undefined) {
        res.json({"status": "error", "error_msg": "event is undefined"});
    }
    var data=req.body;
    switch (req.body.event){
        case 'reminder':
            reminder(data);
            break;
        case 'cancel':
            cancel(data);
            break;
        case 'modify':
            //任务调度
            cancel(data);
            reminder(data);
            break;
    }

    res.json({"status": "success"});
}
//取消提醒
function cancel(data){
    agenda.cancel({name: data.msg.title}, function(err, numRemoved) {

    });
}
//设置提醒
function reminder(data){
//任务定义
    agenda.define(data.msg.title, function(job, done) {
        var data=job.attrs.data;
        io.to(data.topic).broadcast.emit(data.event, data.msg);
        done();
    });
    //任务调度
    var next=new Date(data.msg.next);
    if(data.hasOwnProperty('ntext')){
        data.msg.text=data.msg.ntext;
        delete data.msg.ntext;
    }
    agenda.schedule(next,data.msg.title,data);
}
module.exports = router;
