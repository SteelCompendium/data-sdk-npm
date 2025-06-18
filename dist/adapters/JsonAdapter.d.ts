import BaseAdapter, { IStatblock } from "./BaseAdapter";
declare class JsonAdapter extends BaseAdapter {
    getName(): string;
    parse(text: string): IStatblock;
    format(statblock: IStatblock): string;
}
export default JsonAdapter;
