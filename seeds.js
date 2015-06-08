var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("puncher.db");

// db.run("INSERT INTO users (username, password, score, facebook) VALUES (?,?,?,?),
//   ")