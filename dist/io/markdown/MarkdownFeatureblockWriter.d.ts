import { Featureblock } from "../../model/Featureblock";
import { IDataWriter } from "../IDataWriter";
export declare class MarkdownFeatureblockWriter extends IDataWriter<Featureblock> {
    private abilityWriter;
    write(data: Featureblock): string;
}
