const path = require("path");

const dir = process.cwd();

module.exports = {
    config: path.join(dir, "db/config/config.js"),
    "migrations-path": path.join(dir, "dist/db/migrations"),
    "seeders-path": path.join(__dirname, "dist/db/seeders"),
};
