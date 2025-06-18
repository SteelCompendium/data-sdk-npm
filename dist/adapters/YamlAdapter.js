"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAdapter_1 = __importDefault(require("./BaseAdapter"));
const js_yaml_1 = __importDefault(require("js-yaml"));
class YamlAdapter extends BaseAdapter_1.default {
    getName() {
        return "YAML";
    }
    parse(text) {
        try {
            return js_yaml_1.default.load(text);
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.error("Error parsing YAML:", e);
            throw new Error("Invalid YAML input.");
        }
    }
    format(statblock) {
        return js_yaml_1.default.dump(statblock);
    }
}
exports.default = YamlAdapter;
//# sourceMappingURL=YamlAdapter.js.map