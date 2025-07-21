import { IDataReader } from "../IDataReader";
import { ModelDTOAdapter, SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";
import { XMLParser } from "fast-xml-parser";

export class XmlReader<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> extends IDataReader<M> {
    public constructor(private adapter: ModelDTOAdapter<M, T>) {
        super();
    }

    public read(source: string): M {
        const parser = new XMLParser({
            isArray: (name, jpath, isLeafNode, isAttribute) => {
                return ['keywords', 'effects', 'traits', 'abilities', 'ancestry', 'roles', 'tier', 'keyword'].includes(name);
            },
            transformTagName: (tagName) => tagName,
            transformAttributeName: (attributeName) => attributeName,
            parseTagValue: true,
            parseAttributeValue: false,
            trimValues: true,
        });
        const json = parser.parse(source);
        const [_, root] = Object.entries(json)[0];
        return this.adapter(root as T);
    }
} 