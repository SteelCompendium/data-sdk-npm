"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteelCompendiumIdentifier = exports.SteelCompendiumFormat = void 0;
const yaml_1 = require("yaml");
const json_1 = require("./json");
const yaml_2 = require("./yaml");
const xml_1 = require("./xml");
const MarkdownAbilityReader_1 = require("./markdown/MarkdownAbilityReader");
const model_1 = require("../model");
const fast_xml_parser_1 = require("fast-xml-parser");
const markdown_1 = require("./markdown");
var SteelCompendiumFormat;
(function (SteelCompendiumFormat) {
    SteelCompendiumFormat["Json"] = "json";
    SteelCompendiumFormat["Yaml"] = "yaml";
    SteelCompendiumFormat["Xml"] = "xml";
    SteelCompendiumFormat["Markdown"] = "markdown";
    SteelCompendiumFormat["Unknown"] = "unknown";
})(SteelCompendiumFormat || (exports.SteelCompendiumFormat = SteelCompendiumFormat = {}));
class SteelCompendiumIdentifier {
    static parse(format, model) {
        if (format === SteelCompendiumFormat.Markdown) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Markdown,
                    model: model_1.Ability,
                    getReader: () => new MarkdownAbilityReader_1.MarkdownAbilityReader(),
                };
            }
            if (model === "statblock") {
                return {
                    format: SteelCompendiumFormat.Markdown,
                    model: model_1.Statblock,
                    getReader: () => new markdown_1.MarkdownStatblockReader(),
                };
            }
        }
        if (format === SteelCompendiumFormat.Json) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Json,
                    model: model_1.Ability,
                    getReader: () => new json_1.JsonReader(model_1.Ability.modelDTOAdapter),
                };
            }
            if (model === "statblock") {
                return {
                    format: SteelCompendiumFormat.Json,
                    model: model_1.Statblock,
                    getReader: () => new json_1.JsonReader(model_1.Statblock.modelDTOAdapter),
                };
            }
        }
        if (format === SteelCompendiumFormat.Yaml) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Yaml,
                    model: model_1.Ability,
                    getReader: () => new yaml_2.YamlReader(model_1.Ability.modelDTOAdapter),
                };
            }
            if (model === "statblock") {
                return {
                    format: SteelCompendiumFormat.Yaml,
                    model: model_1.Statblock,
                    getReader: () => new yaml_2.YamlReader(model_1.Statblock.modelDTOAdapter),
                };
            }
        }
        if (format === SteelCompendiumFormat.Xml) {
            if (model === "ability") {
                return {
                    format: SteelCompendiumFormat.Xml,
                    model: model_1.Ability,
                    getReader: () => new xml_1.XmlAbilityReader(),
                };
            }
            console.log("statblocks dont currently support xml");
            if (model === "statblock") {
                return {
                    format: SteelCompendiumFormat.Xml,
                    model: model_1.Statblock,
                    getReader: () => {
                        throw new Error("Unknown format, cannot provide a reader.");
                    }
                };
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
            const parser = new fast_xml_parser_1.XMLParser();
            const data = parser.parse(source);
            const [_, root] = Object.entries(data)[0];
            if (typeof root === 'object' && root !== null) {
                const modelType = this.identifyModelType(root);
                if (modelType === model_1.Ability) {
                    return {
                        format: SteelCompendiumFormat.Xml,
                        model: model_1.Ability,
                        getReader: () => new xml_1.XmlAbilityReader()
                    };
                }
                if (modelType === model_1.Statblock) {
                    return {
                        format: SteelCompendiumFormat.Xml,
                        model: model_1.Statblock,
                        // TODO - should be XmlStatblockReader, but that's not implemented yet'
                        getReader: () => new xml_1.XmlAbilityReader()
                    };
                }
            }
        }
        catch (e) {
            // Not XML
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