module.exports = {
    async truncateTable(tableName, queryInterface) {
        const { sequelize } = queryInterface;

        try {
            await sequelize.transaction(async transaction => {
                await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
                await sequelize.query("TRUNCATE TABLE " + tableName.toLowerCase());
                await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
            });
        } catch (e) {
            console.error(e);
        }
    },
};
