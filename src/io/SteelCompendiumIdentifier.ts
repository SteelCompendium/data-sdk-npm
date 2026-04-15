import { parse } from 'yaml';
import { IDataReader } from './IDataReader';
import { JsonReader } from './json';
import { YamlReader } from './yaml';
import { MarkdownFeatureReader } from './markdown/MarkdownFeatureReader';
import { Feature, Statblock, Ancestry, Career, Class, Complication, Condition, Culture, Kit, Perk, Title, Treasure } from '../model';
import {MarkdownStatblockReader} from "./markdown";
import { Featureblock } from '../model/Featureblock';
import {MarkdownFeatureblockReader} from "./markdown/MarkdownFeatureblockReader";

export enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    Markdown = "markdown",
    Unknown = "unknown",
}

type AnyModel = Feature | Statblock | Featureblock | Ancestry | Career | Class | Complication | Condition | Culture | Kit | Perk | Title | Treasure;
type AnyModelClass = typeof Feature | typeof Statblock | typeof Featureblock | typeof Ancestry | typeof Career | typeof Class | typeof Complication | typeof Condition | typeof Culture | typeof Kit | typeof Perk | typeof Title | typeof Treasure;

export interface IdentificationResult {
    format: SteelCompendiumFormat;
    model: AnyModelClass | null;
    getReader(): IDataReader<AnyModel>;
}

export class SteelCompendiumIdentifier {
    private static readonly CONTENT_TYPE_MAP: Record<string, { model: AnyModelClass; adapter: any }> = {
        ancestry: { model: Ancestry, adapter: Ancestry.modelDTOAdapter },
        career: { model: Career, adapter: Career.modelDTOAdapter },
        class: { model: Class, adapter: Class.modelDTOAdapter },
        complication: { model: Complication, adapter: Complication.modelDTOAdapter },
        condition: { model: Condition, adapter: Condition.modelDTOAdapter },
        culture: { model: Culture, adapter: Culture.modelDTOAdapter },
        kit: { model: Kit, adapter: Kit.modelDTOAdapter },
        perk: { model: Perk, adapter: Perk.modelDTOAdapter },
        title: { model: Title, adapter: Title.modelDTOAdapter },
        treasure: { model: Treasure, adapter: Treasure.modelDTOAdapter },
    };

    public static parse(format: string, model: string): IdentificationResult {
        if (format === SteelCompendiumFormat.Markdown) {
            if (model === "feature") {
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
            if (model === "feature") {
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
            const contentType = this.CONTENT_TYPE_MAP[model];
            if (contentType) {
                return {
                    format: SteelCompendiumFormat.Json,
                    model: contentType.model,
                    getReader: () => new JsonReader(contentType.adapter),
                }
            }
        }
        if (format === SteelCompendiumFormat.Yaml) {
            if (model === "feature") {
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
            const contentType = this.CONTENT_TYPE_MAP[model];
            if (contentType) {
                return {
                    format: SteelCompendiumFormat.Yaml,
                    model: contentType.model,
                    getReader: () => new YamlReader(contentType.adapter),
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
                const result = this.identifyStructured(data, SteelCompendiumFormat.Json);
                if (result) return result;
            }
        } catch (e) {
            // Not JSON
        }

        try {
            const data = parse(source);
            if (typeof data === 'object' && data !== null) {
                const result = this.identifyStructured(data, SteelCompendiumFormat.Yaml);
                if (result) return result;
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
        if (this.isMarkdownFeatureblock(source)) {
            return {
                format: SteelCompendiumFormat.Markdown,
                model: Featureblock,
                getReader: () => new MarkdownFeatureblockReader(),
            };
        }
        if (this.isMarkdownFeature(source)) {
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

    private static identifyStructured(data: any, format: SteelCompendiumFormat.Json | SteelCompendiumFormat.Yaml): IdentificationResult | null {
        const modelType = this.identifyModelType(data);
        if (!modelType) return null;

        const ReaderClass = format === SteelCompendiumFormat.Json ? JsonReader : YamlReader;

        if (modelType === Feature) {
            return { format, model: Feature, getReader: () => new ReaderClass(Feature.modelDTOAdapter) };
        }
        if (modelType === Statblock) {
            return { format, model: Statblock, getReader: () => new ReaderClass(Statblock.modelDTOAdapter) };
        }
        if (modelType === Featureblock) {
            return { format, model: Featureblock, getReader: () => new ReaderClass(Featureblock.modelDTOAdapter) };
        }

        const contentType = this.CONTENT_TYPE_MAP[data.type];
        if (contentType) {
            return { format, model: contentType.model, getReader: () => new ReaderClass(contentType.adapter) };
        }

        return null;
    }

    private static identifyModelType(data: any): AnyModelClass | null {
        switch (data.type) {
            case 'feature':
                return Feature;
            case 'statblock':
                return Statblock;
            case 'featureblock':
                return Featureblock;
        }
        const contentType = this.CONTENT_TYPE_MAP[data.type];
        if (contentType) {
            return contentType.model;
        }
        if ('featureblock_type' in data) {
            return Featureblock;
        }
        if ('stamina' in data && 'level' in data) {
            return Statblock;
        }
        if ('effects' in data || 'cost' in data || 'feature_type' in data) {
            return Feature;
        }
        return null;
    }

    private static isMarkdownFeatureblock(text: string): boolean {
        return text.includes("- **EV:**")
            || text.includes("- **Stamina:**")
            || text.includes("- **Size:**")
            || text.includes(" (Level ")
            || text.includes(" Feature)")
            || text.includes(" (Malice Features)");
    }

    private static isMarkdownFeature(text: string): boolean {
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

        // e.g. **Feature Name (Cost)** or ###### Feature Name (Cost)
        const h6TitleRegex = /^\s*#+\s*(.*?)(?: \((.*?)\))?\s*$/;
        const boldTitleRegex = /^\s*\*\*(.*?)(?: \((.*?)\))?\*\*\s*$/;
        if (!h6TitleRegex.test(firstLine) && !boldTitleRegex.test(firstLine)) {
            return false;
        }

        return true;
    }

    private static isMarkdownStatblock(text: string): boolean {
        return text.includes("<br>Might") || text.includes("<br/> Might");
    }
}