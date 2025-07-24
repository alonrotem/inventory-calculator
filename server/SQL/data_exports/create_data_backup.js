/*
This file will create a data backup sql file, which can later be executed to load previous data back.

How to run:
*/
const fs = require('node:fs');
var path = require('path');
const raw_materials_service = require("../../services/raw_materials");
const babies_service = require("../../services/babies");
const wings_service = require("../../services/wings");
const hats_service = require("../../services/hats");
const mysql = require('mysql2');
const helper = require('../../helper');
const db = require("../../services/db");

const outputFile = path.join(__dirname, "test.txt");
fs.writeFileSync(outputFile, "");

async function get_table_info(table_name){
    const table_info = await db.query(`SHOW COLUMNS FROM ${table_name};`);
    return helper.emptyOrRows(table_info);
}

function construct_inserts(table_name, table_info, records){
    //console.log(`Constructing inserts for table ${table_name}\n${"-".repeat(table_name.length + 34)}`);
    //console.log(`Table conlumns: ${table_info.length}`);
    //console.log(`Table records: ${records.length}\n`);
    let insert_statement = `# ${table_name.toUpperCase()}\n# ${"-".repeat(table_name.length + 2)}\n\n`;
    let onduplicate = `ON DUPLICATE KEY UPDATE\n${ table_info.filter(f=> f.Field != 'id').map((c) => c.Field + "=values("+c.Field+")").join(", ") };\n`;
    let values = "";
    if (!records || !records.length) {
        //console.log("No records to insert.");
        insert_statement += "# No records to insert.\n";   
    }
    if (!table_info || !table_info.length) {
        //console.log("No columns in the table.");
        insert_statement += "# No columns in the table.\n";   
    }
    else {
        insert_statement += `INSERT INTO \`${table_name}\` (${ table_info.map((c) => c.Field).join(", ") }) \nVALUES\n`;
        for(let row=0; row < records.length; row++)
        {
            let eol = (row == records.length - 1)? "\n" : ",\n";
            values += `(`;
            for(let col = 0; col < table_info.length; col++) { 
                let current_rec_value = records[row][table_info[col].Field];
                if(current_rec_value == null)
                    values += "null";
                else { 
                    if (table_info[col].Type.indexOf("varchar") == 0) {
                        values += mysql.escape(current_rec_value);
                    }
                    else {
                        switch(table_info[col].Type) {
                            case 'int':
                            case 'float':
                                values += current_rec_value;
                                break;
                            case 'datetime':
                            case 'date':
                                values += "'" + helper.dateStr(current_rec_value) + "'";
                                break;
                        }
                    }
                }
                if (col < table_info.length -1){
                    values += ", ";
                }
            }
            values += `)${eol}`;
        }
        

    /*
    ON DUPLICATE KEY UPDATE
    name=values(name), business_name=values(business_name), email=values(email), 
    phone=values(phone), tax_id=values(tax_id), created_at=values(created_at), 
    updated_at=values(updated_at), created_by=values(created_by), updated_by=values(updated_by)    
    */        
    }
    fs.appendFileSync(outputFile, insert_statement + values + onduplicate + "\n\n");
}

//console.log("Fetching...")
let data_promises = [];
data_promises.push(get_table_info('raw_materials'));
data_promises.push(get_table_info('babies'));
data_promises.push(get_table_info('wings'));
data_promises.push(get_table_info('hats'));
data_promises.push(raw_materials_service.getMultiple());
data_promises.push(babies_service.getMultiple());
data_promises.push(wings_service.getMultiple());
data_promises.push(hats_service.getMultiple());

Promise.all(data_promises).then((allData) => {
    const raw_materials_table = allData[0];
    const babies_table = allData[1];
    const wings_table = allData[2];
    const hats_table = allData[3];
    const raw_materials = allData[4].data;
    const babies = allData[5].data;
    const wings = allData[6].data;
    const hats = allData[7].data;

    //console.log(" -> " + raw_materials.length + " raw materials.");
    //console.log(" -> " + babies.length + " babies.");
    //console.log(" -> " + wings.length + " wings.");
    //console.log(" -> " + hats.length + " hats.");
    //console.log();

    construct_inserts("raw_materials", raw_materials_table, raw_materials);
    construct_inserts("babies", babies_table, babies);
    construct_inserts("wings", wings_table, wings);
    construct_inserts("hats", hats_table, hats);
});
