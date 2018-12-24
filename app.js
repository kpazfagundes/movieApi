var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//C:\Users\<matric>\AppData\Roaming\npm\pm2 start app.js --watch

var port = process.env.PORT || 3000;

app.listen(port, function () {
	'use strict';
	console.log('Listening on port ' + port);
});

app.use(bodyParser.json());

//controllers
var actorCtrl = require('./server/controllers/actor.js')
var movieCtrl = require('./server/controllers/movie.js')
var directorCtrl = require('./server/controllers/director.js')
var userCtrl = require('./server/controllers/user.js')
var UserMoviesCtrl = require('./server/controllers/user_movies.js')

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
	res.send('server is running', 200);
});

app.get('/movies', function (req, res) {
	movieCtrl.readAll(function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.get('/movies/:id', function (req, res) {
	const id = req.params.id;
	movieCtrl.readById(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.post('/movie', function (req, res) {
	movieCtrl.insert(req.body, function(resp){
		res.status(resp.statusCode).json(resp);})
});
app.put('/movie/:id', function (req, res) {
	const id = req.params.id;
	movieCtrl.edit(id, req.body, function(resp){
		res.status(resp.statusCode).json(resp);})
});
app.delete('/movie/:id', function (req, res) {
	const id = req.params.id;
	movieCtrl.delete(id, function(resp){
		res.status(resp.statusCode).json(resp);})
});
app.get('/directors/:id', function (req, res) {
	const id = req.params.id;
	directorCtrl.readBySlug(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/directors', function (req, res) {
	directorCtrl.readAll(function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.post('/directors', function (req, res) {
	directorCtrl.insert(req.body, function(resp){res.status(resp.statusCode).json(resp);})
});

app.put('/directors/:id', function (req, res) {
	const id = req.params.id;
	directorCtrl.edit(id, req.body, function(resp){res.status(resp.statusCode).json(resp);})
});

app.delete('/directors/:id', function (req, res) {
	const id = req.params.id;
	directorCtrl.delete(id, function(resp){res.status(resp.statusCode).json(resp);})
});

app.get('/actors/:id', function (req, res) {
	const id = req.params.id;
	actorCtrl.readBySlug(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/actors', function (req, res) {
	actorCtrl.readAll(function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.post('/actors', function (req, res) {
	actorCtrl.insert(req.body, function(resp){res.status(resp.statusCode).json(resp);})
});

app.put('/actors/:id', function (req, res) {
	const id = req.params.id;
	actorCtrl.edit(id, req.body, function(resp){res.status(resp.statusCode).json(resp);})
});

app.delete('/actors/:id', function (req, res) {
	const id = req.params.id;
	actorCtrl.delete(id, function(resp){res.status(resp.statusCode).json(resp);})
});

app.get('/users/:id', function (req, res) {
	const id = req.params.id;
	userCtrl.readByID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.get('/users', function (req, res) {
	userCtrl.readAll(function (resp) {
		res.status(resp.statusCode).json(resp);
	});
}); 

app.post('/auth/signin', function (req, res) {
	userCtrl.signin(req.body.fbToken, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.post('/user', function (req, res) {
	userCtrl.insert(req.header.fbToken,req.body.userFacebook, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.put('/user/:id', function (req, res) {
	const id = req.params.id;
	userCtrl.edit(id, req.header.fbToken,req.body.userFacebook, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.get('/user/:id/statistic', function (req, res) {
	const user_id = req.params.id;
	UserMoviesCtrl.lengthById(user_id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.get('/user/:id/list', function (req, res) {
	const user_id = req.params.id;
	UserMoviesCtrl.listByID(user_id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
app.post('/user/:id/list', function (req, res) {
	const user_id = req.params.id;
	UserMoviesCtrl.insert(user_id, req.body, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.delete('/user/:id/list/:movie_id', function (req, res) {
	const id = req.params.id;
	const movie_id = req.params.movie_id;
	UserMoviesCtrl.delete(id, movie_id, function(resp){
		res.status(resp.statusCode).json(resp);})
});