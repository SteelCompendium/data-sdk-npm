import { ErrorObject } from "ajv";
declare class Validator {
    private ajv;
    constructor();
    validateJSON(data: string | object): Promise<{
        valid: boolean;
        errors: ErrorObject[] | null | undefined;
    }>;
    formatErrors(errors: ErrorObject[]): string;
}
declare const validator: Validator;
export default validator;
