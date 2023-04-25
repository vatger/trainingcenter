const fs = require("fs");

console.log("Copying file: .env to ./dist/.env");

fs.copyFile("./.env", "./dist/.env", err => {
    if (err) throw err;

    console.log("\0 \u2713 File copied successfully!\n\n");
});
