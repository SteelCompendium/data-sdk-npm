import { ErrorObject } from "ajv";
declare class Validator {
    private ajv;
    constructor();
    getAvailableSchemas(): string[];
    validateJSON(data: string | object, schemaName?: string): Promise<{
        valid: boolean;
        errors: ErrorObject[] | null | undefined;
        data?: any;
    }>;
    formatErrors(errors: ErrorObject[]): string;
}
declare const validator: Validator;
export default validator;
