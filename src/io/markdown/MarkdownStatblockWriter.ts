import { Statblock } from "../../model/Statblock";
import { IDataWriter } from "../IDataWriter";
import { MarkdownAbilityWriter } from "./MarkdownAbilityWriter";

export class MarkdownStatblockWriter implements IDataWriter<Statblock> {
    private abilityWriter = new MarkdownAbilityWriter();

    write(data: Statblock): string {
        const parts: string[] = [];

        // Create the main statblock table
        parts.push(this.createStatblockTable(data));

        // Add traits
        if (data.traits && data.traits.length > 0) {
            for (const trait of data.traits) {
                if (!trait.name) continue;

                // Build the trait block, then prefix each line with "> "
                const tLines: string[] = [];

                tLines.push(`> **${trait.name}**`);

                if (trait.effects && trait.effects.effects.length > 0) {
                    const effectLines = trait.effects.effects
                        .filter(e => e.effectType() === 'MundaneEffect')
                        .map((e: any) => {
                            const label = e.name ? `**${e.name.trim()}:** ` : '';
                            return `${label}${e.effect.trim()}`;      // no leading \n
                        });
                    tLines.push(...effectLines);
                }

                // Insert a blank line before each trait block (outside the quote)
                parts.push('');
                // Quote-prefix every line of this trait
                parts.push(tLines.join('\n> \n> '));
            }
        }

        // Add abilities
        if (data.abilities && data.abilities.length > 0) {
            parts.push(""); // Empty line for spacing
            parts.push("---"); // Separator
            parts.push(""); // Empty line for spacing

            for (const ability of data.abilities) {
                parts.push(this.abilityWriter.write(ability, true));
                parts.push(""); // Empty line between abilities
            }
        }

        return parts.join('\n');
    }

    private createStatblockTable(data: Statblock): string {
        const table: string[] = [];
        const colWidth = 40;

        // Row 1: Name and Level
        const nameCol = `**${data.name || 'Unnamed'}**`;
        const rolesText = data.roles && data.roles.length > 0 ? data.roles.join(', ') : '-';
        const levelCol = `Level ${data.level || 0} ${rolesText}`;
        table.push(`| ${nameCol.padEnd(colWidth)} | ${levelCol.padEnd(colWidth)} |`);

        // Table alignment
        table.push(`|:${'-'.repeat(colWidth + 1)}|:${'-'.repeat(colWidth + 1)}|`);

        // Row 2: Ancestry and Roles
        const ancestryText = data.ancestry && data.ancestry.length > 0 ? data.ancestry.join(', ') : '-';
        const ancestryCol = `**Ancestry:** ${ancestryText}`;
        const evCol = `**EV:** ${data.ev || 0}`;
        table.push(`| ${ancestryCol.padEnd(colWidth)} | ${evCol.padEnd(colWidth)} |`);

        // Row 3: Stamina and EV
        const staminaCol = `**Stamina:** ${data.stamina || 0}`;
        const immunityText = data.immunities && data.immunities.length > 0 ? data.immunities.join(', ') : '-';
        const immunityCol = `**Immunity:** ${immunityText}`;
        table.push(`| ${staminaCol.padEnd(colWidth)} | ${immunityCol.padEnd(colWidth)} |`);

        // Row 4: Speed and Immunity
        const speedCol = `**Speed:** ${data.speed || 0 }`;
        const weaknessText = data.weaknesses && data.weaknesses.length > 0 ? data.weaknesses.join(', ') : '-';
        const weaknessCol = `**Weakness:** ${weaknessText}`;
        table.push(`| ${speedCol.padEnd(colWidth)} | ${weaknessCol.padEnd(colWidth)} |`);

        // Row 5: Movement and Weakness
        const movementCol = `**Movement:** ${data.movement || '-'}`;
        const withCaptainCol = `**With Captain:** ${data.withCaptain || '-'}`;
        table.push(`| ${movementCol.padEnd(colWidth)} | ${withCaptainCol.padEnd(colWidth)} |`);

        // Row 6: Might and Free Strike
        const mightCol = `**Might:** ${this.formatCharacteristic(data.characteristics.might)}`;
        const freeStrikeCol = `**Free Strike:** ${data.freeStrike || 0}`;
        table.push(`| ${mightCol.padEnd(colWidth)} | ${freeStrikeCol.padEnd(colWidth)} |`);

        // Row 7: Agility and Melee
        const agilityCol = `**Agility:** ${this.formatCharacteristic(data.characteristics.agility)}`;
        const meleeCol = `**Melee:** ${data.meleeDistance || '-'}`;
        table.push(`| ${agilityCol.padEnd(colWidth)} | ${meleeCol.padEnd(colWidth)} |`);

        // Row 8: Reason and Ranged
        const reasonCol = `**Reason:** ${this.formatCharacteristic(data.characteristics.reason)}`;
        const rangedCol = `**Ranged:** ${data.rangedDistance || '-'}`;
        table.push(`| ${reasonCol.padEnd(colWidth)} | ${rangedCol.padEnd(colWidth)} |`);

        // Row 9: Intuition and Size
        const intuitionCol = `**Intuition:** ${this.formatCharacteristic(data.characteristics.intuition)}`;
        const sizeCol = `**Size:** ${data.size || '1'}`;
        table.push(`| ${intuitionCol.padEnd(colWidth)} | ${sizeCol.padEnd(colWidth)} |`);

        // Row 10: Presence and Stability
        const presenceCol = `**Presence:** ${this.formatCharacteristic(data.characteristics.presence)}`;
        const stabilityCol = `**Stability:** ${data.stability || 0}`;
        table.push(`| ${presenceCol.padEnd(colWidth)} | ${stabilityCol.padEnd(colWidth)} |`);

        return table.join('\n');
    }

    private formatCharacteristic(value: number): string {
        if (value > 0) {
            return `+${value}`;
        } else if (value < 0) {
            return `${value}`;
        } else {
            return `+0`;
        }
    }
} 