var AWS = require("aws-sdk");

var updateConfigs = {};
updateConfigs["region"] = process.env.REGION || "us-west-2";
var environment = process.env.ENV || "development";
if (environment == "development"){
  updateConfigs["endpoint"] = "https://dynamodb.us-west-2.amazonaws.com";  
}
AWS.config.update(updateConfigs);

var db = module.exports = {};

function Db() {
  this.dynamodb = new AWS.DynamoDB();;
  this.docClient = new AWS.DynamoDB.DocumentClient();
}

Db.prototype.getRideTimeListById = function(ride_time_id, callback){
	var params = {
	    TableName: "ride_time_to_events",
	    Key:{
	        "id": ride_time_id
	    }
	};

	this.docClient.get(params, function(err, data) {
	    if (err) {
	        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
	        callback(err);
	    } else {
	    	if (data.Item){
	        	callback(null, data.Item);
	    	}else if(Object.keys(data).length === 0 && data.constructor === Object){
	    		callback(null, {id: ride_time_id, event_list: [] });

	    	}else{
	    		callback("poorly formated request");
	    	} 
	    }
	});
};

Db.prototype.addEventToRideTimeListById = function(ride_time_id, new_event, callback){
	console.log("adding new event!!!!! ", new_event);
	var tempDb = this;
	tempDb.getRideTimeListById(ride_time_id, function(err, oldList){
		if(err){
			callback(err);
			return
		}
		oldList.event_list.unshift(new_event);
		var params = {
			TableName: "ride_time_to_events",
			Item: {
				id: ride_time_id,
				event_list: oldList.event_list
	  		}
	    };

	  	tempDb.docClient.put(params, function(err, data) {
	        if (err) {
	            console.log("Unable to add item. ERROR: ", JSON.stringify(err, null, 2));
	  			callback(err);
	            return;
	        } else {
	  			if (data){
		        	callback(null, params.Item);
		    	}else{
		    		callback("poorly formated request");
		    	}
	        }
	    });
	});
};


Db.prototype.getTriggerIdsToRideTimeListById = function(ride_time_id, callback){
	var params = {
	    TableName: "ride_time_to_trigger_ids",
	    Key:{
	        "id": ride_time_id
	    }
	};

	this.docClient.get(params, function(err, data) {
	    if (err) {
	        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
	        callback(err);
	    } else {
	    	if (data.Item){
	        	callback(null, data.Item);

	    	}else if(Object.keys(data).length === 0 && data.constructor === Object){
	    		callback(null, {id: ride_time_id, triggerIds: {} });

	    	}else{
	    		callback("poorly formated request");
	    	}
	    }
	});
};

Db.prototype.addTriggerIdToRideTimeListById = function(ride_time_id, triggerId, callback){
	var tempDb = this;
	tempDb.getTriggerIdsToRideTimeListById(ride_time_id, function(err, oldList){
		if(err){
			callback(err);
			return
		}

		oldList.triggerIds[triggerId] = true;
		var params = {
			TableName: "ride_time_to_trigger_ids",
			Item: {
				id: ride_time_id,
				triggerIds: oldList.triggerIds
	  		}
	    };

	  	tempDb.docClient.put(params, function(err, data) {
	        if (err) {
	            console.log("Unable to add item. ERROR: ", JSON.stringify(err, null, 2));
	  			callback(err);
	            return;
	        } else {
	  			if (data){
		        	callback(null, params.Item);
		    	}else{
		    		callback("poorly formated request");
		    	}
	        }
	    });


	});

};

Db.prototype.getPreviousRideTimes = function(callback){
	var params = {
	    TableName: "park_id_to_previous_times",
	    Key:{
	        "id": "DisneyLandUSA"
	    }
	};

	this.docClient.get(params, function(err, data) {
	    if (err) {
	        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
	        callback(err);
	    } else {
	    	if (data.Item){
	        	callback(null, data.Item.times_map);

	    	}else if(Object.keys(data).length === 0 && data.constructor === Object){
	    		callback(null, {});

	    	}else{
	    		callback("poorly formated request");
	    	}
	        
	    }
	});

};

Db.prototype.updatePreviousRideTimes = function(new_times, callback){

	console.log("updating wait times!!!!! ", new_times);
	var params = {
		TableName: "park_id_to_previous_times",
		Item: {
			id: "DisneyLandUSA",
			times_map: new_times
  		}
    };

  	this.docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item. ERROR: ", JSON.stringify(err, null, 2));
  			callback(err);
            return;
        } else {
  			if (data){
  				console.log("updating wait times!!!!! Succeeded");
	        	callback(null, params.Item.times_map);
	    	}else{
	    		console.log("updating wait times!!!!! Failed");
	    		callback("poorly formated request");
	    	}
        }
    });

};

db.Db = Db;