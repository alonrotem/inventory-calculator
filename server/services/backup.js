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
    //console.log(`Table conlumns: ${table_info.length}`);
    //console.log(`Table records: ${records.length}\n`);
    let insert_statement = `# ${table_name.toUpperCase()}\n# ${"-".repeat(table_name.length + 2)}\n`;
    let onduplicate = `as new_${table_name}\nON DUPLICATE KEY UPDATE\n${ table_info.filter(f=> f.Field != 'id').map((c) => `\`${c.Field}\`=new_${table_name}.\`${c.Field}\``).join(", ") };\n`;
    let values = "";
    if (!records || !records.length) {
        //console.log("No records to insert.");
        insert_statement += "# No records to insert.\n";   

        insert_statement += `DELETE FROM \`${table_name}\` where @delete_records=TRUE;\n\n`;

        return insert_statement;
    }
    if (!table_info || !table_info.length) {
        //console.log("No columns in the table.");
        insert_statement += "# No columns in the table.\n";
        return insert_statement;
    }
    else {
        insert_statement += `DELETE FROM \`${table_name}\` where @delete_records=TRUE;\n\n`;

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
        "use inventory;\nSET @delete_records=" + (!(Boolean(keep_existing_records))).toString().toUpperCase() + ";\n\n" +
        await create_table_backup_statement('customers', keep_existing_records) +
        await create_table_backup_statement('raw_materials', keep_existing_records) +
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

async function restore_backup(backup_sql, cleanup){
    //if there is a specific cleanup varialbe
    let delete_records_variable = backup_sql.match(/SET\s+\@delete_records\s*\=\s*[^\;]*/);
    if(delete_records_variable && delete_records_variable.length > 0) {
        let var_set=(cleanup)? "TRUE":"FALSE";
        backup_sql = backup_sql.replace(/(SET\s+\@delete_records\s*\=\s*)[^\;]*/, `$1${var_set}`);
    }
    else {
        if(cleanup) {
            //manually cleanup before running the restore
            const cleanup_query = 
                `DELETE FROM \`customers\`;
                 DELETE FROM \`raw_materials\`;
                 DELETE FROM \`customer_banks\`;
                 DELETE FROM \`customer_banks_babies\`;
                 DELETE FROM \`babies\`;
                 DELETE FROM \`transaction_history\`;
                 DELETE FROM \`wings\`;
                 DELETE FROM \`wings_babies\`;
                 DELETE FROM \`hats\`;
                 DELETE FROM \`hats_wings\`;
                 DELETE FROM \`settings\`;
                `;
                await db.query(cleanup_query);

        }
    }
    await db.query(backup_sql);
}

module.exports = {
    get_backup,
    restore_backup
}