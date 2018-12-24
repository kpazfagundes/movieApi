var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var UserMoviesCtrl = {};
module.exports = UserMoviesCtrl;

UserMoviesCtrl.lengthById = function (userId, callback) {
    var sql = `SELECT lenght FROM MovieDB.Movie
    INNER JOIN MovieDB.UserMovie
    on UserMovie.watched = MovieDB.Movie.id 
    and MovieDB.UserMovie.user_id = ?`;
    var params = [userId];
    var resultado = {};
    database.query(sql, params, 'release', function (err, rows) {
        if (rows && rows.length > 0) {
            const reducer = (accumulator, currentValue) => accumulator + currentValue.lenght;
            resultado.userId = userId;
            resultado.lenght = rows.reduce(reducer, 0);
            return callback(response.result(200, resultado));
        }

        return callback(err, null);
    });
};
UserMoviesCtrl.listByID = function (user_id, callback) {
    var sql = 'select * FROM MovieDB.UserMovie WHERE user_id = ?';
    var params = [user_id];
    database.query(sql, params, 'release', function (err, rows) {
        if (!rows || rows.length == 0) {
            callback(response.result(400));
            return;
        }
        const data = {
            user_id,
            watched: rows.filter(value => value.watched === 1).map(item => item.movie_id),
            toWatch: rows.filter(value => value.toWatch === 1).map(item => item.movie_id),
            favorite: rows.filter(value => value.favorite === 1).map(item => item.movie_id)
        }
        return callback(response.result(200, data));
    });
};
UserMoviesCtrl.insert = function (user_id, data, callback) {
    var sql = 'select toWatch,watched,favorite,review,user_id,movie_id from MovieDB.UserMovie where movie_id=? and user_id=?';
    var params = [data.movie_id, user_id];
    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            return callback(err);
        }
        if (!rows || rows.length == 0) {
            const item = {
                toWatch: data.list === 'toWatch' ? 1 : 0,
                watched: data.list === 'watched' ? 1 : 0,
                favorite: data.list === 'favorite' ? 1 : 0,
                review: 0,
                user_id: id,
                movie_id: data.movieId
            }
            console.log("item ", item)
            var sqlInsert = 'INSERT INTO MovieDB.UserMovie (toWatch, watched, favorite, review, user_id, movie_id) values (?,?,?,?,?,?)';
            var paramsInsert = [item.toWatch, item.watched, item.favorite, item.review, item.user_id, item.movie_id];
            database.query(sqlInsert, paramsInsert, 'release', function (err, rows) {
                if (err) {
                    callback(response.error(400, err));
                    return;
                }
                UserMoviesCtrl.listByID(item.user_id, callback);
                return;
            });
        } else {
            const item = rows[0];
            item.toWatch = data.list === 'toWatch' ? 1 : item.toWatch;
            item.watched = data.list === 'watched' ? 1 : item.watched;
            item.favorite = data.list === 'favorite' ? 1 : item.favorite;
            var sqlEdit = 'UPDATE MovieDB.UserMovie SET toWatch = ?, watched = ? ,favorite = ?, review = ? where user_id = ? and movie_id = ?';
            var paramsEdit = [item.toWatch, item.watched, item.favorite, item.review, item.user_id, item.movie_id];
            database.query(sqlEdit, paramsEdit, 'release', function (err, rows) {
                if (err) {
                    callback(response.error(400, err));
                    return;
                }
                UserMoviesCtrl.listByID(item.user_id, callback);
                return;
            })
        }
    });
};
UserMoviesCtrl.delete = function(id, movie_id, callback){
  
    var sql = 'DELETE from MovieDB.UserMovie where movie_id=? and user_id=?';
    var params = [id, movie_id];
    
    database.query(sql, params, 'release', function(err, rows) {
      if (err) {
        callback(response.error(400, err));
        return;
      }    
      callback(response.result(200, 'Deletado com sucesso!'));
        return;
    });
  };
