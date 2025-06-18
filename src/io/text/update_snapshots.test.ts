import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { PrereleasePdfStatblockReader } from "./PrereleasePdfStatblockReader";
import { Statblock } from "../../model/Statblock";

describe("Update Snapshots", () => {
    it("should update all snapshots", () => {
        // const adapter = new PrereleasePdfStatblockReader();
        // const inputsDir = path.join(__dirname, "..", "..", "__tests__", "data", "prerelease-pdf-statblock-reader", "inputs");
        // const outputsDir = path.join(__dirname, "..", "..", "__tests__", "data", "prerelease-pdf-statblock-reader", "outputs");

        // const testFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".txt"));

        // testFiles.forEach(file => {
        //     const inputPath = path.join(inputsDir, file);
        //     const outputPath = path.join(outputsDir, file.replace(".txt", ".json"));

        //     const inputText = fs.readFileSync(inputPath, "utf-8");

        //     const result = adapter.read(inputText);

        //     fs.writeFileSync(outputPath, JSON.stringify(Statblock.fromSource(result), null, 2));
        // });
    });
}); 