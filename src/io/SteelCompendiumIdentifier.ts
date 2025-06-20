import { parse } from 'yaml';
import { IDataReader } from './IDataReader';
import { JsonReader } from './json';
import { YamlReader } from './yaml';
import { PrereleasePdfAbilityReader, PrereleasePdfStatblockReader } from './text';
import { SteelCompendiumModel, ModelDTOAdapter } from '../model';
import { SteelCompendiumDTO } from '../dto';
import { Ability, Statblock } from '../model';

export enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    PrereleasePdfAbilityText = "prerelease-pdf-ability-text",
    PrereleasePdfStatblockText = "prerelease-pdf-statblock-text",
    Unknown = "unknown",
}

export interface IdentificationResult<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> {
    format: SteelCompendiumFormat;
    getReader(adapter?: ModelDTOAdapter<M, T>): IDataReader<M>;
}

export class SteelCompendiumIdentifier {
    public static identify<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>>(source: string): IdentificationResult<M, T> {
        try {
            const data = JSON.parse(source);
            if (typeof data === 'object' && data !== null) {
                return {
                    format: SteelCompendiumFormat.Json,
                    getReader: (adapter) => {
                        if (!adapter) {
                            throw new Error("An adapter is required for JSON format.");
                        }
                        return new JsonReader<M, T>(adapter);
                    }
                };
            }
        } catch (e) {
            // Not JSON
        }

        try {
            const data = parse(source);
            if (typeof data === 'object' && data !== null) {
                return {
                    format: SteelCompendiumFormat.Yaml,
                    getReader: (adapter) => {
                        if (!adapter) {
                            throw new Error("An adapter is required for YAML format.");
                        }
                        return new YamlReader<M, T>(adapter);
                    }
                };
            }
        } catch (e) {
            // Not YAML
        }

        if (this.isStatblock(source)) {
            return {
                format: SteelCompendiumFormat.PrereleasePdfStatblockText,
                getReader: () => new PrereleasePdfStatblockReader() as unknown as IDataReader<M>,
            };
        }

        if (this.isAbility(source)) {
            return {
                format: SteelCompendiumFormat.PrereleasePdfAbilityText,
                getReader: () => new PrereleasePdfAbilityReader() as unknown as IDataReader<M>,
            };
        }

        return {
            format: SteelCompendiumFormat.Unknown,
            getReader: () => {
                throw new Error("Unknown format, cannot provide a reader.");
            }
        };
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