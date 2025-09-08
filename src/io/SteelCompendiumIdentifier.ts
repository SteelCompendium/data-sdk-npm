import { parse } from 'yaml';
import { IDataReader } from './IDataReader';
import { JsonReader } from './json';
import { YamlReader } from './yaml';
import { MarkdownFeatureReader } from './markdown/MarkdownFeatureReader';
import { Feature, Statblock } from '../model';
import {MarkdownStatblockReader} from "./markdown";
import { Featureblock } from '../model/Featureblock';
import {MarkdownFeatureblockReader} from "./markdown/MarkdownFeatureblockReader";

export enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    Markdown = "markdown",
    Unknown = "unknown",
}

export interface IdentificationResult {
    format: SteelCompendiumFormat;
    model: typeof Feature | typeof Statblock | typeof Featureblock | null;
    getReader(): IDataReader<Feature | Statblock | Featureblock>;
}

export class SteelCompendiumIdentifier {
    public static parse(format: string, model: string): IdentificationResult {
        if (format === SteelCompendiumFormat.Markdown) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Markdown,
                    model: Feature,
                    getReader: () => new MarkdownFeatureReader(),
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
                    model: Feature,
                    getReader: () => new JsonReader(Feature.modelDTOAdapter),
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
                    model: Feature,
                    getReader: () => new YamlReader(Feature.modelDTOAdapter),
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
                if (modelType === Feature) {
                    return {
                        format: SteelCompendiumFormat.Json,
                        model: Feature,
                        getReader: () => new JsonReader(Feature.modelDTOAdapter)
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
            const data = parse(source);
            if (typeof data === 'object' && data !== null) {
                const modelType = this.identifyModelType(data);
                if (modelType === Feature) {
                    return {
                        format: SteelCompendiumFormat.Yaml,
                        model: Feature,
                        getReader: () => new YamlReader(Feature.modelDTOAdapter)
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

        if (this.isMarkdownStatblock(source)) {
            return {
                format: SteelCompendiumFormat.Markdown,
                model: Statblock,
                getReader: () => new MarkdownStatblockReader(),
            };
        }

        if (this.isMarkdownAbility(source)) {
            return {
                format: SteelCompendiumFormat.Markdown,
                model: Feature,
                getReader: () => new MarkdownFeatureReader(),
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

    private static identifyModelType(data: any): typeof Feature | typeof Statblock | typeof Featureblock | null {
        if ('features' in data) {
            return Featureblock;
        }
        if ('stamina' in data && 'level' in data) {
            return Statblock;
        }
        if ('effects' in data || 'cost' in data) {
            return Feature;
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

    private static isMarkdownStatblock(text: string): boolean {
        return text.includes("<br>Might");
    }
}