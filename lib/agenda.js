/**
 * Created by 忠伟 on 2015/6/2 0002.
 */
var Agenda = require('agenda');

var connectionOpts={
    db: { address: 'localhost:27017/agenda'},
    maxConcurrency: 10,
    processEvery: '5 seconds'
};

var agenda = new Agenda(connectionOpts);

module.exports = agenda;