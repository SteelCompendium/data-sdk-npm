import { StatblockSplitter } from "../../../io/text/StatblockSplitter";
import * as fs from "fs";
import * as path from "path";
import { PrereleasePdfStatblockReader } from "../../../io/text/PrereleasePdfStatblockReader";

describe("StatblockSplitter", () => {
    it("should split the prerelease pdf text into statblocks", () => {
        const text = fs.readFileSync(path.join(__dirname, "../../data/pdf/prerelease-pdf/road_to_broadhurst.txt"), "utf-8");
        const statblocks = StatblockSplitter.split(text);
        expect(statblocks).toHaveLength(4);

        const reader = new PrereleasePdfStatblockReader();
        const names = statblocks.map((s: string) => reader.read(s).name);
        expect(names).toEqual([
            "R ADENWIGHT M ISCHIEVER",
            "R ADENWIGHT SWIFTPAW",
            "R ADENWIGHT R EDEYE",
            "R ADENWIGHT M AESTRO",
        ]);
    });
}); 