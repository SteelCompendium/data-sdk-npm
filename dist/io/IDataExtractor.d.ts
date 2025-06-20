import { SteelCompendiumModel } from "../model/SteelCompendiumModel";
export declare abstract class IDataExtractor<M extends SteelCompendiumModel<any>> {
    abstract extract(source: string): M[];
}
