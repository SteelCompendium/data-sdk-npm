import { Ability } from "../../model";
import { IDataReader } from "../IDataReader";
export declare class MarkdownAbilityReader implements IDataReader<Ability> {
    constructor();
    read(content: string): Ability;
    private parseTiers;
    private peekToCheckForTiers;
}
