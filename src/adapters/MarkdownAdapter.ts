import BaseAdapter, { IStatblock } from "./BaseAdapter";

interface Trait {
    name: string;
    effect?: string;
    effects?: (string | EffectRoll | EffectCost)[];
}

interface Ability {
    name: string;
    type: string;
    cost?: string;
    keywords?: string[];
    distance?: string;
    target?: string;
    trigger?: string;
    effects?: (string | EffectRoll | EffectCost)[];
}

interface EffectRoll {
    roll: string;
    "11 or lower"?: string;
    "12-16"?: string;
    "17+"?: string;
}

interface EffectCost {
    cost: string;
    effect: string;
}


class MarkdownAdapter extends BaseAdapter {
    getName(): string {
        return "Markdown";
    }

    // eslint-disable-next-line no-unused-vars
    parse(text: string): IStatblock {
        throw new Error("Markdown adapter is output-only.");
    }

    format(statblock: IStatblock): string {
        const lines: string[] = [];

        // Header
        const headerLines: string[] = [];
        const role = statblock.roles?.join(" ").toUpperCase() || "";
        headerLines.push(
            `| ${statblock.name} | LEVEL ${statblock.level} ${role} |`,
        );
        headerLines.push("|:---|---:|");
        headerLines.push(`| **${statblock.ancestry?.join(", ") || "Unknown"}** | **EV** ${statblock.ev} |`);

        // Stats
        const staminaLine = `**Stamina** ${statblock.stamina}`;
        let immunityLine = "";
        if (statblock.immunities && statblock.immunities.length > 0) {
            immunityLine = `**Immunity** ${statblock.immunities.join(", ")}`;
        }
        headerLines.push(`| ${staminaLine} | ${immunityLine} |`);

        const speedLine = `**Speed** ${statblock.speed}`;
        const rightColParts: string[] = [];
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
        const attrLines: string[] = [];
        attrLines.push("");
        attrLines.push("|             |               |              |                 |                |");
        attrLines.push("| ----------- | ------------- | ------------ | --------------- | -------------- |");
        attrLines.push(`| ${attributes.join(" | ")} |`);
        lines.push(attrLines.join("\n"));

        const formatEffects = (effects: (string | EffectRoll | EffectCost)[] | undefined): string => {
            if (!effects) return "";
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
        (statblock.traits as Trait[])?.forEach((trait) => {
            const traitLines: string[] = [];
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
        (statblock.abilities as Ability[])?.forEach((ability) => {
            const abilityLines: string[] = [];
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

export default MarkdownAdapter; 