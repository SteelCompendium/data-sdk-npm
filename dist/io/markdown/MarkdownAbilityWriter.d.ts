import { Ability } from "../../model/Ability";
import { IDataWriter } from "../IDataWriter";
export declare class MarkdownAbilityWriter implements IDataWriter<Ability> {
    write(data: Ability): string;
    private writeEffect;
    private writeMundaneEffect;
    private writePowerRollEffect;
}
