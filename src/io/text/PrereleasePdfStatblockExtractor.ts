import { Statblock } from "../../model";
import { IDataExtractor } from "../IDataExtractor";
import { PrereleasePdfStatblockReader } from "./PrereleasePdfStatblockReader";

export class PrereleasePdfStatblockExtractor implements IDataExtractor<Statblock> {
    private readonly statblockReader: PrereleasePdfStatblockReader = new PrereleasePdfStatblockReader();

    extract(text: string): Statblock[] {
        const statblocks = this.extractText(text);
        return statblocks.map(this.statblockReader.read);
    }

    extractText(text: string): string[] {
        const lines = text.split(/\r?\n/);

        const statblockStarts: { name: string; index: number }[] = [];
        const statblockHeaderRegex = /l\s?evel\s+\d+[^\+]/i;

        lines.forEach((line, index) => {
            if (statblockHeaderRegex.test(line)) {
                // To be a statblock header, it must also have a name
                const lineWithNext = line + "\n" + (lines[index + 1] ?? "");
                try {
                    const statblock = this.statblockReader.read(lineWithNext);
                    if (statblock.name && statblock.roles.length > 0) {
                        // const existing = statblockStarts.find(s => s.name === statblock.name);
                        // if (!existing) {
                        statblockStarts.push({ name: statblock.name, index });
                        // }
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