var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var ActorCtrl = {};
module.exports = ActorCtrl;

ActorCtrl.readByMovieId = function (movieId, callback) {
  var sql = `SELECT Star.id, Star.name, Star.photo_url AS photoURL
              FROM Star
              INNER JOIN StarMovie
              ON Star.id = StarMovie.star_id
              WHERE is_actor = true
              AND StarMovie.movie_id = ?`;

  var params = [movieId];

  database.query(sql, params, 'release', function(err, rows){
    if (rows && rows.length > 0){
      return callback(err, rows);
    }
    return callback(err, null);
  });
};

//GET /Actor/:id - detalhes de um Actor
ActorCtrl.readBySlug = function(id, callback){
  var sql = 'select id, name, photo_url FROM MovieDB.Star WHERE is_actor = true AND id = ?';
  var params = [id];

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.result(400));
      return;
    }

    return callback(response.result(200, rows[0]));
  });
};


//GET /Actor - lista todos os Actores
ActorCtrl.readAll = function(callback){

  var sql = 'select id, name FROM MovieDB.Star WHERE is_actor = true';
  var params = null;

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.result(400));
      return;
    }

    return callback(response.result(200, rows));
  });
};
//POST /Actor - insere novo Ator
ActorCtrl.insert = function(params, callback){
  var sql = 'INSERT INTO MovieDB.Star(name, photo_url, is_actor, is_director) VALUES(?,?,?,?)';
  var params = [params.name, params.photo_url, true, false];
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }    
    var id = rows.insertId;
    ActorCtrl.readBySlug(id, callback);
  });
  
};

//PUT /Actors:id - altera dados de um Actor
ActorCtrl.edit = function(id, params, callback){
  
  var sql = 'UPDATE MovieDB.Star SET name = ?, photo_url = ? WHERE id = ? AND is_actor = true';
  var params = [params.name, params.photo_url, id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }    
    ActorCtrl.readBySlug(id, callback);
  });
};
//Delete /Actor:id - deleta dados de um Ator
ActorCtrl.delete = function(id, callback){
  
  var sql = 'DELETE from MovieDB.Star WHERE id = ? AND is_actor = true';
  var params = [id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }    
    callback(response.result(200, 'Deletado com sucesso!'));
      return;
  });
};
