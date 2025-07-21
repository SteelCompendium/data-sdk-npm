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
                return ['traits', 'abilities', 'ancestry', 'roles', 'tier', 'keyword', 'effect'].includes(name);
            },
            transformTagName: (tagName) => tagName,
            transformAttributeName: (attributeName) => attributeName,
            parseTagValue: true,
            parseAttributeValue: false,
            trimValues: true,
        });
        const xml = parser.parse(source);
        const [_, root] = Object.entries(xml)[0];
        const rootDTO = root as any;

        if (rootDTO.effects?.effect) {
            rootDTO.effects = rootDTO.effects.effect.map((effect: any) => {
                if (effect.mundane_effect) return effect.mundane_effect;
                if (effect.roll_effect) return effect.roll_effect;
                return effect;
            }).filter(Boolean);
        } else {
            rootDTO.effects = [];
        }

        if (rootDTO.keywords?.keyword) {
            rootDTO.keywords = rootDTO.keywords.keyword;
        } else {
            rootDTO.keywords = [];
        }

        return this.adapter(rootDTO as T);
    }
} 