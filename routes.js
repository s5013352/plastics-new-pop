var express = require('express');

var router = express.Router();

var pg = require('pg');

pg.defaults.ssl = true;
pg.defaults.poolSize = 10;


var passport = require('./passportSetup');


var auth = function(req, res, next) { 
  if (!req.isAuthenticated()) res.json({message: 'nope'}); //can us req.isAuthenticated() to check if a user is autheticated
  else next(); 
};


/* -------example for API routing below ---------

router.route('/users/:user_id')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(function(req, res, next) {
  res.json(req.user);
})
.put(function(req, res, next) {
  // just an example of maybe updating the user
  req.user.name = req.params.name;
  // save user ... etc
  res.json(req.user);
})
.post(function(req, res, next) {
  next(new Error('not implemented'));
})
.delete(function(req, res, next) {
  next(new Error('not implemented'));
});

*/


//db test route

router.route('/testdb')

.all(function(req, res, next) {
  // do stuff
  next();
})

.get(function(req, res, next) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if(err) { return console.error('error fetching client from pool', err); }
    client.query('SELECT * FROM customer', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})



//route to test if login succesful (remove once front end login page / route is implemented)
router.get('/login', auth, function(req, res) { res.json({ message: 'login get'}); });


//route for logging into app
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
  //next();
  
});


//route for logging out of app
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });





//Front End Route - handles all angular requests--------------------------------
router.get('*', function(req, res) {
    //res.sendFile(__dirname + '/public/views/index.html'); // load our public/index.html file
    res.json({ message: 'Under Construction' });
});





module.exports = router;
