import { IDataWriter } from "../IDataWriter";
import { Ability } from "../../model";
export declare class XmlAbilityWriter extends IDataWriter<Ability> {
    write(data: Ability): string;
}
