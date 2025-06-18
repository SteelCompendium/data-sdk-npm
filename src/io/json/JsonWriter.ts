import { IDataWriter } from "../IDataWriter";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

export class JsonWriter<M extends SteelCompendiumModel<any>> extends IDataWriter<M> {
    write(data: M): string {
        const dto = data.toDTO();
        return JSON.stringify(dto, null, 2);
    }
} 