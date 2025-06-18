import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class IDataWriter<M extends SteelCompendiumModel<any>> {
    public abstract write(data: M): string;
} 