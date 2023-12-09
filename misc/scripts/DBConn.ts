import { SequelizeConfig } from "../../src/core/Config";
import { Sequelize } from "sequelize";

async function connectToDatabase() {
    const newConf = {
        ...SequelizeConfig,
        logging: (message: string) => {
            console.log(message);
        },
    };

    const seq = new Sequelize(newConf);

    try {
        await seq.authenticate();
    } catch (e) {
        console.log(`[SEQ] Failed to authenticate: ${e}.`);
        return null;
    }

    return seq;
}

export default {
    connectToDatabase,
};
