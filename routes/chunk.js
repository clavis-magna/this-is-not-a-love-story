var express = require('express');
var router = express.Router();

var fs = require('fs');



/* GET home page. */
router.get('/', function(req, res) {
  	//res.send(200);
  	console.log("yep");
  	console.log(req.query);

  	//read in datafile
  	var data = fs.readFileSync('./public/data/sourcetext/original-text-tidied.txt', 'utf8');
  	// wait for the result, then use it - don't want async here happy to wait

  	//remove new lines
  	data = data.replace(/\n/g,"");

  	//split into sentences
  	var dataSentences = data.split('.'); 
  	//add a newline at end of each sentence
	res.render('chunk', { basetext: data, chapters: dataSentences  });

	console.log("done");

});

module.exports = router;
