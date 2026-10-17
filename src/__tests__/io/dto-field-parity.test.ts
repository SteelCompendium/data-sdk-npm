import { describe, it, expect } from "@jest/globals";
import { TreasureDTO, CultureDTO, PerkDTO, StatblockDTO } from "../../dto";
import { Statblock } from "../../model";

// Round-trip tests for the card-data field-parity additions:
//   treasure: echelon + string project_goal
//   culture:  flavor
//   perk:     flavor
//   statblock: string free_strike + skills[] (beastheart companions, SC-390)
// Each constructs a DTO, converts to model and back, and asserts the new
// fields survive (fromDTO spreads ...dto; partialFromModel copies them back).

describe("DTO field parity round-trips", () => {
    it("round-trips treasure echelon and string project_goal", () => {
        const dto = new TreasureDTO({
            name: "Bag of Holding",
            echelon: "3",
            project_goal: "45",
            project_roll_characteristic: "Reason",
            flavor: "A bag that holds far more than its size suggests.",
        });
        const back = TreasureDTO.fromModel(dto.toModel());
        expect(back.echelon).toBe("3");
        expect(back.project_goal).toBe("45");
        expect(back.flavor).toBe("A bag that holds far more than its size suggests.");
    });

    it("still accepts a numeric treasure project_goal", () => {
        const dto = new TreasureDTO({ name: "Flame Tongue", project_goal: 450 });
        const back = TreasureDTO.fromModel(dto.toModel());
        expect(back.project_goal).toBe(450);
    });

    it("round-trips culture flavor", () => {
        const dto = new CultureDTO({ name: "Nomadic", flavor: "A wandering people of the high steppes." });
        const back = CultureDTO.fromModel(dto.toModel());
        expect(back.flavor).toBe("A wandering people of the high steppes.");
    });

    it("round-trips perk flavor", () => {
        const dto = new PerkDTO({ name: "Alert", flavor: "You always keep one eye on the door." });
        const back = PerkDTO.fromModel(dto.toModel());
        expect(back.flavor).toBe("You always keep one eye on the door.");
    });

    it("round-trips a companion statblock's text free_strike and skills", () => {
        const dto = new StatblockDTO({
            name: "Panther", organization: "Companion", keywords: ["Animal", "Companion"],
            stamina: "= yours", free_strike: "1 + M", skills: ["Sneak"],
        });
        const back = StatblockDTO.fromModel(dto.toModel());
        expect(back.free_strike).toBe("1 + M");
        expect(back.skills).toEqual(["Sneak"]);
        expect(back.stamina).toBe("= yours");
    });

    it("still accepts a numeric statblock free_strike and omits empty skills", () => {
        const dto = new StatblockDTO({ name: "Goblin Warrior", free_strike: 2 });
        const back = StatblockDTO.fromModel(dto.toModel());
        expect(back.free_strike).toBe(2);
        expect(back.skills).toBeUndefined();
    });

    it("loads a companion statblock from a plain object with a feature_type 'feature' member (DSE readYaml path)", () => {
        const sb = Statblock.modelDTOAdapter({
            name: "Panther", type: "statblock", organization: "Companion", stamina: "= yours",
            free_strike: "1 + M", skills: ["Sneak"],
            features: [
                { type: "feature", feature_type: "ability", name: "Pounce", ability_type: "Signature Ability",
                  usage: "Maneuver", keywords: ["Melee"], distance: "Melee 1", target: "One enemy", effects: [{ effect: "x" }] },
                { type: "feature", feature_type: "feature", name: "Mighty Spring", effects: [{ effect: "y" }] },
            ],
        } as any);
        expect(sb.features.map(f => f.feature_type)).toEqual(["ability", "trait"]);
        expect(sb.freeStrike).toBe("1 + M");
        expect(sb.skills).toEqual(["Sneak"]);
    });
});
