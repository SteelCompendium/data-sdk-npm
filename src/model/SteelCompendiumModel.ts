import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { IDataWriter } from "../io";

export abstract class SteelCompendiumModel<D extends SteelCompendiumDTO<any>> {
    public write(writer: IDataWriter<D, this>): string {
        return writer.writeModel(this);
    }

    public abstract toDTO(): D;
} 