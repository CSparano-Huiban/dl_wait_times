var express = require('express'),
	bodyParser = require('body-parser'),
	DB = require("./utils/db"),
	ride_info_manager = require('./utils/ride_info_manager'),
	Ifttt_triggers = require('./utils/triggers'),
	Ifttt_actions = require('./utils/actions')
	ifttt_helpers = require('./utils/ifttt_helpers');

var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var db = new DB.Db();
var ifttt_triggers = new Ifttt_triggers.Ifttt_triggers(db);
var ifttt_actions = new Ifttt_actions.Ifttt_actions(db);

app.get('/ifttt/v1/status', function(req, res) {
	ifttt_helpers.status(req,res);
});

app.post('/ifttt/v1/test/setup', function(req, res) {
	ifttt_helpers.test_setup(req,res);
});

app.post('/ifttt/v1/triggers/short_wait_time', function(req,res){
	ifttt_triggers.post_short_wait_time(req,res);
});

app.post('/ifttt/v1/actions/email_wait_times', function(req, res) {
	ifttt_actions.post_email_wait_times(req, res);
});

app.post('/ifttt/v1/triggers/short_wait_time/fields/ride_name/options', function(req,res){
	ifttt_triggers.options_for_ride_name(req,res);
});

app.post('/ifttt/v1/triggers/short_wait_time/fields/wait_time/options', function(req,res){
	ifttt_triggers.options_for_wait_time(req, res);
});

app.listen(8081);

// ride_info_manager.pollWaitTimes(db);