var $text = $( "#main_text" );
var partName = [];
var partNameCount = 0;
var chunks = [];
var chunkIterate = 0;
var chapterIterate = 0;
var numberOfChapters;

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
// chunking each capter into sections
// we loop through chapters while they exists, when there are no chapters left, write to the browser
//

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
				partName[partNameCount] = "<b><h2>CHAPTER "+ chapterNumber +"</h2></b>"; // : <span class=\"chapter_name\">" + chunks[0] + "</span></h2></b>";
				partNameCount++;
				getTwitterContent();
	  		});
	  	}
	  	else{
			console.log("should be writing to page now");
			appendToPage();
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
				setTimeout(getTwitterContent,1000);
			})
			.fail(function() {
			    alert( "error" );
			});
	}
	else{
		chapterIterate++;
		chunkIterate = 0;
		getChunks();
	}
	
}

function appendToPage(){
	console.log("------------------------------");
	console.log("it starts here");
	console.log(partName);
	// Insert the part names
	$( "<ul></ul>" )
	  .append( partName.join( "" ) )
	  .appendTo( $text );
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
 
