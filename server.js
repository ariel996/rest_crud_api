var express = require('express');

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// default route
app.get('/', function(req, res) {
   return res.send({ error: true, message: 'hello' })
});

// connection configuration
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ariel',
    database: 'easyauto'
});

// connect to database
dbConn.connect();

// Retrieve all users
app.get('/users', function(req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({error: false, data: results, message: 'users list'});
    });
});

// Retrieve user with id
app.get('/read-user/:id', function(req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({error: true, message: 'Pleasprovide user id'});
    }
    dbConn.query('SELECT * FROM users WHERE id=?', user_id, function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'user list'});
    });
});

// add a new user
app.post('/add-user', function(req, res) {
    let user = req.body.user;
    if(!user) {
        return res.status(400).send({ error: true, message: 'Please provide user !' });
    }
    dbConn.query("INSERT INTO users SET ?", { user: user }, function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully !'});
    });
});

// update user with id
app.put('/update-user', function(req, res) {
    let user_id =req.body.user_id;
    let user = req.body.user;
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id !'});
    }
    dbConn.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], function(error, results, fields) {
        if (error) throw error;
        return res.send({error: false, data: results, message: 'user has been updated successfully !'});
    });
});

// delete user
app.delete('/delete-user', function(req, res) {
    let user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id '});
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been deleted'});
    })
})

// set port
app.listen(3000, function() {
    console.log('app is running on 3000');
});
module.exports = app;