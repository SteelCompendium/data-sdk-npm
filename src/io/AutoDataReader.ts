import { SteelCompendiumModel } from '../model';
import { IDataReader } from './IDataReader';
import { SteelCompendiumIdentifier, SteelCompendiumFormat } from './SteelCompendiumIdentifier';

export class AutoDataReader<M extends SteelCompendiumModel<any>> extends IDataReader<M> {
    public read(source: string): M {
        const identificationResult = SteelCompendiumIdentifier.identify(source);

        if (identificationResult.format === SteelCompendiumFormat.Unknown) {
            throw new Error("Could not identify the format of the provided data.");
        }

        const reader = identificationResult.getReader();
        return reader.read(source) as unknown as M;
    }
} 