const path = require("path");

module.exports = {
    config: path.join(__dirname, "config.js"),
    "migrations-path": path.join(__dirname, "/../migrations"),
    "seeders-path": path.join(__dirname, "/../seeders"),
};
