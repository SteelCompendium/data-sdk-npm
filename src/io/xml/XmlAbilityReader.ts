import { IDataReader } from "../IDataReader";
import { Feature } from "../../model";
import { AbilityXmlDTO } from "../../dto/AbilityXmlDTO";
import { XMLParser } from "fast-xml-parser";

// Deprecated: XML support will be dropped in 1.0.0
export class XmlAbilityReader extends IDataReader<Feature> {
    public read(source: string): Feature {
        const parser = new XMLParser({
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

        return new AbilityXmlDTO(root as Partial<AbilityXmlDTO>).toModel();
    }
}