import { IDataWriter } from "../IDataWriter";
import { XMLBuilder } from "fast-xml-parser";
import { Feature } from "../../model";

// Deprecated: XML support will be dropped in 1.0.0
export class XmlAbilityWriter extends IDataWriter<Feature> {
    write(data: Feature): string {
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
            ignoreAttributes: false,
        });

        return builder.build({
            ['ability']: cleanDTO
        });
    }
}