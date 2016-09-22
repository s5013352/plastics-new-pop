var express = require('express');

var router = express.Router();

var pg = require('./pgSetup');

var passport = require('./passportSetup');

var dbFunc = require('./dbFunctions')


//Authentication middleware - takes an array of strings as input
//  if user is not authenticated an error is returned
//  if user is not a member of one of the groups listed in groupArray an error is returned
//  if user is a member of one of the groups listed in groupArray, continues to the next function / middleware
var auth = function(groupArray) {
  return function(req, res, next) {
    
    if (req.isAuthenticated()) {
      
      var hasAccess = false;
      for(var i=0; i < groupArray.length; i++) {
        if (req.user && req.user.usergroup === groupArray[i]) {hasAccess = true;}
      }
      
      if(hasAccess) { next(); }
      else { res.status(401).json({ error: 'Your account does not have access to this feature' }); }
    }
    else { res.status(401).json({ error: 'You are not currently logged in' }); }
  };
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


router.get('/test', dbFunc.getAllCustomer);


//------------------------------------------------------------------------------
//-------------------------------Database Routes--------------------------------
//------------------------------------------------------------------------------


//------------------------------Customer CRUD-----------------------------------

router.post('/db/customer', auth(['rep', 'admin']), dbFunc.createCustomer); //Create a new Customer

router.get('/db/customer', auth(['rep', 'admin']), dbFunc.getAllCustomer); //get all customers

router.get('/db/customer/:customerID', auth(['rep', 'admin']), dbFunc.getCustomer); //get a specific customer

router.put('/db/customer', auth(['rep', 'admin']), dbFunc.updateCustomer); //update a customer

router.delete('/db/customer/:customerID', auth(['rep', 'admin']), dbFunc.deleteCustomer); //delete the provided customer


//-------------------------------Users CRUD-------------------------------------

router.post('/db/users', auth(['admin']), dbFunc.createUser); //Create a new user

router.get('/db/users', auth(['admin']), dbFunc.getAllUsers); //get all users

router.get('/db/users/:userID', auth(['admin']), dbFunc.getUsers); //get a specific user

router.put('/db/users', auth(['admin']), dbFunc.updateUsers); //update a user

router.delete('/db/users/:userID', auth(['admin']), dbFunc.deleteUsers); //delete the provided user


//----------------------------Tool CRUD-----------------------------------------

router.post('/db/tool', auth(['rep', 'admin']), dbFunc.createTool); //Create a new Tool

router.get('/db/tool', auth(['rep', 'admin']), dbFunc.getAllTool); //get all tools

router.get('/db/tool/:toolID', auth(['rep', 'admin']), dbFunc.getTool); //get a specific tool

router.put('/db/tool', auth(['rep', 'admin']), dbFunc.updateTool); //update a tool

router.delete('/db/tool/:toolID', auth(['rep', 'admin']), dbFunc.deleteTool); //delete the provided tool


//------------------------------Item CRUD---------------------------------------

router.post('/db/item', auth(['rep', 'admin']), dbFunc.createItem); //Create a new Item

router.get('/db/item', auth(['rep', 'admin']), dbFunc.getAllItem); //get all items

router.get('/db/item/:itemID', auth(['rep', 'admin']), dbFunc.getItem); //get a specific item

router.put('/db/item', auth(['rep', 'admin']), dbFunc.updateItem); //update an item

router.delete('/db/item/:itemID', auth(['rep', 'admin']), dbFunc.deleteItem); //delete the provided item


//-------------------------Orders CRUD------------------------------------------

router.post('/db/orders', auth(['customer','rep', 'admin']), dbFunc.createOrders); //Create a new order

router.get('/db/orders', auth(['customer', 'rep', 'admin']), dbFunc.getAllOrders); //get all orders

router.get('/db/orders/:orderID', auth(['customer', 'rep', 'admin']), dbFunc.getOrders); //get a specific order

router.put('/db/orders', auth(['customer', 'rep', 'admin']), dbFunc.updateOrders); //update an order

router.delete('/db/orders/:orderID', auth(['customer', 'rep', 'admin']), dbFunc.deleteOrders); //delete the provided order


//------------------OrderedItems CRUD-------------------------------------------

router.post('/db/orderedItems', auth(['rep', 'admin']), dbFunc.createOrderedItems); //Create a new OrderedItem

router.get('/db/orderedItems', auth(['rep', 'admin']), dbFunc.getAllOrderedItems); //get all OrderedItems

router.get('/db/orderedItems/:orderedItemsID', auth(['rep', 'admin']), dbFunc.getOrderedItems); //get a specific orderedItem

router.put('/db/orderedItems', auth(['rep', 'admin']), dbFunc.updateOrderedItems); //update an orderedItem

router.delete('/db/orderedItems/:orderedItemsID', auth(['rep', 'admin']), dbFunc.deleteOrderedItems); //delete the provided orderedItem


//---------------------------Ease of use DB routes------------------------------

router.get('/db/ordersby/:customerID', auth(['rep', 'admin']), dbFunc.getAllOrdersByCustID); //returns all orders placed by a single customer

router.get('/db/itemsby/:customerID', auth(['rep', 'admin']), dbFunc.getAllItemsByCustID); //returns all items owned by a single customer

router.get('/db/usersby/:customerID', auth(['admin']), dbFunc.getAllUsersByCustID); //returns all users associated with a given customer

router.get('/db/ordereditemsby/:orderID', auth(['rep', 'admin']), dbFunc.getAllOrderedItemsByOrderID); //returns all items relating to a specifc order





//------------------------------------------------------------------------------
//------------------------------Auth Routes-------------------------------------
//------------------------------------------------------------------------------


//route to test if login succesful (remove once front end login page / route is implemented)
router.get('/loggedin', auth(['customer', 'rep', 'admin']), function(req, res) { res.json({ message: 'You are currently logged in'}); });


//route for logging into app
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
  //next();
  
});


//route for logging out of app
router.get('/logout', function(req, res) {
    req.logout();
    //res.redirect('/');
    res.json({message: 'You have been logged out'});
  });




//------------------------------------------------------------------------------
//----------------------------------Front End Routes----------------------------
//------------------------------------------------------------------------------



//Front End Route - handles all angular requests--------------------------------
router.get('*', function(req, res) {
    //res.sendFile(__dirname + '/public/views/index.html'); // load our public/index.html file
    res.json({ message: 'Under Construction' });
});






module.exports = router;
