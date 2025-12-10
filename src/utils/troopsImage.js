// src/utils/troopsImage.js

export const getTroopImageUrl = (troopName) => {
    const imageMap = {
        // 🟥 Home Village Troops — Elixir
        "Barbarian": "/Clans/troops/barbarian.png",
        "Archer": "/Clans/troops/archer.png",
        "Giant": "/Clans/troops/giant.png",
        "Goblin": "/Clans/troops/goblin.png",
        "Wall Breaker": "/Clans/troops/wall-breaker.png",
        "Balloon": "/Clans/troops/balloon.png",
        "Wizard": "/Clans/troops/wizard.png",
        "Healer": "/Clans/troops/healer.png",
        "Dragon": "/Clans/troops/dragon.png",
        "P.E.K.K.A": "/Clans/troops/pekka.png",
        "Baby Dragon": "/Clans/troops/babydragon.png",
        "Miner": "/Clans/troops/miner.png",
        "Electro Dragon": "/Clans/troops/electro-dragon.png",
        "Yeti": "/Clans/troops/Yeti.png",

        // 🟪 Dark Elixir Troops
        "Minion": "/Clans/troops/gargoyle.png",
        "Hog Rider": "/Clans/troops/boar-rider.png",
        "Valkyrie": "/Clans/troops/warrior-girl.png",
        "Golem": "/Clans/troops/golem.png",
        "Witch": "/Clans/troops/warlock.png",
        "Lava Hound": "/Clans/troops/airdefenceseeker.png",
        "Bowler": "/Clans/troops/bowler.png",

        // ⭐ Super Troops
        "Super Barbarian": "/Clans/troops/elitebarbarian.png",
        "Super Archer": "/Clans/troops/elitearcher.png",
        "Super Giant": "/Clans/troops/elitegiant.png",
        "Sneaky Goblin": "/Clans/troops/elitegoblin.png",
        "Super Wall Breaker": "/Clans/troops/elitewallbreaker.png",
        "Rocket Balloon": "/Clans/troops/hastyballoon.png",
        "Super Wizard": "/Clans/troops/super-wizard.png",
        "Super Dragon": "/Clans/troops/super-dragon.png",
        "Super Minion": "/Clans/troops/super-minion.png",
        "Inferno Dragon": "/Clans/troops/infernodragon.png",
        "Ice Golem": "/Clans/troops/ice-golem.png",
        "Super Valkyrie": "/Clans/troops/elitevalkyrie.png",
        "Dragon Rider": "/Clans/troops/dragon-rider.png",
        "Electro Titan": "/Clans/troops/electro-titan.png",
        "Root Rider": "/Clans/troops/root-rider.png",
        "Headhunter": "/Clans/troops/headhunter.png",
        "Apprentice Warden": "/Clans/troops/apprentice-warden.png",
        "Super Bowler": "/Clans/troops/super-bowler.png",
        "Super Witch": "/Clans/troops/head-witch.png",
        "Ice Hound": "/Clans/troops/ice-hound.png",
        "Super Miner": "/Clans/troops/super-miner.png",
        "Super Hog Rider": "/Clans/troops/super-hog-rider.png",
        "Druid": "/Clans/troops/druid_healer.png",
        "Thrower": "/Clans/troops/thrower.png",

        // ⛏️ Siege Machines
        "Wall Wrecker": "/Clans/troops/siege-machine-ram.png",
        "Battle Blimp": "/Clans/troops/siege-machine-flyer.png",
        "Stone Slammer": "/Clans/troops/siege-bowler-balloon.png",
        "Siege Barracks": "/Clans/troops/siege-machine-carrier.png",
        "Log Launcher": "/Clans/troops/siege-log-launcher.png",
        "Flame Flinger": "/Clans/troops/siege-catapult.png",
        "Battle Drill": "/Clans/troops/battle-drill.png",

        // 🟦 Builder Base
        "Raged Barbarian": "/Clans/troops/elitebarbarian.png",
        "Sneaky Archer": "/Clans/troops/elitearcher.png",
        "Boxer Giant": "/Clans/troops/elitegiant.png",
        "Beta Minion": "/Clans/troops/gargoyle.png",
        "Bomber": "/Clans/troops/goblin.png",
        "Cannon Cart": "/Clans/troops/siege-machine-carrier.png",
        "Night Witch": "/Clans/troops/warlock.png",
        "Drop Ship": "/Clans/troops/siege-machine-flyer.png",
        "Power P.E.K.K.A": "/Clans/troops/pekka.png",
        "Hog Glider": "/Clans/troops/boar-rider.png",
        "Electrofire Wizard": "/Clans/troops/wizard.png",
    }

    return imageMap[troopName] || null
}

