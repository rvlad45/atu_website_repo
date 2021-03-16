const express = require('express');
const sql = require('mssql');
const PORT = 1433;

const app = express();

const config = {
    user: "Level1Auth",
    password: "SysAdmin21",
    server: "DESKTOP-TTS61H0\\SQLEXPRESS",
    database: "ITS Equipment",
    port: 1433
};  

app.get('/', function(req,res) {
    let connection = sql.connect(config, (err) =>{
        if(err){
            console.log(err);
        }else {
            res.send('DB Connected');
            //code for SQL request here
        }
    })
    var request = new sql.Request();           
            request.query('select * from Equipment', function (err, recordset) {           
                if (err) console.log(err)
                res.send(recordset);            
            });
})

/*
app.listen(PORT,function(){
    console.log(`Server started at ${PORT}`);
})
*/