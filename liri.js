
require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var Twitter = require("twitter");

///////////////////////////////////////////////////////////////////////////////////////////
// I could not get the twitter api to work.
// My access tokens and keys were added into the keys.js file and 
// .env file but the function did not want to return anything from my twitter account.
// I tried for days to get it to work but it will not run properly

// var getTweets = function() 
// {
//     var user = new Twitter(keys.twitter);

//     var params = {screen_name: "aaronbugden"};

//     user.get("statuses/user_timeline", params, function(error, tweets, response) 
//     {
//     	  if (!error) 
//     	  {
//         	 for (var i = 0; i < tweets.length; i++) 
//           {
//         		console.log(tweets[i].created_at);
//         		console.log("");
//         		console.log(tweets[i].text);
//         	 }
//     	  }
//     });
// };

var getArtist = function(artist)
{
	return artist.name;
};

var getSpotify = function(songName)
{
	if(songName === undefined)
	{
		songName = "What's my age again";
	}

	spotify.search(
	{
		type: "track",
		query: songName
	},
	function(err, data)
	{
		var songs = data.tracks.items;

		if(err)
		{
			console.log("Error occurred: " + err);
			return;
		}

		for(var i = 0; i < songs.length; i++)
		{
			console.log(i);
			console.log("Artist: " + songs[i].artists.map(getArtist));
			console.log("Song name: " + songs[i].name);
	        console.log("Preview song: " + songs[i].preview_url);
	        console.log("Album: " + songs[i].album.name);
	        console.log("-----------------------------------");
		}
	});
};

var getMovie = function(movieName)
{
	if(movieName === undefined)
	{
		movieName = "Mr Nobody";
	}

	var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

	request(urlHit, function(error, response, body)
	{
		if(!error && response.statusCode === 200)
		{
			var jsonData = JSON.parse(body);
			console.log("Title: " + jsonData.Title);
			console.log("Year: " + jsonData.Year);
		    console.log("Rated: " + jsonData.Rated);
		    console.log("IMDB Rating: " + jsonData.imdbRating);
		    console.log("Country: " + jsonData.Country);
		    console.log("Language: " + jsonData.Language);
		    console.log("Plot: " + jsonData.Plot);
		    console.log("Actors: " + jsonData.Actors);
		    console.log("Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value);
		}
	});
};

var getRandomTxt = function()
{
	fs.readFile("random.txt", "utf8", function(error, data)
	{
		console.log(data);

		var newArray = data.split(",");

		if(newArray.length === 2)
		{
			pick(newArray[0], newArray[1]);
		}

		else if(newArray.length === 1)
		{
			pick(newArray[0]);
		}
	});
};

var pick = function(caseData, apiData)
{
	switch(caseData)
	{
		case 'my-tweets':
			getTweets();
			console.log("Tweets go here");
			break;

		case 'spotify-this-song':
			getSpotify(apiData);
			break;

		case 'movie-this':
			getMovie(apiData);
			break;

		case 'read-file':
			getRandomTxt();
			break;

		default:
			console.log('LIRI does not know that');	
	}
};

var getInput = function(arg1, arg2)
{
	pick(arg1, arg2);
};

getInput(process.argv[2], process.argv[3]);
