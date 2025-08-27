import {SteelCompendiumPseudoModel} from '.';

export class FeatureStat implements SteelCompendiumPseudoModel {
    name!: string;
    value!: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

    static fromDTO(data: any): FeatureStat {
        return new FeatureStat(data.name, data.value);
    }

    toDTO() {

    }
}
