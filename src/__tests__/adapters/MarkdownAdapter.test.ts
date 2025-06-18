import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import JsonAdapter from "../../adapters/JsonAdapter";
import MarkdownAdapter from "../../adapters/MarkdownAdapter";

const jsonAdapter = new JsonAdapter();
const markdownAdapter = new MarkdownAdapter();

const inputsDir = path.join(__dirname, "..", "data", "markdown-adapter", "inputs");
const outputsDir = path.join(__dirname, "..", "data", "markdown-adapter", "outputs");

describe("MarkdownAdapter", () => {
	const testFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".json"));

	testFiles.forEach(file => {
		const inputFile = path.join(inputsDir, file);
		const outputFile = path.join(outputsDir, file.replace(".json", ".md"));

		if (fs.existsSync(outputFile)) {
			it(`should correctly convert ${file} to markdown`, () => {
				const input = fs.readFileSync(inputFile, "utf-8");
				const expectedOutput = fs.readFileSync(outputFile, "utf-8");

				const statblock = jsonAdapter.parse(input);
				const actualOutput = markdownAdapter.format(statblock);

				expect(actualOutput.trim()).toEqual(expectedOutput.trim());
			});
		} else {
			it.skip(`should correctly convert ${file} to markdown (output file not found)`, () => {
				// This test is skipped because the output file does not exist.
			});
		}
	});
});