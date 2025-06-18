import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { IDataWriter } from "../io";

export abstract class SteelCompendiumModel<D extends SteelCompendiumDTO<any>> {
    public write(writer: IDataWriter<this>): string {
        return writer.write(this);
    }

    public abstract toDTO(): D;
} 