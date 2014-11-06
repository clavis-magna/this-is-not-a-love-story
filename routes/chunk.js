var express = require('express');
var router = express.Router();

// API to get back text in various chunks as arrays

//require file system library
var fs = require('fs');



/* GET home page. */
router.get('/', function(req, res) {
  	//res.send(200);
  	console.log("yep");
  	
  	var chunkType = req.query.chunktype;
  	var chapterNumber = req.query.chapter;
  	
  	console.log(chapterNumber);

  	//read in datafile
  	var data = fs.readFileSync('./public/data/sourcetext/original-text-tidied.txt', 'utf8');
  	
  	// wait for the result, then use it - don't want async here happy to wait

  	//remove new lines (to tidy things up)
  	data = data.replace(/\n/g,"");
  	
  	//get chapter headings
  	if(chunkType == "chapertitle"){
	  	res.send(getChapterTitles(data)); 
  	}
  	
  	if(chunkType == "chaptercount"){
		 //how many chapters are there?
		 var chaptersForCount = getChapterTitles(data);
		 res.send(chaptersForCount.length.toString());
	 }
  	
  	//remove heading indicators
  	data = data.replace(/\_/g,"");
  	
  	if(chunkType == "chapter"){
	  	//send array of text as chapters back
	  	res.send(getChapters(data)); 
	 }

  	if(chunkType == "sentence"){
  		if(chapterNumber == undefined){
	  		res.send(getSentence(data));
	  	}
	  	else{
  	  		//get chapter chunks
	  	  	var chapters = getChapters(data);
	  	  	//get phases from that chapter & return them
	  	  	res.send(getSentence(chapters[chapterNumber]));	
  	  	}  
	 }
	 
	 if(chunkType == "phrase"){
	 	if(chapterNumber == undefined){
  	  		res.send(getPhrases(data));
  	  	}
  	  	else{
  	  		//get chapter chunks
	  	  	var chapters = getChapters(data);
	  	  	//get phases from that chapter & return them
	  	  	res.send(getPhrases(chapters[chapterNumber]));	
  	  	} 
	 }
	 
	 if(chunkType == "word"){
	  	res.send(getWords(data)); 
	 }
	 
	 
	//send 200 
	res.status(200).end();
	
	console.log("done");

});

module.exports = router;

//
// chunking functions
//

function getChapters(theText){
	//split into chapters
  	var dataChapters = theText.split('*'); 
  	return dataChapters;
} 

function getWords(theText){
	//remove *** chapter delineators
	theText = theText.replace(/\*/g,'');
  	//split into words
  	var dataWords = theText.split(/!|\.|,| |\(|\)|\"/); 
  	//remove any emtpy words
  	for(var i =  dataWords.length-1; i--;){
  		//trim
		dataWords[i] = dataWords[i].trim();
		//remove empties
		if ( dataWords[i] === ""){
			dataWords.splice(i, 1);
		}
	}
	return dataWords;
}


function getSentence(theText){
	//remove *** chapter delineators
	theText = theText.replace(/\*/g,'');
  	//split into sentences
  	var dataSentences = theText.split(/!|\./); 
  	//remove any emtpy words & trim whitespace
  	for(var i =  dataSentences.length-1; i--;){
  		//trim
		dataSentences[i] = dataSentences[i].trim();
		
		//get first character
		var firstCar = dataSentences[i].substring(0,1);
		if(firstCar == "\""){
			//remove first char if its a "
			dataSentences[i] = dataSentences[i].replace('\"', "");
			//and add it to the end of the previous
			dataSentences[i-1] = dataSentences[i-1]+'\"';
		}

		//and trim again for good measure
		dataSentences[i] = dataSentences[i].trim();
		
		//remove empities
		if ( dataSentences[i] === ""){
			dataSentences.splice(i, 1);
		}
	}
	return dataSentences;
}

function getChapterTitles(theText){
	//split into sentences
  	var datatitles = theText.split(/!|\./); 
  	
  	//iterate through remove any non titles and remove indicator on titles
  	for(var i =  datatitles.length-1; i--;){
  		//trim
		datatitles[i] = datatitles[i].trim();
		//get first character
		var firstCar = datatitles[i].substring(0,1);
		if(firstCar == "\""){
			//remove first char if its a "
			datatitles[i] = datatitles[i].replace('\"', "");
			//and add it to the end of the previous
			datatitles[i-1] = datatitles[i-1]+'\"';
		}

		//and trim again for good measure
		datatitles[i] = datatitles[i].trim();
		
		//get last character
		var lastCharacter = datatitles[i].slice(-1);
		if(lastCharacter != "_"){
			datatitles.splice(i, 1);
		}
		else{
			datatitles[i] = datatitles[i].replace("_", "");
		}
		
		//and remove empties
		if ( datatitles[i] === ""){
			datatitles.splice(i, 1);
		}
	}
	return datatitles;
}

function getPhrases(theText){
	//remove *** chapter delineators
	theText = theText.replace(/\*/g,'');
  	//split into phrases
  	var dataphrase = theText.split(/!|\.|,/); 
  	
  	//remove any emtpy words & trim whitespace
  	for(var i =  dataphrase.length-1; i--;){
  		//trim
		dataphrase[i] = dataphrase[i].trim();
		
	  	//get first character
		var firstCar = dataphrase[i].substring(0,1);
		if(firstCar == "\""){
			//remove first char if its a "
			dataphrase[i] = dataphrase[i].replace('\"', "");
			//and add it to the end of the previous
			dataphrase[i-1] = dataphrase[i-1]+'\"';
		}

		//and trim again for good measure
		dataphrase[i] = dataphrase[i].trim();
		
		//remove empities
		if ( dataphrase[i] === ""){
			dataphrase.splice(i, 1);
		}
	}
	return dataphrase;
}