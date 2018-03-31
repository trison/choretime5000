// CALL PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

// MODELS
var User = require('./app/models/user');

//APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect('mongodb://trison:choretime@ds149437.mlab.com:49437/chores');

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

apiRouter.use(function(req, res, next){
	console.log('api use boi');

	//authentication here

	next();
});

apiRouter.get('/', function(req, res){
	res.json({ message: 'welcome to da api' });
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



//register routes
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

//app.use('/', basicRoutes);
//app.use('/admin', adminRoutes);
//app.use('/api', apiRoutes);

app.listen(port);
console.log("go to " + port + " bro");
