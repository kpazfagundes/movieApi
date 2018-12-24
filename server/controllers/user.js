require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');
var request = require("request");
var UserCtrl = {};

module.exports = UserCtrl;

UserCtrl.readByID = function (id, callback) {
    var params = [id];
    var sql = 'SELECT id, name, email, fbToken, photo_url AS photoURL FROM MovieDB.User WHERE id = ?';
    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400));
            return;
        }
        if (!rows || rows.length == 0) {
            callback(response.error(404));
            return;
        }
        callback(response.result(200, rows[0]));
    });
};

UserCtrl.readAll = function(callback){
    var sql = 'SELECT id, name, email, fbToken, photo_url AS photoURL FROM MovieDB.User';
    var params = null;  
    database.query(sql, params, 'release', function(err, rows) {
      if (!rows || rows.length == 0){
        callback(response.result(400));
        return;
      }  
      return callback(response.result(200, rows));
    });
  };

UserCtrl.insert = function (fbToken, userFacebook, callback) {
    params = [userFacebook.name, fbToken, userFacebook.picture.data.url, userFacebook.email];
    sql = 'INSERT INTO MovieDB.User (name, fbToken, photo_url, email) VALUES (?,?,?,?)';
    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }
        UserCtrl.readByID(rows.insertId, callback);
    });
};

UserCtrl.edit = function (id, fbToken, userFacebook, callback) {
    params = [userFacebook.name, fbToken, userFacebook.picture.data.url, userFacebook.email];
    sql = 'UPDATE MovieDB.User SET name = ?, fbToken = ?, photo_url = ? WHERE email = ?';
    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }
        UserCtrl.readByID(id, callback);
    });
};

//POST /auth/signin - autentica o usuário via facebook e atualiza o token no banco
UserCtrl.signin = function (fbToken, callback) {
    
    var fbURL = 'https://graph.facebook.com/me';
    var actions = '&fields=name,email,id,picture';
    var url = fbURL + '?access_token=' + fbToken + actions;
    var options = {
        url: url,
        method: 'GET',
        encoding: null,
        contentType: 'application/json'
    }
    request(options, function (error, resp, body) {
        if (error) {
            callback(response.error(400, error));
            return;
        }
        if (resp.statusCode != 200) {
            callback(response.result(resp.statusCode), { 'message': 'Não foi possível autenticar pelo Facebook.' });
        } else {
            var userFacebook = JSON.parse(body);
            var params = [userFacebook.email];
            var sql = 'SELECT id, name, email, fbToken, photo_url FROM MovieDB WHERE email = ?';
            database.query(sql, params, 'release', function (err, rows) {
                if (err) {
                    callback(response.error(400, err));
                    return;
                }
                if (!rows || rows.length == 0) {
                    UserCtrl.insert(fbToken, userFacebook, callback);
                } else {
                    UserCtrl.edit(rows[0].id, fbToken, userFacebook, callback);
                }
            });
        }
    });
};