import { Ability } from "../../model/Ability";
import { Effect } from "../../model/Effect";
import { Statblock } from "../../model/Statblock";
import { Trait } from "../../model/Trait";
import { IDataReader } from "../IDataReader";
import { Characteristics, MundaneEffect, PowerRollEffect } from "../../model";
import { Effects } from "../../model/Effects";

function cleanupOcrArtifacts(text: string): string {
    // collapse single letters that are separated by a space which is a common OCR artifact
    return text.replace(/\b([A-Z])\s+([A-Z]+)\b/g, '$1$2');
}

export class PrereleasePdfStatblockReader implements IDataReader<Statblock> {
    read(text: string): Statblock {
        const cleanedText = cleanupOcrArtifacts(text);
        const lines = cleanedText.split(/\r?\n/).map(l => l.trim()).filter(l => !l.includes("MCDM Productions"));
        let idx = 0;

        // skip any leading blank lines
        while (idx < lines.length && !lines[idx]) idx++;

        // 1) Header: name, tags
        const nameLine = lines[idx++];
        let levelLine = "";
        const statblock: Partial<Statblock> = {
            name: nameLine,
            level: 0,
            roles: [],
        };

        // Check if the next line has the level info
        if (idx < lines.length && /L\s*EVEL/i.test(lines[idx])) {
            levelLine = lines[idx++];
        } else if (/L\s*EVEL/i.test(nameLine)) {
            // for backwards compatibility, check if the name line has the level info
            levelLine = nameLine;
            // in this case, we need to extract the name from the line
            const nameMatch = /^(.+?)\s*L\s*EVEL/im.exec(nameLine);
            if (nameMatch) {
                statblock.name = nameMatch[1].trim();
            }
        }

        if (levelLine) {
            const levelMatch = /L\s*EVEL\s+(\d+)\s*(.*)/im.exec(levelLine);
            if (levelMatch) {
                statblock.level = parseInt(levelMatch[1], 10);
                statblock.roles = levelMatch[2] ? levelMatch[2].split(/\s+/).map(t => t.trim()).filter(Boolean) : [];
            }
        }

        // skip any blank lines
        while (idx < lines.length && !lines[idx]) idx++;

        // 2) Type / Subtype / EV - map to ancestry array
        let typeLine = lines[idx++];
        const typeMatch = /^(.*?)\s*EV\s+(.+)$/.exec(typeLine);
        if (typeMatch) {
            statblock.ancestry = typeMatch[1].split(/,/).map(s => s.trim()).filter(Boolean);
            statblock.ev = typeMatch[2].trim();
        } else {
            statblock.ancestry = typeLine.split(/,/).map(s => s.trim()).filter(Boolean);
            // EV might be on the next line
            if (idx < lines.length && /^\s*EV\s+/.test(lines[idx])) {
                typeLine = lines[idx++];
                const evMatch = /^\s*EV\s+(.+)$/.exec(typeLine);
                if (evMatch) {
                    statblock.ev = evMatch[1].trim();
                }
            }
        }

        // skip any blank lines
        while (idx < lines.length && !lines[idx]) idx++;

        // 3) Stamina
        const staminaLine = lines[idx++];
        const staminaMatch = /^Stamina\s+(\d+)/.exec(staminaLine);
        statblock.stamina = staminaMatch ? parseInt(staminaMatch[1], 10) : 0;

        const immunityMatchOnStamina = /Immunity\s+([^/]+)/i.exec(staminaLine);
        if (immunityMatchOnStamina) {
            statblock.immunities = immunityMatchOnStamina[1].trim().split(/\s*,\s*/).map(s => s.trim());
        }

        const weaknessMatchOnStamina = /Weakness\s+(.+)/i.exec(staminaLine);
        if (weaknessMatchOnStamina) {
            statblock.weaknesses = weaknessMatchOnStamina[1].trim().split(/\s*,\s*/).map(s => s.trim());
        }

        // skip any blank lines
        while (idx < lines.length && !lines[idx]) idx++;

        // 4, 5, 6) Speed, Size, Stability, Free Strike, Stats, etc.
        statblock.speed = "0";
        statblock.size = "";
        statblock.stability = 0;
        statblock.freeStrike = 0;
        statblock.characteristics = new Characteristics(0, 0, 0, 0, 0);
        statblock.ev = statblock.ev || "0";

        const statsKeywords = ["Speed", "Size", "Stability", "Free Strike", "Might", "Agility", "Reason", "Intuition", "Presence", "With Captain", "Immunity", "Weakness", "Target", "EV"];

        while (idx < lines.length) {
            const line = lines[idx];
            const abilityHeaderRe = /^(.+?)\s+\(\s*(Main Action|Action|Maneuver|Free Triggered Action|Triggered Action|Triggered|Villain Action\s*\d+)\s*\)/;
            if (abilityHeaderRe.test(line)) {
                break;
            }

            if (!statsKeywords.some(kw => line.includes(kw))) {
                if (line.trim()) {
                    break;
                }
            }

            if (!line.trim()) { // skip blank line
                idx++;
                continue;
            }

            const speedMatch = /Speed\s+([\d\s()A-z]+?)(?=\s*Size|\s*\/|$)/i.exec(line);
            if (speedMatch) {
                statblock.speed = speedMatch[1].trim();
            }

            const sizeMatch = /Size\s+(.+?)(?=\s*\/|$)/i.exec(line);
            if (sizeMatch) {
                statblock.size = sizeMatch[1].trim();
            }

            const stabilityMatch = /Stability\s+(\d+)/i.exec(line);
            if (stabilityMatch) {
                statblock.stability = parseInt(stabilityMatch[1], 10);
            }

            const fsMatch = /Free Strike\s+(\d+)/.exec(line);
            if (fsMatch) {
                statblock.freeStrike = parseInt(fsMatch[1], 10);
            }

            const captainMatch = /With Captain\s+(.+?)(?=\s+Free Strike|$)/.exec(line);
            if (captainMatch) {
                statblock.withCaptain = captainMatch[1].trim();
            }

            const mightMatch = /Might\s+([+-−]?\d+)/.exec(line);
            if (mightMatch) {
                statblock.characteristics.might = parseInt(mightMatch[1].replace("−", "-").replace("+", ""), 10);
            }

            const agilityMatch = /Agility\s+([+-−]?\d+)/.exec(line);
            if (agilityMatch) {
                statblock.characteristics.agility = parseInt(agilityMatch[1].replace("−", "-").replace("+", ""), 10);
            }

            const reasonMatch = /Reason\s+([+-−]?\d+)/.exec(line);
            if (reasonMatch) {
                statblock.characteristics.reason = parseInt(reasonMatch[1].replace("−", "-").replace("+", ""), 10);
            }

            const intuitionMatch = /Intuition\s+([+-−]?\d+)/.exec(line);
            if (intuitionMatch) {
                statblock.characteristics.intuition = parseInt(intuitionMatch[1].replace("−", "-").replace("+", ""), 10);
            }

            const presenceMatch = /Presence\s+([+-−]?\d+)/.exec(line);
            if (presenceMatch) {
                statblock.characteristics.presence = parseInt(presenceMatch[1].replace("−", "-").replace("+", ""), 10);
            }

            const evMatch = /EV\s+(.+)/i.exec(line);
            if (evMatch) {
                statblock.ev = evMatch[1].trim();
            }

            const weaknessMatch = /Weakness\s+(.+)/i.exec(line);
            if (weaknessMatch) {
                statblock.weaknesses = weaknessMatch[1].trim().split(/\s*,\s*/).map(s => s.trim());
            }

            const immunityMatch = /Immunity\s+(.+)/i.exec(line);
            if (immunityMatch) {
                statblock.immunities = immunityMatch[1].trim().split(/\s*,\s*/).map(s => s.trim());
            }

            idx++;
        }

        // skip any blank lines
        while (idx < lines.length && !lines[idx]) idx++;

        statblock.traits = [];
        statblock.abilities = [];

        const isNewToken = (line: string): boolean => {
            if (!line.trim()) return true; // blank line
            if (/^(.+?)\s+\(\s*(Main Action|Action|Maneuver|Free Triggered Action|Triggered Action|Triggered|Villain Action\s*\d+)\s*\)/.test(line)) return true;
            if (/^Keywords\s+/.test(line)) return true;
            if (/^Distance\s+/.test(line)) return true;
            if (/^[✦★✸]/.test(line)) return true;
            if (/^Effect\s+/.test(line)) return true;
            if (/^Trigger\s+/.test(line)) return true;
            if (/^\d+\+?\s+Malice/.test(line)) return true;
            const articles = ["the", "of", "and", "a", "an", "in", "on", "at", "to", "for", "by", "with", "as", "but", "or", "nor", "so", "yet"];
            const words = line.split(" ");
            const isTitleCased = words.every(w => articles.includes(w.toLowerCase()) || (w.length > 0 && /^[A-Z]/.test(w)));
            if (isTitleCased) {
                const m = /^(.+?)\s+\(\s*(Main Action|Action|Maneuver|Free Triggered Action|Triggered Action|Triggered|Villain Action\s*\d+)\s*\)/.exec(line);
                return !m;
            }
            return false;
        };

        let current: any = null;
        const pushCurrent = () => {
            if (!current) return;

            const ability: Partial<Ability> = {
                name: current.name,
                type: PrereleasePdfStatblockReader.mapActionTypeToAbilityType(current.category),
            };

            if (current.cost) {
                ability.cost = current.cost;
            }

            ability.keywords = current.keywords;

            if (current.range) {
                ability.distance = current.range;
            }

            if (current.target) {
                ability.target = current.target;
            }

            if (current.trigger) {
                ability.trigger = current.trigger;
            }

            ability.effects = new Effects(current.effects || []);

            statblock.abilities!.push(new Ability(ability));
            current = null;
        };

        while (idx < lines.length) {
            let line = lines[idx].trim();

            if (!line) {
                idx++;
                continue;
            }

            const headerRe = /^(.+?)\s+\(\s*(Main Action|Action|Maneuver|Free Triggered Action|Triggered Action|Triggered|Villain Action\s*\d+)\s*\)(?:\s*◆\s*(.+))?$/;
            const m = headerRe.exec(line);
            if (m) {
                pushCurrent();
                current = {
                    name: m[1].trim(),
                    category: m[2],
                    keywords: [],
                    range: "",
                    target: "",
                    outcomes: [],
                    effects: [],
                    trigger: "",
                    sub_effects: [],
                    parsing_outcomes: false,
                };

                const details = m[3] ? m[3].trim() : "";
                if (details) {
                    const rollRegex = /(\d+[dD]\d+)\s*\+\s*(\d+)/;
                    const rollMatch = rollRegex.exec(details);
                    if (rollMatch) {
                        current.roll = { dice: rollMatch[1], bonus: parseInt(rollMatch[2], 10) };
                        const remaining = details.replace(rollMatch[0], "").replace(/◆/g, "").trim();
                        if (remaining) {
                            current.cost = remaining;
                        }
                    } else {
                        current.cost = details;
                    }
                }
                idx++;
                continue;
            }

            if (current && isNewToken(line) && !/^Keywords\s+/.test(line) && !/^Distance\s+/.test(line) && !/^Target\s+/.test(line) && !/^[✦★✸]/.test(line) && !/^Effect\s+/.test(line) && !/^Trigger\s+/.test(line) && !/^\d+\+?\s+Malice/.test(line)) {
                pushCurrent();
                current = null;
                continue;
            }

            const kw = /^Keywords\s+(.+)$/.exec(line);
            if (kw && current) {
                current.keywords.push(...kw[1].split(/\s*,\s*/).map(s => s.trim()));
                idx++;
                continue;
            }

            const dt = /^Distance\s+(.+?)\s+Target\s+(.+)$/.exec(line);
            if (dt && current) {
                current.range = dt[1].trim();
                current.target = dt[2].trim();
                idx++;
                continue;
            }

            const distanceRe = /^Distance\s+(.+)/i;
            const distanceMatch = distanceRe.exec(line);
            if (distanceMatch && current && !current.parsing_outcomes) {
                current.range = distanceMatch[1].trim();
                idx++;
                continue;
            }

            const targetRe = /^Target\s+(.+)/i;
            const targetMatch = targetRe.exec(line);
            if (targetMatch && current && !current.parsing_outcomes) {
                current.target = targetMatch[1].trim();
                idx++;
                continue;
            }

            const outRe = /^([✦★✸])(.*)$/;
            const out = outRe.exec(line);
            if (out && current) {
                current.parsing_outcomes = true;
                let restOfLine = out[2].trim();
                let lookahead = idx + 1;

                if (!restOfLine) {
                    if (lookahead < lines.length) {
                        restOfLine = lines[lookahead].trim();
                        lookahead++;
                    }
                }

                const outcomePartsRe = /^(≤?\d+(?:–\d+)?|\d+\+?)\s+(.+)$/;
                const outcomeParts = outcomePartsRe.exec(restOfLine);

                if (outcomeParts) {
                    const threshold = outcomeParts[1];
                    let description = outcomeParts[2].trim();

                    while (lookahead < lines.length && lines[lookahead].trim() && !isNewToken(lines[lookahead])) {
                        description += ` ${lines[lookahead++].trim()}`;
                    }
                    current.outcomes.push({
                        symbol: out[1],
                        threshold,
                        description,
                    });
                    if (lookahead >= lines.length || !/^([✦★✸])\s*/.test(lines[lookahead])) {
                        if (!current.roll && current.effects.length > 0) {
                            const lastEffect = current.effects[current.effects.length - 1];
                            if (lastEffect instanceof MundaneEffect && lastEffect.effect.includes("test")) {
                                const rollEffect: any = { roll: lastEffect.effect };
                                if (current.outcomes && current.outcomes.length > 0) {
                                    current.outcomes.forEach((o: any) => {
                                        const tierKey = PrereleasePdfStatblockReader.mapOutcomeToTierKey(o.threshold);
                                        rollEffect[tierKey] = o.description;
                                    });
                                }
                                current.effects[current.effects.length - 1] = new PowerRollEffect(rollEffect);
                                current.outcomes = [];
                            }
                        } else if (current.roll) {
                            const rollEffect: any = { roll: `${current.roll.dice} + ${current.roll.bonus}` };
                            if (current.outcomes && current.outcomes.length > 0) {
                                current.outcomes.forEach((o: any) => {
                                    const tierKey = PrereleasePdfStatblockReader.mapOutcomeToTierKey(o.threshold);
                                    rollEffect[tierKey] = o.description;
                                });
                            }
                            current.effects.push(new PowerRollEffect(rollEffect));
                            current.outcomes = [];
                        }
                    }
                    idx = lookahead;
                    continue;
                }
                idx++;
                continue;
            }

            const malice = /^(\d+\+?\s+Malice)\s+(.+)$/.exec(line);
            if (malice && current) {
                let effectText = malice[2].trim();
                let lookahead = idx + 1;
                while (lookahead < lines.length && lines[lookahead].trim() && !isNewToken(lines[lookahead])) {
                    effectText += ` ${lines[lookahead++].trim()}`;
                }
                const effect: any = {
                    effect: effectText,
                };
                if (statblock.name === "WEREWOLF" || (current.cost && /malice/i.test(current.cost))) {
                    effect.name = malice[1];
                } else {
                    effect.cost = malice[1];
                }
                current.effects.push(new MundaneEffect(effect));
                idx = lookahead;
                continue;
            }

            const ef = /^Effect\s+(.+)$/.exec(line);
            if (ef && current) {
                let effectText = ef[1].trim();
                let lookahead = idx + 1;
                while (lookahead < lines.length && lines[lookahead].trim() && !isNewToken(lines[lookahead])) {
                    effectText += ` ${lines[lookahead++].trim()}`;
                }
                current.effects.push(new MundaneEffect({ effect: effectText }));

                if (lookahead < lines.length && isNewToken(lines[lookahead]) && !/^Keywords\s+/.test(lines[lookahead]) && !/^Distance\s+/.test(lines[lookahead]) && !/^[✦★✸]/.test(lines[lookahead]) && !/^Effect\s+/.test(lines[lookahead]) && !/^Trigger\s+/.test(lines[lookahead]) && !/^\d+\+?\s+Malice/.test(lines[lookahead])) {
                    pushCurrent();
                    current = null;
                    idx = lookahead;
                    continue;
                }
                idx = lookahead;
                continue;
            }

            const tr = /^Trigger\s+(.+)$/.exec(line);
            if (tr && current) {
                current.trigger = tr[1].trim();
                let lookahead = idx + 1;
                while (lookahead < lines.length && !isNewToken(lines[lookahead])) {
                    current.trigger += ` ${lines[lookahead++].trim()}`;
                }
                idx = lookahead;
                continue;
            }

            if (!current && isNewToken(line)) {
                const traitName = line.trim();
                const effects: Effect[] = [];
                let lookahead = idx + 1;
                let currentUnnamedEffectLines: string[] = [];

                const flushUnnamedEffect = () => {
                    if (currentUnnamedEffectLines.length > 0) {
                        effects.push(new MundaneEffect({ effect: currentUnnamedEffectLines.join(" ") }));
                        currentUnnamedEffectLines = [];
                    }
                };

                while (lookahead < lines.length && !isNewToken(lines[lookahead])) {
                    const effectLine = lines[lookahead].trim();
                    if (!effectLine) {
                        lookahead++;
                        continue;
                    }

                    const words = effectLine.split(" ");
                    const articles = ["the", "of", "and", "a", "an", "in", "on", "at", "to", "for", "by", "with", "as", "but", "or", "nor", "so", "yet", "if", "when"];
                    let titleCaseWords = 0;
                    for (const word of words) {
                        if (/^[A-Z]/.test(word) && !articles.includes(word.toLowerCase())) {
                            titleCaseWords++;
                        } else {
                            break;
                        }
                    }

                    if (titleCaseWords > 1 && titleCaseWords < words.length) {
                        flushUnnamedEffect();
                        const effectName = words.slice(0, titleCaseWords).join(" ");
                        const description = words.slice(titleCaseWords).join(" ").trim();
                        effects.push(new MundaneEffect({ effect: description, name: effectName }));
                    } else {
                        if (effects.length > 0 && typeof effects[effects.length - 1] === "object") {
                            (effects[effects.length - 1] as MundaneEffect).effect += ` ${effectLine}`;
                        } else {
                            currentUnnamedEffectLines.push(effectLine);
                        }
                    }
                    lookahead++;
                }
                flushUnnamedEffect();

                statblock.traits.push(new Trait({ name: traitName, effects: new Effects(effects) }));
                idx = lookahead;
                continue;
            }

            if (!line.trim()) {
                pushCurrent();
                current = null;
                idx++;
            }

            idx++;
        }
        pushCurrent();

        return new Statblock(statblock);
    }

    private static mapActionTypeToAbilityType(category: string): string {
        if (category === "Main Action") return "Action";
        if (category === "Action") return "Action";
        if (category === "Maneuver") return "Maneuver";
        if (category === "Triggered Action") return "Triggered Action";
        if (category === "Free Triggered Action") return "Free Triggered Action";
        if (category.startsWith("Villain Action")) return category;
        return "Action";
    }

    // TODO - this is a mess and needs standardization
    private static mapOutcomeToTierKey(threshold: string): string {
        if (threshold.includes("≤11") || threshold.includes("11 or lower")) {
            return "t1";
        } else if (threshold.includes("17+") || threshold.includes("17")) {
            return "t3";
        } else if (threshold.includes("–") || threshold.includes("-")) {
            return "t2";
        } else if (threshold.includes("crit") || threshold.includes("nat 19-20") || threshold.includes("critical")) {
            return "crit";
        }
        return threshold;
    }
}