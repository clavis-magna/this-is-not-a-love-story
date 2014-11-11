var $text = $( "#main_text" );
var partName = [];
var partNameCount = 0;
var chunks = [];
var chunkIterate = 0;
var chapterIterate = 0;
var numberOfChapters;
var chapterHeading;

var chapterHeadingPrefixes = ["Where ","In which ","Where you can see that ", "Whereby ","Whereabouts "];

$(doIt());

//
// doit is the entry point
//

function doIt(){	
	// firstly lets get the number of chapters
	$.get( "chunk", { chunktype : "chaptercount" } )
		.done(function( data ) {
			numberOfChapters = data;
			console.log("there are "+numberOfChapters+" chapters");
			getChunks();
  		});
}


//
// iterate thorugh the number of chapters
// chunking each chapter into sections
// we loop through chapters while they exists, when there are no chapters left, else we are done

function getChunks(){	
	if(chapterIterate < numberOfChapters){
		console.log("on iteration "+chapterIterate+" of "+numberOfChapters);
		//get some text using the chunk api
		$.get( "chunk", { chunktype : "phrase", chapter: chapterIterate, pos: "adjective" } )
			//wait untit after we get the data back	
			.done(function( data ) {
				chunks = data;
				//format the headings for the main Chapters
				var chapterNumber = Number(chapterIterate)+1;
				chapterHeading = "<b>CHAPTER "+ chapterNumber; // : <span class=\"chapter_name\">" + chunks[0] + "</span></h2></b>";

				//add in the first opening paragraph tag
				partName[partNameCount] = "<p class=\"drop\">";
				partNameCount++;
				getTwitterContent();
	  		});
	  	}
	  	else{	
		  	$( "<p></p>").append( "this is not a love story." ).appendTo( $text );		
			//the end
		}
}



function getTwitterContent(){
	
	if(chunkIterate < chunks.length){
		
		//search string as first 30 characters (just as a quick test really)
		//var theSearchTerm = chunks[chunkIterate].substr(0, 30);
		
		//search string for this pass first 4 words. 
		//var theSearchTerm = getWords(chunks[chunkIterate],4);
		
		var theSearchTerm = chunks[chunkIterate];
		
		if(theSearchTerm == ""){
			theSearchTerm = "x";
		}
		
		console.log("section "+chunkIterate+" of "+chunks.length+" in chapter "+chapterIterate);
		
		$.get( "search", { term : theSearchTerm, number: "3" } )
			.done(function(data){
				console.log(data);
				
				//following line commented out to hide actual seed text.
				//
				//partName[ partNameCount ] = "<li><b>CHAPTER "+ chapterIterate+1 +", PART " + (chunkIterate) + "</b>:  <br/><br/>" + chunks[chunkIterate] + "</li>";
				
				//following line alternative to showing seed text
				//var chapterNumber = Number(chapterIterate)+1;
				//partName[ partNameCount ] = "<li><b>CHAPTER "+ chapterNumber +", PART " + (chunkIterate) + "</b>:  <br/><br/></li>";
				partName[ partNameCount ] = data ;
				
				//to check out why partName if not working with incementals
				//console.log("== " + partName);
				//console.log("++ " +partName[ partNameCount ]);
				
				partNameCount ++;
				chunkIterate ++;
				
				//write to page as we go so we can see the text being built
				//appendToPage();
				
				setTimeout(getTwitterContent,1000);
			})
			.fail(function() {
			    alert( "error" );
			});
	}
	else{
		//add closing /p
		partName[ partNameCount ] = "</p>" ;

		//or write to page as each chapter is complete
		appendToPage();
		
		partNameCount = 0;
		partName = [];
		
		chapterIterate++;
		chunkIterate = 0;
		getChunks();
	}
	
}

function appendToPage(){
	
	//join just so we can get the subtitle (with a differnt var)
	var joinedPartname = partName.join( "" );
	//get the subheading from this joined text
	var subHeading = afterIncluding(joinedPartname, " I ")+".";
	
	//we want to divide the chapter into suitable paragraphs
	//first join it all together from the array
	partName = partName.join( "" );
	
	//get the subheading while the text is spliced
	var subHeading = afterIncluding(partName, " I ");
	
	//then split it up again at full stops
	partName = partName.split("~");
	console.log("there are "+partName.length+" sentences.");
	for(sentence = 0; sentence < partName.length; sentence ++){
		//add ful stops back 
		if(partName[sentence].length > 0 && sentence != partName.length-1){
			partName[sentence] = partName[sentence] +".";
		
			//and capitalise sentenc
			partName[sentence] = partName[sentence].charAt(0).toUpperCase() + partName[sentence].slice(1);
			if(Math.random() < 0.2){
				console.log(sentence);
				partName.splice(sentence, 0,"</p><p>");
			}
		}
	}
	
	//and rejoin them
	partName = partName.join( "" );
	
	//append the chapter heading
	$( "<h2></h2>").append( chapterHeading ).appendTo( $text );
	
	//get a chapter heading prefix
	var prefix = chapterHeadingPrefixes[Math.floor(Math.random()*chapterHeadingPrefixes.length)];
	//append the subheading
	$( "<h3></h3>").append( prefix+subHeading ).appendTo( $text );
	
	// Insert the part names (the main text)
	$( "<span></span>" )
	  .append( partName )
	  .appendTo( $text );
	  
	$(".drop").dropJ({factor:5});
	$("p").removeClass("drop");
}
 
//
// helpers
//

// return first x words from a string

function getWords(str,howMany) {
    return str.split(/\s+/).slice(1,howMany).join(" ");
}

// acccess get params from url

function $_GET(q,s) { 
    s = s ? s : window.location.search; 
    var re = new RegExp('&'+q+'(?:=([^&]*))?(?=&|$)','i'); 
    return (s=s.replace(/^?/,'&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined; 
} 

//after including

function afterIncluding(text, term) {
	//find the search term in the tweet
	var aslower = text.toLowerCase();
	var queryaslower = term.toLowerCase();

	var startOfSearch = aslower.indexOf(queryaslower);
	
	//remove everything up to the point of the found text
	text = text.substring(startOfSearch, text.length);
	text = text.substring(0, text.indexOf('~'));
	
	//then remove everything after any punctuation
	text = text.split(/[.?!,]/)[0];
	
	return text;
}
 
