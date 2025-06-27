"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteelCompendiumIdentifier = exports.SteelCompendiumFormat = void 0;
const yaml_1 = require("yaml");
const json_1 = require("./json");
const yaml_2 = require("./yaml");
const text_1 = require("./text");
const MarkdownAbilityReader_1 = require("./markdown/MarkdownAbilityReader");
const model_1 = require("../model");
var SteelCompendiumFormat;
(function (SteelCompendiumFormat) {
    SteelCompendiumFormat["Json"] = "json";
    SteelCompendiumFormat["Yaml"] = "yaml";
    SteelCompendiumFormat["Markdown"] = "markdown";
    SteelCompendiumFormat["PrereleasePdfText"] = "prerelease-pdf-text";
    SteelCompendiumFormat["Unknown"] = "unknown";
})(SteelCompendiumFormat || (exports.SteelCompendiumFormat = SteelCompendiumFormat = {}));
class SteelCompendiumIdentifier {
    static identify(source) {
        try {
            const data = JSON.parse(source);
            if (typeof data === 'object' && data !== null) {
                const modelType = this.identifyModelType(data);
                if (modelType === model_1.Ability) {
                    return {
                        format: SteelCompendiumFormat.Json,
                        model: model_1.Ability,
                        getReader: () => new json_1.JsonReader(model_1.Ability.modelDTOAdapter)
                    };
                }
                if (modelType === model_1.Statblock) {
                    return {
                        format: SteelCompendiumFormat.Json,
                        model: model_1.Statblock,
                        getReader: () => new json_1.JsonReader(model_1.Statblock.modelDTOAdapter)
                    };
                }
            }
        }
        catch (e) {
            // Not JSON
        }
        try {
            const data = (0, yaml_1.parse)(source);
            if (typeof data === 'object' && data !== null) {
                const modelType = this.identifyModelType(data);
                if (modelType === model_1.Ability) {
                    return {
                        format: SteelCompendiumFormat.Yaml,
                        model: model_1.Ability,
                        getReader: () => new yaml_2.YamlReader(model_1.Ability.modelDTOAdapter)
                    };
                }
                if (modelType === model_1.Statblock) {
                    return {
                        format: SteelCompendiumFormat.Yaml,
                        model: model_1.Statblock,
                        getReader: () => new yaml_2.YamlReader(model_1.Statblock.modelDTOAdapter)
                    };
                }
            }
        }
        catch (e) {
            // Not YAML
        }
        if (this.isMarkdownAbility(source)) {
            return {
                format: SteelCompendiumFormat.Markdown,
                model: model_1.Ability,
                getReader: () => new MarkdownAbilityReader_1.MarkdownAbilityReader(),
            };
        }
        if (this.isStatblock(source)) {
            return {
                format: SteelCompendiumFormat.PrereleasePdfText,
                model: model_1.Statblock,
                getReader: () => new text_1.PrereleasePdfStatblockReader(),
            };
        }
        if (this.isAbility(source)) {
            return {
                format: SteelCompendiumFormat.PrereleasePdfText,
                model: model_1.Ability,
                getReader: () => new text_1.PrereleasePdfAbilityReader(),
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
    static identifyModelType(data) {
        if ('stamina' in data && 'level' in data) {
            return model_1.Statblock;
        }
        if ('effects' in data || 'cost' in data) {
            return model_1.Ability;
        }
        return null;
    }
    static isMarkdownAbility(text) {
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
        const hasSection = lines.some(l => l.startsWith('**Power Roll') ||
            l.startsWith('**Effect:**') ||
            l.startsWith('**Trigger:**'));
        return hasTable || hasSection;
    }
    static isStatblock(text) {
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
    static isAbility(text) {
        const abilityKeywords = [
            /effect:/i,
            /power roll/i,
            /distance:/i,
            /target:/i,
            /\((main action|action|maneuver|triggered action|free triggered action)\)/i,
            /\(\d+ piety\)/i,
        ];
        const lines = text.split('\n').map(l => l.trim());
        const isAllUpperCase = (s) => s.length > 1 && s === s.toUpperCase() && s.toLowerCase() !== s.toUpperCase();
        if (lines.some(isAllUpperCase)) {
            return true;
        }
        if (this.isStatblock(text)) {
            return false;
        }
        return abilityKeywords.some(keyword => keyword.test(text));
    }
}
exports.SteelCompendiumIdentifier = SteelCompendiumIdentifier;
//# sourceMappingURL=SteelCompendiumIdentifier.js.map