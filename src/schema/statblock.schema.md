# Draw Steel Statblock Schema

This document describes the JSON schema for Draw Steel statblocks, which represent creatures and NPCs in the game.

## Root Object

The root object represents a complete statblock with the following properties:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | string | Yes | - | The name of the creature. |
| `level` | integer | No | 0 | The creature's level. |
| `roles` | string[] | Yes | [] | Roles assigned to the creature (e.g., Boss, Minion). |
| `ancestry` | string[] | Yes | [] | Ancestries or types the creature belongs to (e.g., Human, Humanoid). |
| `ev` | string | Yes | "0" | Encounter Value (EV) of the creature. |
| `stamina` | integer | Yes | 0 | The creature's max stamina. |
| `immunities` | string[] | No | [] | List of immunities (e.g., Magic 2, Psionic 2). |
| `weaknesses` | string[] | No | [] | List of weaknesses (e.g., acid 3, holy 1). |
| `speed` | integer | Yes | "" | Movement speed of the creature (e.g., 5). |
| `movement` | string | No | "" | Movement types of the creature (e.g. 'run, fly') |
| `size` | string | Yes | "" | Size category (e.g., 1M for medium). |
| `stability` | integer | Yes | 0 | Stability value of the creature. |
| `free_strike` | integer | Yes | 0 | The free strike value. |
| `melee_distance` | integer | No | 0 | The melee distance. |
| `ranged_distance` | integer | No | 0 | The ranged distance. |
| `might` | integer | Yes | 0 | Might modifier. |
| `agility` | integer | Yes | 0 | Agility modifier. |
| `reason` | integer | Yes | 0 | Reason modifier. |
| `intuition` | integer | Yes | 0 | Intuition modifier. |
| `presence` | integer | Yes | 0 | Presence modifier. |
| `with_captain` | string | No | - | Effect when a captain is present. |
| `traits` | Trait[] | No | [] | Special traits of the creature. |
| `abilities` | Ability[] | No | [] | List of abilities (see Ability schema). |

## Trait Object

A trait represents a special characteristic or feature of the creature.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | The name of the trait |
| `effects` | Effect[] | Yes | List of effects of the trait. See Ability schema for Effect types. |

## Example

```json
{
  "name": "GHOUL",
  "level": 1,
  "roles": ["HORDE", "HARRIER"],
  "ancestry": ["Undead"],
  "ev": "3",
  "stamina": 15,
  "speed": "7",
  "size": "1M",
  "stability": 0,
  "free_strike": 1,
  "might": 0,
  "agility": 2,
  "reason": -2,
  "intuition": 0,
  "presence": -1,
  "immunities": ["corruption 1", "poison 1"],
  "traits": [
    {
      "name": "Hunger",
      "effects": [
        "If the ghoul charges, their speed increases by 2 until the end of their turn."
      ]
    }
  ],
  "abilities": [
    {
      "name": "Razor Claws",
      "type": "Action",
      "keywords": ["Charge", "Melee", "Strike", "Weapon"],
      "effects": [
        {
          "roll": "2d10 + 2",
          "11 or lower": "3 damage",
          "12-16": "4 damage",
          "17+": "5 damage; M<2 bleeding (save ends)"
        }
      ],
      "cost": "Signature",
      "distance": "Melee 1",
      "target": "One creature or object"
    }
  ]
}
``` 