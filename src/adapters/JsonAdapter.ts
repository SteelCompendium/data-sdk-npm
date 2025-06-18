import BaseAdapter, { IStatblock } from "./BaseAdapter";

class JsonAdapter extends BaseAdapter {
    getName(): string {
        return "JSON";
    }

    parse(text: string): IStatblock {
        try {
            return JSON.parse(text);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Error parsing JSON:", e);
            throw new Error("Invalid JSON input.");
        }
    }

    format(statblock: IStatblock): string {
        return JSON.stringify(statblock, null, 2);
    }
}

export default JsonAdapter; 