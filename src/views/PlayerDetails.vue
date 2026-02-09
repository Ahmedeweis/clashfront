<template>
  <div v-if="loading" class="p-6 text-center">
    <div class="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
    <p class="mt-4 text-gray-600">Loading player data...</p>
  </div>
  <div v-else-if="error" class="text-red-500 p-6 text-center">
    ❌ Failed to load player data. Please check the tag and try again.
  </div>
  <div v-else class="p-4 space-y-8 bg-[#0A0918]">
    <!-- Player Header -->
    <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
      <!-- Gradient Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 animate-gradient-x opacity-90"></div>

      <!-- Shine Effect -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
      </div>

      <!-- Overlay Pattern -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>

      <!-- Content -->
      <div class="relative p-8 md:p-12 text-white flex flex-col md:flex-row items-center md:justify-between gap-6">
        <!-- Player Info -->
        <div class="text-center md:text-left">
          <h1 class="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
            {{ player.name }}
          </h1>
          <div class="mt-2 flex flex-wrap justify-center md:justify-start items-center gap-3">
            <span class="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-lg font-mono text-yellow-400 border border-yellow-500/30">{{ player.tag }}</span>
            <span class="text-xl md:text-2xl font-bold text-pink-200 opacity-90">Level {{ player.expLevel }}</span>
          </div>
          <div class="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm md:text-base opacity-90 font-medium">
             <span class="flex items-center gap-1">🏆 {{ player.trophies }}</span>
             <span class="flex items-center gap-1">⭐ {{ player.warStars }} Stars</span>
             <span class="flex items-center gap-1">⚔️ {{ player.attackWins }} Wins</span>
          </div>
        </div>

        <!-- Major Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors shadow-inner">
            <p class="text-[10px] uppercase tracking-widest opacity-70">Best Cups</p>
            <p class="text-2xl font-black text-yellow-400 leading-tight">{{ player.bestTrophies }}</p>
          </div>
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors shadow-inner">
            <p class="text-[10px] uppercase tracking-widest opacity-70">War Stars</p>
            <p class="text-2xl font-black text-pink-400 leading-tight">{{ player.warStars }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Heroes with Equipment -->
    <div v-if="player.heroes && player.heroes.length" class="bg-gradient-to-b from-[#0A0918] to-[#15122b] p-8 space-y-10 rounded-3xl border-2 border-white/5 shadow-2xl overflow-hidden relative">
      <!-- Background Ambient Glow -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <h2 class="text-4xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 drop-shadow-lg tracking-widest uppercase">
        {{ player.name }} 🦸 HEROES & EQUIPMENT
      </h2>
<div class="flex flex-wrap justify-center w-full gap-4">
    <div v-for="hero in [...player.heroes].sort((a,b) => b.level - a.level)" :key="hero.name"
         class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-6 flex flex-col items-center shadow-2xl
                hover:shadow-pink-600 hover:scale-105 transition-all duration-300 transform">
      <!-- Hero Level Badge -->
      <span class="absolute top-3 left-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
        Lvl {{ hero.level }} / {{ hero.maxLevel }}
      </span>
      <!-- Hero Image -->
      <img :src="heroesData[hero.name] || 'https://via.placeholder.com/128/cccccc/999999?text=?'"
           :alt="hero.name"
           class="w-36 h-36 object-contain mb-5 rounded-xl shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-pink-500" />
      <!-- Hero Name -->
      <span class="font-extrabold text-xl text-center mb-6 text-white drop-shadow-lg">{{ hero.name }}</span>
      <!-- Hero Equipment -->
      <div v-if="equipmentGroupedByHero[hero.name]" class="grid grid-cols-4 gap-4 w-full">
        <div v-for="eq in [...equipmentGroupedByHero[hero.name]].sort((a,b)=>b.level-a.level)" :key="eq.name"
             class="relative flex flex-col items-center rounded-2xl p-2 group cursor-pointer transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-blue-400"
:style="{
  background: eq.level === 0
    ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' // رصاصي فاتح
    : eq.maxLevel <= 18
      ? `linear-gradient(135deg, #60a5fa ${eq.level/eq.maxLevel*100}%, #1e3a8a 100%)`
      : `linear-gradient(135deg, #c084fc ${eq.level/eq.maxLevel*100}%, #7e22ce 100%)`
}">
          <!-- Level Badge -->
