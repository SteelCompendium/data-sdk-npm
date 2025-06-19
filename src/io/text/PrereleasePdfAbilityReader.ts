import { Ability } from "../../model/Ability";
import { IDataReader } from "../IDataReader";
import { Effects } from "../../model/Effects";
import { Effect, MundaneEffect, PowerRollEffect } from "../../model";

export class PrereleasePdfAbilityReader implements IDataReader<Ability> {
    read(text: string): Ability {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const effects: Effect[] = [];
        const abilityData: Partial<Ability> = {};

        if (!lines.length) return new Ability({ ...abilityData, effects: new Effects([]) });

        const firstLine = lines.shift() || '';
        const costMatch = firstLine.match(/\((.*)\)/);
        if (costMatch) {
            abilityData.cost = costMatch[1].trim();
            abilityData.name = firstLine.replace(costMatch[0], '').trim();
        } else {
            abilityData.name = firstLine.trim();
        }

        const propertyLines: string[] = [];
        const effectLines: string[] = [];

        const types = ['Main Action', 'Action', 'Maneuver', 'Triggered Action', 'Villain Action 1', ];

        let inEffectSection = false;
        for (const line of lines) {
            if (line.toLowerCase().startsWith('effect:')) {
                inEffectSection = true;
                const effectText = line.substring('effect:'.length).trim();
                if (effectText) effectLines.push(effectText);
                continue;
            }
            if (line.toLowerCase().startsWith('power roll')) {
                inEffectSection = true;
            }
            if (line.startsWith('•')) {
                inEffectSection = true;
            } else {
                const namedEffectMatch = line.match(/^([a-zA-Z0-9\s]+):\s(.+)/);
                if (namedEffectMatch) {
                    const isProperty = /distance|target/i.test(namedEffectMatch[1]);
                    if (!isProperty) {
                        inEffectSection = true;
                    }
                }
            }

            if (inEffectSection) {
                effectLines.push(line);
            } else {
                propertyLines.push(line);
            }
        }

        const flavor: string[] = [];
        for (const line of propertyLines) {
            let isProperty = false;

            const distanceMatch = line.match(/Distance:\s*(.*?)(?:\s*Target:|$)/i);
            if (distanceMatch && distanceMatch[1]) {
                abilityData.distance = distanceMatch[1].trim();
                isProperty = true;
            }

            const targetMatch = line.match(/Target:\s*(.*)/i);
            if (targetMatch && targetMatch[1]) {
                abilityData.target = targetMatch[1].trim();
                isProperty = true;
            }

            const keywords: string[] = [];
            const foundTypes: string[] = [];
            const parts = line.split(',').map(p => p.trim());
            const likelyKeywordLine = parts.length > 1 && parts.every(p => p.split(' ').length < 5);

            if (likelyKeywordLine) {
                parts.forEach(part => {
                    let typeFound = false;
                    for (const type of types) {
                        if (part.toLowerCase().endsWith(type.toLowerCase())) {
                            const typeName = type;
                            if (!foundTypes.includes(typeName)) {
                                foundTypes.push(typeName);
                            }
                            const remaining = part.replace(new RegExp(type, 'i'), '').trim();
                            if (remaining) keywords.push(remaining);
                            typeFound = true;
                            isProperty = true;
                            break;
                        }
                    }
                    if (!typeFound) keywords.push(part);
                });
            }

            if (foundTypes.length > 0) {
                abilityData.type = foundTypes.join(', ');
                abilityData.keywords = (abilityData.keywords || []).concat(keywords.filter(k => k));
            } else if (likelyKeywordLine) {
                abilityData.keywords = (abilityData.keywords || []).concat(keywords.filter(k => k));
                isProperty = true;
            }

            if (!isProperty) {
                flavor.push(line);
            }
        }

        if (flavor.length > 0) abilityData.flavor = flavor.join(' ');

        if (effectLines.length > 0) {
            const effectGroups = this.groupEffectLines(effectLines);
            for (const group of effectGroups) {
                const firstLine = group[0];
                const powerRollMatch = firstLine.match(/Power Roll\s*\+\s*([a-zA-Z]+)/i);
                if (powerRollMatch) {
                    const effect = new PowerRollEffect({ roll: `Power Roll + ${powerRollMatch[1]}` });
                    let tierCounter = 1;
                    for (let i = 0; i < group.length; i++) {
                        const line = group[i];
                        const tierMatch = line.match(/^(?:•\s*)?((?:\d+-\d+)|(?:\d+ or lower)|(?:\d+ or higher)|(?:\d+\+)|crit(?:ical)?):\s*(.*)/i);
                        if (tierMatch) {
                            (effect as any)[`t${tierCounter++}`] = tierMatch[2].trim();
                        }
                    }
                    effects.push(effect);
                } else {
                    const fullText = group.map(l => l.startsWith('•') ? l.substring(1).trim() : l).join(' ');
                    const namedMatch = fullText.match(/^([a-zA-Z0-9\s]+):\s*(.*)/);
                    if (namedMatch && !/distance|target/i.test(namedMatch[1])) {
                        effects.push(new MundaneEffect({ name: namedMatch[1].trim(), effect: namedMatch[2].trim() }));
                    } else {
                        effects.push(new MundaneEffect({ effect: fullText }));
                    }
                }
            }
        } else if (propertyLines.length > 0 && effects.length === 0) {
            effects.push(new MundaneEffect({ effect: flavor.join(' ') }));
            delete abilityData.flavor;
        }

        if (!abilityData.type) {
            abilityData.type = 'Unknown';
        }

        const finalAbility = new Ability(abilityData);
        finalAbility.effects = new Effects(effects);
        return finalAbility;
    }

    private groupEffectLines(lines: string[]): string[][] {
        const groups: string[][] = [];
        let currentGroup: string[] = [];

        for (const line of lines) {
            const isNewGroup = this.isNewEffectGroup(line);

            if (isNewGroup && currentGroup.length > 0) {
                groups.push(currentGroup);
                currentGroup = [];
            }
            currentGroup.push(line);
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    }

    private isNewEffectGroup(line: string): boolean {
        if (/power roll/i.test(line)) return true;

        const isTier = /^(?:•\s*)?(?:(?:\d+-\d+)|(?:\d+ or lower)|(?:\d+ or higher)|(?:\d+\+)|crit(?:ical)?):/i.test(line);
        if (isTier) return false;

        if (line.startsWith('•')) return true;

        const namedMatch = line.match(/^([a-zA-Z0-9\s]+):\s*(.*)/);
        if (namedMatch && !/distance|target/i.test(namedMatch[1])) {
            return true;
        }
        return false;
    }
}
