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

    async validateJSON(data: string | object): Promise<{ valid: boolean; errors: ErrorObject[] | null | undefined }> {
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

        const validate = this.ajv.getSchema("statblock.schema.json");
        if (!validate) {
            throw new Error("Could not find statblock schema");
        }
        const valid = await Promise.resolve(validate(jsonData));
        return { valid: valid as boolean, errors: validate.errors };
    }

    formatErrors(errors: ErrorObject[]): string {
        return errors
            .map(error => `${error.instancePath} ${error.message}`)
            .join("\\n");
    }
}

const validator = new Validator();
export default validator; 