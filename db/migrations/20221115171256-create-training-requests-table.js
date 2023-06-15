const { DataType } = require("sequelize-typescript");

const RequestStatusEnum = ["requested", "planned", "cancelled", "completed"];

const DataModelAttributes = {
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
    training_type_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "training_types",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    course_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "courses",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    training_station_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_stations",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    comment: {
        type: DataType.TEXT,
        allowNull: true,
    },
    status: {
        type: DataType.ENUM(...RequestStatusEnum),
        allowNull: false,
        default: "requested",
    },
    expires: {
        type: DataType.DATE,
        allowNull: false,
    },
    training_session_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_sessions",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("training_requests", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("training_requests");
    },

    DataModelAttributes,
};
