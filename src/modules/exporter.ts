import fs from "fs";
import path from "path";

const exporter = (function module() {

  return {
    // exports the data as JSON during module teardown.
    export(): string { 
      const fullPath: string = path.join(__dirname, "./data/main.json");
      const fileRead: Buffer = fs.readFileSync(fullPath);
      const fileJson = JSON.parse(fileRead.toString());
      return fileJson;
    } 
  }
})();

export default exporter;