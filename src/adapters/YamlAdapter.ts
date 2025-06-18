import BaseAdapter, { IStatblock } from "./BaseAdapter";
import yaml from "js-yaml";

class YamlAdapter extends BaseAdapter {
    getName(): string {
        return "YAML";
    }

    parse(text: string): IStatblock {
        try {
            return yaml.load(text) as IStatblock;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Error parsing YAML:", e);
            throw new Error("Invalid YAML input.");
        }
    }

    format(statblock: IStatblock): string {
        return yaml.dump(statblock);
    }
}

export default YamlAdapter; 