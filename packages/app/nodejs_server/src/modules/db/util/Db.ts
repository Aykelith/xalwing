//= Functions & Modules
// Others
import fs from "fs";

//= Structures & Data
// Own
import Data from "../data/Data";

export default class Db {
    private dataFilePath: string;
    public data: Data;

    constructor(dataFilePath: string) {
        this.dataFilePath = dataFilePath;

        this.data = JSON.parse(fs.readFileSync(this.dataFilePath, { encoding: "utf8" }));
    }

    save() {
        fs.writeFileSync(this.dataFilePath, JSON.stringify(this.data));
    }
}
