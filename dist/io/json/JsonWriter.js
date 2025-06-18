"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonWriter = void 0;
const IDataWriter_1 = require("../IDataWriter");
class JsonWriter extends IDataWriter_1.IDataWriter {
    write(data) {
        const dto = data.toDTO();
        const cleanDTO = Object.entries(dto).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});
        return JSON.stringify(cleanDTO, null, 2);
    }
}
exports.JsonWriter = JsonWriter;
//# sourceMappingURL=JsonWriter.js.map