import { Sequelize, QueryOptions, QueryOptionsWithType, QueryTypes } from "sequelize";
import { SequelizeConfig } from "./Config";

export const sequelize: Sequelize = new Sequelize(SequelizeConfig);

export async function authenticate() {
    return await sequelize.authenticate();
}
