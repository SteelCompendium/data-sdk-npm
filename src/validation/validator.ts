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

    validateJSON(data: string | object): { valid: boolean; errors: ErrorObject[] | null | undefined } {
        let jsonData;
        if (typeof data === "string") {
            try {
                jsonData = JSON.parse(data);
            } catch (e: any) {
                return { valid: false, errors: [{ keyword: "parsing", message: e.message, dataPath: "", schemaPath: "" }] };
            }
        } else {
            jsonData = data;
        }

        const validate = this.ajv.getSchema("statblock.schema.json");
        if (!validate) {
            throw new Error("Could not find statblock schema");
        }
        const valid = validate(jsonData);
        return { valid, errors: validate.errors };
    }

    formatErrors(errors: ErrorObject[]): string {
        return errors
            .map(error => `${error.dataPath} ${error.message}`)
            .join("\\n");
    }
}

const validator = new Validator();
export default validator; 