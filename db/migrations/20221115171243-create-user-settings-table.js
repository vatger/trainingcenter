const { DataType } = require("sequelize-typescript");

const LanguageEnum = ["de", "en"];

const DataModelAttributes = {
    user_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    language: {
        type: DataType.ENUM(...LanguageEnum),
        allowNull: false,
        defaultValue: "de",
    },
    additional_emails: {
        type: DataType.JSON(),
        allowNull: true,
        defaultValue: [],
    },
    email_notifications_enabled: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("user_settings", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("user_settings");
    },

    DataModelAttributes,
};
