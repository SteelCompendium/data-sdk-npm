import { IDataWriter } from "../io";

export abstract class SteelCompendiumModel {
    public write(writer: IDataWriter<this>): string {
        return writer.write(this);
    }
} 