import { Statblock } from "../../model/Statblock";
import { IDataReader } from "../IDataReader";
export declare class PrereleasePdfStatblockReader implements IDataReader<Statblock> {
    read(text: string): Statblock;
    mapActionTypeToAbilityType(category: string): string;
    mapOutcomeToTierKey(threshold: string): string;
    format(statblock: Statblock): string;
}
