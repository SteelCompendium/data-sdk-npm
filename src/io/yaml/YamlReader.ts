import { IDataReader } from "../IDataReader";
import { parse } from 'yaml';
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

type ModelFactory<M extends SteelCompendiumModel<any>> = (source: any) => M;

export class YamlReader<M extends SteelCompendiumModel<any>> extends IDataReader<M> {
    private modelFactory: ModelFactory<M>;

    public constructor(modelFactory: ModelFactory<M>) {
        super();
        this.modelFactory = modelFactory;
    }

    public read(source: string): M {
        const data = parse(source);
        return this.modelFactory(data);
    }
} 