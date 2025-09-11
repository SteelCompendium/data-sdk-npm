# Draw Steel Statblock Schema

This document describes the JSON schema for Draw Steel statblocks, which represent creatures and NPCs in the game.

## Root Object

The root object represents a complete statblock with the following properties:

| Property          | Type      | Required | Default     | Description                                                          |
|-------------------|-----------|----------|-------------|----------------------------------------------------------------------|
| `name`            | string    | Yes      | -           | The name of the creature.                                            |
| `type`            | string    | Yes      | "statblock" | Static string "statblock"                                            |
| `level`           | integer   | No       | 0           | The creature's level.                                                |
| `roles`           | string[]  | Yes      | []          | Roles assigned to the creature (e.g., Boss, Minion).                 |
| `ancestry`        | string[]  | Yes      | []          | Ancestries or types the creature belongs to (e.g., Human, Humanoid). |
| `ev`              | string    | Yes      | "0"         | Encounter Value (EV) of the creature.                                |
| `stamina`         | string    | Yes      | 0           | The creature's max stamina.                                          |
| `immunities`      | string[]  | No       | []          | List of immunities (e.g., Magic 2, Psionic 2).                       |
| `weaknesses`      | string[]  | No       | []          | List of weaknesses (e.g., acid 3, holy 1).                           |
| `speed`           | integer   | Yes      | ""          | Movement speed of the creature (e.g., 5).                            |
| `movement`        | string    | No       | ""          | Movement types of the creature (e.g. 'run, fly')                     |
| `size`            | string    | Yes      | ""          | Size category (e.g., 1M for medium).                                 |
| `stability`       | integer   | Yes      | 0           | Stability value of the creature.                                     |
| `free_strike`     | integer   | Yes      | 0           | The free strike value.                                               |
| `melee_distance`  | integer   | No       | 0           | The melee distance.                                                  |
| `ranged_distance` | integer   | No       | 0           | The ranged distance.                                                 |
| `might`           | integer   | Yes      | 0           | Might modifier.                                                      |
| `agility`         | integer   | Yes      | 0           | Agility modifier.                                                    |
| `reason`          | integer   | Yes      | 0           | Reason modifier.                                                     |
| `intuition`       | integer   | Yes      | 0           | Intuition modifier.                                                  |
| `presence`        | integer   | Yes      | 0           | Presence modifier.                                                   |
| `with_captain`    | string    | No       | -           | Effect when a captain is present.                                    |
| `features`        | Feature[] | No       | []          | List of features (see Feature schema).                               |

## Example

```json
{
  "type": "statblock",
  "name": "Zombie",
  "level": 1,
  "roles": [
    "Horde",
    "Brute"
  ],
  "ancestry": [
    "Undead"
  ],
  "ev": "3",
  "stamina": "20",
  "immunities": [
    "corruption 1",
    "poison 1"
  ],
  "speed": 5,
  "size": "1M",
  "stability": 1,
  "free_strike": 2,
  "might": 2,
  "agility": 1,
  "reason": -5,
  "intuition": -2,
  "presence": 1,
  "features": [
    {
      "type": "feature",
      "feature_type": "trait",
      "name": "Endless Knight",
      "icon": "⭐️",
      "effects": [
        {
          "effect": "The first time the zombie is reduced to Stamina 0 by damage that isn’t fire damage or holy damage and their body isn’t destroyed, they regain 10 Stamina and fall prone."
        }
      ]
    },
    {
      "type": "feature",
      "feature_type": "ability",
      "name": "Clobber and Clutch",
      "icon": "🗡",
      "cost": "Signature Ability",
      "keywords": [
        "Melee",
        "Strike",
        "Weapon"
      ],
      "usage": "Main action",
      "distance": "Melee 1",
      "target": "One creature or object",
      "effects": [
        {
          "roll": "Power Roll + 2",
          "t1": "4 damage",
          "t2": "6 damage",
          "t3": "7 damage; grabbed"
        },
        {
          "effect": "A target who starts their turn grabbed by the zombie takes 2 corruption damage. If a creature takes 5 or more corruption damage this way, they become insatiably hungry for flesh. The target must complete the Find a Cure project to end this effect.",
          "name": "Effect"
        }
      ]
    },
    {
      "type": "feature",
      "feature_type": "ability",
      "name": "Zombie Dust",
      "icon": "❇️",
      "cost": "3 Malice",
      "keywords": [
        "Area",
        "Melee"
      ],
      "usage": "Maneuver",
      "distance": "2 burst",
      "target": "Each enemy in the burst",
      "effects": [
        {
          "name": "Effect",
          "effect": "The zombie falls prone, expelling a wave of rot and dust."
        },
        {
          "roll": "Power Roll + 2",
          "t1": "2 corruption damage",
          "t2": "3 corruption damage; M<1 weakened (save ends)",
          "t3": "4 corruption damage; M<2 dazed (save ends)"
        }
      ]
    }
  ]
}
``` 