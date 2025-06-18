import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { PrereleasePdfStatblockReader } from "../../../io/text/PrereleasePdfStatblockReader";

describe("PrereleasePdfStatblockReader", () => {
	const adapter = new PrereleasePdfStatblockReader();
	const inputsDir = path.join(__dirname, "..", "..", "data", "prerelease-pdf");
	const outputsDir = path.join(__dirname, "..", "..", "data", "dto-json");

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