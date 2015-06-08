var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("puncher.db");

db.run("INSERT INTO users (username, score) VALUES (?,?),(?,?),(?,?),(?,?)", 
  'bar', 11,
  'qat', 9,
  'kwo', 13,
  'tbr', 8, function(err){
    if(err){
      throw err;
    }
  }
);