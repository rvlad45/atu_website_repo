var express = require("express");
var bodyParser = require("body-parser");
var sql = require("../project/node_modules/mssql");
var cors = require('cors');
var app = express(); 

// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(cors());

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

var dbConfig = {
server: "DESKTOP-TTS61H0\\SQLEXPRESS",
database:"ITS Equipment",
user: "Level1Auth",
password:"SysAdmin21",
port:1433
}

var conn;
connectToDB=function(){
conn = new sql.ConnectionPool(dbConfig);
conn.connect(function (err){
if (err){
console.log(err);
return;
} else {
    console.log("connected");
}

}); }