import BaseAdapter, { IStatblock } from "./BaseAdapter";
declare class MarkdownAdapter extends BaseAdapter {
    getName(): string;
    parse(text: string): IStatblock;
    format(statblock: IStatblock): string;
}
export default MarkdownAdapter;
