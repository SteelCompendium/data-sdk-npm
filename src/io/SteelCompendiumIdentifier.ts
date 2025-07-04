import { parse } from 'yaml';
import { IDataReader } from './IDataReader';
import { JsonReader } from './json';
import { YamlReader } from './yaml';
import { PrereleasePdfAbilityReader, PrereleasePdfStatblockReader } from './text';
import { MarkdownAbilityReader } from './markdown/MarkdownAbilityReader';
import { Ability, Statblock } from '../model';

export enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    Markdown = "markdown",
    PrereleasePdfText = "prerelease-pdf-text",
    Unknown = "unknown",
}

export interface IdentificationResult {
    format: SteelCompendiumFormat;
    model: typeof Ability | typeof Statblock | null;
    getReader(): IDataReader<Ability | Statblock>;
}

export class SteelCompendiumIdentifier {
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

        if (this.isStatblock(source)) {
            return {
                format: SteelCompendiumFormat.PrereleasePdfText,
                model: Statblock,
                getReader: () => new PrereleasePdfStatblockReader(),
            };
        }

        if (this.isAbility(source)) {
            return {
                format: SteelCompendiumFormat.PrereleasePdfText,
                model: Ability,
                getReader: () => new PrereleasePdfAbilityReader(),
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
        const lines = text.split('\n').map(l => l.trim());
        const firstLine = lines[0];

        // e.g. **Ability Name (Cost)**
        const titleRegex = /^\s*\*\*(.*?)(?: \((.*?)\))?\*\*\s*$/;
        if (!titleRegex.test(firstLine)) {
            return false;
        }

        // Check for markdown table for keywords/type/etc.
        // e.g. | **Keywords** | **Type** |
        const hasTable = lines.some(l => l.includes('|'));

        // Check for markdown sections
        const hasSection = lines.some(l =>
            l.startsWith('**Power Roll') ||
            l.startsWith('**Effect:**') ||
            l.startsWith('**Trigger:**')
        );

        return hasTable || hasSection;
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