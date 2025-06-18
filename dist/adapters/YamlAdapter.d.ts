import BaseAdapter, { IStatblock } from "./BaseAdapter";
declare class YamlAdapter extends BaseAdapter {
    getName(): string;
    parse(text: string): IStatblock;
    format(statblock: IStatblock): string;
}
export default YamlAdapter;
