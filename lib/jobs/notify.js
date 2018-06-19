/**
 * Created by 忠伟 on 2015/6/2 0002.
 */
var io = require('socket.io-emitter')({host: '127.0.0.1', port: 6379});

module.exports = function(agenda) {
    agenda.define('cron notify', function(job, done) {
        var data=job.attrs.data;
        console.log("开始提醒............");
        console.log(data);
        io.to(data.topic).broadcast.emit(data.event, data.msg);
        done();
        //(function(data) {
        //    io.to(data.topic).broadcast.emit(data.event, data.msg);
        //    done();
        //});
    });

    agenda.define('other', function(job, done) {
        // etc etc
    })

}