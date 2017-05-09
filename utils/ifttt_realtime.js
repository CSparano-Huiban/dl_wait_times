var request = require('request');
var uid = require('uid');

var ifttt_realtime = module.exports = {};

var sendRealTimeNotifications = function(current_ride_id, db){

	db.getTriggerIdsToRideTimeListById(current_ride_id, function(error, idsObject){
		var ids = Object.keys(idsObject.triggerIds);
		ids = ids.map(function(id){
			return {trigger_identity: id};
		});

		while(ids.length > 0){
			var maxPop = Math.min(ids.length, 1000);
			var idsToSend = ids.splice(0, maxPop);

			var postData = {
			  data: idsToSend
			}

			var url = 'https://realtime.ifttt.com/v1/notifications'
			var options = {
			  method: 'post',
			  body: postData,
			  json: true,
			  url: url,
			  headers: {
			    'IFTTT-Channel-Key': process.env.IFTTT_CHANNEL_KEY,
			    'X-Request-ID': uid(16)
			  }
			}
			request(options, function (err, res, body) {
			  if (err) {
			    console.error('error posting json: ', err)
			    return;
			  }
			});

		}
	});
}

ifttt_realtime.sendRealTimeNotifications = sendRealTimeNotifications;