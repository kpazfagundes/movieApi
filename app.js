var express = require('express');
var app = express();
// var bodyParser = require('body-parser');


allowCors = function(req, res, next) {
	// res.header('Access-Control-Allow-Origin', '127.0.0.1:3000');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type: text/xml');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
};


var port = process.env.PORT || 3000;

app.listen( port, function() {
	'use strict';
	console.log( 'Listening on port ' + port );
} );


app.use(allowCors);



// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
	res.send('server is running',200);
});

app.get('/movies', function(req, res) {
	var movies = [{
		id: 1,
		title: 'lagoa azul 1',
		year: '20000'
	}];
	res.send(movies,200);
});
app.get('/movies/:id', function(req, res) {
	
	const id = req.params.id;	
	var movies = [{
		id: 1,
		title: 'lagoa azul 1',
		year: '20000'
	},
	{
		id: 2,
		title: 'lagoa azul 2',
		year: '1520'
	}];
	
	const movie = movies.find(value => {
		return value.id == id;
	});
	if (movie) {
		res.status(200).send(movie);
	} else {
		res.status(404).send('Filme não encontrado');	
	}
});
