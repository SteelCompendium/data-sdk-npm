import { SteelCompendiumModel } from '../model';
import { IDataReader } from './IDataReader';
export declare class AutoDataReader<M extends SteelCompendiumModel<any>> extends IDataReader<M> {
    read(source: string): M;
}
