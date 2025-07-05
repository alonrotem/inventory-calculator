const db = require('./db');
const helper = require('../helper');

function parseSetting(resultObj, setting) {
    let value = (setting["value"]) ? setting["value"] : setting["default_value"];

    switch(setting["value_type"]){
        case "string":
            resultObj[setting["key"]] = value;
            break;
        case "number":
            if(!isNaN(parseFloat(value)))
                resultObj[setting["key"]] = parseFloat(value);
            break;
        case "boolean":
            resultObj[setting["key"]] = (value == "1");
            break;
    }
}

async function getSettings(settingKeys) {
    let filter = "";
    if (settingKeys && settingKeys.length > 0) {
        let placeholder = "(" + Array(settingKeys.length).fill("(?)").join(",") + ")";
        filter = `where \`key\` in ${placeholder}`;
    }
    const rows = await db.query(
      `select * from settings ${filter};`,
      settingKeys
    );
    let settings =  helper.emptyOrRows(rows);
    let results = {};
    settings.forEach(async (setting) => {
        parseSetting(results, setting);
    });
    return results;
}

async function saveSettings(settings, active_connection=null){
    let self_executing = false;
    if(!active_connection) {
        active_connection = await db.trasnaction_start();
        self_executing = true;
    }
    try {
        //console.dir(settings);
        let new_values_array = [];
        let placeholder = "";
        for (const key in settings){
            new_values_array.push(key);
            new_values_array.push(settings[key]);
            placeholder += ((placeholder=="")?"":",") + "(?,?)"
        }
        //console.dir(new_values_array);
        const result = await db.transaction_query(
            `INSERT INTO settings (\`key\`, value)
            VALUES ${placeholder} as new_settings
            ON DUPLICATE KEY UPDATE
            \`key\`=new_settings.key, value=new_settings.value`,
            new_values_array,
            active_connection
        );

        if(self_executing) {
        await db.transaction_commit(active_connection);
        }

        return "ok!";
    }  
    catch(error){
        if(self_executing) {
            await db.transaction_rollback(active_connection);
        }
        throw(error);
    }
    finally {
        if(self_executing) {
            await db.transaction_release(active_connection);
        }
    }
}

module.exports = {
    getSettings,
    saveSettings
}