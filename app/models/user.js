// packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//user schema
var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, index:{ unique: true }},
	password: { type: String, required: true, select: false }
});

//hash password before save user
UserSchema.pre('save', function(next){
	var user = this;
	//hash password inly if pass changed or user is new
	if (!user.isModified('password')) return next();

	//generate hash
	bcrypt.hash(user.password, null, null, function(err, hash){
		if (err) return next(err);
		
		//change password to hashed version
		user.password = hash;
		next();
	});
});

//compare given password with database hash
UserSchema.methods.comparePassword = function(password){
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

//return model
module.exports = mongoose.model('User', UserSchema);
