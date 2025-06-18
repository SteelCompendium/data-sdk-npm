import { describe, expect, test } from "@jest/globals";
import validator from "../../validation/validator";
import fs from "fs";
import path from "path";

describe("JSONValidator", () => {
    const dataDir = path.resolve(__dirname, "../data/statblock/dto-json");
    const filenames = fs.readdirSync(dataDir).filter(file => file.endsWith(".json"));

    filenames.forEach(filename => {
        test(`should validate ${filename} successfully`, async () => {
            const filePath = path.join(dataDir, filename);
            const jsonString = fs.readFileSync(filePath, "utf-8");
            const result = await validator.validateJSON(jsonString);

            if (!result.valid) {
                const formattedErrors = validator.formatErrors(result.errors || []);
                throw new Error(`Validation failed for ${filename}:\n${formattedErrors}`);
            }

            expect(result.valid).toBe(true);
        });
    });
}); 