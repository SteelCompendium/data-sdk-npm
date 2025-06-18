import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class IDataWriter<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> {
    public abstract write(data: T): string;

    writeModel(data: M): string {
        const dto = data.toDTO();
        return this.write(dto);
    }
} 