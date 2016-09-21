var pg = require('./pgSetup');


//Function that returns an object formatted specifically for being output via res.json
function formatOutput(status, message, data) {
    var obj = {
        status: status,
        message: message,
        data: data
    }
    return obj;
}



//-----------------------------------------------------------------------------
//-----------Customer CRUD-----------------------------------------------------
//-----------------------------------------------------------------------------

exports.createCustomer = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('INSERT INTO customer VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
        [req.body.customerName, req.body.phone, req.body.emailAddress, req.body.contactInfo, req.body.postalAddress, req.body.deliveryAddress, req.body.deliveryInfo, req.body.customerNotes],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is details of the newly created customer, including the new customerID
        }
        );
    });
    
};


exports.getAllCustomer = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM customer', function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); }
        });
    });
    
};


exports.getCustomer = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM customer WHERE customerid = $1',[req.params.customerID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); }
        });
    });
    
};


exports.updateCustomer = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('UPDATE customer SET customername = $2, phone = $3, emailaddress = $4, contactinfo = $5, postaladdress = $6, deliveryaddress = $7, deliveryinfo = $8, customernotes = $9 WHERE customerid = $1 RETURNING *',
        [req.body.customerID, req.body.customerName, req.body.phone, req.body.emailAddress, req.body.contactInfo, req.body.postalAddress, req.body.deliveryAddress, req.body.deliveryInfo, req.body.customerNotes],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is the newly updated entry
        });
    });
    
};


exports.deleteCustomer = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('DELETE FROM customer WHERE customerid = $1 RETURNING *',[req.params.customerID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is currently details of the deleted entry
        });
    });
    
};




//------------------------------------------------------------------------------
//-----------------------------Users CRUD----------------------------------------
//------------------------------------------------------------------------------


exports.createUser = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING *', 
        [req.body.customerID, req.body.username, req.body.password, req.body.userGroup, req.body.userEmail],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is details of the newly created user, including the new userID
        }
        );
    });
    
};


exports.getAllUsers = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM users', function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput("success", null, result)); }
        });
    });
    
};


exports.getUsers = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM users WHERE userid = $1',[req.params.userID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); }
        });
    });
    
};


exports.updateUsers = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('UPDATE users SET customerid = $2, username = $3, password = $4, usergroup = $5, useremail = $6 WHERE userid = $1 RETURNING *',
        [req.body.userID, req.body.customerID, req.body.username, req.body.password, req.body.userGroup, req.body.userEmail],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); } //response is the newly updated entry
        });
    });
    
};


exports.deleteUsers = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('DELETE FROM users WHERE userid = $1 RETURNING *',[req.params.userID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is currently details of the deleted entry
        });
    });
    
};



//------------------------------------------------------------------------------
//-----------------------------Tool CRUD----------------------------------------
//------------------------------------------------------------------------------


exports.createTool = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('INSERT INTO tool VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *', 
        [req.body.toolLocation, req.body.setupSheet, req.body.qualityControlSheet, req.body.notes],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is details of the newly created tool, including the new toolID
        }
        );
    });
    
};


exports.getAllTool = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM tool', function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput("success", null, result)); }
        });
    });
    
};


exports.getTool = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM tool WHERE toolid = $1',[req.params.toolID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); }
        });
    });
    
};


exports.updateTool = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('UPDATE tool SET toollocation = $2, setupsheet = $3, qualitycontrolsheet = $4, notes = $5 WHERE toolid = $1 RETURNING *',
        [req.body.toolID, req.body.toolLocation, req.body.setupSheet, req.body.qualityControlSheet, req.body.notes],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); } //response is the newly updated entry
        });
    });
    
};


exports.deleteTool = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('DELETE FROM tool WHERE toolid = $1 RETURNING *',[req.params.toolID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is currently details of the deleted entry
        });
    });
    
};



//------------------------------------------------------------------------------
//-----------------------------Item CRUD----------------------------------------
//------------------------------------------------------------------------------


