const Config = require("../dist/core/Config");
const Sequelize = require("sequelize");

async function connectToDatabase() {
    const newConf = {
        ...Config.SequelizeConfig,
        logging: message => {
            console.log(message);
        },
    };

    const seq = new Sequelize(newConf);

    try {
        await seq.authenticate()
    } catch (e) {
        console.log(`[SEQ] Failed to authenticate: ${e}.`)
        return null;
    }

    return seq;
}

module.exports = {
    connectToDatabase
}