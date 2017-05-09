var Themeparks = require("themeparks"),
	ifttt_realtime = require('./ifttt_realtime'),
	uid = require('uid');

var ride_info_manager = module.exports = {};

var disneyMagicKingdom = new Themeparks.Parks.DisneylandResortMagicKingdom();

var pollWaitTimes = function(db){

	setInterval(function () {
		var date = new Date();

		if(date.getHours() >= 7){
			console.log("polling at Date: ", date);
			getRidesForDisneyland(function(err, rides){
		    	if(err){
		    		console.log(err)
		    		return
		    	}
		    	db.getPreviousRideTimes(function(err, oldWaitTimes){
		    		for(var i = 0; i < rides.length; i++){
			    		var ride = rides[i];
			    		updateDictionariesFromRide(oldWaitTimes, ride);
			    		oldWaitTimes[ride.id] = ride.waitTime;
			    	}

			    	db.updatePreviousRideTimes(oldWaitTimes, function(err, result){
			    		if(err){
			    			console.log(err);
			    			return
			    		}
			    	})
		    	});
		    });
		}else if(date.getHours() === 3 && date.getMinutes() < 10){
			db.updatePreviousRideTimes({}, function(err, data){
				if(err){
		    		console.log(err)
		    		return
		    	}
			});
		}
	    
	}, 300000);

};

var updateDictionariesFromRide = function(last_seen_wait_times, ride, db){

	var previous_wait_time = last_seen_wait_times[ride.id] || 100000;
	var current_wait_time = ride.waitTime;
	var date = new Date();

	if(current_wait_time < previous_wait_time){
		for(var i = 0; i < wait_time_options.length; i++){
			var wait_time_to_test = wait_time_options[i];
			if(wait_time_to_test >= current_wait_time && wait_time_to_test < previous_wait_time){
				var dict_id = ride.id + "." + wait_time_to_test;
				var new_value = { 
					wait_time: ride.waitTime,
					name: ride.name,
					created_at: date.toISOString(),
					meta:{
						id: uid(16),
						timestamp: Math.floor(date.getTime()/1000)
					}
				};

				ifttt_realtime.sendRealTimeNotifications(dict_id, db);
				
				db.addEventToRideTimeListById(dict_id, new_value, function(err,result){
					if(err){
						console.log("Error in updating: ", dict_id, ", ", new_value);
						return;
					}
				});
			}
		}
	}
};


var getRidesForDisneyland = function(callback){
	disneyMagicKingdom.GetWaitTimes(function(err, rides) {
    	
    	if (err){
    		console.log(err);
    		callback(err, null);
    		return;
    	}

	    var temp_rides = rides.filter(function(ride){
	    	return ride.status === 'Operating';
	    });

	    var curr_rides = temp_rides.sort(function(a,b){
	    	return a.waitTime - b.waitTime;
	    });

	    callback(null, curr_rides);
	    

	});
};

var getRideListForOptions = function(callback){
	disneyMagicKingdom.GetWaitTimes(function(err, rides){
		if (err){
			console.log(err);
    		callback(err, null);
    		return;
    	}

		callback(null, rides.map(function(ride){
    		return {label: ride.name, value: ride.id}
    	}));
    	return;
	});
};

ride_info_manager.pollWaitTimes = pollWaitTimes;
ride_info_manager.getRidesForDisneyland = getRidesForDisneyland;
ride_info_manager.getRideListForOptions = getRideListForOptions;