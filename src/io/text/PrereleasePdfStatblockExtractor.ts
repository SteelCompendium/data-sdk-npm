import { Statblock } from "../../model";
import { IDataExtractor } from "../IDataExtractor";
import { PrereleasePdfStatblockReader } from "./PrereleasePdfStatblockReader";

export class PrereleasePdfStatblockExtractor implements IDataExtractor<Statblock> {
    extract(text: string): Statblock[] {
        const statblocks = PrereleasePdfStatblockExtractor.extractStatblockText(text);
        const reader = new PrereleasePdfStatblockReader();
        return statblocks.map(reader.read);
    }

    static extractStatblockText(text: string): string[] {
        const lines = text.split(/\r?\n/);

        const statblockStarts: { name: string; index: number }[] = [];
        const statblockHeaderRegex = /level\s+\d+\s+/i;
        const reader = new PrereleasePdfStatblockReader();

        lines.forEach((line, index) => {
            if (statblockHeaderRegex.test(line)) {
                // To be a statblock header, it must also have a name
                const lineWithNext = line + "\n" + (lines[index + 1] ?? "");
                try {
                    const statblock = reader.read(lineWithNext);
                    if (statblock.name && statblock.roles.length > 0) {
                        const existing = statblockStarts.find(s => s.name === statblock.name);
                        if (!existing) {
                            statblockStarts.push({ name: statblock.name, index });
                        }
                    }
                } catch (e) {
                    // Not a valid statblock header, ignore
                }
            }
        });

        return statblockStarts.map(({ name, index }, i) => {
            const start = index;
            const end = i < statblockStarts.length - 1 ? statblockStarts[i + 1].index : lines.length;
            const block = lines.slice(start, end).join("\n");
            return block;
        });
    }
}