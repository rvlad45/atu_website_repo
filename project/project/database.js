/*  database.js hold the connections to MS SQL SERVER,
    it sends queries to obtain data from SQL SERVER,
    it recieves and auto generates a table on the 
    items.html page. It also figures out if the items
    are available and will allow the button to take 
    the user to the cart for checkout.
*/

// Variables Needed to establish the SQL Server Connection
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
var sql = require("../project/node_modules/mssql");
var cors = require('cors');
var app = express(); 

// Variables used to manipulate json data.
var itemData = [];
var tempA = 0;
var checkRows = 0;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());

//Pulls data from the Checkout Form
app.post('/info', (req, res)=> {
    sendData(`${req.body.mySerial}`,`${req.body.myTNum}`,
    `${req.body.myFName}`,`${req.body.myLName}`,`${req.body.myEmail}`,
    `${req.body.myMobile}`,`${req.body.rentDate}`,`${req.body.myChoice}`,
    `${req.body.myComments}`,`${req.body.myChecker}`);
});

const port = 5001;

app.listen(port, () => {
    console.log(`lower Server running on port ${port}`);
});

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

            // Query brings any actively borrowed item's "Serial_Num" and puts it in "avail"
            request.query('select * from Borrower', function (err, avail) {

                // Checks for any issue with the Query
                if (err) console.log(err);

                // Adds the "Serial_Num" of active borrowers in "availableData"
                availableData = avail['rowsAffected'];
                checkRows = recordset['rowsAffected'];

                // Checks if there are any rows in the table
                if (avail['rowsAffected'] != 0) {
                    for(i = 0; i < checkRows; i++) {
                        
                            for(j = 0; j < availableData; j++) {
                                if (recordset.recordset[i].Serial_Num == avail.recordset[j].Serial_Num){
                                    if (avail.recordset[j].Ch_InDate == null) {
                                        recordset.recordset[i].Availability = 'No';
                                    } else {
                                        console.log(avail);
                                        recordset.recordset[i].Availability = 'Yes';
                                    }
                                }
                                if( j == availableData - 1 && recordset.recordset[i].Availability == null) {
                                    recordset.recordset[i].Availability = 'Yes';
                                }
                            }
                    }
                }else {
                    for(i = 0; i < checkRows; i++) {
                        recordset.recordset[i].Availability = 'Yes';
                    }
                }
                tempA = 0;


            // Just to see if I'm getting the right data
            itemData = recordset['recordset'];
            // console.log(itemData);
            });

            // Runs the table maker for items.html
            setTimeout(createTable, 200);
        });

        
    });
});

// Quick check on server status
var server = app.listen(5000, function () {
    console.log('Server is running..');
});

// Function responsible for making the table and all the data inside
function createTable() {
    // JSON data
    const data = itemData;

    // Build path
    const { buildPathHtml } = require('./buildPaths');

    // Finds the data with the name item.(NAME) and puts it in the table
    const createRow = (item) => `
        <tr>           
            <td>${item.Serial_Num}</td>
            <td>${item.Name}</td>
            <td>${item.Make}</td>
            <td>${item.Model}</td>
            <td>${item.Availability}</td>
        </tr>
    `;

    // Creates the table structure in items.html
    const createTable = (rows) => `
        <table id="dataTable">
        <tr>
            <th>Serial Number</td>
            <th>Name</td>
            <th>Make</td>
            <th>Model</td>
            <th>Availability</td>
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
        </head>
        <body>
            <div id="wrapper"> 
                <nav>
                    <a href="index.html">Home</a>
                    <a href="items.html">Inventory</a>
                    <a href="checkout.html">Checkout</a>
                </nav>
                <h1>Inventory</h1>
                <main>
                    <h2>All Equipment Available to Borrow:</h2>
                    ${table}
                </main>
                <footer>
                <div class="footer-widgets">
                <div class="item1">
                    <h3>CAMPUS SUPPORT CENTER</h3>
                </div>
                <div class="item3">
                    <ul>
                        <li>RPL 150</li>
                        <li>(479) 968-0646</li>
                        <li>(866) 400-8022</li>
                        <li>campussupport@atu.edu</li>
                    </ul><br>
                    <h4>Hours of Operation</h4>
                    <ul>
                        <li>Sunday-Thursday 7 am - 1 am</li>
                        <li>Friday-Saturday 7 am - 4 pm</li>
                    </ul>
                </div>
        
                <div class="item2">
                    <h3>QUICK LINKS</h3>
                </div>
                <div class="item4">
                    <ul>
                        <li><a href="https://bblearn.atu.edu/">Blackboard Learn</a></li>
                        <li><a href="http://www.dell.com/dellu/atu">Dell Discounts</a></li>
                        <li><a href="https://www.atu.edu/adminservices/form-tech-equip-removal.php">Equipment Removal</a></li>
                        <li><a href="https://ois.atu.edu/feedback/">Feedback</a></li>
                    </ul>
                </div>
                <div class="item5">
                    <ul>
                        <li><a href="https://ois.atu.edu/information-security/">InfoSec</a></li>
                        <li><a href="https://support.atu.edu/support/solutions">Solutions</a></li>
                        <li><a href="https://ams.atu.edu/">Manage Account</a></li>
                    </ul>
                </div>
                <div class="item6">
                    <ul>
                        <li><a href="http://office365.atu.edu/">Office 365</a></li>
                        <li><a href="https://onetech.atu.edu/">OneTech</a></li>
                        <li><a href="https://ois.atu.edu/computer-based-training/">Online Training</a></li>
                        <li><a href="https://ois.atu.edu/information-security/phishing/">Phishing</a></li>
                    </ul>
                </div>
                <div class="item7">
                    <ul>
                        <li><a href="https://support.atu.edu/support/solutions/folders/7000071466">Policies</a></li>
                        <li><a href="https://ois.atu.edu/hardwaresoftware-purchasing-best-practices/">Purchasing</a></li>
                        <li><a href="https://ois.atu.edu/category/security/data-security-awareness/">Security Awarness</a></li>
                        <li><a href="https://support.atu.edu/support/catalog/items/69">Software Request</a></li>
                        <li><a href="https://get.teamviewer.com/v13/zzac6tp">TeamViewer</a></li>
                    </ul>
                </div>
        
                    <div class="item8">
                        <a href="https://www.atu.edu/"><img src="media/ATU_logo.PNG" width="80" height="40" alt="ATU Logo"></a><br><br>
                        <a>&copy; Copyright 2021 Arkansas Tech University - All Rights Reserved - Website Accessibility</a>
                    </div>
                </div>
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

//Sends data to populate the database from the Checkout Form
function sendData (mySerial,myTNum,myFName,myLName,myEmail,myMobile,rentDate,myChoice,myComments,myChecker) {
    var sql = require("mssql");

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

    sql.connect(config, function (err) {

        if (err) console.log(err);

        let currentDate = new Date();
        let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        var request = new sql.Request();
        var ReturnDate = rentDate;

        request.query("INSERT INTO Borrower (T_Num,Name,Phone,Email,Ch_OutBy,Ch_OutTime,Ch_OutDate,ReturnDate,Comments,Serial_Num) VALUES ('" + myTNum + "','" + myFName + " " 
        + myLName + "','" + myMobile + "','" + myEmail + "','" + myChecker + "','" + time 
        + "','" + rentDate + "','" + ReturnDate + "','" + myComments + "','" + mySerial + "');", function (err, result) {
            if (err) console.log(err);
            console.log(result);
        });
    });
}
