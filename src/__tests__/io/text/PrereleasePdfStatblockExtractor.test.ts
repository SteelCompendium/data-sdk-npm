import { PrereleasePdfStatblockExtractor } from "../../../io/text/PrereleasePdfStatblockExtractor";
import * as fs from "fs";
import * as path from "path";

describe("PrereleasePdfStatblockExtractor", () => {
    it("should extract the statblocks from the road to broadhurst prerelease pdf text", () => {
        const text = fs.readFileSync(path.join(__dirname, "../../data/pdf/prerelease-pdf/road_to_broadhurst.txt"), "utf-8");
        const statblocks = new PrereleasePdfStatblockExtractor().extractText(text);
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
            "G OBLIN WARRIOR LEVEL 1 HORDE HARRIER",
        ]);

        const maestroLines = statblocks[3].split("\n");
        expect(maestroLines[maestroLines.length - 1]).toBe(
            "triggered action once in conjunction with these free strikes."
        );

        const warriorLines = statblocks[7].split("\n");
        expect(warriorLines[warriorLines.length - 1]).toBe("The warrior doesn’t provoke opportunity attacks by moving.");
    });

    it("should extract the statblocks from the delian tomb encounters prerelease pdf text", () => {
        const text = fs.readFileSync(path.join(__dirname, "../../data/pdf/prerelease-pdf/delian_tomb_encounters.txt"), "utf-8");
        const statblocks = new PrereleasePdfStatblockExtractor().extractText(text);
        expect(statblocks.length).toBeGreaterThanOrEqual(109);

        const names = statblocks.map((s: string) => s.split("\n")[0]);
        expect(names).toEqual([
            "GOBLIN ASSASSIN L EVEL 1 HORDE AMBUSHER",
            "GOBLIN UNDERBOSS L EVEL 1 HORDE S UPPORT",
            "GOBLIN WARRIOR L EVEL 1 HORDE HARRIER",
            "GOBLIN S NIPER L EVEL 1 M INION ARTILLERY",
            "GOBLIN S PINECLEAVER L EVEL 1 M INION B RUTE",
            "GOBLIN WARRIOR L EVEL 1 HORDE HARRIER",
            "GHOUL L EVEL 1 HORDE HARRIER",
            "S KELETON L EVEL 1 HORDE ARTILLERY",
            "Z OMBIE L EVEL 1 HORDE B RUTE",
            "B UGBEAR CHANNELER L EVEL 2 E LITE CONTROLLER",
            "GOBLIN S PINECLEAVER L EVEL 1 M INION B RUTE",
            "GOBLIN WARRIOR L EVEL 1 HORDE HARRIER",
            "DWARF S TONEWHISPERER L EVEL 3 P LATOON CONTROLLER",
            "DWARF T RAPPER L EVEL 1 P LATOON HARRIER",
            "DWARF WARDEN L EVEL 2 P LATOON B RUTE",
            "HUMAN B RAWLER L EVEL 1 P LATOON B RUTE",
            "HUMAN GUARD L EVEL 1 M INION B RUTE",
            "HUMAN RAIDER L EVEL 1 M INION HARRIER",
            "WEREWOLF L EVEL 1 S OLO",
            "B ODDORFF B UCKFEATHER L EVEL 2 E LITE S UPPORT",
            "GOREK L EVEL 2 E LITE B RUTE",
            "M ARA L EVEL 2 E LITE CONTROLLER",
            "T ARGON L EVEL 2 E LITE ARTILLERY",
            "ARMORED S OULWIGHT L EVEL 1 HORDE HEXER",
            "S PINDLEGOTH L EVEL 1 HORDE AMBUSHER",
            "GHOST L EVEL 1 L EADER",
            "S HADE L EVEL 1 M INION AMBUSHER",
            "S PECTER L EVEL 1 HORDE HEXER",
            "DECREPIT S KELETON L EVEL 1 M INION ARTILLERY",
            "S KELETON L EVEL 1 HORDE ARTILLERY",
            "S OULWIGHT L EVEL 1 HORDE HEXER",
            "WALLMASTER L EVEL 1 E LITE DEFENDER",
            "GHOUL L EVEL 1 HORDE HARRIER",
            "M EMORIAL I VY L EVEL 2 M INION ARTILLERY",
            "ROTTING Z OMBIE L EVEL 1 M INION B RUTE",
            "S OULWIGHT L EVEL 1 HORDE HEXER",
            "T OMB HORROR L EVEL 2 E LITE B RUTE",
            "CREEPING S LUDGE L EVEL 2 HORDE B RUTE",
            "I MIT P UTTY L EVEL 1 HORDE AMBUSHER",
            "B LACK I CHOR L EVEL 2 M INION DEFENDER",
            "CREEPING S LUDGE L EVEL 2 HORDE B RUTE",
            "GELATINOUS B ALL L EVEL 1 HORDE HARRIER",
            "CRAWLING CLAW L EVEL 1 M INION HARRIER",
            "DAME CORNELIA L EVEL 1 L EADER",
            "DECREPIT S KELETON L EVEL 1 M INION ARTILLERY",
            "S OULWIGHT L EVEL 1 HORDE HEXER",
            "Z OMBIE L EVEL 1 HORDE B RUTE",
            "B ODDORFF B UCKFEATHER L EVEL 2 E LITE S UPPORT",
            "GOREK L EVEL 2 E LITE B RUTE",
            "M ARA L EVEL 2 E LITE CONTROLLER",
            "ARIXX L EVEL 1 S OLO",
            "CLAWFISH L EVEL 1 M INION B RUTE",
            "HUMAN ARCHER L EVEL 1 M INION ARTILLERY",
            "HUMAN ARCHER L EVEL 1 M INION ARTILLERY",
            "HUMAN RAIDER L EVEL 1 M INION HARRIER",
            "HUMAN ROGUE L EVEL 1 M INION AMBUSHER",
            "HUMAN S COUNDREL L EVEL 1 P LATOON AMBUSHER",
            "HUMAN T RICKSHOT L EVEL 1 P LATOON ARTILLERY",
            "HUMAN KNAVE L EVEL 2 P LATOON DEFENDER",
            "HUMAN RAIDER L EVEL 1 M INION HARRIER",
            "B RUNE L EVEL 1 P LATOON B RUTE",
            "HUMAN B ANDIT CHIEF L EVEL 3 L EADER",
            "L AESI L EVEL 2 E LITE HARRIER",
            "GLASS S PIDER L EVEL 1 E LITE S KIRMISHER",
            "M OHLER L EVEL 1 M INION AMBUSHER",
            "O GRE GOON L EVEL 2 E LITE B RUTE",
            "O GRE JUGGERNAUT L EVEL 2 E LITE HARRIER",
            "V URKOR L EVEL 2 E LITE CONTROLLER",
            "Z OMBIE L EVEL 1 HORDE B RUTE",
            "E SSENCE OF CHANGE L EVEL 1 E LITE M OUNT",
            "F LOW OF THE RIVER L EVEL 2 M INION HARRIER",
            "S UDDEN DOWNPOUR L EVEL 1 HORDE AMBUSHER",
            "WEREWOLF L EVEL 1 S OLO",
            "GOBLIN CURSESPITTER L EVEL 1 HORDE HEXER",
            "GOBLIN S NIPER L EVEL 1 M INION ARTILLERY",
            "GOBLIN S PINECLEAVER L EVEL 1 M INION B RUTE",
            "GOBLIN UNDERBOSS L EVEL 1 HORDE S UPPORT",
            "GOBLIN WARRIOR L EVEL 1 HORDE HARRIER",
            "GOBLIN ASSASSIN L EVEL 1 HORDE AMBUSHER",
            "GOBLIN S TINKER L EVEL 1 HORDE CONTROLLER",
            "GOBLIN WARRIOR L EVEL 1 HORDE HARRIER",
            "WORG L EVEL 1 HORDE M OUNT",
            "GOBLIN RUNNER L EVEL 1 M INION HARRIER",
            "GOBLIN S NIPER L EVEL 1 M INION ARTILLERY",
            "GOBLIN M ONARCH L EVEL 1 L EADER",
            "WAR S PIDER L EVEL 1 E LITE M OUNT",
            "ARCHER ’S S TAKES L EVEL 1 F ORTIFICATION DEFENDER",
            "GOBLIN RUNNER L EVEL 1 M INION HARRIER",
            "GOBLIN S NIPER L EVEL 1 M INION ARTILLERY",
            "GOBLIN UNDERBOSS L EVEL 1 HORDE S UPPORT",
            "GOBLIN WARRIOR L EVEL 1 HORDE HARRIER",
            "P ILLAR L EVEL 2 HAZARD HEXER",
            "GOBLIN ASSASSIN L EVEL 1 HORDE AMBUSHER",
            "GOBLIN CURSESPITTER L EVEL 1 HORDE HEXER",
            "B UGBEAR COMMANDER L EVEL 2 E LITE S UPPORT",
            "M EMORIAL I VY L EVEL 2 M INION ARTILLERY",
            "T ARGON L EVEL 2 E LITE ARTILLERY",
            "GOBLIN S PINECLEAVER L EVEL 1 M INION B RUTE",
            "GOBLIN UNDERBOSS L EVEL 1 HORDE S UPPORT",
            "GOBLIN WARRIOR L EVEL 1 HORDE HARRIER",
            "S PINDLEGOTH L EVEL 1 HORDE AMBUSHER",
            "GOBLIN ASSASSIN L EVEL 1 HORDE AMBUSHER",
            "GOBLIN CURSESPITTER L EVEL 1 HORDE HEXER",
            "GOBLIN M ONARCH L EVEL 1 L EADER",
            "GOBLIN RUNNER L EVEL 1 M INION HARRIER",
            "GOBLIN S TINKER L EVEL 1 HORDE CONTROLLER",
            "GOBLIN WARRIOR L EVEL 1 HORDE HARRIER",
            "S PINDLEGOTH L EVEL 1 HORDE AMBUSHER",
            "WAR S PIDER L EVEL 1 E LITE M OUNT",
            "GOBLIN M ONARCH L EVEL 1 L EADER",
            "GOBLIN S HADOWKNIFE L EVEL 2 HORDE AMBUSHER",
            "GOBLIN DEATHTONGUE L EVEL 2 HORDE HEXER",
            "GOBLIN T OXINAUT L EVEL 2 HORDE CONTROLLER",
            "GOBLIN M ASTERMIND L EVEL 2 HORDE S UPPORT",
            "GOBLIN B ATTLEBORN L EVEL 2 HORDE B RUTE",
            "M YSTIC Q UEEN B ARGNOT L EVEL 3 L EADER",
        ]);
        expect(names[0]).toBe("GOBLIN ASSASSIN L EVEL 1 HORDE AMBUSHER");
        const goblinAssassinLines = statblocks[0].split("\n");
        expect(goblinAssassinLines[goblinAssassinLines.length - 1]).toBe(
            "The assassin can take the Hide maneuver even while observed."
        );

        const werewolfIndex = names.indexOf("WEREWOLF L EVEL 1 S OLO");
        expect(werewolfIndex).toBeGreaterThan(-1);
        const werewolfLines = statblocks[werewolfIndex].split("\n");
        expect(werewolfLines[werewolfLines.length - 1]).toBe(
            "using this ability."
        );

        const mysticQueenIndex = names.indexOf("M YSTIC Q UEEN B ARGNOT L EVEL 3 L EADER");
        expect(mysticQueenIndex).toBeGreaterThan(-1);
        const mysticQueenLines = statblocks[mysticQueenIndex].split("\n");
        expect(mysticQueenLines[mysticQueenLines.length - 1]).toBe("(EoT) after using this villain action.");

    });
}); 