var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
}

module.exports = User;

//save info
//注意这里有prototype 下面的get没有
User.prototype.save = function(callback) {
  var user = {
    name: this.name,
    password: this.password,
    eamil: this.email
  };

  mongodb.open(function(err, db){
    if (err) {
      return callback(err);
    }

    db.collection('users', function(err, collection){
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.insert(user,{
        safe: true
      },function (err, user){
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user[0]);
      });
    });
  });
};

User.get = function (name, callback){
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection){
        if (err) {
          mongodb.close();
          return callback(err);
        }

        collection.findOne({
          name:name
        }, function (err,user){
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null,user);
        });
    });
  });
};
