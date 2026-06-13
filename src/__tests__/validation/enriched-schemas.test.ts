import { describe, expect, test } from "@jest/globals";
import validator from "../../validation/validator";
import fs from "fs";
import path from "path";

describe("Enriched Schema Validation", () => {
    describe("Kit schema", () => {
        const dataDir = path.resolve(__dirname, "../data/kit/dto-json");
        const filenames = fs.readdirSync(dataDir).filter(file => file.endsWith(".json"));

        filenames.forEach(filename => {
            test(`should validate ${filename} against kit schema`, async () => {
                const filePath = path.join(dataDir, filename);
                const jsonString = fs.readFileSync(filePath, "utf-8");
                const result = await validator.validateJSON(jsonString, "kit.schema.json");

                if (!result.valid) {
                    const formattedErrors = validator.formatErrors(result.errors || []);
                    throw new Error(`Validation failed for ${filename}:\n${formattedErrors}`);
                }

                expect(result.valid).toBe(true);
            });
        });

        test("should reject kit with unknown property", async () => {
            const invalidKit = { name: "Bad Kit", type: "kit", unknown_field: true };
            const result = await validator.validateJSON(invalidKit, "kit.schema.json");
            expect(result.valid).toBe(false);
        });

        test("should reject kit missing required name", async () => {
            const invalidKit = { type: "kit" };
            const result = await validator.validateJSON(invalidKit, "kit.schema.json");
            expect(result.valid).toBe(false);
        });
    });

    describe("Ancestry schema", () => {
        const dataDir = path.resolve(__dirname, "../data/ancestry/dto-json");
        const filenames = fs.readdirSync(dataDir).filter(file => file.endsWith(".json"));

        filenames.forEach(filename => {
            test(`should validate ${filename} against ancestry schema`, async () => {
                const filePath = path.join(dataDir, filename);
                const jsonString = fs.readFileSync(filePath, "utf-8");
                const result = await validator.validateJSON(jsonString, "ancestry.schema.json");

                if (!result.valid) {
                    const formattedErrors = validator.formatErrors(result.errors || []);
                    throw new Error(`Validation failed for ${filename}:\n${formattedErrors}`);
                }

                expect(result.valid).toBe(true);
            });
        });

        test("should reject ancestry with invalid purchased_trait (missing cost)", async () => {
            const invalidAncestry = {
                name: "Bad Ancestry",
                type: "ancestry",
                purchased_traits: [{ name: "Trait Without Cost" }]
            };
            const result = await validator.validateJSON(invalidAncestry, "ancestry.schema.json");
            expect(result.valid).toBe(false);
        });

        test("should reject ancestry with unknown property", async () => {
            const invalidAncestry = { name: "Bad", type: "ancestry", bogus: true };
            const result = await validator.validateJSON(invalidAncestry, "ancestry.schema.json");
            expect(result.valid).toBe(false);
        });
    });

    describe("Complication schema", () => {
        test("should validate complication with benefit and drawback", async () => {
            const complication = {
                name: "Amnesia",
                type: "complication",
                flavor: "You have no memory of your past.",
                benefit: "You have a supernatural possession.",
                drawback: "You take a bane on any test made to recall lore."
            };
            const result = await validator.validateJSON(complication, "complication.schema.json");
            expect(result.valid).toBe(true);
        });

        test("should validate minimal complication", async () => {
            const complication = { name: "Test", type: "complication" };
            const result = await validator.validateJSON(complication, "complication.schema.json");
            expect(result.valid).toBe(true);
        });
    });

    describe("Career schema", () => {
        test("should validate career with full fields", async () => {
            const career = {
                name: "Criminal",
                type: "career",
                flavor: "You once worked as a bandit, insurgent, smuggler, outlaw, or even as an assassin.",
                skills: ["Criminal Underworld", "Pick Lock", "Pick Pocket"],
                skill_group: "intrigue",
                language: "One language",
                project_points: 120,
                perk: "Criminal Contacts",
                perk_group: "intrigue",
                inciting_incidents: [
                    { roll: 1, name: "Antiquity Procurement", description: "You stole, smuggled, and sold antiquities." },
                    { roll: 2, name: "Atonement", description: "The last criminal job you pulled led to the death of someone." }
                ]
            };
            const result = await validator.validateJSON(career, "career.schema.json");
            expect(result.valid).toBe(true);
        });

        test("should reject career with string project_points", async () => {
            const career = { name: "Bad", type: "career", project_points: "120" };
            const result = await validator.validateJSON(career, "career.schema.json");
            expect(result.valid).toBe(false);
        });
    });

    describe("Class schema", () => {
        test("should validate class with basics fields", async () => {
            const cls = {
                name: "Fury",
                type: "class",
                flavor: "You do not temper the heat of battle within you. You unleash it!",
                heroic_resource: "Rage",
                primary_characteristics: ["Might", "Agility"],
                weak_potency: "Might - 2",
                average_potency: "Might - 1",
                strong_potency: "Might",
                starting_stamina: 21,
                stamina_per_level: 9,
                recoveries: 10,
                skills: ["Nature"],
                skill_group: "exploration or intrigue"
            };
            const result = await validator.validateJSON(cls, "class.schema.json");
            expect(result.valid).toBe(true);
        });
    });

    describe("Treasure schema", () => {
        test("should validate treasure with project fields and level_effects", async () => {
            const treasure = {
                name: "Blade of Quintessence",
                type: "treasure",
                treasure_type: "Leveled",
                flavor: "This crystal blade houses a stormy vortex of fire, ice, and lightning.",
                keywords: ["Magic", "Medium Weapon"],
                item_prerequisite: "A ruby hardened in the fires of the City of Brass, a sapphire that has been struck by lightning",
                project_source: "Texts or lore in Zaliac",
                project_roll_characteristic: "Might, Reason, or Intuition",
                project_goal: 450,
                level_effects: {
                    "1st": "Any weapon ability gains a +1 damage bonus.",
                    "5th": "The weapon's damage bonus increases to +2.",
                    "9th": "The weapon's damage bonus increases to +3."
                }
            };
            const result = await validator.validateJSON(treasure, "treasure.schema.json");
            expect(result.valid).toBe(true);
        });
    });

    describe("Perk schema", () => {
        test("should validate perk with group", async () => {
            const perk = {
                name: "Area of Expertise",
                type: "perk",
                perk_group: "Crafting",
                content: "Choose one skill you already have from the crafting skill group."
            };
            const result = await validator.validateJSON(perk, "perk.schema.json");
            expect(result.valid).toBe(true);
        });
    });

    describe("Title schema", () => {
        test("should validate title with prerequisite and effect", async () => {
            const title = {
                name: "Brawler",
                type: "title",
                echelon: "1st",
                flavor: "We won't kill you. But you might wish we had.",
                prerequisite: "You triumph in battle without killing any of your foes.",
                effect: "Choose one of the following benefits:",
                benefits: ["Duck!", "Furniture Fighter", "Headbutt", "If I Wanted You Dead, You'd Be Dead"]
            };
            const result = await validator.validateJSON(title, "title.schema.json");
            expect(result.valid).toBe(true);
        });
    });

    describe("Culture schema", () => {
        test("should validate culture with benefit type and skill options", async () => {
            const culture = {
                name: "Urban",
                type: "culture",
                culture_benefit_type: "Environment",
                skill_options: ["interpersonal", "intrigue"],
                quick_build_skill: "Alertness"
            };
            const result = await validator.validateJSON(culture, "culture.schema.json");
            expect(result.valid).toBe(true);
        });
    });

    describe("Featureblock schema", () => {
        test("should validate malice featureblock with rich feature (power roll + sections + enhancement)", async () => {
            const featureblockSample = {
                name: "Basilisk Malice",
                type: "featureblock",
                kind: "malice",
                flavor: "At the start of any basilisk's turn…",
                features: [
                    {
                        name: "Upchuck",
                        icon: "🔳",
                        cost: "5 Malice",
                        usage: "Main action",
                        keywords: ["Area", "Weapon"],
                        distance: "3 cube within 10",
                        target: "Each enemy in the area",
                        power_roll: { formula: "+ 2", tiers: { low: "4 damage", mid: "4 damage; prone", high: "5 damage" } },
                        sections: [{ label: "Effect", text: "Spits a stone." }],
                        enhancements: [{ cost: "2 Malice", text: "More." }],
                    },
                ],
            };
            const result = await validator.validateJSON(featureblockSample, "featureblock.schema.json");
            if (!result.valid) {
                const formattedErrors = validator.formatErrors(result.errors || []);
                throw new Error(`Validation failed for featureblock sample:\n${formattedErrors}`);
            }
            expect(result.valid).toBe(true);
        });

        test("should validate dynamic-terrain featureblock with loose stats and passive feature", async () => {
            const terrainSample = {
                name: "Angry Beehive",
                type: "dynamic-terrain",
                level: 2,
                terrain_type: "Hazard",
                role: "Hexer",
                stats: [
                    { name: "EV", value: "2" },
                    { name: "Stamina", value: "3" },
                    { name: "Size", value: "1S" },
                ],
                features: [{ name: "Deactivate", icon: "🌀", body: "The beehive can't be deactivated." }],
            };
            const result = await validator.validateJSON(terrainSample, "featureblock.schema.json");
            if (!result.valid) {
                const formattedErrors = validator.formatErrors(result.errors || []);
                throw new Error(`Validation failed for dynamic-terrain sample:\n${formattedErrors}`);
            }
            expect(result.valid).toBe(true);
        });

        test("should reject featureblock missing required features array", async () => {
            const invalid = { name: "Bad Block", type: "featureblock" };
            const result = await validator.validateJSON(invalid, "featureblock.schema.json");
            expect(result.valid).toBe(false);
        });

        test("should reject featureblock with invalid type value", async () => {
            const invalid = { name: "Bad Block", type: "statblock", features: [] };
            const result = await validator.validateJSON(invalid, "featureblock.schema.json");
            expect(result.valid).toBe(false);
        });
    });
});
