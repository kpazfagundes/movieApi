var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var DirectorCtrl = {};
module.exports = DirectorCtrl;


//GET /Director/:id - detalhes de um diretor
DirectorCtrl.readBySlug = function(id, callback){
  var sql = 'select id, name, photo_url FROM MovieDB.Star WHERE is_director = true AND id = ?';
  var params = [id];

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.result(400));
      return;
    }

    return callback(response.result(200, rows[0]));
  });
};


//GET /directors - lista todos os diretores
DirectorCtrl.readAll = function(callback){

  var sql = 'select id, name FROM MovieDB.Star WHERE is_director = true';
  var params = null;

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.result(400));
      return;
    }

    return callback(response.result(200, rows));
  });
};
//POST /director - insere novo diretor
DirectorCtrl.insert = function(params, callback){
  var sql = 'INSERT INTO MovieDB.Star(name, photo_url, is_actor, is_director) VALUES(?,?,?,?)';
  var params = [params.name, params.photo_url, false, true];
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }    
    var id = rows.insertId;
    DirectorCtrl.readBySlug(id, callback);
  });
  
};

//PUT /directors:id - altera dados de um diretor
DirectorCtrl.edit = function(id, params, callback){
  
  var sql = 'UPDATE MovieDB.Star SET name = ?, photo_url = ? WHERE id = ? AND is_director = true';
  var params = [params.name, params.photo_url, id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }    
    DirectorCtrl.readBySlug(id, callback);
  });
};
//Delete /directors:id - deleta dados de um diretor
DirectorCtrl.delete = function(id, callback){
  
  var sql = 'DELETE from MovieDB.Star WHERE id = ? AND is_director = true';
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
