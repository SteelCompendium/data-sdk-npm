import { Statblock } from "../../model";
import { IDataReader } from "../IDataReader";
export declare class MarkdownStatblockReader implements IDataReader<Statblock> {
    private abilityReader;
    read(content: string): Statblock;
    private parseStatblockTable;
}
