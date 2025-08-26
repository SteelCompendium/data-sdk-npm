import {IDataReader} from "../IDataReader";
import {Featureblock} from "../../model/Featureblock";

export class MarkdownFeatureblockReader implements IDataReader<Featureblock> {
    read(content: string): Featureblock {
    }
}