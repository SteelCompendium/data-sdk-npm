import { Statblock } from "../../model";
import { IDataExtractor } from "../IDataExtractor";
export declare class PrereleasePdfStatblockExtractor implements IDataExtractor<Statblock> {
    private readonly statblockReader;
    extract(text: string): Statblock[];
    extractStatblockText(text: string): string[];
}
