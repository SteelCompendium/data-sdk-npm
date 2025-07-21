"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlReader = void 0;
const IDataReader_1 = require("../IDataReader");
const fast_xml_parser_1 = require("fast-xml-parser");
class XmlReader extends IDataReader_1.IDataReader {
    constructor(adapter) {
        super();
        this.adapter = adapter;
    }
    read(source) {
        const parser = new fast_xml_parser_1.XMLParser({
            isArray: (name, jpath, isLeafNode, isAttribute) => {
                return ['keywords', 'effects', 'traits', 'abilities', 'ancestry', 'roles', 'tier', 'keyword'].includes(name);
            },
            transformTagName: (tagName) => tagName,
            transformAttributeName: (attributeName) => attributeName,
            parseTagValue: true,
            parseAttributeValue: false,
            trimValues: true,
        });
        const xml = parser.parse(source);
        const [_, root] = Object.entries(xml)[0];
        return this.adapter(root);
    }
}
exports.XmlReader = XmlReader;
//# sourceMappingURL=XmlReader.js.map