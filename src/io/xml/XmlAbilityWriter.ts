import { IDataWriter } from "../IDataWriter";
import { XMLBuilder } from "fast-xml-parser";
import {Ability} from "../../model";

export class XmlAbilityWriter extends IDataWriter<Ability> {
    write(data: Ability): string {
        const dto = data.toXmlDTO();

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
            ['ability']: cleanDTO
        });
    }
}