<span
  class="absolute bottom-2 left-1 text-white text-[10px] font-bold px-1 py-[1px] rounded-[5px] shadow"
  :class="eq.level === eq.maxLevel ? 'bg-yellow-500 text-black' : 'bg-black text-white'"
>
  {{ eq.level }}
</span>
          <!-- Equipment Image -->
          <img :src="getHeroEquipmentImageUrl(eq.name) || defaultEquipmentImage"
               :alt="eq.name"
               @error="handleImageError"
               class="w-12 h-12 object-cover rounded transition-transform duration-300 group-hover:scale-125"
               :class="{ 'opacity-90 grayscale': eq.level === 0 }" />
          <!-- Overlay Name + Tooltip -->
          <div class="absolute inset-0 bg-black bg-opacity-60 text-white text-[10px] font-bold flex flex-col items-center justify-center text-center rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span>{{ eq.name }}</span>
            <span class="text-[9px] opacity-80">Lvl {{ eq.level }} / {{ eq.maxLevel }}</span>
            <span class="text-[8px] opacity-60">{{ eq.village === 'home' ? 'Home' : 'Builder Base' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    <!-- Clan Info -->
    <div v-if="player.clan" class="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6 rounded-3xl shadow-2xl border-4 border-blue-500 overflow-hidden relative group">
      <!-- Shine -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
      </div>

      <div class="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <!-- Clan Badge -->
        <div class="relative">
          <div class="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 text-center"></div>
          <img :src="player.clan.badgeUrls.large" alt="Clan Badge" class="relative w-28 h-28 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300" />
        </div>

        <!-- Clan Info -->
        <div class="flex-1 text-white text-center md:text-left">
          <h2 class="text-3xl md:text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 drop-shadow-lg uppercase tracking-wider">
            🏰 {{ player.clan.name }}
          </h2>
          <p class="text-sm font-mono text-blue-200 mb-4 bg-black/20 inline-block px-3 py-1 rounded-full border border-white/10">{{ player.clan.tag }}</p>

          <div>
            <span class="bg-yellow-400/20 backdrop-blur-md px-6 py-2 rounded-xl border border-yellow-400/30 text-yellow-300 font-black text-xl shadow-lg">
              LEVEL {{ player.clan.clanLevel }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Town Hall & Builder Base -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Home Base -->
      <div class="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 p-6 rounded-3xl shadow-2xl border-4 border-green-500 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
        <h2 class="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-green-300 drop-shadow-lg uppercase tracking-widest">
          🏡 HOME BASE
        </h2>

        <div class="space-y-4">
          <!-- Town Hall -->
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p class="text-green-200 text-sm mb-1">Town Hall</p>
            <div class="flex items-center justify-between">
              <span class="text-white font-black text-2xl">Level {{ player.townHallLevel }}</span>
              <span class="text-yellow-300 text-sm">⚙️ Weapon: {{ player.townHallWeaponLevel }}</span>
            </div>
          </div>

          <!-- League -->
          <div v-if="player.league" class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center gap-4">
            <img :src="player.league.iconUrls?.medium" alt="League" class="w-16 h-16 drop-shadow-xl" />
            <div class="flex-1">
              <p class="text-green-200 text-sm">League</p>
              <p class="text-white font-bold text-lg">{{ player.league.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Builder Base -->
      <div class="bg-gradient-to-br from-orange-900 via-red-800 to-pink-900 p-6 rounded-3xl shadow-2xl border-4 border-orange-500 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
        <h2 class="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-300 drop-shadow-lg uppercase tracking-widest">
          🛠️ BUILDER BASE
        </h2>

        <div class="space-y-4">
          <!-- Builder Hall -->
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p class="text-orange-200 text-sm mb-1">Builder Hall</p>
            <span class="text-white font-black text-2xl">Level {{ player.builderHallLevel }}</span>
          </div>

          <!-- Trophies -->
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p class="text-orange-200 text-sm mb-2">Trophies</p>
            <div class="flex items-center justify-between">
              <span class="text-white font-bold text-xl">🏆 {{ player.builderBaseTrophies }}</span>
              <span class="text-yellow-300 text-sm">Best: {{ player.bestBuilderBaseTrophies }}</span>
            </div>
          </div>

          <!-- League -->
          <div v-if="player.builderBaseLeague" class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p class="text-orange-200 text-sm mb-1">League</p>
            <p class="text-white font-bold">{{ player.builderBaseLeague.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend Statistics -->
    <div v-if="player.legendStatistics" class="bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-600 p-6 rounded-3xl shadow-2xl border-4 border-yellow-400 relative overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
      <h2 class="text-3xl font-black mb-6 text-center text-white drop-shadow-lg uppercase tracking-widest">
        👑 LEGEND STATISTICS
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Current Trophies -->
        <div class="bg-white/20 backdrop-blur-md rounded-xl p-5 border border-white/30 text-center">
          <p class="text-yellow-100 text-sm mb-2">Current</p>
          <p class="text-white font-black text-3xl">{{ player.legendStatistics.legendTrophies }}</p>
          <p class="text-yellow-200 text-xs mt-1">Trophies</p>
        </div>

        <!-- Best Season -->
        <div v-if="player.legendStatistics.bestSeason" class="bg-white/20 backdrop-blur-md rounded-xl p-5 border border-white/30 text-center">
          <p class="text-yellow-100 text-sm mb-2">Best Season</p>
          <p class="text-white font-black text-2xl">Rank #{{ player.legendStatistics.bestSeason.rank }}</p>
          <p class="text-yellow-200 text-xs mt-1">{{ player.legendStatistics.bestSeason.trophies }} Trophies</p>
        </div>

        <!-- Best Builder -->
        <div v-if="player.legendStatistics.bestBuilderBaseSeason" class="bg-white/20 backdrop-blur-md rounded-xl p-5 border border-white/30 text-center">
          <p class="text-yellow-100 text-sm mb-2">Best Builder</p>
          <p class="text-white font-black text-2xl">Rank #{{ player.legendStatistics.bestBuilderBaseSeason.rank }}</p>
          <p class="text-yellow-200 text-xs mt-1">{{ player.legendStatistics.bestBuilderBaseSeason.trophies }} Trophies</p>
        </div>
      </div>
    </div>

    <!-- Role & Achievements -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile -->
      <div class="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 rounded-3xl shadow-2xl border-4 border-indigo-500 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
        <h2 class="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300 drop-shadow-lg uppercase tracking-widest">
          👤 PROFILE
        </h2>

        <div class="space-y-3">
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <span class="text-indigo-200">Role</span>
            <span class="text-white font-bold capitalize">{{ player.role }}</span>
          </div>

          <div class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <span class="text-indigo-200">War Preference</span>
            <span class="text-white font-bold">{{ player.warPreference === 'in' ? '⚔️ Fights' : '🛡️ Skips' }}</span>
          </div>

          <div class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p class="text-indigo-200 text-sm mb-2">Donations</p>
            <div class="flex justify-between items-center">
              <span class="text-green-400 font-bold text-lg">↑ {{ player.donations }}</span>
              <span class="text-blue-400 font-bold text-lg">↓ {{ player.donationsReceived }}</span>
            </div>
          </div>

          <div class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <span class="text-indigo-200">Clan Capital</span>
            <span class="text-yellow-400 font-bold text-lg">{{ formatNumber(player.clanCapitalContributions) }}</span>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 p-6 rounded-3xl shadow-2xl border-4 border-pink-500 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
        <h2 class="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 drop-shadow-lg uppercase tracking-widest">
          🏆 ACHIEVEMENTS
        </h2>

        <div class="space-y-4">
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
            <p class="text-pink-200 text-sm mb-2">Total Achievements</p>
            <p class="text-white font-black text-5xl">{{ player.achievements?.length }}</p>
          </div>

          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
            <p class="text-pink-200 text-sm mb-2">Stars Earned</p>
            <p class="text-yellow-400 font-black text-5xl">⭐ {{ player.achievements?.reduce((sum, a) => sum + a.stars, 0) }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- ⚔️ HOME VILLAGE TROOPS -->
    <div v-if="player.troops && player.troops.filter(t => t.village === 'home' && !isSuperTroop(t.name) && !isSiegeMachine(t.name) && !isHeroPet(t.name)).length > 0"
         class="bg-gradient-to-br from-red-900 via-red-800 to-orange-900 p-8 rounded-3xl shadow-2xl border-4 border-red-600">
      <h2 class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-300 to-pink-300 drop-shadow-lg">
        {{ player.name }} ⚔️ HOME VILLAGE TROOPS
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player.troops.filter(t => t.village === 'home' && !isSuperTroop(t.name) && !isSiegeMachine(t.name) && !isHeroPet(t.name))"
             :key="troop.name"
             class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-red-500">
          <div class="absolute top-1 left-1 z-10">
            <span class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
                  :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
                 class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
                 :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3 class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-yellow-300 transition-colors">{{ troop.name }}</h3>
          <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
                 :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-green-400 to-green-600'"
                 :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⭐ SUPER TROOPS -->
    <div v-if="player.troops && player.troops.filter(t => isSuperTroop(t.name)).length > 0"
         class="bg-gradient-to-br from-yellow-900 via-amber-800 to-orange-800 p-8 rounded-3xl shadow-2xl border-4 border-yellow-600">
      <h2 class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-300 drop-shadow-lg">
        {{ player.name }} ⭐ SUPER TROOPS
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player.troops.filter(t => isSuperTroop(t.name))" :key="troop.name"
             class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-yellow-500">
          <div v-if="troop.superTroopIsActive" class="absolute -top-1 -right-1 z-10">
            <span class="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full shadow-md animate-pulse">ACTIVE</span>
          </div>
          <div class="absolute top-1 left-1 z-10">
            <span class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
                  :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
                 class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
                 :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3 class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-yellow-300 transition-colors">{{ troop.name }}</h3>
          <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
                 :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-orange-400 to-yellow-600'"
                 :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🏗️ SIEGE MACHINES -->
    <div v-if="player.troops && player.troops.filter(t => isSiegeMachine(t.name)).length > 0"
         class="bg-gradient-to-br from-gray-800 via-gray-700 to-zinc-900 p-8 rounded-3xl shadow-2xl border-4 border-gray-500">
      <h2 class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-zinc-400 to-slate-200 drop-shadow-lg">
        {{ player.name }} 🏗️ SIEGE MACHINES
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player.troops.filter(t => isSiegeMachine(t.name))" :key="troop.name"
             class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-zinc-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-zinc-500">
          <div class="absolute top-1 left-1 z-10">
            <span class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
                  :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
                 class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
                 :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3 class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-zinc-300 transition-colors">{{ troop.name }}</h3>
          <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
                 :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-gray-400 to-zinc-600'"
                 :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🐾 HERO PETS -->
    <div v-if="player.troops && player.troops.filter(t => isHeroPet(t.name)).length > 0"
         class="bg-gradient-to-br from-teal-900 via-emerald-800 to-cyan-900 p-8 rounded-3xl shadow-2xl border-4 border-teal-600">
      <h2 class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 drop-shadow-lg">
        {{ player.name }} 🐾 HERO PETS
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player.troops.filter(t => isHeroPet(t.name))" :key="troop.name"
             class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-teal-500">
          <div class="absolute top-1 left-1 z-10">
            <span class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
                  :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
                 class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
                 :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3 class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-teal-300 transition-colors">{{ troop.name }}</h3>
          <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
                 :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-teal-400 to-emerald-600'"
                 :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🛠️ BUILDER BASE TROOPS -->
    <div v-if="player.troops && player.troops.filter(t => t.village === 'builderBase').length > 0"
         class="bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 p-8 rounded-3xl shadow-2xl border-4 border-orange-600">
      <h2 class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-300 to-amber-300 drop-shadow-lg leading-normal">
        🛠️ BUILDER BASE TROOPS
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player.troops.filter(t => t.village === 'builderBase')" :key="troop.name"
             class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-orange-500">
          <div class="absolute top-1 left-1 z-10">
            <span class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
                  :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
                 class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
                 :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3 class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-orange-300 transition-colors">{{ troop.name }}</h3>
          <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
                 :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-orange-400 to-amber-600'"
                 :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>


    <!-- Home Village Spells -->
    <div v-if="player.spells && player.spells.filter(s => s.village === 'home').length > 0" class="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8 rounded-3xl shadow-2xl border-4 border-purple-600">
      <h2 class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 drop-shadow-lg">
        {{ player.name }} 🔮 HOME VILLAGE SPELLS
      </h2>

      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        <div
          v-for="spell in player.spells.filter(s => s.village === 'home')"
          :key="spell.name"
          class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-purple-500"
        >
          <!-- Level Badge -->
          <div class="absolute top-1 left-1 z-10">
            <span
              class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
              :class="spell.level === spell.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'"
            >
              {{ spell.level }}/{{ spell.maxLevel }}
            </span>
          </div>

          <!-- Spell Image -->
          <div class="flex justify-center items-center h-14 mb-1">
            <img
              :src="getSpellImageUrl(spell.name)"
              :alt="spell.name"
              class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
              :class="{ 'opacity-50 grayscale': spell.level === 0 }"
            />
          </div>

          <!-- Spell Name -->
          <h3 class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-cyan-300 transition-colors">
            {{ spell.name }}
          </h3>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="spell.level === spell.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-blue-400 to-purple-600'"
              :style="{ width: `${(spell.level / spell.maxLevel) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Builder Base Spells (if any exist) -->
    <div v-if="player.spells && player.spells.filter(s => s.village === 'builderBase').length > 0" class="bg-gradient-to-br from-cyan-900 via-teal-800 to-emerald-900 p-8 rounded-3xl shadow-2xl border-4 border-cyan-600">
      <h2 class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 drop-shadow-lg">
        🔮 BUILDER BASE SPELLS
      </h2>

      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-3">
        <div
          v-for="spell in player.spells.filter(s => s.village === 'builderBase')"
          :key="spell.name"
          class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-cyan-500"
        >
          <!-- Level Badge -->
          <div class="absolute top-1 left-1 z-10">
            <span
              class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
              :class="spell.level === spell.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'"
            >
              {{ spell.level }}/{{ spell.maxLevel }}
            </span>
          </div>

          <!-- Spell Image -->
          <div class="flex justify-center items-center h-14 mb-1">
            <img
              :src="getSpellImageUrl(spell.name)"
              :alt="spell.name"
              class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
              :class="{ 'opacity-50 grayscale': spell.level === 0 }"
            />
          </div>

          <!-- Spell Name -->
          <h3 class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-cyan-300 transition-colors">
            {{ spell.name }}
          </h3>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="spell.level === spell.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-cyan-400 to-teal-600'"
              :style="{ width: `${(spell.level / spell.maxLevel) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Heroes -->
    <!-- Labels -->
    <div v-if="player.labels && player.labels.length > 0" class="bg-gradient-to-br from-teal-900 via-emerald-900 to-green-900 p-6 rounded-3xl shadow-2xl border-4 border-teal-500">
      <h2 class="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-green-300 drop-shadow-lg">
        🏷️ LABELS
      </h2>
      <div class="flex flex-wrap justify-center gap-3">
        <div v-for="label in player.labels" :key="label.id"
             class="group flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/50">
          <img :src="label.iconUrls.small" class="w-8 h-8 drop-shadow-lg group-hover:rotate-12 transition-transform" :alt="label.name" />
          <span class="text-white font-bold text-sm">{{ label.name }}</span>
        </div>
      </div>
    </div>

    <!-- Player House -->
    <div v-if="player.playerHouse" class="bg-gradient-to-br from-indigo-900 via-blue-900 to-cyan-900 p-6 rounded-3xl shadow-2xl border-4 border-indigo-500">
      <h2 class="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 drop-shadow-lg">
        🏠 PLAYER HOUSE
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="elem in player.playerHouse.elements" :key="elem.type"
             class="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col items-center">
          <p class="text-indigo-200 text-xs uppercase tracking-widest mb-1">{{ elem.type }}</p>
          <p class="text-white font-black text-xl">#{{ elem.id }}</p>
        </div>
      </div>
    </div>
  </div>
  <!-- ---------------------------------- -->
</template>
<script setup>
import { ref, onMounted , computed } from 'vue'
import { getHeroEquipmentImageUrl } from '../utils/heroEquipmentImages'
import { heroEquipmentByHero } from '../utils/heroEquipmentByHero'
import { heroesData } from '../utils/heroesData'
import { getTroopImageUrl } from "../utils/troopsImage";
import { getSpellImageUrl } from "../utils/SpellImage";

console.log(heroesData["Barbarian King"])
import { useRoute } from 'vue-router'
import axios from 'axios'
import { getPlayer } from '../utils/apiService'   // 👈 هنا نستدعيه من الـ service
const formatNumber = (num) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num
}
const route = useRoute()
const tag = route.params.tag   // 👈 ده اللي جايلك من الـ router
const player = ref(null)
const loading = ref(true)
const error = ref(false)
onMounted(async () => {
  try {
    const res = await getPlayer(tag)   // 👈 بدل axios المباشر
    player.value = res.data
  } catch (err) {
    console.error('Error loading player:', err)
    error.value = true
  } finally {
    loading.value = false
  }
})
const props = defineProps({
  player: Object,
})

const defaultEquipmentImage = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23374151' rx='8'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%239CA3AF' dy='.3em' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E";

const handleImageError = (event) => {
  event.target.src = defaultEquipmentImage
}

// Categories classification
const isSuperTroop = (name) => {
  const superTroops = [
    "Super Barbarian", "Super Archer", "Super Giant", "Sneaky Goblin", "Super Wall Breaker",
    "Rocket Balloon", "Super Wizard", "Super Dragon", "Inferno Dragon", "Super Minion",
    "Super Valkyrie", "Super Witch", "Ice Hound", "Super Bowler", "Super Miner",
    "Super Hog Rider", "Super Yeti"
  ];
  return superTroops.includes(name);
};

const isSiegeMachine = (name) => {
  const siegeMachines = [
    "Wall Wrecker", "Battle Blimp", "Stone Slammer", "Siege Barracks",
    "Log Launcher", "Flame Flinger", "Battle Drill", "Troop Launcher"
  ];
  return siegeMachines.includes(name);
};

const isHeroPet = (name) => {
  const heroPets = [
    "L.A.S.S.I", "Electro Owl", "Mighty Yak", "Unicorn", "Frosty", "Diggy",
    "Poison Lizard", "Phoenix", "Spirit Fox", "Angry Jelly", "Sneezy"
  ];
  return heroPets.includes(name);
};
// تجهيز المعدات مقسمة حسب الأبطال
const equipmentGroupedByHero = computed(() => {
  if (!player.value?.heroEquipment) return {}
  const result = {}
  for (const hero in heroEquipmentByHero) {
    // قائمة كل المعدات الخاصة بالبطل
    result[hero] = heroEquipmentByHero[hero].map(eqName => {
      // دور على العدة في بيانات اللاعب
      const found = player.value.heroEquipment.find(e => e.name === eqName)
      if (found) {
        return found // لو موجودة، رجعها زي ما هي
      }
      // لو مش موجودة، رجع object افتراضي
      return {
        name: eqName,
        level: 0,
        maxLevel: 27,
        village: "home"
      }
    })
  }
  return result
})
// onMounted(async () => {
//   try {
//     const res = await axios.get(`http://localhost:5000/api/player/${tag}`)
//     player.value = res.data
//     const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2))
//     const downloadAnchor = document.createElement("a")
//     downloadAnchor.setAttribute("href", dataStr)
//     downloadAnchor.setAttribute("download", "player.json")
//     document.body.appendChild(downloadAnchor)
//     downloadAnchor.click()
//     downloadAnchor.remove()
//   } catch (err) {
//     console.error("Error loading player:", err)
//     error.value = true
//   } finally {
//     loading.value = false
//   }
// })
// --------------------------------------
// const equipments = ref([])
// const heroes = ref([])
// onMounted(async () => {
//   try {
//     const res = await axios.get(`http://localhost:5000/api/player/${tag}`)
//     heroes.value = res.data.heroes || []
//   } catch (err) {
//     console.error("Error fetching heroes:", err)
//     error.value = true
//   } finally {
//     loading.value = false
//   }
// })
// const imageError = (event) => {
//   event.target.src = "https://via.placeholder.com/64/cccccc/999999?text=?"
// }
</script>
<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 8s ease infinite;
}
</style>