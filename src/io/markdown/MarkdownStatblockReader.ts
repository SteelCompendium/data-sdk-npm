import { Statblock, Trait, MundaneEffect, Effects, Ability } from "../../model";
import { IDataReader } from "../IDataReader";
import { MarkdownAbilityReader } from "./MarkdownAbilityReader";

export class MarkdownStatblockReader implements IDataReader<Statblock> {
    private abilityReader = new MarkdownAbilityReader();

    public read(content: string): Statblock {
        const partial: Partial<Statblock> & { characteristics: any } = {
            characteristics: {
                might: 0,
                agility: 0,
                reason: 0,
                intuition: 0,
                presence: 0,
            },
        };

        // ------------------------------------------------------------------
        // Split: stat-block part  |  abilities part
        // ------------------------------------------------------------------
        const sep = '\n---\n';
        const sepIdx = content.indexOf(sep);
        const mainContent      = sepIdx !== -1 ? content.substring(0, sepIdx)     : content;
        const abilitiesContent = sepIdx !== -1 ? content.substring(sepIdx + sep.length) : undefined;

        // ------------------------------------------------------------------
        // Parse the *main* stat-block
        // ------------------------------------------------------------------
        const mainLines = mainContent.split('\n');

        // 1) Table (first contiguous |…| lines)
        const tableLines: string[] = [];
        let idx = 0;
        while (idx < mainLines.length && mainLines[idx].startsWith('|')) {
            tableLines.push(mainLines[idx]);
            idx++;
        }
        this.parseStatblockTable(tableLines, partial);

        // 2) Skip blank lines after the table
        while (idx < mainLines.length && mainLines[idx].trim() === '') idx++;

        // 3) Traits — contiguous block-quote chunks
        const traits: Trait[] = [];
        while (idx < mainLines.length) {
            if (/^\s*>\s?/.test(mainLines[idx])) {
                const block: string[] = [];
                while (idx < mainLines.length && /^\s*>\s?/.test(mainLines[idx])) {
                    block.push(mainLines[idx].replace(/^\s*>\s?/, ''));
                    idx++;
                }
                const traitAbility = this.abilityReader.read(block.join('\n').trim());
                traits.push(
                    new Trait({
                        name:    traitAbility.name,
                        effects: traitAbility.effects,
                    })
                );
            } else {
                // any non-blockquote line is ignored / future-proof
                idx++;
            }
        }
        partial.traits = traits;

        // ------------------------------------------------------------------
        // Abilities (after the '---' divider)
        // ------------------------------------------------------------------
        if (abilitiesContent) {
            const abilityBlocks: string[] = [];
            let buf: string[] = [];

            const pushBuf = () => {
                if (buf.length) {
                    abilityBlocks.push(buf.join('\n').trim());
                    buf = [];
                }
            };

            for (const line of abilitiesContent.split('\n')) {
                if (/^\s*>\s?/.test(line)) {
                    buf.push(line.replace(/^\s*>\s?/, ''));
                } else {
                    // blank or non-blockquote line marks the end of a block
                    pushBuf();
                }
            }
            pushBuf(); // last one

            partial.abilities = abilityBlocks.map(b => this.abilityReader.read(b));
        }

        return new Statblock(partial as any);
    }

    // ----------------------------------------------------------------------
    // helpers
    // ----------------------------------------------------------------------
    private parseStatblockTable(tableLines: string[], partial: Partial<Statblock> & { characteristics: any }) {
        tableLines.forEach(line => {
            if (line.includes('**')) {
                const cells = line.split('|').map(c => c.trim()).filter(Boolean);
                if (cells.length === 2) {
                    this.parseRow(cells[0], partial);
                    this.parseRow(cells[1], partial);
                }
            }
        });
    }

    private parseRow(cell: string, partial: Partial<Statblock> & { characteristics: any }) {
        const clean = cell.replace(/\*/g, '');

        if (clean.toLowerCase().startsWith('level ')) {
            const m = clean.match(/Level (\d+)\s+(.*)/i);
            if (m) {
                partial.level = +m[1];
                let roles = m[2].split(',').map(s => s.trim());
                if (roles.length === 1 && roles[0] === '-') roles = [];
                partial.roles = roles;
            }
        } else if (clean.startsWith('Ancestry:')) {
            const v = clean.replace('Ancestry:', '').trim();
            partial.ancestry = v === '-' ? [] : v.split(',').map(s => s.trim());
        } else if (clean.startsWith('Stamina:')) {
            partial.stamina = clean.replace('Stamina:', '').trim() || '0';
        } else if (clean.startsWith('EV:')) {
            partial.ev = clean.replace('EV:', '').trim() || '0';
        } else if (clean.startsWith('Speed:')) {
            partial.speed = parseInt(clean.replace('Speed:', '').trim(), 10) || 0;
        } else if (clean.startsWith('Immunity:')) {
            const v = clean.replace('Immunity:', '').trim();
            partial.immunities = v === '-' ? [] : v.split(',').map(s => s.trim());
        } else if (clean.startsWith('Weakness:')) {
            const v = clean.replace('Weakness:', '').trim();
            partial.weaknesses = v === '-' ? [] : v.split(',').map(s => s.trim());
        } else if (clean.startsWith('Might:')) {
            partial.characteristics.might = parseInt(clean.replace('Might:', '').trim(), 10) || 0;
        } else if (clean.startsWith('Free Strike:')) {
            partial.freeStrike = parseInt(clean.replace('Free Strike:', '').trim(), 10) || 0;
        } else if (clean.startsWith('Agility:')) {
            partial.characteristics.agility = parseInt(clean.replace('Agility:', '').trim(), 10) || 0;
        } else if (clean.startsWith('Reason:')) {
            partial.characteristics.reason = parseInt(clean.replace('Reason:', '').trim(), 10) || 0;
        } else if (clean.startsWith('Intuition:')) {
            partial.characteristics.intuition = parseInt(clean.replace('Intuition:', '').trim(), 10) || 0;
        } else if (clean.startsWith('Size:')) {
            partial.size = clean.replace('Size:', '').trim();
        } else if (clean.startsWith('Presence:')) {
            partial.characteristics.presence = parseInt(clean.replace('Presence:', '').trim(), 10) || 0;
        } else if (clean.startsWith('Stability:')) {
            partial.stability = parseInt(clean.replace('Stability:', '').trim(), 10) || 0;
        } else if (clean.startsWith('With Captain:')) {
            const v = clean.replace('With Captain:', '').trim();
            if (v !== '-') partial.withCaptain = v;
        } else if (clean.startsWith('Movement:')) {
            const v = clean.replace('Movement:', '').trim();
            if (v !== '-') partial.movement = v;
        } else if (clean.startsWith('Melee:')) {
            const v = clean.replace('Melee:', '').trim();
            if (v !== '-') partial.meleeDistance = +v || 0;
        } else if (clean.startsWith('Ranged:')) {
            const v = clean.replace('Ranged:', '').trim();
            if (v !== '-') partial.rangedDistance = +v || 0;
        } else if (!clean.includes(':')) {
            partial.name = clean;
        }
    }
}
