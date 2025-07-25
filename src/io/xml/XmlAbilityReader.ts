import { IDataReader } from "../IDataReader";
import { Ability } from "../../model";
import { AbilityXmlDTO } from "../../dto/AbilityXmlDTO";
import { XMLParser } from "fast-xml-parser";

export class XmlAbilityReader extends IDataReader<Ability> {
    public read(source: string): Ability {
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