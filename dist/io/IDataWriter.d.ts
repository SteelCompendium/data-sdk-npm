import { SteelCompendiumModel } from "../model/SteelCompendiumModel";
export declare abstract class IDataWriter<M extends SteelCompendiumModel<any>> {
    abstract write(data: M): string;
}
