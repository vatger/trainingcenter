const { DataType } = require("sequelize-typescript");

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
    completed: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    mentor_id: {
        type: DataType.INTEGER,
        allowNull: true, // Null for CPTs!
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    cpt_examiner_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    cpt_atsim_passed: {
        type: DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
    date: {
        type: DataType.DATE,
        allowNull: true,
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
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("training_sessions", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("training_sessions");
    },

    DataModelAttributes,
};
