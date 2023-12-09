const fs = require("fs");
const path = require("path");

let content;
const uuidLength = Number(process.argv[2] ?? 120);

console.log(`Opening file: ${path.resolve(__dirname + "/../.env")}`);

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

console.log(process.argv);

fs.readFile(path.resolve(__dirname + "/../.env"), "utf-8", (err, data) => {
    if (err) throw err;

    content = data;

    let contentLines = content.split("\n");

    for (let i = 0; i < contentLines.length; i++) {
        if (contentLines[i].includes("APP_KEY")) {
            let res = "";
            const charLength = chars.length;

            for (let i = 0; i < uuidLength; i++) {
                res += chars.charAt(Math.floor(Math.random() * charLength));
            }

            contentLines[i] = `APP_KEY=${res}`;
        }
    }

    contentLines = contentLines.join("\n");

    fs.writeFile(path.resolve(__dirname + "/../.env"), contentLines, { encoding: "utf-8", flag: "w" }, err => {
        if (err) console.error(err);
        else console.log("APP_KEY successfully updated!");
    });
});
