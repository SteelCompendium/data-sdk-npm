import { Statblock } from "../../model/Statblock";
import { IDataReader } from "../IDataReader";
export declare class PrereleasePdfStatblockReader implements IDataReader<Statblock> {
    read(text: string): Statblock;
    private static mapActionTypeToAbilityType;
    private static mapOutcomeToTierKey;
}
