const db = require('./db');
const mysql = require('mysql2');
const helper = require('../helper');
const raw_materials_service = require("./raw_materials");

async function get_table_info(table_name){
    const table_info = await db.query(`SHOW COLUMNS FROM ${table_name};`);
    //console.dir(table_info);
    return helper.emptyOrRows(table_info);
}

async function get_table_records(table_name){
    const rows = await db.query(`SELECT * FROM ${table_name};`);
    //console.dir(rows);
    return helper.emptyOrRows(rows);
}

function construct_inserts(table_name, table_info, records, keep_existing_records){
    console.log(`Table conlumns: ${table_info.length}`);
    console.log(`Table records: ${records.length}\n`);
    let insert_statement = `# ${table_name.toUpperCase()}\n# ${"-".repeat(table_name.length + 2)}\n\n`;
    let onduplicate = `as new_${table_name}\nON DUPLICATE KEY UPDATE\n${ table_info.filter(f=> f.Field != 'id').map((c) => `\`${c.Field}\`=new_${table_name}.\`${c.Field}\``).join(", ") };\n`;
    let values = "";
    if (!records || !records.length) {
        console.log("No records to insert.");
        insert_statement += "# No records to insert.\n";   

        if(!keep_existing_records) {
            insert_statement += `DELETE FROM \`${table_name}\`;\n\n`;
        }
        return insert_statement;
    }
    if (!table_info || !table_info.length) {
        console.log("No columns in the table.");
        insert_statement += "# No columns in the table.\n";
        return insert_statement;
    }
    else {
        if(!keep_existing_records) {
            insert_statement += `DELETE FROM \`${table_name}\`;\n\n`;
        }        
        insert_statement += `INSERT INTO \`${table_name}\` (${ table_info.map((c) => `\`${c.Field}\``).join(", ") }) \nVALUES\n`;
        for(let row=0; row < records.length; row++)
        {
            let eol = (row == records.length - 1)? "\n" : ",\n";
            values += `(`;
            for(let col = 0; col < table_info.length; col++) { 
                let current_rec_value = records[row][table_info[col].Field];
                if(current_rec_value == null)
                    values += "null";
                else { 
                    if (
                        table_info[col].Type.indexOf("varchar") == 0 || 
                        table_info[col].Type.indexOf("enum") == 0
                    ) {
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
    }
    return insert_statement + values + onduplicate + "\n\n";
    //fs.appendFileSync(outputFile, insert_statement + values + "\n\n");
}

async function create_table_backup_statement(table_name, keep_existing_records=false){
    return construct_inserts(
        table_name, 
        await get_table_info(table_name), 
        await get_table_records(table_name),
        keep_existing_records
    );
}


//https://stackoverflow.com/a/18471193
async function get_backup(keep_existing_records) {   
    let inserts =
        "use inventory;\n\n" +
        await create_table_backup_statement('raw_materials', keep_existing_records) +
        await create_table_backup_statement('customers', keep_existing_records) +
        await create_table_backup_statement('customer_banks', keep_existing_records) +
        await create_table_backup_statement('customer_banks_babies', keep_existing_records) +
        await create_table_backup_statement('babies', keep_existing_records) +
        await create_table_backup_statement('transaction_history', keep_existing_records) +
        await create_table_backup_statement('wings', keep_existing_records) +
        await create_table_backup_statement('wings_babies', keep_existing_records) +
        await create_table_backup_statement('hats', keep_existing_records) +
        await create_table_backup_statement('hats_wings', keep_existing_records) +
        await create_table_backup_statement('settings', keep_existing_records) 
    ;
    return inserts;
}

module.exports = {
    get_backup
}