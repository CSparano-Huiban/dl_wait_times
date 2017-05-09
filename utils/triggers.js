var util = require("./util"),
	uid = require('uid'),
	ride_info_manager = require('./ride_info_manager');

var triggers = module.exports = {};

var wait_time_options = ride_info_manager.wait_time_options;

function Ifttt_triggers(DB){
	this.db = DB;
}

Ifttt_triggers.prototype.post_short_wait_time = function(req, res) {
	var db = this.db
	if(util.checkChannelKeyAndRespondWithError(req, res)){

		if(req.body && req.body.triggerFields && req.body.triggerFields.wait_time && req.body.triggerFields.ride_name){
			var ride_id = req.body.triggerFields.ride_name;
			var wait_time = req.body.triggerFields.wait_time;

			var data_base_id = ride_id + "." + wait_time;

			var trigger_id = req.body.trigger_identity;
			if(trigger_id){
				db.addTriggerIdToRideTimeListById(data_base_id, trigger_id, function(err,res){
					if(err){
						console.log(err)
					}
				});
			}
			var limit = req.body.limit;

			if(limit === 0){
				res.status(200).send({ data: [] });
				return;
			}

			db.getRideTimeListById(data_base_id, function(err, old_events){
				if(err){
					res.status(400).send({ errors: [ err ] });
					return
				}
				var slice_value = old_events.event_list.length;
				if(limit){
					slice_value = Math.min(limit, slice_value);
				}
				res.status(200).send({ data: old_events.event_list.slice(0,slice_value)});
			});
		}else{
			res.status(400).send({ errors: [ { message: "400" } ] });
			return
		}
		return;
	}
}

Ifttt_triggers.prototype.options_for_ride_name = function(req, res) {
	if(util.checkChannelKeyAndRespondWithError(req, res)){
		ride_info_manager.getRideListForOptions(function(err, ride_list){
			if(err){
				res.status(400).send({ errors: [ { message: "400" } ] });
				return;
			}
			if(ride_list.length === 0){
				res.status(200).send({data: [{label: "Hyperspace Mountain", value: "DisneylandResortMagicKingdom_353435"}]});
				return
			}

			res.status(200).send({data: ride_list});
		});
		return;	
	}
}

Ifttt_triggers.prototype.options_for_wait_time = function(req, res) {
	if(util.checkChannelKeyAndRespondWithError(req, res)){
		res.status(200).send(
			{
				data: wait_time_options.map(function(time){
					return {label: time, value:time};
				})
			}
		);
		return;	
	}
}

triggers.Ifttt_triggers = Ifttt_triggers;

