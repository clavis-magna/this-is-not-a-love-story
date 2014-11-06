var $text = $( "#main_text" );
var partName = [];
var partNameCount = 0;
var chunks = [];
var chunkIterate = 1;
var chapterIterate = 0;
var numberOfChapters;

$(doIt());

//
// doit is the entry point
//

function doIt(){	
	// firstly lets get the number of chapters
	$.get( "chunk", { chunktype : "chaptercount" } )
		//wait untit after we get the data back	
		.done(function( data ) {
			numberOfChapters = data;
			console.log("there are "+numberOfChapters+" chapters");
			getChunks();
  		});
}

function getChunks(){
	
	if(chapterIterate < numberOfChapters){
		console.log("on iteration "+chapterIterate+" of "+numberOfChapters);
		//get some text using the chunk api
		$.get( "chunk", { chunktype : "phrase", chapter: chapterIterate } )
			//wait untit after we get the data back	
			.done(function( data ) {
				chunks = data;
				//format the headings for the main Chapters
				var chapterNumber = Number(chapterIterate)+1;
				partName[partNameCount] = "<b><h2>CHAPTER "+ chapterNumber + " : <span class=\"chapter_name\">" + chunks[0] + "</span></h2></b>";
				partNameCount++;
				getTwitterContent();
	  		});
	  	}
	  	else{
			console.log("should be writing to page now");
			appendToPage();
		}
}

function formatHeadings(){
	
	
			
	//we start at 1 as the chapter title is at 0 in the array
	for(var i = 1; i < chunks.length; i++){
		//main part headings for chapter
		var chapterNumber = Number(chapterIterate)+1;
		partName[ i ] = "<li><b>CHAPTER "+ chapterNumber +", PART " + (i) + "</b>:  <br/><br/>" + chunks[i] + "</li>";
	}
		
	getTwitterContent();
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

function getTwitterContent(){
	if(chunkIterate < chunks.length-1){
		var theSearchTerm = chunks[chunkIterate].substr(0, 30);
		console.log("section "+chunkIterate+" of "+chunks.length+" in chapter "+chapterIterate);
		
		$.get( "search", { term : theSearchTerm, number: "3" } )
			.done(function(data){
				console.log(data);
				
				//following line commented out to hide actual seed text.
				//
				//partName[ partNameCount ] = "<li><b>CHAPTER "+ chapterIterate+1 +", PART " + (chunkIterate) + "</b>:  <br/><br/>" + chunks[chunkIterate] + "</li>";
				
				//following line alternative to showing see text
				partName[ partNameCount ] = "<li><b>CHAPTER "+ chapterIterate+1 +", PART " + (chunkIterate) + "</b>:  <br/><br/></li>";
				partName[ partNameCount ] += "<p>" + data + "</p>";
				
				//to check out why partName if not working with incementals
				//console.log("== " + partName);
				//console.log("++ " +partName[ partNameCount ]);
				
				partNameCount ++;
				chunkIterate ++;
				setTimeout(getTwitterContent,500);
			})
			.fail(function() {
			    alert( "error" );
			});
	}
	else{
		chapterIterate++;
		chunkIterate = 1;
		getChunks();
	}
	
}


 

 
