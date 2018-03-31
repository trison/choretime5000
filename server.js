// CALL PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;


//APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect('mongodb://trisonn:newpass@ds149437.mlab.com:49437/chores');

// config app to handle CORS requests
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-ALlow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});
// log requests to console
app.use(morgan('dev'));

// ROUTES FOR API
var path = require('path');

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/angular/views/index.html'));
});

//api
var apiRouter = express.Router();

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

//register routes
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

//app.use('/', basicRoutes);
//app.use('/admin', adminRoutes);
//app.use('/api', apiRoutes);

app.listen(port);
console.log("go to " + port + " bro");