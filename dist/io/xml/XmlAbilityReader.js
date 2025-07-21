"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlAbilityReader = void 0;
const IDataReader_1 = require("../IDataReader");
const AbilityXmlDTO_1 = require("../../dto/AbilityXmlDTO");
const fast_xml_parser_1 = require("fast-xml-parser");
class XmlAbilityReader extends IDataReader_1.IDataReader {
    read(source) {
        const parser = new fast_xml_parser_1.XMLParser({
            isArray: (name, jpath, isLeafNode, isAttribute) => {
                return ['keyword', 'effect', 'traits', 'abilities', 'ancestry', 'roles', 'tier'].includes(name);
            },
            transformTagName: (tagName) => tagName,
            transformAttributeName: (attributeName) => attributeName,
            textNodeName: "#text",
            parseTagValue: true,
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            parseAttributeValue: true,
            trimValues: true,
            tagValueProcessor: (tagName, tagValue, jPath, isLeafNode, isAttribute) => {
                return tagValue.trim();
            },
        });
        const xml = parser.parse(source);
        const [_, root] = Object.entries(xml)[0];
        return new AbilityXmlDTO_1.AbilityXmlDTO(root).toModel();
    }
}
exports.XmlAbilityReader = XmlAbilityReader;
//# sourceMappingURL=XmlAbilityReader.js.map