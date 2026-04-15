import Ajv from "ajv/dist/2019";
import { ErrorObject } from "ajv";
import statblockSchema from "../schema/statblock.schema.json";
import featureSchema from "../schema/feature.schema.json";
import ancestrySchema from "../schema/ancestry.schema.json";
import careerSchema from "../schema/career.schema.json";
import classSchema from "../schema/class.schema.json";
import complicationSchema from "../schema/complication.schema.json";
import conditionSchema from "../schema/condition.schema.json";
import cultureSchema from "../schema/culture.schema.json";
import kitSchema from "../schema/kit.schema.json";
import perkSchema from "../schema/perk.schema.json";
import titleSchema from "../schema/title.schema.json";
import treasureSchema from "../schema/treasure.schema.json";

const ALL_SCHEMAS = [
    { key: "feature.schema.json", schema: featureSchema },
    { key: "statblock.schema.json", schema: statblockSchema },
    { key: "ancestry.schema.json", schema: ancestrySchema },
    { key: "career.schema.json", schema: careerSchema },
    { key: "class.schema.json", schema: classSchema },
    { key: "complication.schema.json", schema: complicationSchema },
    { key: "condition.schema.json", schema: conditionSchema },
    { key: "culture.schema.json", schema: cultureSchema },
    { key: "kit.schema.json", schema: kitSchema },
    { key: "perk.schema.json", schema: perkSchema },
    { key: "title.schema.json", schema: titleSchema },
    { key: "treasure.schema.json", schema: treasureSchema },
] as const;

class Validator {
    private ajv: Ajv;

    constructor() {
        this.ajv = new Ajv({ allErrors: true });
        for (const { key, schema } of ALL_SCHEMAS) {
            this.ajv.addSchema(schema, key);
        }
    }

    getAvailableSchemas(): string[] {
        return ALL_SCHEMAS.map(s => s.key);
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