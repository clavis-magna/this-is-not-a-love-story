this-is-not-a-love-story
========================

<h3>
Seed text formatting 
</h3>

* plain text
* chapter sections delineated by an asterix *
* chapter titles indicated by trailing underscore _

<h3>
Text Chunking api
</h3>

Returns array of text 'chunked' by various taxonomies

<h5>acting upon the entire seed text</h5>

http://path-to-node-server:port/chunk?chunkType=*

* chapertitle
* chapter
* sentence
* phrase
* word

<h5>acting upon a single chapter chunk

http://path-to-node-server:port/chunk?chunktype=*&chapter=13

* sentence
* phrase

<h3>
Install & run
</h3>

git clone https://github.com/clavis-magna/this-is-not-a-love-story.git
```
cd this-is-not-a-love-story

npm install

node bin/www  
```

chunking API now available @

http://localhost:3000/chunk
