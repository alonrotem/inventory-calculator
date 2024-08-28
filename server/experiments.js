const db = require('./services/db');
const helper = require('./helper');
const config = require('./config');
const { raw } = require('mysql2');

console.log("Running query:");

var id=1;
var rows = db.query(
    `insert into wings_babies (parent_wing_id, position_id, length)
    VALUES ((?),(?),(?)), ((?),(?),(?)),((?),(?),(?)),((?),(?),(?)),((?),(?),(?)),((?),(?),(?)),((?),(?),(?))`,
    [
        2, 1, 5,
        2, 1, 5.5,
        2, 1, 6,
        2, 1, 6.5,
        2, 1, 7,
        2, 2, 7.5,
        2, 2, 8
    ]
  ).then((rows) => {
    console.log("Got " + rows.length + " rows");
    console.log("Done");    
  });

