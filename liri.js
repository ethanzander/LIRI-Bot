// Global Variables
var inquire = require("inquirer");
var fs = require("fs");
var twitter = require("twitter");
var keys = require('./keys.js');
var spotify = require('node-spotify-api');
var request = require("request");
var client = new twitter({
	consumer_key: keys.twitterKeys.consumer_key
	,consumer_secret: keys.twitterKeys.consumer_secret
	,access_token_key: keys.twitterKeys.access_token_key
	,access_token_secret: keys.twitterKeys.access_token_secret
});
var spotifyClient = new spotify({
	 id: keys.spotifyKeys.id
	,secret: keys.spotifyKeys.secret
}); 
var commandInput;
var serachInput;
// FUNCTIONS
function showMyTweets(){
	client.get("statuses/user_timeline",{screen_name:"captianredbear1"}, function(error, tweets, response){
		if(error){console.log(error);}
		else{
			for (var i = 0; i < 20; i++) {
				if(i < tweets.length){
					console.log("--------------------------------------------------------");
					console.log(tweets[i].created_at);
					console.log(tweets[i].text);
					console.log("--------------------------------------------------------");
				}
			}
		}
		reStart();
	});
}
function spotifyThisSong(song){
	spotifyClient.search({ type:"track", query: song, limit:"1"},function(err, data){
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Album: " + data.tracks.items[0].album.name);
		console.log("Song: " + data.tracks.items[0].name);
		console.log("Preview: " + data.tracks.items[0].preview_url);
		reStart();
	})
}
function findMovie(movie){
	var url = "http://www.omdbapi.com/?t=" + movie + "&apikey=" + keys.omdbKey
	request(url,function(error,response,body){
		if(error){console.log(error);}
		else if(response.statusCode === 200){
			var data = JSON.parse(body);
			console.log("Movie: " + data.Title);
			console.log("Released: " + data.Year);
			console.log("IMDB Rating: " + data.Ratings[0].Value);
			console.log("Rotton Tomatoes Rating: " + data.Ratings[1].Value);
			console.log("Produced in: " + data.Country);
			console.log("Language: " + data.Language);
			console.log("Plot: " + data.Plot);
			console.log("Actors: " + data.Actors);
		}
		reStart();
	});
}
function exeChoice(){
	fs.readFile("../log.txt","utf8",function(error,data){
		var temp = data.split(",");
		if (temp[0] === "Find my tweets"){
			showMyTweets();
		}
		else if (temp[0] === "Find a song"){
			spotifyThisSong(temp[1]);
		}
		else if (temp[0] === "Find a movie"){
			findMovie(temp[1]);
		}
	});
}
function start(){
	inquire.prompt([
		{
			message: "What would you like to do?"
			,type: "list"
			,choices:["Find my tweets","Find a song","Find a movie","EXIT"]
			,name:"function"
		}
	]).then(function(answers){
		if(answers.function === "Find my tweets"){
			myTweets();
		}
		else if (answers.function === "Find a song"){
			inquire.prompt([{
				message:"What song are we Spotifying?"
				,type: "input"
				,name: "song"
			}]).then(function(subAnswer){
				if (subAnswer.length > 0){
					spotifyThisSong(subAnswer.song);
				}
				else {
					spotifyThisSong("Pink Floyd, The Dark Side Of The Moon");
				}
			});
		}
		else if(answers.function === "Find a movie"){
			inquire.prompt([{
				message:"What is the title of the movie?"
				,type: "input"
				,name: "movie"
			}]).then(function(subAnswer){
				if (subAnswer.length > 0){
					findMovie(subAnswer.movie);
				}
				else {
					findMovie("Tommy Boy");
				}
			});
		}
		else if (answers.function === "EXIT"){
			return;
		}
	});
}
function reStart(){
	start();
}
//APP LOGIC
start();