exports.createItem = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('INSERT INTO item VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) RETURNING *', 
        [req.body.toolID, req.body.customerID, req.body.customerCode, req.body.productCode, req.body.price, req.body.minQuantity, req.body.description],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is details of the newly created item, including the new itemID
        }
        );
    });
    
};


exports.getAllItem = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM item', function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput("success", null, result)); }
        });
    });
    
};


exports.getItem = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM item WHERE itemid = $1',[req.params.itemID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); }
        });
    });
    
};


exports.updateItem = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('UPDATE item SET toolid = $2, customerid = $3, customercode = $4, productcode = $5, price = $6, minquantity = $7, description = $8 WHERE itemid = $1 RETURNING *',
        [req.body.itemID, req.body.toolID, req.body.customerID, req.body.customerCode, req.body.productCode, req.body.price, req.body.minQuantity, req.body.description],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); } //response is the newly updated entry
        });
    });
    
};


exports.deleteItem = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('DELETE FROM item WHERE itemid = $1 RETURNING *',[req.params.itemID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is currently details of the deleted entry
        });
    });
    
};



//------------------------------------------------------------------------------
//-----------------------------Order CRUD----------------------------------------
//------------------------------------------------------------------------------


exports.createOrders = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('INSERT INTO orders VALUES (DEFAULT, $1, $2, $3, $4, $5, DEFAULT) RETURNING *', 
        [req.body.customerID, req.body.orderDate, req.body.purchaseOrderNumber, req.body.poDoc, req.body.notes],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is details of the newly created order, including the new orderID
        }
        );
    });
    
};


exports.getAllOrders = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM orders', function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput("success", null, result)); }
        });
    });
    
};


exports.getOrders = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM orders WHERE orderrid = $1',[req.params.orderID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); }
        });
    });
    
};


exports.updateOrders = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('UPDATE orders SET customerid = $2, orderdate = $3, purchaseordernumber = $4, podoc = $5, notes = $6, orderclosed = $7 WHERE orderid = $1 RETURNING *',
        [req.body.orderID, req.body.customerID, req.body.orderDate, req.body.purchaseOrderNumber, req.body.poDoc, req.body.notes, req.body.orderClosed],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); } //response is the newly updated entry
        });
    });
    
};


exports.deleteOrders = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('DELETE FROM orders WHERE orderid = $1 RETURNING *',[req.params.orderID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is currently details of the deleted entry
        });
    });
    
};


//------------------------------------------------------------------------------
//-----------------------------OrderedItems CRUD--------------------------------
//------------------------------------------------------------------------------


exports.createOrderedItems = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('INSERT INTO ordereditems VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *', 
        [req.body.orderID, req.body.itemID, req.body.quantity, req.body.urgent],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is details of the newly created orderedItem, including the new orderedItemID
        }
        );
    });
    
};


exports.getAllOrderedItems = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM ordereditems', function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput("success", null, result)); }
        });
    });
    
};


exports.getOrderedItems = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('SELECT * FROM ordereditems WHERE ordereditemsid = $1',[req.params.orderedItemsID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); }
        });
    });
    
};


exports.updateOrderedItems = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('UPDATE ordereditems SET orderid = $2, itemid = $3, quantity = $4, urgent = $5 WHERE ordereditemsid = $1 RETURNING *',
        [req.body.orderedItemsID, req.body.orderID, req.body.itemID, req.body.quantity, req.body.urgent],
        function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); }
            else { res.json(formatOutput('success', null, result)); } //response is the newly updated entry
        });
    });
    
};



exports.deleteOrderedItems = function(req, res) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) { return console.error('error fetching client from pool', err); }
        client.query('DELETE FROM ordereditems WHERE ordereditemsid = $1 RETURNING *',[req.params.orderedItemsID], function(err, result) {
            done();
            if (err) { console.error(err); res.status(400).json(formatOutput('error', err.message, err)); } 
            else { res.json(formatOutput('success', null, result)); } //response is currently details of the deleted entry
        });
    });
    
};



//TODO: Check all comments of dbFunctions.js & routes.js are right
//      Test all routes and setup tests in postman
//      add routes and funcs for specific instances (e.g. * ordereditems relating to orderID, * orders relating to customerID, etc.)

