import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class IDataWriter<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel> {
    public abstract write(data: T): string;

    writeModel(data: M): string {
        const dto = data.toDTO() as T;
        return this.write(dto);
    }
} 