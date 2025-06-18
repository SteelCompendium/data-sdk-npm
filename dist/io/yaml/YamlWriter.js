"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamlWriter = void 0;
const IDataWriter_1 = require("../IDataWriter");
const yaml_1 = require("yaml");
class YamlWriter extends IDataWriter_1.IDataWriter {
    write(data) {
        return (0, yaml_1.stringify)(data.toDTO());
    }
}
exports.YamlWriter = YamlWriter;
//# sourceMappingURL=YamlWriter.js.map