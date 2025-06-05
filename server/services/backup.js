const db = require('./db');
const mysql = require('mysql2');
const helper = require('../helper');

const tables = [
    'customers',
    'material_colors',
    'raw_materials',
    'customer_banks',
    'customer_banks_babies',        //old table
    'customer_banks_allocations',   //new table
    'babies',                       //old table
    'allocation_babies',            //new table
    'transaction_history',
    'wings',
    'wings_babies',
    'customer_hats',
    'hats_wings',
    'orders',
    'orders_status',
    'settings'
];


async function get_table_info(table_name){
    const table_info = await db.query(`SHOW COLUMNS FROM ${table_name};`);
    //console.dir(table_info);
    return helper.emptyOrRows(table_info);
}

async function get_table_records(table_name){
    const rows = await db.query(`SELECT * FROM ${table_name};`);
    return helper.emptyOrRows(rows);
}

function construct_queries(table_name, table_info, records, keep_existing_records){
    let title = `# ${table_name.toUpperCase()}\n# ${"-".repeat(table_name.length + 2)}\n`;
    let values = "";
    let delete_statement = wrap_statement_if_table_exists(`DELETE FROM \`${table_name}\` where @delete_records=TRUE;`, table_name) + `\n\n`;
    let insert_statement = '';
    if (!records || !records.length) {
        //console.log("No records to insert.");
        insert_statement += "# No records to insert.\n\n";   
        //return title + delete_statement;
    }
    if (!table_info || !table_info.length) {
        //console.log("No columns in the table.");
        insert_statement += "# No columns in the table.\n\n";
        delete_statement = '';
        //return title;
    }
    if (records && records.length) {
        insert_statement = `INSERT INTO \`${table_name}\` (${ table_info.map((c) => `\`${c.Field}\``).join(", ") }) \nVALUES\n`;
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
                            case 'tinyint(1)':
                                values += current_rec_value;
                                break;
                            case 'datetime':
                            case 'date':
                                values += "'" + helper.dateStr(current_rec_value) + "'";
                                break;
                            case 'tinyint(1)': //boolean

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
    let onduplicate = `as new_${table_name}\nON DUPLICATE KEY UPDATE\n${ table_info.filter(f=> f.Field != 'id').map((c) => `\`${c.Field}\`=new_${table_name}.\`${c.Field}\``).join(", ") };`;
    
    //return title + delete_statement + wrap_statement_if_table_exists(insert_statement + values + onduplicate, table_name) + "\n\n";
    return {
        title: title,
        deletes: delete_statement,
        inserts: (insert_statement && values && onduplicate && table_name)?
            wrap_statement_if_table_exists(insert_statement + values + onduplicate, table_name) + '\n\n':
            ''
    };
}

function wrap_statement_if_table_exists(sql_statement, table_name){
    return `
        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = '${table_name}');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "${sql_statement}", 'SELECT \\\'Table ${table_name} does not exist\\\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;`;
}

async function create_table_backup_statement(table_name, keep_existing_records=false){
    const tbl_exists = await helper.check_if_table_exists(table_name);
    if(tbl_exists) {
        return construct_queries(
            table_name, 
            await get_table_info(table_name), 
            await get_table_records(table_name),
            keep_existing_records
        );
    }
    else {
        return {
            title: `\n\n# Table ${table_name} does not exist in the database!\n\n`,
            deletes: '',
            inserts: ''
        }
    }
}


//https://stackoverflow.com/a/18471193
async function get_backup(keep_existing_records) {
       
    const statements =
        "use inventory;\nSET @delete_records=" + (!(Boolean(keep_existing_records))).toString().toUpperCase() + ";\n\n";
    let deletes = '# ========== DELETES ==========\n\n';
    let inserts = '# ========== INSERTS ==========\n\n';;
    
    for (const table of tables) {
        let queries = await create_table_backup_statement(table, keep_existing_records);
        deletes += queries.title + queries.deletes;
        inserts += queries.title + queries.inserts;
    }   

    return statements + deletes + inserts;
}

async function clean_table(table_name){
    const tbl_exists = await helper.check_if_table_exists(table_name);
    if(tbl_exists){
        const cleanup_query = `DELETE FROM \`${table_name}\`;`;
        await db.query(cleanup_query);
    }
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
            tables.forEach(async (table) => {
                await clean_table(table);
            });
        }
    }
    await db.query(backup_sql);
}

module.exports = {
    get_backup,
    restore_backup
}