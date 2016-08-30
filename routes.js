var express = require('express');

var router = express.Router();



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


//Front End Route - handles all angular requests--------------------------------
router.get('*', function(req, res) {
    //res.sendFile(__dirname + '/public/views/index.html'); // load our public/index.html file
    res.json({ message: 'Under Construction' });
});





module.exports = router;
