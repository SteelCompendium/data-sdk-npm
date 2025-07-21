import { IDataReader } from "../IDataReader";
import { Ability } from "../../model";
import { AbilityXmlDTO } from "../../dto/AbilityXmlDTO";
import { XMLParser } from "fast-xml-parser";

export class XmlAbilityReader extends IDataReader<Ability> {
    public read(source: string): Ability {
        const parser = new XMLParser({
            isArray: (name, jpath, isLeafNode, isAttribute) => {
                return ['keyword', 'mundane_effect', 'roll_effect', 'traits', 'abilities', 'ancestry', 'roles', 'tier'].includes(name);
            },
            transformTagName: (tagName) => tagName,
            transformAttributeName: (attributeName) => attributeName,
            parseTagValue: true,
            parseAttributeValue: false,
            trimValues: true,
            tagValueProcessor: (tagName, tagValue, jPath, isLeafNode, isAttribute) => {
                return tagValue.trim();
            },
        });
        const xml = parser.parse(source);
        const [_, root] = Object.entries(xml)[0];
        const rootDTO = root as any;

        if (rootDTO.effects) {
            rootDTO.effects = [rootDTO.effects.mundane_effect, rootDTO.effects.roll_effect].flat().filter(Boolean);
        }

        if (rootDTO.keywords) {
            rootDTO.keywords = [rootDTO.keywords.keyword].flat().filter(Boolean);
        }

        return new AbilityXmlDTO(rootDTO as Partial<AbilityXmlDTO>).toModel();
    }
} 