"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrereleasePdfAbilityReader = void 0;
const Ability_1 = require("../../model/Ability");
const Effects_1 = require("../../model/Effects");
const model_1 = require("../../model");
const stringUtils_1 = require("./stringUtils");
class PrereleasePdfAbilityReader {
    read(text) {
        const lines = text.split('\n').map(l => l).filter(l => l);
        const effects = [];
        const abilityData = {};
        if (!lines.length)
            return new Ability_1.Ability(Object.assign(Object.assign({}, abilityData), { effects: new Effects_1.Effects([]) }));
        const firstLine = lines.shift() || '';
        const costMatch = firstLine.match(/\((.*)\)/);
        if (costMatch) {
            let cost = costMatch[1].trim();
            cost = (0, stringUtils_1.cleanOcrText)(cost);
            abilityData.cost = cost;
            let name = firstLine.replace(costMatch[0], '').trim();
            name = (0, stringUtils_1.cleanOcrText)(name);
            abilityData.name = name;
        }
        else {
            let name = firstLine.trim();
            name = (0, stringUtils_1.cleanOcrText)(name);
            abilityData.name = name;
        }
        let inEffectSection = false;
        const propertyLines = [];
        const effectLines = [];
        for (const line of lines) {
            if (line.toLowerCase().startsWith('effect:')) {
                inEffectSection = true;
                const effectText = line.substring('effect:'.length).trim();
                if (effectText)
                    effectLines.push(line);
                continue;
            }
            if (line.startsWith('•')) {
                inEffectSection = true;
            }
            else {
                const namedEffectMatch = line.match(/^([a-zA-Z0-9\s]+):\s(.+)/);
                const powerRollTierMatch = line.match(/^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i);
                if (powerRollTierMatch) {
                    inEffectSection = true;
                }
                else if (line.toLowerCase().startsWith('power roll')) {
                    inEffectSection = true;
                }
                else if (namedEffectMatch) {
                    const propertyKeywords = ['Distance', 'Target', 'Keywords', 'Trigger'];
                    if (!propertyKeywords.some(keyword => new RegExp(`^${keyword}`, 'i').test(namedEffectMatch[1]))) {
                        inEffectSection = true;
                    }
                }
            }
            if (inEffectSection) {
                effectLines.push(line);
            }
            else {
                propertyLines.push(line);
            }
        }
        const types = ['Main Action', 'Action', 'Maneuver', 'Triggered Action', 'Free Triggered Action', 'Villain Action 1', 'Free Triggered', 'Triggered'];
        const flavorLines = [];
        const actualPropertyLines = [];
        let flavorDone = false;
        for (const line of propertyLines) {
            const parts = line.split(/,/).map(p => p.trim()).filter(p => p);
            const likelyKeywordLine = parts.length > 1 && !line.includes(':') && line.length < 80 && parts.every(p => p.split(' ').length < 4);
            const isPropertyMarker = /^(Distance:|Target:|Trigger:|Keywords:)/i.test(line);
            if (!flavorDone && !isPropertyMarker && !likelyKeywordLine) {
                flavorLines.push(line);
            }
            else {
                flavorDone = true;
                actualPropertyLines.push(line);
            }
        }
        if (flavorLines.length > 0)
            abilityData.flavor = this.joinAndFormatEffectLines(flavorLines);
        let capturingTrigger = false;
        for (const line of actualPropertyLines) {
            const triggerMatch = line.match(/Trigger:\s*(.*)/i);
            const distanceMatch = line.match(/Distance:\s*(.*?)(?:\s*Target:|$)/i);
            const targetMatch = line.match(/Target:\s*(.*)/i);
            if (capturingTrigger) {
                if (distanceMatch || targetMatch || /Keywords:/i.test(line) || triggerMatch) {
                    capturingTrigger = false;
                }
                else {
                    abilityData.trigger = ((abilityData.trigger || '') + ' ' + line.trim()).trim();
                    continue;
                }
            }
            if (triggerMatch) {
                abilityData.trigger = triggerMatch[1].trim();
                capturingTrigger = true;
            }
            if (distanceMatch && distanceMatch[1]) {
                abilityData.distance = distanceMatch[1].trim();
            }
            if (targetMatch && targetMatch[1]) {
                abilityData.target = targetMatch[1].trim();
            }
            const keywords = [];
            const foundTypes = [];
            const parts = line.split(/,/).map(p => p.trim()).filter(p => p);
            const likelyKeywordLine = parts.length > 1 && !line.includes(':') && line.length < 80 && parts.every(p => p.split(' ').length < 4);
            if (likelyKeywordLine) {
                parts.forEach(part => {
                    let typeFound = false;
                    for (const type of types) {
                        if (part.toLowerCase().includes(type.toLowerCase())) {
                            foundTypes.push(type);
                            const remaining = part.replace(new RegExp(type, 'i'), '').trim();
                            if (remaining)
                                keywords.push(remaining);
                            typeFound = true;
                            break;
                        }
                    }
                    if (!typeFound)
                        keywords.push(part);
                });
            }
            if (foundTypes.length > 0) {
                abilityData.type = foundTypes.join(', ');
                abilityData.keywords = (abilityData.keywords || []).concat(keywords.filter(k => k));
            }
            else if (likelyKeywordLine && keywords.length > 0) {
                abilityData.keywords = (abilityData.keywords || []).concat(keywords.filter(k => k));
            }
        }
        if (effectLines.length > 0) {
            const effectGroups = this.groupEffectLines(effectLines);
            for (const group of effectGroups) {
                const firstLine = group[0];
                if (firstLine.toLowerCase().startsWith('power roll') || group.some(l => /^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i.test(l))) {
                    const rollMatch = group.find(l => /power roll/i.test(l));
                    const roll = rollMatch ? rollMatch.trim().replace(/:$/, '') : '';
                    const tiers = {};
                    const tierIdentifier = /^((\d+-\d+)|(\d+–\d+)|(\d+\s+or\s+lower)|(\d+\s+or\s+higher)|(\d+\+)|crit(?:ical)?)/i;
                    let currentTierKey = null;
                    let currentTierLines = [];
                    const flushTier = () => {
                        if (currentTierKey) {
                            tiers[currentTierKey] = this.joinAndFormatEffectLines(currentTierLines);
                        }
                        currentTierLines = [];
                        currentTierKey = null;
                    };
                    for (const line of group) {
                        if (/power roll/i.test(line))
                            continue;
                        const parts = line.split('•').map(p => p.trim()).filter(Boolean);
                        for (const part of parts) {
                            const tierMatch = part.match(tierIdentifier);
                            if (tierMatch) {
                                flushTier();
                                currentTierKey = this.mapOutcomeToTierKey(tierMatch[1].trim());
                                const restOfPart = part.substring(tierMatch[0].length).replace(/^:/, '').trim();
                                if (restOfPart) {
                                    currentTierLines.push(restOfPart);
                                }
                            }
                            else if (currentTierKey) {
                                currentTierLines.push(part);
                            }
                        }
                    }
                    flushTier();
                    if (Object.keys(tiers).length > 0) {
                        effects.push(new model_1.PowerRollEffect(Object.assign({ roll }, tiers)));
                    }
                    else {
                        const blockText = this.joinAndFormatEffectLines(group).replace(/^(Effect|Trigger):/i, '').trim();
                        effects.push(new model_1.MundaneEffect({ effect: blockText }));
                    }
                }
                else {
                    const blockTextWithHeader = this.joinAndFormatEffectLines(group);
                    const blockText = blockTextWithHeader.replace(/^(Effect|Trigger):/i, '').trim();
                    const effectParts = blockText.split(/(?=\b[A-Z][a-zA-Z0-9\s'-+]*:\s)/);
                    const parsedEffects = [];
                    for (const part of effectParts) {
                        if (!part.trim())
                            continue;
                        const namedMatch = part.match(/^([A-Z][a-zA-Z0-9\s'-+]*):\s*([\s\S]*)/);
                        if (namedMatch) {
                            parsedEffects.push({ name: namedMatch[1].trim(), effect: namedMatch[2].trim() });
                        }
                        else {
                            parsedEffects.push({ effect: part.trim() });
                        }
                    }
                    // Merge logic for incorrectly split "Spend" effects
                    if (parsedEffects.length > 0) {
                        const finalEffects = [];
                        for (let i = 0; i < parsedEffects.length; i++) {
                            const current = parsedEffects[i];
                            if (!current.name && current.effect.startsWith('Spend ') && i + 1 < parsedEffects.length) {
                                const next = parsedEffects[i + 1];
                                if (next.name) {
                                    finalEffects.push(new model_1.MundaneEffect({
                                        name: `${current.effect} ${next.name}`,
                                        effect: next.effect
                                    }));
                                    i++; // consumed next element
                                }
                                else {
                                    finalEffects.push(new model_1.MundaneEffect(current));
                                }
                            }
                            else {
                                finalEffects.push(new model_1.MundaneEffect(current));
                            }
                        }
                        effects.push(...finalEffects);
                    }
                }
            }
        }
        if (effects.length === 0 && abilityData.flavor) {
            effects.push(new model_1.MundaneEffect({ effect: abilityData.flavor }));
            delete abilityData.flavor;
        }
        const finalAbility = new Ability_1.Ability(abilityData);
        finalAbility.effects = new Effects_1.Effects(effects);
        return finalAbility;
    }
    isNewEffect(line, previousLine) {
        if (line.toLowerCase().startsWith('power roll'))
            return true;
        if (line.toLowerCase().startsWith('effect:'))
            return true;
        if (line.toLowerCase().startsWith('trigger:'))
            return true;
        const powerRollTierRegex = /^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i;
        if (powerRollTierRegex.test(line)) {
            return false; // Tiers are never a new effect, they are part of a power roll
        }
        const previousLineIsTier = previousLine.trim().startsWith('•');
        const isCapitalized = /^[A-Z]/.test(line);
        const previousLineIsShort = previousLine.length < 80;
        if (previousLineIsTier && isCapitalized && previousLineIsShort) {
            return true;
        }
        if (line.startsWith('•'))
            return false;
        const namedEffectRegex = /^([A-Z][a-zA-Z0-9\s'-+]+):\s*(.*)/;
        if (namedEffectRegex.test(line)) {
            const match = line.match(namedEffectRegex);
            if (match) {
                const name = match[1].trim();
                if (/distance|target|keywords|trigger/i.test(name)) {
                    return false;
                }
                if (/Persistent \d+/.test(name))
                    return true;
                if (/Spend \d+\+? \w+/.test(name))
                    return true;
                return true;
            }
        }
        return false;
    }
    groupEffectLines(lines) {
        if (!lines.length)
            return [];
        const groups = [];
        let currentGroup = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isTier = /^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i.test(line);
            if (i > 0 && this.isNewEffect(line, lines[i - 1])) {
                if (currentGroup.length > 0)
                    groups.push(currentGroup);
                currentGroup = [line];
            }
            else {
                // Special handling for tiers to ensure they group with a preceding Power Roll line
                if (isTier && currentGroup.length > 0 && !currentGroup.some(l => l.toLowerCase().startsWith('power roll') || /^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i.test(l))) {
                    if (currentGroup.length > 0)
                        groups.push(currentGroup);
                    currentGroup = [line];
                }
                else {
                    currentGroup.push(line);
                }
            }
        }
        if (currentGroup.length > 0)
            groups.push(currentGroup);
        return groups;
    }
    joinAndFormatEffectLines(lines) {
        if (!lines || lines.length === 0)
            return '';
        let result = lines[0];
        for (let i = 1; i < lines.length; i++) {
            const prevLine = lines[i - 1];
            const currentLine = lines[i];
            if (currentLine.startsWith('•')) {
                result += `\n${currentLine}`;
                continue;
            }
            const prevPunctuationWhitespace = /[.!?]\s+$/.test(prevLine);
            const prevPunctuationNoWhitespace = /[.!?]$/.test(prevLine);
            const prevWhitespace = /\s+$/.test(prevLine);
            if (prevPunctuationWhitespace) {
                result += `${currentLine}`;
            }
            else if (prevPunctuationNoWhitespace) {
                result += `\n${currentLine}`;
            }
            else if (prevWhitespace) {
                result += `${currentLine}`;
            }
            else {
                result += ` ${currentLine}`;
            }
        }
        // Final cleanup for bullet points that might not have been handled by the loop logic (e.g., first line is a bullet)
        return result.replace(/\s*•/g, '\n•').trim();
    }
    mapOutcomeToTierKey(threshold) {
        const s = threshold.toLowerCase().replace(':', '');
        if (s.includes('or lower') || s.includes('<') || (s.includes('–') && parseInt(s.split(/[-–]/)[0], 10) < 12)) {
            return 't1';
        }
        else if (s.includes('+') || s.includes('or higher') || (s.includes('–') && parseInt(s.split(/[-–]/)[1], 10) > 16) || s.startsWith('17')) {
            return 't3';
        }
        else if (s.includes('–') || s.includes('-')) {
            return 't2';
        }
        else if (s.includes('crit')) {
            return 'crit';
        }
        // basic fallback for single numbers
        const num = parseInt(s, 10);
        if (num <= 11)
            return 't1';
        if (num >= 17)
            return 't3';
        if (num >= 12 && num <= 16)
            return 't2';
        return `t${s}`;
    }
}
exports.PrereleasePdfAbilityReader = PrereleasePdfAbilityReader;
//# sourceMappingURL=PrereleasePdfAbilityReader.js.map