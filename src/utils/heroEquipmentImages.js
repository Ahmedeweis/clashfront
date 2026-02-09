// src/utils/heroEquipmentImages.js
export const getHeroEquipmentImageUrl = (equipmentName) => {
  const imageMap = {
    // King
    "Giant Gauntlet": "/Clans/king/Giant-Gauntlet.png",
    "Barbarian Puppet": "/Clans/king/Barbarian-Puppet.png",
    "Vampstache": "/Clans/king/Vampstache.png",
    "Rage Vial": "/Clans/king/Rage-Vial.png",
    "Spiky Ball": "/Clans/king/Spiky-Ball.png",
    "Earthquake Boots": "/Clans/king/Earthquake-Boots.png",
    "Snake Bracelet": "/Clans/king/Snake-Bracelet.png",
    // Queen
    "Action Figure": "/Clans/Queen/Action-Figure.png",
    "Giant Arrow": "/Clans/Queen/Giant-Arrow.png",
    "Healer Puppet": "/Clans/Queen/Healer-Puppet.png",
    "Archer Puppet": "/Clans/Queen/Archer-Puppet.png",
    "Invisibility Vial": "/Clans/Queen/Invisibility-Vial.png",
    "Action Figure": "/Clans/Queen/Action-Figure.png",
    "Magic Mirror": "/Clans/Queen/Magic-Mirror.png",
    "Frozen Arrow": "/Clans/Queen/Frozen-Arrow.png",
    "Metal Pants": "/Clans/Prince/Metal-Pants.png",
    "Noble Iron": "/Clans/Prince/Noble-Iron.png",
    "Dark Crown": "/Clans/Prince/Dark Crown.png",
    "Dark Orb": "/Clans/Prince/Dark-Orb.png",
    "Henchmen Puppet": "/Clans/Prince/Henchmen-Puppet.png",
    "Meteor Staff": "/Clans/Prince/Meteor_Staff.png",
    // RC
    "Hog Rider Puppet": "/Clans/RC/Hog-Rider-Puppet.png",
    "Electro Boots": "/Clans/RC/Electro-Boots.png",
    "Rocket Spear": "/Clans/RC/Rocket-Spear.png",
    "Haste Vial": "/Clans/RC/Haste-Vial.png",
    "Royal Gem": "/Clans/RC/Royal-Gem.png",
    "Seeking Shield": "/Clans/RC/Seeking-Shield.png",
    "Frost Flake": "/Clans/RC/Frost_Flake.png",
    // warden
    "Eternal Tome": "/Clans/warden/Eternal-Tome.png",
    "Life Gem": "/Clans/warden/Life-Gem.png",
    "Rage Gem": "/Clans/warden/Rage-Gem.png",
    "Fireball": "/Clans/warden/Fireball.png",
    "Healing Tome": "/Clans/warden/Healing-Tome.png",
    "Lavaloon Puppet": "/Clans/warden/Lavaloon-Puppet.png",
    "Heroic Torch": "/Clans/warden/Heroic-Torch.png",
  }
  return imageMap[equipmentName]
}