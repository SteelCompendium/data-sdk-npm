import { IDataReader } from "../IDataReader";
import { Ability } from "../../model";
export declare class XmlAbilityReader extends IDataReader<Ability> {
    read(source: string): Ability;
}
