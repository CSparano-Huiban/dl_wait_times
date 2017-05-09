var util = module.exports = {};

var IFTTT_CHANNEL_KEY = process.env.IFTTT_CHANNEL_KEY;

var checkChannelKeyAndRespondWithError = function(req, res){
	var sentKey = req.get('IFTTT-Channel-Key');
	if(IFTTT_CHANNEL_KEY === sentKey){
		return true;
	}else{
		respondWithError(res);
		return false;
	};
};

var respondWithError = function(res){
	res.status(401).send({ errors: [ { message: "401" } ] });
};

util.checkChannelKeyAndRespondWithError = checkChannelKeyAndRespondWithError;