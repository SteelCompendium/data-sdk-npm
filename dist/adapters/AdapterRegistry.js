"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DrawSteelAdapter_1 = __importDefault(require("./DrawSteelAdapter"));
const JsonAdapter_1 = __importDefault(require("./JsonAdapter"));
const YamlAdapter_1 = __importDefault(require("./YamlAdapter"));
const MarkdownAdapter_1 = __importDefault(require("./MarkdownAdapter"));
const validator_1 = __importDefault(require("../validation/validator"));
class AdapterRegistry {
    constructor() {
        this.adapters = new Map();
        this.registerDefaultAdapters();
    }
    registerDefaultAdapters() {
        this.registerAdapter(new DrawSteelAdapter_1.default());
        this.registerAdapter(new JsonAdapter_1.default());
        this.registerAdapter(new YamlAdapter_1.default());
        this.registerAdapter(new MarkdownAdapter_1.default());
        // Register more default adapters here
    }
    registerAdapter(adapter) {
        this.adapters.set(adapter.getName(), adapter);
    }
    getAdapter(name) {
        const adapter = this.adapters.get(name);
        if (!adapter) {
            throw new Error(`No adapter found for format: ${name}`);
        }
        return adapter;
    }
    getAvailableFormats(isOutput = false) {
        const formats = Array.from(this.adapters.keys());
        if (isOutput) {
            return formats.filter(format => format !== "Draw Steel");
        }
        return formats;
    }
    convert(text, sourceFormat, targetFormat) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceAdapter = this.getAdapter(sourceFormat);
            const targetAdapter = this.getAdapter(targetFormat);
            // Parse the input text into a standardized format
            const standardizedStatblock = sourceAdapter.parse(text);
            // Format the standardized statblock into the target format
            const result = targetAdapter.format(standardizedStatblock);
            // If the target format is JSON, validate it against the schema
            if (targetFormat.toLowerCase().includes("json") || this.isJSONFormat(result)) {
                try {
                    const validationResult = yield validator_1.default.validateJSON(result);
                    if (validationResult.errors && !validationResult.valid) {
                        const errorMessages = validator_1.default.formatErrors(validationResult.errors);
                        // eslint-disable-next-line no-console
                        console.warn("Generated JSON does not conform to schema:", errorMessages);
                        // Note: We're not throwing an error here to avoid breaking existing functionality
                        // but we log the validation issues for debugging
                    }
                }
                catch (validationError) {
                    // eslint-disable-next-line no-console
                    console.warn("Could not validate generated JSON:", validationError.message);
                }
            }
            return result;
        });
    }
    /**
     * Helper method to detect if a string is JSON format
     * @param {string} text - The text to check
     * @returns {boolean} - True if the text appears to be JSON
     */
    isJSONFormat(text) {
        if (typeof text !== "string")
            return false;
        const trimmed = text.trim();
        return (trimmed.startsWith("{") && trimmed.endsWith("}"))
            || (trimmed.startsWith("[") && trimmed.endsWith("]"));
    }
}
// Create a singleton instance
const registry = new AdapterRegistry();
exports.default = registry;
//# sourceMappingURL=AdapterRegistry.js.map