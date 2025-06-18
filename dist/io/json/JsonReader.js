"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonReader = void 0;
const IDataReader_1 = require("../IDataReader");
class JsonReader extends IDataReader_1.IDataReader {
    constructor(adapter) {
        super();
        this.adapter = adapter;
    }
    read(source) {
        return this.adapter(JSON.parse(source));
    }
}
exports.JsonReader = JsonReader;
//# sourceMappingURL=JsonReader.js.map