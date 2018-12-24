var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');
var actorCtrl = require('./actor.js')

var MovieCtrl = {};
module.exports = MovieCtrl;

//GET /Movie/:id - detalhes de um filme
MovieCtrl.readById = function(id, callback){
  var sql = 'select id, title, photo_url, lenght, released_date FROM MovieDB.Movie WHERE id = ?';
  var params = [id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.result(400));
      return;
    }
    actorCtrl.readByMovieId(id, function(actorsErr, resp){
      var movieWithActor = rows[0];
      movieWithActor.actors = resp;
      return callback(response.result(200, movieWithActor));
    })
  });
};

//GET /Movies - lista todos os filmes
MovieCtrl.readAll = function(callback){

  var sql = 'select id, title FROM MovieDB.Movie';
  var params = null;

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.result(400));
      return;
    }
    return callback(response.result(200, rows));
  });
};

MovieCtrl.insert = function(params, callback){
  var sql = 'INSERT INTO MovieDB.Movie(title, photo_url, lenght, released_date) VALUES(?,?,?,?)';
  var params = [params.title, params.photo_url, params.lenght, params.released_date];
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }    
    var id = rows.insertId;
    MovieCtrl.readById(id, callback);
  });  
};
MovieCtrl.edit = function(id, params, callback){
  var sql = 'UPDATE MovieDB.Movie SET title=?, photo_url=?, lenght=?, released_date=? WHERE id =?';
  var params = [params.title, params.photo_url, params.lenght, params.released_date, id];
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    } 
    MovieCtrl.readById(id, callback);
  });  
};

MovieCtrl.delete = function(id, callback){
  
  var sql = 'DELETE from MovieDB.Movie WHERE id = ?';
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

