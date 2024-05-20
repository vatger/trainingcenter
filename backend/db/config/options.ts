import path from "path";

const dir = process.cwd();

module.exports = {
    config: path.join(dir, "../_build/backend/db/config/config.js"),
    "migrations-path": path.join(dir, "../_build/backend/db/migrations"),
    "seeders-path": path.join(dir, "../_build/backend/db/seeders"),
};
