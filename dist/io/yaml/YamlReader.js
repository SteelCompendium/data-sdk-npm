"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamlReader = void 0;
const IDataReader_1 = require("../IDataReader");
const yaml_1 = require("yaml");
class YamlReader extends IDataReader_1.IDataReader {
    constructor(adapter) {
        super();
        this.adapter = adapter;
    }
    read(source) {
        return this.adapter((0, yaml_1.parse)(source));
    }
}
exports.YamlReader = YamlReader;
//# sourceMappingURL=YamlReader.js.map