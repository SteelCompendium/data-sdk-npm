# Draw Steel Feature Schema

This document describes the JSON schema for Draw Steel abilities, which represent actions, maneuvers, and other capabilities that creatures can use.

## Root Object

The root object represents a complete feature with the following properties:

| Property       | Type     | Required | Description                                                                 |
|----------------|----------|----------|-----------------------------------------------------------------------------|
| `name`         | string   | No       | The title or description of the feature                                     |
| `type`         | string   | Yes      | Static string "feature"                                                     |
| `feature_type` | string   | Yes      | The type of feature ("ability" or "trait")                                  |
| `icon`         | string   | No       | The icon of the feature (ex: "🏹")                                          |
| `usage`        | string   | Yes      | Usage (e.g., "Action", "Maneuver", "Triggered Action", "Villain Action 1")  |
| `cost`         | string   | No       | Cost to use the feature (e.g., "5 Essence", "Signature", "2 Malice")        |
| `ability_type` | string   | No       | Type of the ability (Signature or Heroic)                                   |
| `keywords`     | string[] | No       | Keywords associated with the feature (e.g., ["Magic", "Earth", "Melee"])    |
| `distance`     | string   | No       | Distance or area (e.g., "Ranged 5", "2 burst", "Melee 1")                   |
| `target`       | string   | No       | Who or what is targeted (e.g., "All enemies", "One creature", "Self")       |
| `trigger`      | string   | No       | Trigger condition for triggered actions                                     |
| `effects`      | Effect[] | Yes      | List of effects (flexible formats)                                          |
| `flavor`       | string   | No       | Flavor text of the feature                                                  |
| `metadata`     | object   | No       | Key-value pairs for additional data, often used for frontmatter in markdown |

### Effects

A test effect represents a test against the targets with different outcomes based on the result.

| Property   | Type      | Description                                                          |
|------------|-----------|----------------------------------------------------------------------|
| `name`     | string    | Name of the test effect                                              |
| `cost`     | string    | Cost to trigger this test effect                                     |
| `effect`   | string    | Description of the test effect                                       |
| `roll`     | string    | Power Roll expression (e.g., "2d10 + 3")                             |
| `[tier]`   | string    | Tier result (key can be '11 or lower', '12-16', '17+', 'crit', etc.) |
| `features` | Feature[] | A list of Features granted from the effect.                          |

Example Test effect:

```json
{
  "effect": "Targets make a Might test",
  "name": "Effect",
  "11 or lower": "3 sonic damage; slide 1; shift 1",
  "12-16": "6 sonic damage; slide 3; shift 3",
  "17+": "8 sonic damage; slide 5; shift 5"
}
```

Example Effect with name and cost:

```json
{
  "name": "Malice Boost",
  "cost": "3 Malice",
  "effect": "Each ally within 3 of a target has their speed increased by 2 until the end of their next turn."
}
```

Example Effect without name, cost, etc:

```json
{
  "effect": "Until the end of their next turn, the target halves incoming damage, deals an additional 4 damage on strikes, and their speed is doubled."
}
```

## Full Example

```json
{
  "type": "feature",
  "feature_type": "ability",
  "name": "Instantaneous Excavation",
  "cost": "5 Essence",
  "flavor": "The surface of the world around you opens up to swallow foes.",
  "keywords": [
    "Earth",
    "Magic",
    "Ranged"
  ],
  "usage": "Maneuver",
  "distance": "Ranged 10",
  "target": "Special",
  "effects": [
    {
      "name": "Effect",
      "effect": "You open up two holes with 1-square openings that are 4 squares deep, which can be placed on any mundane surface within distance. You can place these holes next to each other to create fewer holes with wider openings. When the holes open, make a separate power roll for each creature on the ground above a hole and small enough to fall in. (You can’t score a critical hit with this ability because it uses a maneuver.)"
    },
    {
      "roll": "Power Roll + Reason",
      "tier1": "The target can shift 1 square from the edge of the hole to the nearest unoccupied space of their choice.",
      "tier2": "The target falls into the hole.",
      "tier3": "The target falls into the hole and can’t reduce the height of the fall."
    },
    {
      "effect": "At the start of your turn, you open another hole, making a power roll against each creature who could fall into the hole when it opens without spending essence.",
      "name": "Persistent 1"
    }
  ]
}
``` 
TODO - add Features[] to this example