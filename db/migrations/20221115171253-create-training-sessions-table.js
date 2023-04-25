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
    mentor_id: {
        type: DataType.INTEGER,
        allowNull: false,
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
        onDelete: "cascade",
    },
    cpt_atsim_passed: {
        type: DataType.BOOLEAN,
        allowNull: true,
        default: false,
    },
    training_station_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_stations",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    date: {
        type: DataType.DATE,
        allowNull: true,
    },
    training_type_id: {
        type: DataType.INTEGER,
        references: {
            model: "training_types",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    course_id: {
        type: DataType.INTEGER,
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
