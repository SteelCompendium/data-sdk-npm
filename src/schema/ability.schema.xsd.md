# Ability XML Schema Documentation

This document provides a guide to the structure of an `ability` XML file, as defined by the `ability.schema.xsd`.

## Root Element: `<ability>`

The root element of the XML document must be `<ability>`.

### Attributes

None.

### Child Elements

The `<ability>` element contains the following child elements in a specific sequence:

| Element    | Type          | Occurrence | Description                                     |
| :--------- | :------------ | :--------- | :---------------------------------------------- |
| `name`     | `xs:string`   | 1          | The name of the ability.                        |
| `type`     | `xs:string`   | 1          | The type of action (e.g., "Maneuver", "Main Action"). |
| `cost`     | `xs:string`   | 0..1       | The resource cost to use the ability.           |
| `keywords` | `KeywordsType`| 0..1       | A container for keyword elements.               |
| `distance` | `xs:string`   | 0..1       | The range of the ability.                       |
| `target`   | `xs:string`   | 0..1       | The target of the ability.                      |
| `trigger`  | `xs:string`   | 0..1       | The trigger condition for the ability.          |
| `flavor`   | `xs:string`   | 0..1       | Flavor text for the ability.                    |
| `metadata` | `MetadataType`| 0..1       | A container for arbitrary metadata.             |
| `effects`  | `EffectsType` | 1          | A container for the ability's effects.          |

---

## Complex Types

### `KeywordsType`

A container for one or more `<keyword>` elements.

| Element   | Type        | Occurrence | Description               |
| :-------- | :---------- | :--------- | :------------------------ |
| `keyword` | `xs:string` | 0..unbounded | A keyword associated with the ability. |

### `MetadataType`

A container for arbitrary metadata, allowing for flexible key-value pairs represented as XML elements.

| Element | Type | Occurrence | Description |
| :--- | :--- | :--- | :--- |
| (any) | `xs:any` | 0..unbounded | Any valid XML element can be included. |


### `EffectsType`

A container for one or more `<effect>` elements.

| Element  | Type         | Occurrence | Description                                |
| :------- | :----------- | :--------- | :----------------------------------------- |
| `effect` | `EffectType` | 1..unbounded | Describes a single effect of the ability. |

### `EffectType`

Describes an effect. This is a mixed-type element, meaning it can contain text and child elements.

#### Attributes

| Attribute | Type        | Use        | Description                                       |
| :-------- | :---------- | :--------- | :------------------------------------------------ |
| `type`    | `xs:string` | required   | The type of effect. Can be "mundane" or "roll".   |
| `name`    | `xs:string` | optional   | The name of the effect (e.g., "Persistent 1").    |
| `cost`    | `xs:string` | optional   | The cost associated with this specific effect.    |

#### Content and Child Elements

The content of the `<effect>` element depends on its `type` attribute.

-   If `type="mundane"`, the element's text content is the description of the effect.
-   If `type="roll"`, the element contains child elements that describe a power roll.

| Element | Type        | Occurrence | Description                             |
| :------ | :---------- | :--------- | :-------------------------------------- |
| `roll`  | `xs:string` | 0..1       | The dice roll formula.                  |
| `t1`    | `xs:string` | 0..1       | The outcome for the first tier.         |
| `t2`    | `xs:string` | 0..1       | The outcome for the second tier.        |
| `t3`    | `xs:string` | 0..1       | The outcome for the third tier.         |
| `crit`  | `xs:string` | 0..1       | The outcome for a critical success.     |

---

## Example

Here is an example of a complete `<ability>` XML structure.

```xml
<ability>
  <name>BLESSING OF THE BLADE</name>
  <cost>11 PIETY</cost>
  <flavor>“The power of the gods is within you, friends. Allow me to unleash it.”</flavor>
  <metadata>
    <sourceBook>Core Rulebook</sourceBook>
    <page>78</page>
  </metadata>
  <keywords>
    <keyword>Area</keyword>
    <keyword>Magic</keyword>
  </keywords>
  <type>Maneuver</type>
  <distance>5 aura</distance>
  <target>Self and each ally in the area</target>
  <effects>
    <effect type="mundane">At the end of each of your turns until the end of the encounter or until you are dying, each target gains 3 surges.</effect>
    <effect type="roll">
      <roll>Power Roll + Intuition</roll>
      <t1>3 + I corruption damage; M &lt; weak, damage weakness 5 (save ends)</t1>
      <t2>6 + I corruption damage; M &lt; average, damage weakness 5 (save ends)</t2>
      <t3>9 + I corruption damage; M &lt; strong, damage weakness 5 (save ends)</t3>
    </effect>
  </effects>
</ability>
```
