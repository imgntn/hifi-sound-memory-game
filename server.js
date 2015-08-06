var express = require('express');
var app = express();
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var cors = require('cors')
dotenv.load();

app.set('superSecret', process.env.SECRET);
app.use(cors());
var Score = require('./api/schema/Score');

var User = require('./api/schema/User');

var router = express.Router();

var useAuthentication = false;

router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

if (useAuthentication === true) {

	router.use(function(req, res, next) {

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, app.get('superSecret'), function(err, decoded) {
				if (err) {
					return res.json({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next();
				}
			});

		} else {

			// if there is no token
			// return an error
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

		}
	});
}


router.get('/test', function(req, res) {
	res.json({
		message: 'hooray! welcome to our api!'
	});
});



router.route('/scores')
	// create a score (accessed at POST http://localhost:8080/api/scores)
	.post(function(req, res) {

		var score = new Score(); // create a new instance of the score model
		console.log('HIGHSCORE?', req.body.highscore)
		score.highscore = req.body.highscore; // set the score name (comes from the request)
		// save the score and check for errors
		score.save(function(err) {
			if (err) {
				res.send(err);
			} else {
				res.json({
					message: 'score created!'
				});
			}

		});

	})
	.get(function(req, res) {
		Score.find(function(err, scores) {
			if (err) {
				res.send(err);
			} else {
				res.json(scores);
			}

		});
	});

router.route('/top/:howMany').get(function(req, res) {

	console.log('TOP ROUTE')
	var howMany = req.params.howMany;

	Score.find({}).sort({
		highscore: -1
	}).limit(howMany).exec(function(err, scores) {
		if (err) {
			res.send(err);
		} else {
			res.json(scores);
		}
	});


})

router.route('/scores/:score_id')
	.get(function(req, res) {
		Score.findById(req.params.score_id, function(err, score) {
			if (err) {
				res.send(err);
			} else {
				res.json(score);
			}


		});
	})
	.put(function(req, res) {

		// use our score model to find the score we want
		Score.findById(req.params.score_id, function(err, score) {

			if (err)
				res.send(err);

			score.txt = req.body.txt; // update the scores info

			// save the score
			score.save(function(err) {
				if (err)
					res.send(err);

				res.json({
					message: 'score updated!'
				});
			});

		});
	}).delete(function(req, res) {
		Score.remove({
			_id: req.params.score_id
		}, function(err, score) {
			if (err)
				res.send(err);

			res.json({
				message: 'Successfully deleted'
			});
		});
	});

router.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}

		}

	});
});

// app.get('/setup', function(req, res) {

//   // create a sample user
//   var nick = new User({ 
//     name: 'Nick Cerminara', 
//     password: 'password',
//     admin: true 
//   });

//   // save the sample user
//   nick.save(function(err) {
//     if (err) throw err;

//     console.log('User saved successfully');
//     res.json({ success: true });
//   });
// });



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));

app.use('/api', router);

app.use(express.static(__dirname + '/scripts'));

app.listen(process.env.PORT || 3000);

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI);
//mongoose.connect('mongodb://localhost:27017')