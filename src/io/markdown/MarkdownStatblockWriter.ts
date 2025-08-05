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

    /**
     *  New stat-block layout
     *
     * **NAME**
     *
     * |  Ancestry  | Movement |    Level    | With Captain |     EV     |
     * |:----------:|:--------:|:-----------:|:------------:|:----------:|
     * | **Size**<br>Size      | **Speed**<br>Speed | **Stamina**<br>Stamina | **Stability**<br>Stability | **Free Strike**<br>Free Strike |
     * | **Immunities**<br>Immunities | **Movement**<br>Movement |           | **With Captain**<br>WithCaptain | **Weaknesses**<br>Weaknesses |
     * | **Might**<br>Might | **Agility**<br>Agility | **Reason**<br>Reason | **Intuition**<br>Intuition | **Presence**<br>Presence |
     */
    private createStatblockTable(data: Statblock): string {
        //-------------------------------------------------------------
        // Helper that returns "**val**<br>label" or "**-**<br>label"
        //-------------------------------------------------------------
        const cell = (val: string | number | undefined, label: string) =>
            `**${val ?? '-'}**<br>${label}`;

        //-------------------------------------------------------------
        // Row 0 (header row)
        //-------------------------------------------------------------
        const ancestry = data.ancestry?.length ? data.ancestry.join(', ') : '-';
        const movementDash = data.movement ?? '-';
        const levelCell   = `Level ${data.level ?? 0}`;
        const roles       = data.roles?.length ? data.roles.join(', ') : '-'; // placeholder for col-4
        const evCell      = `EV ${data.ev ?? 0}`;

        const headerRow = [
            ancestry,
            movementDash,
            levelCell,
            roles,
            evCell,
        ];

        //-------------------------------------------------------------
        // Row 1: Size | Speed | Stamina | Stability | Free Strike
        //-------------------------------------------------------------
        const row1 = [
            cell(data.size ?? '-', 'Size'),
            cell(data.speed ?? '-', 'Speed'),
            cell(data.stamina ?? 0, 'Stamina'),
            cell(data.stability ?? 0, 'Stability'),
            cell(data.freeStrike ?? 0, 'Free Strike'),
        ];

        //-------------------------------------------------------------
        // Row 2: Immunities | Movement | (blank) | With Captain | Weaknesses
        //-------------------------------------------------------------
        const immunities = data.immunities?.length ? data.immunities.join(', ') : '-';
        const weaknesses = data.weaknesses?.length ? data.weaknesses.join(', ') : '-';
        const withCaptain = data.withCaptain ?? '-';

        const row2 = [
            cell(immunities, 'Immunities'),
            cell(data.movement ?? '-', 'Movement'),
            '', // centre cell empty
            cell(withCaptain, 'With Captain'),
            cell(weaknesses, 'Weaknesses'),
        ];

        //-------------------------------------------------------------
        // Row 3: Characteristics
        //-------------------------------------------------------------
        const ch = data.characteristics;
        const row3 = [
            cell(this.formatCharacteristic(ch.might), 'Might'),
            cell(this.formatCharacteristic(ch.agility), 'Agility'),
            cell(this.formatCharacteristic(ch.reason), 'Reason'),
            cell(this.formatCharacteristic(ch.intuition), 'Intuition'),
            cell(this.formatCharacteristic(ch.presence), 'Presence'),
        ];

        //-------------------------------------------------------------
        // Build the markdown table
        //-------------------------------------------------------------
        const separator = '|:----------------------------:'.repeat(5) + '|';

        const toRow = (arr: string[]) => `| ${arr.map(c => c || ' ').join(' | ')} |`;

        const tableLines = [
            toRow(headerRow),
            separator,
            toRow(row1),
            toRow(row2),
            toRow(row3),
        ];

        //-------------------------------------------------------------
        // Title line + blank + table
        //-------------------------------------------------------------
        const title = `**${data.name ?? 'Unnamed'}**`;

        return `${title}\n\n${tableLines.join('\n')}`;
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