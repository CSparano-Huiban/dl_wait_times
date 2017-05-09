var util = require("./util"),
	ride_info_manager = require('./ride_info_manager'),
	emailer = require('./emailer');

var actions = module.exports = {};

function Ifttt_actions(DB){
	this.db = DB
}

Ifttt_actions.prototype.post_email_wait_times = function(req, res) {
	if(util.checkChannelKeyAndRespondWithError(req, res)){

		if(req.body && req.body.actionFields && req.body.actionFields.email){
			var email = req.body.actionFields.email;

			ride_info_manager.getRidesForDisneyland(function(error, rides){
				if(error){
					res.status(400).send({ errors: [ { message: "400" } ] });
					return
				}
				emailer.sendRideEmail(rides, email, function(error, emailInfo){
					if(error){
						res.status(400).send({ errors: [ { message: "400" } ] });
						return
					}
					var date = new Date();
					res.status(200).send({data: [{id: date.toISOString()}]});
					return

				});
			});
		}else{
			res.status(400).send({ errors: [ { message: "400" } ] });
			return
		}
		return;

	}
}

actions.Ifttt_actions = Ifttt_actions;