/*  database.js hold the connections to MS SQL SERVER,
    it sends queries to obtain data from SQL SERVER,
    it recieves and auto generates a table on the 
    items.html page. It also figures out if the items
    are available and will allow the button to take 
    the user to the cart for checkout.
*/

// Variables Needed to establish the SQL Server Connection
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("../project/node_modules/mssql");
var cors = require('cors');
var app = express(); 

// Variables used to manipulate json data.
var itemData = [];
var availableData = [];

// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(cors());

// Setting up the server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// Connection to the server
app.get('/', function (req, res) {
    var sql = require("mssql");

    // Config for database
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

    // Connects to the database
    sql.connect(config, function (err) {

        // Checks if there is any issue with connection
        if (err) console.log(err);

        // Creates a Request object
        var request = new sql.Request();

        // Query to the Equipment Database placed in "recordset"
        request.query('select * from Equipment', function (err, recordset) {

            // Checks for any issue with the Query
            if (err) console.log(err);

            // Sets the itemData variable to hold proper json data
            itemData = recordset['recordset'];

            // Send the json data to the server
            res.send(recordset['recordset']);

            // Runs the table maker for items.html
            createTable();
        });

        // Query brings any actively borrowed item's "Serial_Num" and puts it in "avail"
        request.query('select Serial_Num from Borrower', function (err, avail) {

            // Checks for any issue with the Query
            if (err) console.log(err);

            // Checks if there are any rows in the table
            if (!avail['rowsAffected'] == 0) {
                // Adds the "Serial_Num" of active borrowers in "availableData"
                availableData = avail['recordset'];
            }

            // Just to see if I'm getting the right data
            console.log(availableData);
        });
    });
});

// Quick check on server status
var server = app.listen(5000, function () {
    console.log('Server is running..');
});

// Function responsible for making the table and all the data inside
function createTable() {
    // IDK but its required
    const fs = require('fs');

    // JSON data
    const data = itemData;

    // Build path
    const { buildPathHtml } = require('./buildPaths');

    // Finds the data with the name item.(NAME) and puts it in the table
    const createRow = (item) => `
        <tr>
            <td><a href="cart.html">${item.Availability}</a></td>
            <td>${item.Serial_Num}</td>
            <td>${item.Name}</td>
            <td>${item.Make}</td>
            <td>${item.Model}</td>
        </tr>
    `;

    // Creates the table structure in items.html
    const createTable = (rows) => `
        <table>
        <tr>
            <th>Availability</td>
            <th>Serial_Num</td>
            <th>Name</td>
            <th>Make</td>
            <th>Model</td>
        </tr>
        ${rows}
        </table>
    `;

    // HTML Code so that it can be deleted and rebuild for every update
    const createHtml = (table) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <title>ITS Equipment - Inventory</title>
            <meta charset="utf-8">
            <link href="style.css" rel="stylesheet">
            <link rel="icon" type="image/png" href="media/Belltower_logo.PNG"/>
            <meta name="description" content="This is the equipment available for rent.">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="script" href="/data.js">
        </head>
        <body>
            <div id="wrapper"> 
                <nav>
                    <a href="index.html">Home</a>
                    <a href="items.html">Inventory</a>
                    <a href="cart.html">Cart</a>
                    <a href="checkout.html">Checkout</a>
                </nav>
                <h1>Inventory</h1>
                <main>
                    <h2>All Equipment Available for Rent:</h2>
                    ${table}
                </main>
                <footer>
                    <a href="https://www.atu.edu/"><img src="media/ATU_logo.PNG" width="80" height="40" alt="ATU Logo"></a><br><br>
                    <a>Copyright &copy; 2021 Arkansas Tech University - All Rights Reserved - Website Accessibility</a>
                </footer>
            </div>
        </body>
    </html>
    `;


    const doesFileExist = (filePath) => {
	    try {
		    fs.statSync(filePath); // get information of the specified file path.
		    return true;
	    } catch (error) {
		    return false;
	    }
    };

    try {
	    /* Check if the file for `html` build exists in system or not */
	    if (doesFileExist(buildPathHtml)) {
		    console.log('Deleting old build file');
		    /* If the file exists delete the file from system */
		    fs.unlinkSync(buildPathHtml);
	    }
	    /* generate rows */
	    const rows = data.map(createRow).join('');
	    /* generate table */
	    const table = createTable(rows);
	    /* generate html */
	    const html = createHtml(table);
	    /* write the generated html to file */
	    fs.writeFileSync(buildPathHtml, html);
	    console.log('Succesfully created an HTML table');
    } catch (error) {
	    console.log('Error generating table', error);
    }
}