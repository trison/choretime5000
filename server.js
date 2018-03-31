// CALL PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

// MODELS
var User = require('./app/models/user');

//APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect('mongodb://trison:choretime@ds149437.mlab.com:49437/chores');
var port = process.env.PORT || 8080;
var superSecret = 'gr8chores';

// config app to handle CORS requests
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-ALlow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log requests to console
app.use(morgan('dev'));

var path = require('path');
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/angular/views/index.html'));
});

// ROUTES
//api
var apiRouter = express.Router();

apiRouter.post('/authenticate', function(req, res){
	//find user
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user){
		if (err) throw err;

		//no user with that username found
		if (!user){
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else if (user){
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword){
				res.json({
					success: false,
					message: 'Authentication failed: Wrong password.'
				});
			} else{
				//if user found and pass good, create token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiresIn: 1440 //24 hours
				});
				//return the info including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token boi',
					token: token
				});
			}
		}
	});
});

//routing authentication
apiRouter.use(function(req, res, next){
	console.log('api use boi');

	//check header / url parameters / post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access=token'];

	//decode token
	if (token){
		//verifies secret and checks exp
		jwt.verify(token, superSecret, function(err, decoded){
			if (err) {
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token'
				});
			} else{
				//if all good, save decoded request to use in other routes
				req.decoded = decoded;
				next();
			}
		});
	}
	else{
		//if no token, return HTTP 403 response (access forbidden) and error msg
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

apiRouter.get('/', function(req, res){
	res.json({ message: 'welcome to da api' });
});

//users
apiRouter.route('/users')
	//create user
	.post(function(req, res){
		var user = new User();
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err){
			if(err){
				//duplicate entry
				if (err.code==11000)
					return res.json({ success: false, message: 'A user with that username already exists' });
				else return res.send(err);
			}
			res.json({ message: 'User created!' });
		});
	})
	//get users
	.get(function(req, res){
		User.find(function(err, users){
			if (err) res.send(err);
			res.json(users);
		});
	})
	
//user
apiRouter.route('/users/:user_id')
	.get(function(req, res){
		User.findById(req.params.user_id, function(err, user){
			if (err) res.send(err);
			res.json(user);
		});
	})
	.put(function(req, res){
		User.findById(req.params.user_id, function(err, user){
			if (err) res.send(err);
			//update only if new
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.username) user.password = req.body.password;

			//save user
			user.save(function(err){
				if (err) res.send(err);
				res.json({ message: 'User updated!' });
			});
		});
	})
	.delete(function(req, res){
		User.remove({ _id: req.params.user_id }, function(err, user){
			if (err) return res.send(err);
			res.json({ message: 'Successfully deleted' });
		});
	});

apiRouter.get('/me', function(req, res){
	//decoded from middleware
	res.send(req.decoded);
});

//admin
var adminRouter = express.Router();

adminRouter.use(function(req, res, next){
	console.log(req.method, req.url);

	next();
});

adminRouter.get('/', function(req, res){
	res.send('THE DASHBOARD');
});

adminRouter.get('/users', function(req, res){
	res.send('ALL THE USERS');
});

adminRouter.get('/posts', function(req, res){
	res.send('ALL THE POSTS');
});


//register routes
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

//app.use('/', basicRoutes);
//app.use('/admin', adminRoutes);
//app.use('/api', apiRoutes);

app.listen(port);
console.log("go to " + port + " bro");
