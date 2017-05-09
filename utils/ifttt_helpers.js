var util = require("./util");

var ifttt_helpers = module.exports = {};

var status = function(req, res){
	if(util.checkChannelKeyAndRespondWithError(req, res)){
		res.status(200).end();
		return;	
	}
}

var test_setup = function(req, res) {
	if(util.checkChannelKeyAndRespondWithError(req, res)){
		var dataToSendForTest = {
		  data: {
		    samples: {
		      triggers: {
		        short_wait_time: {
		          ride_name: "DisneylandResortMagicKingdom_353435",
		          wait_time: 30
		        }
		      },
		      actions: {
		        email_wait_times: {
		          email: "csparanohuiban@gmail.com"
		        }
		      }
		    }
		  }
		};
		res.status(200).send(dataToSendForTest);
		return;	
	}
}

ifttt_helpers.status = status;
ifttt_helpers.test_setup = test_setup;