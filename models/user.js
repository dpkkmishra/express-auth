var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/expressauth');

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type:  String,
		index: true
	},
	password: {
		type: String,
		bcrypt:true,
		required:true
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileimage: {
		type: String
	}
});

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.getUserById = function(id, callback) {	
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.comparePassword = function(userPassword, hash, callback) {
	bcrypt.compare(userPassword, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	})
}

module.exports.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		// Set Hashed pw 
		newUser.password = hash;

		// Create User
		newUser.save(callback);
	});
}