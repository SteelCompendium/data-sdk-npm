"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAdapter_1 = __importDefault(require("./BaseAdapter"));
class MarkdownAdapter extends BaseAdapter_1.default {
    getName() {
        return "Markdown";
    }
    // eslint-disable-next-line no-unused-vars
    parse(text) {
        throw new Error("Markdown adapter is output-only.");
    }
    format(statblock) {
        var _a, _b, _c, _d;
        const lines = [];
        // Header
        const headerLines = [];
        const role = ((_a = statblock.roles) === null || _a === void 0 ? void 0 : _a.join(" ").toUpperCase()) || "";
        headerLines.push(`| ${statblock.name} | LEVEL ${statblock.level} ${role} |`);
        headerLines.push("|:---|---:|");
        headerLines.push(`| **${((_b = statblock.ancestry) === null || _b === void 0 ? void 0 : _b.join(", ")) || "Unknown"}** | **EV** ${statblock.ev} |`);
        // Stats
        const staminaLine = `**Stamina** ${statblock.stamina}`;
        let immunityLine = "";
        if (statblock.immunities && statblock.immunities.length > 0) {
            immunityLine = `**Immunity** ${statblock.immunities.join(", ")}`;
        }
        headerLines.push(`| ${staminaLine} | ${immunityLine} |`);
        const speedLine = `**Speed** ${statblock.speed}`;
        const rightColParts = [];
        if (statblock.size) {
            rightColParts.push(`**Size** ${statblock.size}`);
        }
        if (statblock.stability) {
            rightColParts.push(`**Stability** ${statblock.stability}`);
        }
        if (statblock.speed || rightColParts.length > 0) {
            headerLines.push(`| ${speedLine} | ${rightColParts.join(" ")} |`);
        }
        if (statblock.free_strike) {
            headerLines.push(`|   | **Free Strike** ${statblock.free_strike} |`);
        }
        lines.push(headerLines.join("\n"));
        // Attributes
        const attributes = [
            `**Might** ${statblock.might}`,
            `**Agility** ${statblock.agility}`,
            `**Reason** ${statblock.reason}`,
            `**Intuition** ${statblock.intuition}`,
            `**Presence** ${statblock.presence}`,
        ];
        const attrLines = [];
        attrLines.push("");
        attrLines.push("|             |               |              |                 |                |");
        attrLines.push("| ----------- | ------------- | ------------ | --------------- | -------------- |");
        attrLines.push(`| ${attributes.join(" | ")} |`);
        lines.push(attrLines.join("\n"));
        const formatEffects = (effects) => {
            if (!effects)
                return "";
            return effects.map(effect => {
                if (typeof effect === "string") {
                    return effect;
                }
                if ("roll" in effect) {
                    let effectText = `**${effect.roll}**`;
                    if (effect["11 or lower"]) {
                        effectText += `\n*   **◆ ≤11** ${effect["11 or lower"]}`;
                    }
                    if (effect["12-16"]) {
                        effectText += `\n*   **★ 12-16** ${effect["12-16"]}`;
                    }
                    if (effect["17+"]) {
                        effectText += `\n*   **✹ 17+** ${effect["17+"]}`;
                    }
                    return effectText;
                }
                if ("cost" in effect) {
                    return `**${effect.cost}** ${effect.effect}`;
                }
                return "";
            }).join("\n");
        };
        // Traits
        (_c = statblock.traits) === null || _c === void 0 ? void 0 : _c.forEach((trait) => {
            const traitLines = [];
            traitLines.push(`## ${trait.name}`);
            if (trait.effect) {
                traitLines.push(`**Effect** ${trait.effect}`);
            }
            if (trait.effects) {
                traitLines.push(`**Effect** ${formatEffects(trait.effects)}`);
            }
            lines.push(traitLines.join("\n"));
        });
        lines.push("---");
        // Abilities
        (_d = statblock.abilities) === null || _d === void 0 ? void 0 : _d.forEach((ability) => {
            const abilityLines = [];
            abilityLines.push(`## ${ability.name} (${ability.type})`);
            if (ability.cost) {
                abilityLines.push(`**Cost:** ${ability.cost}`);
            }
            if (ability.keywords && ability.keywords.length > 0) {
                abilityLines.push(`**Keywords** ${ability.keywords.join(", ")}`);
            }
            if (ability.distance) {
                abilityLines.push(`**Distance** ${ability.distance}`);
            }
            if (ability.target) {
                abilityLines.push(`**Target** ${ability.target}`);
            }
            if (ability.trigger) {
                abilityLines.push(`**Trigger** ${ability.trigger}`);
            }
            if (ability.effects) {
                abilityLines.push(`**Effect** ${formatEffects(ability.effects)}`);
            }
            lines.push(abilityLines.join("\n"));
        });
        return lines.join("\n\n");
    }
}
exports.default = MarkdownAdapter;
//# sourceMappingURL=MarkdownAdapter.js.map