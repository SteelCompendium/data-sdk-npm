import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { PrereleasePdfAbilityReader } from "../../../io/text/PrereleasePdfAbilityReader";

describe("PrereleasePdfAbilityReader", () => {
	const adapter = new PrereleasePdfAbilityReader();
	const inputsDir = path.join(__dirname, "..", "..", "data", "ability", "prerelease-pdf");
	const outputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-json");

	const testFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".txt"));

	testFiles.forEach(file => {
		it(`should correctly parse ${file}`, () => {
			const inputPath = path.join(inputsDir, file);
			const outputPath = path.join(outputsDir, file.replace(".txt", ".json"));

			const inputText = fs.readFileSync(inputPath, "utf-8");
			const expectedOutput = JSON.parse(fs.readFileSync(outputPath, "utf-8"));

			const result = adapter.read(inputText).toDTO();

			expect(result).toEqual(expectedOutput);
		});
	});
});