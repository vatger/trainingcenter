const { DataType } = require("sequelize-typescript");

const CourseInformationModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    author_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    content_de: {
        type: DataType.TEXT("medium"),
        allowNull: false,
    },
    content_en: {
        type: DataType.TEXT("medium"),
        allowNull: false,
    },
    link: {
        type: DataType.STRING(255),
        allowNull: true,
    },
    icon: {
        type: DataType.STRING(50),
        allowNull: true,
    },
    severity: {
        type: DataType.ENUM("default", "info", "success", "danger"),
        allowNull: true,
    },
    read: {
        type: DataType.BOOLEAN,
        allowNull: false,
        default: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("notifications", CourseInformationModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("notifications");
    },
};
