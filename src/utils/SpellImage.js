// src/utils/SpellImage.js

export const getSpellImageUrl = (spellName) => {
    const imageMap = {
        "Lightning Spell": "/Clans/spells/Lightning Spell.png",
        "Healing Spell": "/Clans/spells/healingwave.png",
        "Rage Spell": "/Clans/spells/Rage Spell.png",
        "Jump Spell": "/Clans/spells/jump.png",
        "Freeze Spell": "/Clans/spells/freeze.png",
        "Poison Spell": "/Clans/spells/poison.png",
        "Earthquake Spell": "/Clans/spells/earthquake.png",
        "Haste Spell": "/Clans/spells/speedup.png",
        "Clone Spell": "/Clans/spells/Clone Spell.png",
        "Skeleton Spell": "/Clans/spells/Skeleton Spell.png",
        "Bat Spell": "/Clans/spells/Bat Spell.png",
        "Invisibility Spell": "/Clans/spells/invisibility.png",
        "Recall Spell": "/Clans/spells/recall.png",
        "Overgrowth Spell": "/Clans/spells/overgrowth.png",
        "Revive Spell": "/Clans/spells/revive.png",
        "Ice Block Spell": "/Clans/spells/Ice Block Spell.png",
        "Totem Spell": "/Clans/spells/Totem Spell.png",
    }

    return imageMap[spellName] || null
}
