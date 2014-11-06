$(doIt());

function doIt(){
	//get some text using the chunk api
	$.get( "chunk", { chunktype : "phrase", chapter: "0" } )
		.done(function( data ) {
			console.log(data.length);
			
			var $text = $( "#main_text" ),
			partName = [];
			
			partName[0] = "<b><h2>CHAPTER 1 : <span class=\"chapter_name\">" + data[0] + "</span></h2></b>";
			
			//we start at 1 as the chapter title is at 0 in the array
			for(var i = 1; i < data.length; i++){
				//main part headings for chapter
				partName[ i ] = "<li><b>CHAPTER 1, PART " + (i) + "</b>:  <br/><span class=\"chapter_name\">" + data[i] + "</span></li><br/><br/>";
				//now add in some data for each chapter
				//partName[ i ] += 
				console.log(data[i]);
			}
			
			// Insert the part names
			$( "<ul></ul>" )
			  .append( partName.join( "" ) )
			  .appendTo( $text );
  		});
}


 

 
