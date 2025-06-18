import { IDataReader } from "../IDataReader";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

type ModelFactory<M extends SteelCompendiumModel<any>> = (source: any) => M;

export class JsonReader<M extends SteelCompendiumModel<any>> extends IDataReader<M> {
    private modelFactory: ModelFactory<M>;

    public constructor(modelFactory: ModelFactory<M>) {
        super();
        this.modelFactory = modelFactory;
    }

    public read(source: string): M {
        const data = JSON.parse(source);
        return this.modelFactory(data);
    }
} 