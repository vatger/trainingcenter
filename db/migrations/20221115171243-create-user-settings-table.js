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
        default: "de",
    },
    dark_mode: {
        type: DataType.BOOLEAN,
        allowNull: false,
        default: false,
    },
    additional_emails: {
        type: DataType.JSON(),
        allowNull: true,
        default: [],
    },
    email_notifications_enabled: {
        type: DataType.BOOLEAN,
        allowNull: false,
        default: true,
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
