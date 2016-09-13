var pg = require('pg');

pg.defaults.ssl = true;
pg.defaults.poolSize = 10;


// ----------- Passport Authentication setup ---------

var myPassport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



var strat = new LocalStrategy(
  function(username, password, cb) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) { 
      if(err) { return console.error('error fetching client from pool', err); }
      client.query('SELECT * FROM users where username = $1', [username],function(err, result) {
        done();
        
        if (err) { console.error(err); }
        else { 
           if(result.rows.length == 1) {
             
              if (result.rows[0].username != username) {return cb(null, false, {message: 'Incorrect Username'}); } //redundent if ???
              if (result.rows[0].password != password) {return cb(null, false, {message: 'Incorrect Password'}); }
              return cb(null, result.rows[0]);
               
           }
           else { return cb(null, false, {message: 'User does not exist'}); }
         
       }
    });
  });
 
 }
);



myPassport.use(strat);


myPassport.serializeUser(function(user, cb) {
  cb(null, user.userid);
});


myPassport.deserializeUser(function(id, cb) {
    
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) { 
      if(err) { return console.error('error fetching client from pool', err); }
      client.query('SELECT * FROM users where userid = $1', [id],function(err, result) {
        done();
        
        if (err) { console.error(err); return cb(err); }
        cb(null, result.rows[0]);
    });
  });
    
});



module.exports = myPassport;