import { parse } from 'yaml';
import { IDataReader } from './IDataReader';
import { JsonReader } from './json';
import { YamlReader } from './yaml';
import { XmlAbilityReader } from './xml';
import { MarkdownAbilityReader } from './markdown/MarkdownAbilityReader';
import { Ability, Statblock } from '../model';
import { XMLParser } from 'fast-xml-parser';
import {MarkdownStatblockReader} from "./markdown";
import { Featureblock } from '../model/Featureblock';
import {MarkdownFeatureblockReader} from "./markdown/MarkdownFeatureblockReader";

export enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    Xml = "xml",
    Markdown = "markdown",
    Unknown = "unknown",
}

export interface IdentificationResult {
    format: SteelCompendiumFormat;
    model: typeof Ability | typeof Statblock | typeof Featureblock | null;
    getReader(): IDataReader<Ability | Statblock | Featureblock>;
}

export class SteelCompendiumIdentifier {
    public static parse(format: string, model: string): IdentificationResult {
        if (format === SteelCompendiumFormat.Markdown) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Markdown,
                    model: Ability,
                    getReader: () => new MarkdownAbilityReader(),
                }
            }
            if (model === "statblock") {
                return {
                    format: SteelCompendiumFormat.Markdown,
                    model: Statblock,
                    getReader: () => new MarkdownStatblockReader(),
                }
            }
            if (model === "featureblock") {
                return {
                    format: SteelCompendiumFormat.Markdown,
                    model: Featureblock,
                    getReader: () => new MarkdownFeatureblockReader(),
                }
            }
        }
        if (format === SteelCompendiumFormat.Json) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Json,
                    model: Ability,
                    getReader: () => new JsonReader(Ability.modelDTOAdapter),
                }
            }
            if (model === "statblock") {
                return {
                    format: SteelCompendiumFormat.Json,
                    model: Statblock,
                    getReader: () => new JsonReader(Statblock.modelDTOAdapter),
                }
            }
            if (model === "featureblock") {
                return {
                    format: SteelCompendiumFormat.Json,
                    model: Featureblock,
                    getReader: () => new JsonReader(Featureblock.modelDTOAdapter),
                }
            }
        }
        if (format === SteelCompendiumFormat.Yaml) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Yaml,
                    model: Ability,
                    getReader: () => new YamlReader(Ability.modelDTOAdapter),
                }
            }
            if (model === "statblock") {
                return {
                    format: SteelCompendiumFormat.Yaml,
                    model: Statblock,
                    getReader: () => new YamlReader(Statblock.modelDTOAdapter),
                }
            }
            if (model === "featureblock") {
                return {
                    format: SteelCompendiumFormat.Yaml,
                    model: Featureblock,
                    getReader: () => new YamlReader(Featureblock.modelDTOAdapter),
                }
            }
        }
        if (format === SteelCompendiumFormat.Xml) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Xml,
                    model: Ability,
                    getReader: () => new XmlAbilityReader(),
                }
            }
            console.log("statblocks and featureblocks dont currently support xml");
            if (model === "statblock") {
                return {
                    format: SteelCompendiumFormat.Xml,
                    model: Statblock,
                    getReader: () => {
                        throw new Error("Unknown format, cannot provide a reader.");
                    }
                }
            }
            if (model === "featureblock") {
                return {
                    format: SteelCompendiumFormat.Xml,
                    model: Featureblock,
                    getReader: () => {
                        throw new Error("Unknown format, cannot provide a reader.");
                    }
                }
            }
        }
        return {
            format: SteelCompendiumFormat.Unknown,
            model: null,
            getReader: () => {
                throw new Error("Unknown format, cannot provide a reader.");
            }
        };
    }

    // TODO - this logic is flawed and doesnt work
    public static identify(source: string): IdentificationResult {
        try {
            const data = JSON.parse(source);
            if (typeof data === 'object' && data !== null) {
                const modelType = this.identifyModelType(data);
                if (modelType === Ability) {
                    return {
                        format: SteelCompendiumFormat.Json,
                        model: Ability,
                        getReader: () => new JsonReader(Ability.modelDTOAdapter)
                    };
                }
                if (modelType === Statblock) {
                    return {
                        format: SteelCompendiumFormat.Json,
                        model: Statblock,
                        getReader: () => new JsonReader(Statblock.modelDTOAdapter)
                    };
                }
            }
        } catch (e) {
            // Not JSON
        }

        try {
            const parser = new XMLParser();
            const data = parser.parse(source);
            const [_, root] = Object.entries(data)[0];

            if (typeof root === 'object' && root !== null) {
                const modelType = this.identifyModelType(root);
                if (modelType === Ability) {
                    return {
                        format: SteelCompendiumFormat.Xml,
                        model: Ability,
                        getReader: () => new XmlAbilityReader()
                    };
                }
                if (modelType === Statblock) {
                    return {
                        format: SteelCompendiumFormat.Xml,
                        model: Statblock,
                        // TODO - should be XmlStatblockReader, but that's not implemented yet'
                        getReader: () => new XmlAbilityReader()
                    };
                }
            }
        } catch (e) {
            // Not XML
        }

        try {
            const data = parse(source);
            if (typeof data === 'object' && data !== null) {
                const modelType = this.identifyModelType(data);
                if (modelType === Ability) {
                    return {
                        format: SteelCompendiumFormat.Yaml,
                        model: Ability,
                        getReader: () => new YamlReader(Ability.modelDTOAdapter)
                    };
                }
                if (modelType === Statblock) {
                    return {
                        format: SteelCompendiumFormat.Yaml,
                        model: Statblock,
                        getReader: () => new YamlReader(Statblock.modelDTOAdapter)
                    };
                }
            }
        } catch (e) {
            // Not YAML
        }

        if (this.isMarkdownAbility(source)) {
            return {
                format: SteelCompendiumFormat.Markdown,
                model: Ability,
                getReader: () => new MarkdownAbilityReader(),
            };
        }

        return {
            format: SteelCompendiumFormat.Unknown,
            model: null,
            getReader: () => {
                throw new Error("Unknown format, cannot provide a reader.");
            }
        };
    }

    private static identifyModelType(data: any): typeof Ability | typeof Statblock | null {
        if ('stamina' in data && 'level' in data) {
            return Statblock;
        }
        if ('effects' in data || 'cost' in data) {
            return Ability;
        }
        return null;
    }

    private static isMarkdownAbility(text: string): boolean {
        let lines = text.split('\n').map(l => l.trim());

        // Find the end of the frontmatter
        let frontmatterEndIndex = -1;
        if (lines[0].trim() === '---') {
            frontmatterEndIndex = lines.slice(1).findIndex(line => line.trim() === '---');
            if (frontmatterEndIndex !== -1) {
                // The index is in the sliced array, so we add 1 to get the index in the original array
                // and another 1 to get the line after the '---'
                lines = lines.slice(frontmatterEndIndex + 2);
            }
        }
        lines = lines.filter(line => line.trim() !== '');
        const firstLine = lines[0];

        // e.g. **Ability Name (Cost)** or ###### Ability Name (Cost)
        const h6TitleRegex = /^\s*#+\s*(.*?)(?: \((.*?)\))?\s*$/;
        const boldTitleRegex = /^\s*\*\*(.*?)(?: \((.*?)\))?\*\*\s*$/;
        if (!h6TitleRegex.test(firstLine) && !boldTitleRegex.test(firstLine)) {
            return false;
        }

        return true;
    }

    private static isStatblock(text: string): boolean {
        const statblockKeywords = [
            /level\s+\d+/i,
            /stamina\s+\d+/i,
            /might\s+[+-−]?\d+/i,
            /agility\s+[+-−]?\d+/i,
            /reason\s+[+-−]?\d+/i,
            /intuition\s+[+-−]?\d+/i,
            /presence\s+[+-−]?\d+/i,
        ];
        const scoreLine = /might\s+[+-−]?\d+.*agility\s+[+-−]?\d+.*reason\s+[+-−]?\d+.*intuition\s+[+-−]?\d+.*presence\s+[+-−]?\d+/i;

        return statblockKeywords.filter(keyword => keyword.test(text)).length > 3 || scoreLine.test(text);
    }

    private static isAbility(text: string): boolean {
        const abilityKeywords = [
            /effect:/i,
            /power roll/i,
            /distance:/i,
            /target:/i,
            /\((main action|action|maneuver|triggered action|free triggered action)\)/i,
            /\(\d+ piety\)/i,
        ];

        const lines = text.split('\n').map(l => l.trim());
        const isAllUpperCase = (s: string) => s.length > 1 && s === s.toUpperCase() && s.toLowerCase() !== s.toUpperCase();
        if (lines.some(isAllUpperCase)) {
            return true;
        }

        if (this.isStatblock(text)) {
            return false;
        }

        return abilityKeywords.some(keyword => keyword.test(text));
    }
} 