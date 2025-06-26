import { Ability } from "../../model";
import { IDataReader } from "../IDataReader";
export declare class MarkdownAbilityReader implements IDataReader<Ability> {
    read(content: string): Ability;
}
