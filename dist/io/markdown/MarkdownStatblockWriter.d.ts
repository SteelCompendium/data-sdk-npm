import { Statblock } from "../../model/Statblock";
import { IDataWriter } from "../IDataWriter";
export declare class MarkdownStatblockWriter implements IDataWriter<Statblock> {
    private abilityWriter;
    write(data: Statblock): string;
    private createStatblockTable;
    private formatCharacteristic;
}
