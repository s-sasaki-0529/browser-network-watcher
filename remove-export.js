const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "./dist/contentScript.js");

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  if (data.includes("export {};")) {
    const result = data.replace(/export\s*{};/g, "");
    fs.writeFile(filePath, result, "utf8", (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});
