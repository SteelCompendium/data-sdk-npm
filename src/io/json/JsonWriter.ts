import { IDataWriter } from "../IDataWriter";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

export class JsonWriter<M extends SteelCompendiumModel<any>> extends IDataWriter<M> {
    write(data: M): string {
        const dto = data.toDTO();

        const cleanDTO = Object.entries(dto).reduce((acc: Record<string, any>, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});

        return JSON.stringify(cleanDTO, null, 2);
    }
} 