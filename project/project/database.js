var express = require("express");
var bodyParser = require("body-parser");
var sql = require("../project/node_modules/mssql");
var cors = require('cors');
var app = express(); 

var itemData;

// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(cors());

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get('/', function (req, res) {

    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'Level1Auth',
        password: 'SysAdmin21',
        server: 'localhost', 
        database: 'ITS Equipment',
        "options": {
        "encrypt": true,
        "enableArithAbort": true
        }
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('select * from Equipment', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            itemData = recordset;
            console.log(itemData);
        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});

// THIS IS THE FORMAT TO INSERT ITEMS INTO TABLE
forEach(let row in array) {
    $('#my_table').append(`<tr>
        <td>${row.name}</td>
        <td>${row.surname}</td>
        <td>${row.age}</td>
    </tr>`);
}