import { IDataReader } from "../IDataReader";
import { Featureblock } from "../../model/Featureblock";
export declare class MarkdownFeatureblockReader extends IDataReader<Featureblock> {
    private abilityReader;
    read(source: string): Featureblock;
    private findFirstHeader;
    private parseTitle;
    private splitIntoBlocks;
    private extractStatsBullets;
    private pickStat;
    private extractFlavor;
}
