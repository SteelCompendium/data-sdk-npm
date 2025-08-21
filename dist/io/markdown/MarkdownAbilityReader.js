"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownAbilityReader = void 0;
const model_1 = require("../../model");
const Effects_1 = require("../../model/Effects");
const yaml = __importStar(require("js-yaml"));
const TestEffect_1 = require("../../model/TestEffect");
class MarkdownAbilityReader {
    constructor() { }
    read(content) {
        let lines = content.split('\n');
        lines = lines.map(l => l.replace(/^\s*>\s?/, ''));
        const partial = {};
        // Find the end of the frontmatter
        let frontmatterEndIndex = -1;
        if (lines[0].trim() === '---') {
            frontmatterEndIndex = lines.slice(1).findIndex(line => line.trim() === '---');
            if (frontmatterEndIndex !== -1) {
                const frontmatterLines = lines.slice(1, frontmatterEndIndex + 1).join('\n');
                try {
                    partial.metadata = yaml.load(frontmatterLines);
                }
                catch (e) {
                    console.error("Error parsing frontmatter:", e);
                }
                // The index is in the sliced array, so we add 1 to get the index in the original array
                // and another 1 to get the line after the '---'
                lines = lines.slice(frontmatterEndIndex + 2);
            }
        }
        lines = lines.filter(line => line.trim() !== '');
        let i = 0;
        // Title and Cost
        const titleLine = lines[i++].trim();
        let titleMatch;
        if (titleLine.startsWith('###')) {
            titleMatch = titleLine.match(/#+\s*(.*?)(?: \((.*?)\))?$/);
        }
        else {
            titleMatch = titleLine.match(/\*\*(.*?)(?: \((.*?)\))?\*\*/);
        }
        if (titleMatch) {
            partial.name = titleMatch[1].trim();
            if (titleMatch[2]) {
                partial.cost = titleMatch[2].trim();
            }
        }
        // Flavor Text
        if (i < lines.length && lines[i].startsWith('*') && !lines[i].startsWith('**')) {
            partial.flavor = lines[i++].replace(/\*/g, '');
        }
        // Table
        if (i < lines.length && lines[i].includes('|')) {
            const headerCells = lines[i++].split('|').map(c => c.replace(/\*/g, '').trim()).filter(Boolean);
            partial.keywords = headerCells[0].split(', ').map(k => k.trim());
            partial.type = headerCells[1];
            i++; // Skip separator
            const dataCells = lines[i++].split('|').map(c => c.replace(/\*/g, '').trim()).filter(Boolean);
            partial.distance = dataCells[0].replace('📏', '').trim();
            partial.target = dataCells[1].replace('🎯', '').trim();
        }
        const effects = [];
        // Effects
        while (i < lines.length) {
            const line = lines[i];
            if (line.startsWith('**')) {
                let hasTiers = false;
                // Peek ahead to see if there are roll tiers
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine.startsWith('- **') && nextLine.includes(':')) {
                        hasTiers = true;
                    }
                }
                if (!hasTiers && i + 2 < lines.length) {
                    const nextLine = lines[i + 2].trim();
                    if (nextLine.startsWith('- **') && nextLine.includes(':')) {
                        hasTiers = true;
                    }
                }
                if (hasTiers) {
                    let tierEffect;
                    if (line.includes("Power Roll") || line.includes("2d10")) {
                        tierEffect = new model_1.PowerRollEffect({});
                        tierEffect.roll = line.replace(/\*\*|:/g, '').trim();
                    }
                    else {
                        tierEffect = new TestEffect_1.TestEffect({});
                        tierEffect.effect = line.replace(/\*\*|:/g, '').trim();
                    }
                    i++;
                    while (i < lines.length && (lines[i].trim().startsWith('-') || lines[i].trim() === '')) {
                        const rollLine = lines[i].trim();
                        if (rollLine === '') {
                            i++;
                            continue;
                        }
                        const separatorIndex = rollLine.indexOf(':');
                        const tier = rollLine.substring(0, separatorIndex);
                        const description = rollLine.substring(separatorIndex + 1).replace(/\*/g, '').trim();
                        if (tier.includes('≤11'))
                            tierEffect.t1 = description.trim();
                        else if (tier.includes('12-16'))
                            tierEffect.t2 = description.trim();
                        else if (tier.includes('17+'))
                            tierEffect.t3 = description.trim();
                        else if (tier.includes('19-20'))
                            tierEffect.crit = description.trim();
                        i++;
                    }
                    effects.push(tierEffect);
                    continue;
                }
            }
            if (line.startsWith('**Trigger:**')) {
                let triggerText = line.substring('**Trigger:**'.length).trim();
                i++;
                while (i < lines.length && !lines[i].startsWith('**')) {
                    triggerText += '\n' + lines[i];
                    i++;
                }
                partial.trigger = triggerText.trim();
                continue;
            }
            // Effects (e.g., **Effect:**, **Persistent:**, **Effect (1 Malice):**)
            const effectMatch = line.match(/\*\*(.+?):\*\* (.*)/);
            if (effectMatch) {
                const nameAndCost = effectMatch[1];
                let effect = effectMatch[2];
                i++;
                while (i < lines.length && !lines[i].startsWith('**')) {
                    effect += '\n' + lines[i];
                    i++;
                }
                const effectProps = { effect: effect.trim() };
                if (nameAndCost.trim().match(/\d+\+*\s*\w+/)) {
                    effectProps.cost = nameAndCost.trim();
                }
                else if (nameAndCost.trim().toLowerCase() !== 'effect') {
                    effectProps.name = nameAndCost.trim();
                }
                // const nameCostMatch = nameAndCost.match(/(.*?) \((.*)\)/);
                // let name: string | undefined;
                // if (nameCostMatch) {
                //     name = nameCostMatch[1].trim();
                //     effectProps.cost = nameCostMatch[2].trim();
                // } else {
                //     name = nameAndCost.trim();
                // }
                // if (name.toLowerCase() !== 'effect') {
                //     effectProps.name = name;
                // }
                effects.push(new model_1.MundaneEffect(effectProps));
                continue;
            }
            // If we've reached here and the line is not empty, it must be a simple effect
            if (line.trim()) {
                let effect = line;
                i++;
                while (i < lines.length && !lines[i].startsWith('**')) {
                    effect += '\n' + lines[i];
                    i++;
                }
                const effectProps = { effect: effect.trim() };
                effects.push(new model_1.MundaneEffect(effectProps));
                continue;
            }
            i++;
        }
        const ability = new model_1.Ability(partial);
        ability.effects = new Effects_1.Effects(effects);
        return ability;
    }
}
exports.MarkdownAbilityReader = MarkdownAbilityReader;
//# sourceMappingURL=MarkdownAbilityReader.js.map