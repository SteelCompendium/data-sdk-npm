"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlWriter = void 0;
const IDataWriter_1 = require("../IDataWriter");
const fast_xml_parser_1 = require("fast-xml-parser");
class XmlWriter extends IDataWriter_1.IDataWriter {
    constructor(rootName) {
        super();
        this.rootName = rootName;
    }
    write(data) {
        const dto = data.toDTO();
        const cleanDTO = Object.entries(dto).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});
        const builder = new fast_xml_parser_1.XMLBuilder({
            format: true,
            suppressBooleanAttributes: false,
        });
        return builder.build({
            [this.rootName]: cleanDTO
        });
    }
}
exports.XmlWriter = XmlWriter;
//# sourceMappingURL=XmlWriter.js.map