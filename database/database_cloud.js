require('dotenv').config();
const mysql = require("mysql2")
const fs = require("fs")

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
    multipleStatements:true,
    ssl: {
        ca:fs.readFileSync("./cert/ca.pem"),
        rejectUnauthorized: true
    }
})

connection.connect((error)=>{
    if(!!error){
        console.log(error)
    }else{
        console.log("========Connected=========")
    }
})

module.exports = connection