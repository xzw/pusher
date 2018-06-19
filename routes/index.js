var express = require('express');
var router = express.Router();
var Agenda = require('agenda');
var agendaUI = require('agenda-ui');

var agenda = new Agenda({db: { address: 'localhost:27017/agenda'}});

router.use('/agenda-ui', agendaUI(agenda, {poll: 5000}));
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    res.sendFile(__dirname+'/index.html');
});
router.get('/purge',function(req,res,next){
    agenda.purge(function(err, numRemoved) {
        console.log(numRemoved +' jobs has removed from the database');
    });
    res.json({"status": "success"});
});

module.exports = router;
