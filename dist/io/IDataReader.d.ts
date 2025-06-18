import { SteelCompendiumModel } from "../model/SteelCompendiumModel";
export declare abstract class IDataReader<M extends SteelCompendiumModel<any>> {
    abstract read(source: string): M;
}
