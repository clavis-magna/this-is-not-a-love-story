var $text = $( "#main_text" );
var partName = [];
var chunks = [];
var chunkIterate = 1;

$(doIt());

function doIt(){

	//get some text using the chunk api
	$.get( "chunk", { chunktype : "phrase", chapter: "0" } )
		//wait untit after we get the data back	
		.done(function( data ) {
			chunks = data;
			//format the headings for partNames
			formatHeadings();
  		});
}

function formatHeadings(){
	
	partName[0] = "<b><h2>CHAPTER 1 : <span class=\"chapter_name\">" + chunks[0] + "</span></h2></b>";
			
	//we start at 1 as the chapter title is at 0 in the array
	for(var i = 1; i < chunks.length; i++){
		//main part headings for chapter
		partName[ i ] = "<li><b>CHAPTER 1, PART " + (i) + "</b>:  <br/><br/>" + chunks[i] + "</li>";
	}
	
	//
	//now add in some data for each chapter
	//test
	//
	
	//partName[1] += "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><br/><br/>";
	
	getTwitterContent();
}

function appendToPage(){
	// Insert the part names
	$( "<ul></ul>" )
	  .append( partName.join( "" ) )
	  .appendTo( $text );
}

function getTwitterContent(){
	if(chunkIterate < chunks.length-1){
		var theSearchTerm = chunks[chunkIterate].substr(0, 30);
		console.log("**"+chunkIterate+"**"+chunks.length);
		
		$.get( "search", { term : theSearchTerm, number: "3" } )
			.done(function(data){
				console.log(data);
				partName[chunkIterate] += "<p>" + data + "</p>";
				chunkIterate ++;
				setTimeout(getTwitterContent,5000);
			})
			.fail(function() {
			    alert( "error" );
			});
	}
	else{
		console.log("should be writing to page now");
		appendToPage();
	}
	
}


 

 
