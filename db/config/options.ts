import path from "path";

const dir = process.cwd();

module.exports = {
    config: path.join(dir, "dist/db/config/config.js"),
    "migrations-path": path.join(dir, "dist/db/migrations"),
    "seeders-path": path.join(dir, "dist/db/seeders"),
};
