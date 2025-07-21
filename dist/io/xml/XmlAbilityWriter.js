"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlAbilityWriter = void 0;
const IDataWriter_1 = require("../IDataWriter");
const fast_xml_parser_1 = require("fast-xml-parser");
class XmlAbilityWriter extends IDataWriter_1.IDataWriter {
    write(data) {
        const dto = data.toXmlDTO();
        const cleanDTO = Object.entries(dto).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});
        const builder = new fast_xml_parser_1.XMLBuilder({
            format: true,
            suppressBooleanAttributes: false,
            ignoreAttributes: false,
        });
        return builder.build({
            ['ability']: cleanDTO
        });
    }
}
exports.XmlAbilityWriter = XmlAbilityWriter;
//# sourceMappingURL=XmlAbilityWriter.js.map