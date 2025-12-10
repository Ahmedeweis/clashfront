// src/utils/animals.js

export const getPetImageUrl = (petName) => {
    const imageMap = {
        // 🐾 Hero Pets
        "L.A.S.S.I": "/Clans/pets/LASSI.png",
        "Electro Owl": "/Clans/pets/Electro-Owl.png",
        "Mighty Yak": "/Clans/pets/Mighty-Yak.png",
        "Unicorn": "/Clans/pets/Unicorn.png",

        "Frosty": "/Clans/pets/Frosty.png",
        "Diggy": "/Clans/pets/Diggy.png",
        "Poison Lizard": "/Clans/pets/Poison-Lizard.png",
        "Phoenix": "/Clans/pets/Phoenix.png",

        "Spirit Fox": "/Clans/pets/Spirit-Fox.png",
        "Angry Jelly": "/Clans/pets/Angry-Jelly.png",
    }

    return imageMap[petName] || "/Clans/pets/default.png"
}
