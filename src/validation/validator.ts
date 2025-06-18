import Ajv, { ErrorObject } from "ajv";
import statblockSchema from "../schema/statblock.schema.json";
import abilitySchema from "../schema/ability.schema.json";

class Validator {
    private ajv: Ajv;

    constructor() {
        this.ajv = new Ajv({ allErrors: true });
        this.ajv.addSchema(abilitySchema, "ability.schema.json");
        this.ajv.addSchema(statblockSchema, "statblock.schema.json");
    }

    getAvailableSchemas(): string[] {
        // Ajv does not provide a direct way to list added schema keys.
        // We will return the names we used to add them.
        return ["statblock.schema.json", "ability.schema.json"];
    }

    async validateJSON(data: string | object, schemaName: string = "statblock.schema.json"): Promise<{ valid: boolean; errors: ErrorObject[] | null | undefined, data?: any }> {
        let jsonData;
        if (typeof data === "string") {
            try {
                jsonData = JSON.parse(data);
            } catch (e: any) {
                const error: ErrorObject = {
                    keyword: 'parsing',
                    instancePath: '',
                    schemaPath: '',
                    params: {},
                    message: e.message,
                };
                return { valid: false, errors: [error] };
            }
        } else {
            jsonData = data;
        }

        const validate = this.ajv.getSchema(schemaName);
        if (!validate) {
            throw new Error(`Could not find schema: ${schemaName}`);
        }
        const valid = await Promise.resolve(validate(jsonData));
        if (valid) {
            return { valid: true, errors: null, data: jsonData };
        }
        return { valid: false, errors: validate.errors };
    }

    formatErrors(errors: ErrorObject[]): string {
        return errors
            .map(error => `${error.instancePath} ${error.message}`)
            .join("\\n");
    }
}

const validator = new Validator();
export default validator; 