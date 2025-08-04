import { Ability } from "../../model/Ability";
import { IDataWriter } from "../IDataWriter";
export declare class MarkdownAbilityWriter implements IDataWriter<Ability> {
    write(data: Ability, prefix?: string, suffix?: string): string;
    private writeEffect;
    private writeMundaneEffect;
    private writePowerRollEffect;
}
