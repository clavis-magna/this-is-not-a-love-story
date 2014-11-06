var express = require('express');
var router = express.Router();
var Twit = require('twit');


config = require('../config');
var T = new Twit(config);


/* GET home page. */
router.get('/', function(req, res) {
  		 
	var term = req.query.term;
	var numTweets = req.query.number;
	
	//we dont want retweets
	term = term + " -RT";
	
	if(numTweets == undefined)
	{
		numTweets = 1;
	}
	
	function handleError(err){
		console.log("twitter error : "+ err);
	}
	
	T.get('search/tweets', { q: term, count: 100 }, function(err, data) {
		if(err) return handleError(err);
		
		//get the statuses from the json
		var tweets = data.statuses;
		var tweetsToReturn = "";
		
		if(tweets[0] != undefined){
			
			// store for indexes we have already chosen to check on repeats
			// look into better random use (like a grab bag)
			var usedTweets = [];
			
			for(var k = 0; k < numTweets; k++){
				//choose one at random
		        var i = tweets.length;
		        var j = randomInt(0, i);
	        
				if(usedTweets.indexOf(j) == -1){
					console.log(">>>> "+j);
					//add index to usedTweets
					usedTweets[k] = j;
						
			        var theTweet = tweets[j].text;
			        
			        //
			        // do some tidying with regex - could push these together but easier to see whats going on when they are sepearte
			        //
			        
			        //remove @s
			        theTweet = theTweet.replace(/(@\w+)/ig, "");
			        //remove RT : (just incase any retweets got through)
			        theTweet = theTweet.replace(/(RT :+)/ig, "");
			        //remove #tags
					theTweet = theTweet.replace(/(#\w+)/g, "");
			        //remove URLS
			        theTweet = theTweet.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/ig, "");
			        
			        tweetsToReturn += theTweet+" ";	
			    }
	        }
	        //
	        // tidy done, send it back
	        //
	        
			res.send(tweetsToReturn);
		}
		else{
			
			// if we didn't get a response from twitter (or an error etc.) 
			// afterall, we can't be lucky everyday
			
			res.send("");
		}
		
		
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
