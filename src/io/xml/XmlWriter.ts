import { IDataWriter } from "../IDataWriter";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { XMLBuilder } from "fast-xml-parser";

export class XmlWriter<M extends SteelCompendiumModel<any>> extends IDataWriter<M> {
    public constructor(private readonly rootName: string) {
        super();
    }

    write(data: M): string {
        const dto = data.toDTO();

        const cleanDTO = Object.entries(dto).reduce((acc: Record<string, any>, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});

        const builder = new XMLBuilder({
            format: true,
            suppressBooleanAttributes: false,
        });

        return builder.build({
            [this.rootName]: cleanDTO
        });
    }

} 