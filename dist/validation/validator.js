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
const ajv_1 = __importDefault(require("ajv"));
const statblock_schema_json_1 = __importDefault(require("../schema/statblock.schema.json"));
const ability_schema_json_1 = __importDefault(require("../schema/ability.schema.json"));
class Validator {
    constructor() {
        this.ajv = new ajv_1.default({ allErrors: true });
        this.ajv.addSchema(ability_schema_json_1.default, "ability.schema.json");
        this.ajv.addSchema(statblock_schema_json_1.default, "statblock.schema.json");
    }
    validateJSON(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonData;
            if (typeof data === "string") {
                try {
                    jsonData = JSON.parse(data);
                }
                catch (e) {
                    const error = {
                        keyword: 'parsing',
                        instancePath: '',
                        schemaPath: '',
                        params: {},
                        message: e.message,
                    };
                    return { valid: false, errors: [error] };
                }
            }
            else {
                jsonData = data;
            }
            const validate = this.ajv.getSchema("statblock.schema.json");
            if (!validate) {
                throw new Error("Could not find statblock schema");
            }
            const valid = yield Promise.resolve(validate(jsonData));
            return { valid: valid, errors: validate.errors };
        });
    }
    formatErrors(errors) {
        return errors
            .map(error => `${error.instancePath} ${error.message}`)
            .join("\\n");
    }
}
const validator = new Validator();
exports.default = validator;
//# sourceMappingURL=validator.js.map