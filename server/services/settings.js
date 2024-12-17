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

module.exports = {
    getSettings
}