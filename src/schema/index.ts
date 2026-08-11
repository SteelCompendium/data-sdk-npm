// Schema stability: feature/statblock/featureblock (+ shared sub-schemas) are stable.
// The 10 content-type schemas below (ancestry, career, class, complication, condition,
// culture, kit, perk, title, treasure) are BETA — subject to change without notice.
// See README.md § Schema stability.
import * as featureSchema from "./feature.schema.json"
import * as statblockSchema from "./statblock.schema.json"
import * as featureblockSchema from "./featureblock.schema.json"
import * as ancestrySchema from "./ancestry.schema.json"
import * as careerSchema from "./career.schema.json"
import * as classSchema from "./class.schema.json"
import * as complicationSchema from "./complication.schema.json"
import * as conditionSchema from "./condition.schema.json"
import * as cultureSchema from "./culture.schema.json"
import * as kitSchema from "./kit.schema.json"
import * as perkSchema from "./perk.schema.json"
import * as titleSchema from "./title.schema.json"
import * as treasureSchema from "./treasure.schema.json"

export {
    featureSchema,
    statblockSchema,
    featureblockSchema,
    ancestrySchema,
    careerSchema,
    classSchema,
    complicationSchema,
    conditionSchema,
    cultureSchema,
    kitSchema,
    perkSchema,
    titleSchema,
    treasureSchema,
};