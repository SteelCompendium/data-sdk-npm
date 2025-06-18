import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { IDataWriter } from "../io";

export abstract class SteelCompendiumModel {
    public write(writer: IDataWriter<SteelCompendiumDTO<this>, this>): string {
        return writer.writeModel(this);
    }

    public abstract toDTO(): SteelCompendiumDTO<this>;
} 