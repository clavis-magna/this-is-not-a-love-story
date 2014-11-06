var express = require('express');
var router = express.Router();
var Twit = require('twit');


config = require('../config');
var T = new Twit(config);


/* GET home page. */
router.get('/', function(req, res) {
  		 
	var term = req.query.term;
	
	T.get('search/tweets', { q: term, count: 100 }, function(err, data) {
		if(err) return handleError(err);
		
		//get the statuses from the json
		var tweets = data.statuses;
		
		//choose one at random
        var i = tweets.length;
        var j = randomInt(0, i);
		res.send(tweets[j].text);
      
		
		
	});
	
	console.log("done");

});

module.exports = router;

//
// helpers
//

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
