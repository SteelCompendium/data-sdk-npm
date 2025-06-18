"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAdapter_1 = __importDefault(require("./BaseAdapter"));
class JsonAdapter extends BaseAdapter_1.default {
    getName() {
        return "JSON";
    }
    parse(text) {
        try {
            return JSON.parse(text);
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.error("Error parsing JSON:", e);
            throw new Error("Invalid JSON input.");
        }
    }
    format(statblock) {
        return JSON.stringify(statblock, null, 2);
    }
}
exports.default = JsonAdapter;
//# sourceMappingURL=JsonAdapter.js.map