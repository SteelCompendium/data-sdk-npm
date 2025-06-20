import { PrereleasePdfStatblockExtractor } from "../../../io/text/PrereleasePdfStatblockExtractor";
import * as fs from "fs";
import * as path from "path";

describe("PrereleasePdfStatblockExtractor", () => {
    it("should extract the statblocks from the prerelease pdf text", () => {
        const text = fs.readFileSync(path.join(__dirname, "../../data/pdf/prerelease-pdf/road_to_broadhurst.txt"), "utf-8");
        const statblocks = PrereleasePdfStatblockExtractor.extractStatblockText(text);
        expect(statblocks).toHaveLength(8);

        const names = statblocks.map((s: string) => s.split("\n")[0]);
        expect(names).toEqual([
            "R ADENWIGHT M ISCHIEVER LEVEL 1 M INION AMBUSHER",
            "R ADENWIGHT SWIFTPAW LEVEL 1 M INION HARRIER",
            "R ADENWIGHT R EDEYE LEVEL 1 M INION ARTILLERY",
            "R ADENWIGHT M AESTRO LEVEL 1 LEADER",
            "G OBLIN SNIPER LEVEL 1 M INION ARTILLERY",
            "G OBLIN ASSASSIN LEVEL 1 HORDE AMBUSHER",
            "G OBLIN STINKER LEVEL 1 HORDE C ONTROLLER",
            "G OBLIN WARRIOR LEVEL 1 HORDE HARRIER"
        ]);
    });
}); 