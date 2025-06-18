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
    getAvailableSchemas() {
        // Ajv does not provide a direct way to list added schema keys.
        // We will return the names we used to add them.
        return ["statblock.schema.json", "ability.schema.json"];
    }
    validateJSON(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, schemaName = "statblock.schema.json") {
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
            const validate = this.ajv.getSchema(schemaName);
            if (!validate) {
                throw new Error(`Could not find schema: ${schemaName}`);
            }
            const valid = yield Promise.resolve(validate(jsonData));
            if (valid) {
                return { valid: true, errors: null, data: jsonData };
            }
            return { valid: false, errors: validate.errors };
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