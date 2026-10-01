<template>
  <div v-if="loading" class="p-6 text-center bg-gray-50 min-h-screen flex flex-col justify-center items-center">
    <div class="animate-spin w-10 h-10 border-4 border-[#DC2626] border-t-transparent rounded-full mx-auto"></div>
    <p class="mt-4 text-[#0F172A]/60">Loading player data...</p>
  </div>
  <div v-else-if="error" class="text-[#DC2626] p-6 text-center">
    ❌ Failed to load player data. Please check the tag and try again.
  </div>
  <div v-else class="p-4 space-y-8 bg-gray-50">
    <!-- Player Header -->
    <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#DC2626]/40 group">
      <!-- Gradient Animated Background -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#DC2626] animate-gradient-x opacity-95">
      </div>
      <!-- Shine Effect -->
      <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out">
        </div>
      </div>
      <!-- Overlay Pattern -->
      <div
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay">
      </div>
      <!-- Content -->
      <div class="relative p-8 md:p-12 text-white flex flex-col md:flex-row items-center md:justify-between gap-6">
        <!-- Player Info -->
        <div class="text-center md:text-left">
          <h1
            class="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
            {{ player?.name }}
          </h1>
          <div class="mt-2 flex flex-wrap justify-center md:justify-start items-center gap-3">
            <span
              class="px-3 py-1 bg-[#DC2626]/30 backdrop-blur-md rounded-lg text-lg font-mono text-white border border-[#DC2626]/50">{{
                player?.tag }}</span>
            <span class="text-xl md:text-2xl font-bold text-white/80 opacity-90">Level {{ player?.expLevel }}</span>
          </div>
          <div
            class="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm md:text-base opacity-90 font-medium">
            <span class="flex items-center gap-1">🏆 {{ player?.trophies }}</span>
            <span class="flex items-center gap-1">⭐ {{ player?.warStars }} Stars</span>
            <span class="flex items-center gap-1">⚔️ {{ player?.attackWins }} Wins</span>
          </div>
        </div>
        <!-- Major Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div
            class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors shadow-inner">
            <p class="text-[10px] uppercase tracking-widest opacity-70">Best Cups</p>
            <p class="text-2xl font-black text-yellow-400 leading-tight">{{ player?.bestTrophies }}</p>
          </div>
          <div
            class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors shadow-inner">
            <p class="text-[10px] uppercase tracking-widest opacity-70">War Stars</p>
            <p class="text-2xl font-black text-[#DC2626] leading-tight">{{ player?.warStars }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Heroes with Equipment -->
    <div v-if="player?.heroes && player?.heroes.length"
      class="bg-white p-8 space-y-10 rounded-3xl border border-gray-200 shadow-md overflow-hidden relative">
      <h2
        class="text-3xl font-black text-center mb-10 text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-4">
        🦸 <span class="text-[#DC2626]">Heroes</span> & Equipment
      </h2>
      <div class="flex flex-wrap justify-center w-full gap-4">
        <div
          v-for="hero in [...player?.heroes].sort((a, b) => b.level - a.level).filter(h => h.name !== 'Battle Machine' && h.name !== 'Battle Copter')"
          :key="hero.name"
          class="relative bg-gray-50 border border-gray-200 rounded-3xl p-6 flex flex-col items-center shadow-sm hover:shadow-md hover:border-[#DC2626]/30 hover:scale-105 transition-all duration-300 transform">
          <!-- Hero Level Badge -->
          <span
            class="absolute top-3 left-3 bg-[#DC2626] text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            Lvl {{ hero.level }} / {{ hero.maxLevel }}
          </span>
          <!-- Hero Image -->
          <img :src="heroesData[hero.name] || 'https://via.placeholder.com/128/cccccc/999999?text=?'" :alt="hero.name"
            class="w-36 h-36 object-contain mb-5 rounded-xl shadow-md transition-transform duration-300 hover:scale-110" />
          <!-- Hero Name -->
          <span class="font-extrabold text-xl text-center mb-6 text-[#0F172A]">{{ hero.name }}</span>
          <!-- Hero Equipment -->
          <div v-if="equipmentGroupedByHero[hero.name]" class="grid grid-cols-4 gap-4 w-full">
            <div v-for="eq in [...equipmentGroupedByHero[hero.name]].sort((a, b) => b.level - a.level)" :key="eq.name"
              class="relative flex flex-col items-center rounded-2xl p-2 group cursor-pointer transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-blue-400"
              :style="{
                background: eq.level === 0
                  ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' // رصاصي فاتح
                  : eq.maxLevel <= 18
                    ? `linear-gradient(135deg, #60a5fa ${eq.level / eq.maxLevel * 100}%, #1e3a8a 100%)`
                    : `linear-gradient(135deg, #c084fc ${eq.level / eq.maxLevel * 100}%, #7e22ce 100%)`
              }">
              <!-- Level Badge -->
              <span class="absolute bottom-2 left-1 text-white text-[10px] font-bold px-1 py-[1px] rounded-[5px] shadow"
                :class="eq.level === eq.maxLevel ? 'bg-yellow-500 text-black' : 'bg-black text-white'">
                {{ eq.level }}
              </span>
              <!-- Equipment Image -->
              <img :src="getHeroEquipmentImageUrl(eq.name) || defaultEquipmentImage" :alt="eq.name"
                @error="handleImageError"
                class="w-12 h-12 object-cover rounded transition-transform duration-300 group-hover:scale-125"
                :class="{ 'opacity-90 grayscale': eq.level === 0 }" />
              <!-- Overlay Name + Tooltip -->
              <div
                class="absolute inset-0 bg-black bg-opacity-60 text-white text-[10px] font-bold flex flex-col items-center justify-center text-center rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
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
    <div v-if="player?.clan"
      class="bg-white p-6 rounded-3xl shadow-md border border-gray-200 overflow-hidden group hover:border-[#DC2626]/30 transition">
      <div class="flex flex-col md:flex-row items-center gap-6">
        <!-- Clan Badge -->
        <div class="relative">
          <img :src="player?.clan.badgeUrls.large" alt="Clan Badge"
            class="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
        </div>
        <!-- Clan Info -->
        <div class="flex-1 text-center md:text-left">
          <h2 class="text-3xl md:text-4xl font-black mb-2 text-[#0F172A] uppercase tracking-wider">
            🏰 <span class="text-[#DC2626]">{{ player?.clan.name }}</span>
          </h2>
          <p
            class="text-sm font-mono text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-full border border-gray-200">
            {{ player?.clan.tag }}</p>
          <div>
            <span class="bg-[#DC2626] px-6 py-2 rounded-xl text-white font-black text-lg shadow-sm">
              LEVEL {{ player?.clan.clanLevel }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- Town Hall & Builder Base -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Home Base -->
      <div class="bg-white p-6 rounded-3xl shadow-md border border-gray-200 group hover:border-[#DC2626]/30 transition">
        <h2
          class="text-2xl font-black mb-6 text-center text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-3">
          🏡 <span class="text-[#DC2626]">Home Base</span>
        </h2>
        <div class="space-y-4">
          <!-- Town Hall -->
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p class="text-gray-500 text-sm mb-1">Town Hall</p>
            <div class="flex items-center justify-between">
              <span class="text-[#0F172A] font-black text-2xl">Level {{ player?.townHallLevel }}</span>
              <span class="text-[#DC2626] text-sm font-bold">⚙️ Weapon: {{ player?.townHallWeaponLevel }}</span>
            </div>
          </div>
          <!-- League -->
          <div v-if="player?.league" class="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-4">
            <img :src="player?.league.iconUrls?.medium" alt="League" class="w-16 h-16 drop-shadow-lg" />
            <div class="flex-1">
              <p class="text-gray-500 text-sm">League</p>
              <p class="text-[#0F172A] font-bold text-lg">{{ player?.league.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Builder Base -->
      <div class="bg-white p-6 rounded-3xl shadow-md border border-gray-200 group hover:border-[#DC2626]/30 transition">
        <h2
          class="text-2xl font-black mb-6 text-center text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-3">
          🛠️ <span class="text-[#DC2626]">Builder Base</span>
        </h2>
        <div class="space-y-4">
          <!-- Builder Hall -->
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p class="text-gray-500 text-sm mb-1">Builder Hall</p>
            <span class="text-[#0F172A] font-black text-2xl">Level {{ player?.builderHallLevel }}</span>
          </div>
          <!-- Trophies -->
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p class="text-gray-500 text-sm mb-2">Trophies</p>
            <div class="flex items-center justify-between">
              <span class="text-[#0F172A] font-bold text-xl">🏆 {{ player?.builderBaseTrophies }}</span>
              <span class="text-[#DC2626] text-sm font-bold">Best: {{ player?.bestBuilderBaseTrophies }}</span>
            </div>
          </div>
          <!-- League -->
          <div v-if="player?.builderBaseLeague" class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p class="text-gray-500 text-sm mb-1">League</p>
            <p class="text-[#0F172A] font-bold">{{ player?.builderBaseLeague.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Legend Statistics -->
    <div v-if="player?.legendStatistics"
      class="bg-white p-6 rounded-3xl shadow-md border border-gray-200 border-l-4 border-l-[#DC2626] group hover:shadow-lg transition">
      <h2
        class="text-2xl font-black mb-6 text-center text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-3">
        👑 <span class="text-[#DC2626]">Legend Statistics</span>
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Current Trophies -->
        <div class="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
          <p class="text-gray-500 text-sm mb-2">Current</p>
          <p class="text-[#0F172A] font-black text-3xl">{{ player?.legendStatistics.legendTrophies }}</p>
          <p class="text-[#DC2626] text-xs mt-1 font-semibold">Trophies</p>
        </div>
        <!-- Best Season -->
        <div v-if="player?.legendStatistics.bestSeason"
          class="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
          <p class="text-gray-500 text-sm mb-2">Best Season</p>
          <p class="text-[#0F172A] font-black text-2xl">Rank #{{ player?.legendStatistics.bestSeason.rank }}</p>
          <p class="text-[#DC2626] text-xs mt-1 font-semibold">{{ player?.legendStatistics.bestSeason.trophies }}
            Trophies</p>
        </div>
        <!-- Best Builder -->
        <div v-if="player?.legendStatistics.bestBuilderBaseSeason"
          class="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
          <p class="text-gray-500 text-sm mb-2">Best Builder</p>
          <p class="text-[#0F172A] font-black text-2xl">Rank #{{ player?.legendStatistics.bestBuilderBaseSeason.rank }}
          </p>
          <p class="text-[#DC2626] text-xs mt-1 font-semibold">{{ player?.legendStatistics.bestBuilderBaseSeason.trophies
          }} Trophies</p>
        </div>
      </div>
    </div>
    <!-- Role & Achievements -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile -->
      <div class="bg-white p-6 rounded-3xl shadow-md border border-gray-200 group hover:border-[#DC2626]/30 transition">
        <h2
          class="text-2xl font-black mb-6 text-center text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-3">
          👤 <span class="text-[#DC2626]">Profile</span>
        </h2>
        <div class="space-y-3">
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 flex justify-between items-center">
            <span class="text-gray-500">Role</span>
            <span class="text-[#0F172A] font-bold capitalize">{{ player?.role }}</span>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 flex justify-between items-center">
            <span class="text-gray-500">War Preference</span>
            <span class="text-[#0F172A] font-bold">{{ player?.warPreference === 'in' ? '⚔️ Fights' : '🛡️ Skips'
            }}</span>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p class="text-gray-500 text-sm mb-2">Donations</p>
            <div class="flex justify-between items-center">
              <span class="text-[#0F172A] font-bold text-lg">↑ {{ player?.donations }}</span>
              <span class="text-[#DC2626] font-bold text-lg">↓ {{ player?.donationsReceived }}</span>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 flex justify-between items-center">
            <span class="text-gray-500">Clan Capital</span>
            <span class="text-[#DC2626] font-bold text-lg">{{ formatNumber(player?.clanCapitalContributions) }}</span>
          </div>
        </div>
      </div>
      <!-- Achievements -->
      <div class="bg-white p-6 rounded-3xl shadow-md border border-gray-200 group hover:border-[#DC2626]/30 transition">
        <h2
          class="text-2xl font-black mb-6 text-center text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-3">
          🏆 <span class="text-[#DC2626]">Achievements</span>
        </h2>
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <p class="text-gray-500 text-sm mb-2">Total Achievements</p>
            <p class="text-[#0F172A] font-black text-5xl">{{ player?.achievements?.length }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <p class="text-gray-500 text-sm mb-2">Stars Earned</p>
            <p class="text-[#DC2626] font-black text-5xl">⭐ {{player?.achievements?.reduce((sum, a) => sum + a.stars, 0)
            }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- ⚔️ HOME VILLAGE TROOPS -->
    <div
      v-if="player?.troops && player?.troops.filter(t => t.village === 'home' && !isSuperTroop(t.name) && !isSiegeMachine(t.name) && !isHeroPet(t.name)).length > 0"
      class="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
      <h2 class="text-2xl font-black text-center mb-8 text-[#0F172A] border-b border-gray-100 pb-4">
        ⚔️ <span class="text-[#DC2626]">Home Village Troops</span>
        <span class="text-base block mt-2 text-gray-500 font-medium">
          (باقي {{getRemainingUpgrades(player?.troops.filter(t => t.village === 'home' && !isSuperTroop(t.name) &&
            !isSiegeMachine(t.name) && !isHeroPet(t.name)))}} ترقية)
        </span>
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div
          v-for="troop in player?.troops.filter(t => t.village === 'home' && !isSuperTroop(t.name) && !isSiegeMachine(t.name) && !isHeroPet(t.name))"
          :key="troop.name"
          class="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md hover:border-[#DC2626]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
          <div class="absolute top-1 left-1 z-10">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400 text-black' : 'bg-[#0F172A] text-white'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
              class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 drop-shadow-md"
              :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3
            class="text-center text-[#0F172A] font-bold text-[10px] mb-1 truncate group-hover:text-[#DC2626] transition-colors">
            {{ troop.name }}</h3>
          <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400' : 'bg-[#DC2626]'"
              :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- ⭐ SUPER TROOPS -->
    <div v-if="player?.troops && player?.troops.filter(t => isSuperTroop(t.name)).length > 0"
      class="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
      <h2 class="text-2xl font-black text-center mb-8 text-[#0F172A] border-b border-gray-100 pb-4">
        ⭐ <span class="text-[#DC2626]">Super Troops</span>
        <span class="text-base block mt-2 text-gray-500 font-medium">(باقي {{
          getRemainingUpgrades(player?.troops.filter(t => isSuperTroop(t.name)))}} ترقية)</span>
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player?.troops.filter(t => isSuperTroop(t.name))" :key="troop.name"
          class="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md hover:border-[#DC2626]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
          <div v-if="troop.superTroopIsActive" class="absolute -top-1 -right-1 z-10">
            <span
              class="bg-[#DC2626] text-white text-[8px] font-black px-1 py-0.5 rounded-full shadow-md animate-pulse">ACTIVE</span>
          </div>
          <div class="absolute top-1 left-1 z-10">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400 text-black' : 'bg-[#0F172A] text-white'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
              class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 drop-shadow-md"
              :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3
            class="text-center text-[#0F172A] font-bold text-[10px] mb-1 truncate group-hover:text-[#DC2626] transition-colors">
            {{ troop.name }}</h3>
          <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400' : 'bg-[#DC2626]'"
              :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 🏗️ SIEGE MACHINES -->
    <div v-if="player?.troops && player?.troops.filter(t => isSiegeMachine(t.name)).length > 0"
      class="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
      <h2 class="text-2xl font-black text-center mb-8 text-[#0F172A] border-b border-gray-100 pb-4">
        🏗️ <span class="text-[#DC2626]">Siege Machines</span>
        <span class="text-base block mt-2 text-gray-500 font-medium">(باقي {{
          getRemainingUpgrades(player?.troops.filter(t => isSiegeMachine(t.name)))}} ترقية)</span>
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player?.troops.filter(t => isSiegeMachine(t.name))" :key="troop.name"
          class="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md hover:border-[#DC2626]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
          <div class="absolute top-1 left-1 z-10">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400 text-black' : 'bg-[#0F172A] text-white'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
              class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 drop-shadow-md"
              :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3
            class="text-center text-[#0F172A] font-bold text-[10px] mb-1 truncate group-hover:text-[#DC2626] transition-colors">
            {{ troop.name }}</h3>
          <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400' : 'bg-[#DC2626]'"
              :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 🐾 HERO PETS -->
    <div v-if="player?.troops && player?.troops.filter(t => isHeroPet(t.name)).length > 0"
      class="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
      <h2 class="text-2xl font-black text-center mb-8 text-[#0F172A] border-b border-gray-100 pb-4">
        🐾 <span class="text-[#DC2626]">Hero Pets</span>
        <span class="text-base block mt-2 text-gray-500 font-medium">(باقي {{
          getRemainingUpgrades(player?.troops.filter(t => isHeroPet(t.name)))}} ترقية)</span>
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player?.troops.filter(t => isHeroPet(t.name))" :key="troop.name"
          class="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md hover:border-[#DC2626]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
          <div class="absolute top-1 left-1 z-10">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400 text-black' : 'bg-[#0F172A] text-white'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
              class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 drop-shadow-md"
              :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3
            class="text-center text-[#0F172A] font-bold text-[10px] mb-1 truncate group-hover:text-[#DC2626] transition-colors">
            {{ troop.name }}</h3>
          <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400' : 'bg-[#DC2626]'"
              :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 🛠️ BUILDER BASE TROOPS -->
    <div v-if="player?.troops && player?.troops.filter(t => t.village === 'builderBase').length > 0"
      class="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
      <h2 class="text-2xl font-black text-center mb-8 text-[#0F172A] border-b border-gray-100 pb-4">
        🛠️ <span class="text-[#DC2626]">Builder Base Troops</span>
        <span class="text-base block mt-2 text-gray-500 font-medium">(باقي {{
          getRemainingUpgrades(player?.troops.filter(t => t.village === 'builderBase'))}} ترقية)</span>
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        <div v-for="troop in player?.troops.filter(t => t.village === 'builderBase')" :key="troop.name"
          class="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md hover:border-[#DC2626]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
          <div class="absolute top-1 left-1 z-10">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400 text-black' : 'bg-[#0F172A] text-white'">
              {{ troop.level }}/{{ troop.maxLevel }}
            </span>
          </div>
          <div class="flex justify-center items-center h-14 mb-1">
            <img :src="getTroopImageUrl(troop.name) || '/Clans/troops/default.png'" :alt="troop.name"
              class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 drop-shadow-md"
              :class="{ 'opacity-50 grayscale': troop.level === 0 }" />
          </div>
          <h3
            class="text-center text-[#0F172A] font-bold text-[10px] mb-1 truncate group-hover:text-[#DC2626] transition-colors">
            {{ troop.name }}</h3>
          <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="troop.level === troop.maxLevel ? 'bg-yellow-400' : 'bg-[#DC2626]'"
              :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>
    <h2
      class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#DC2626] drop-shadow-lg">
      {{ player?.name }} ⭐ SUPER TROOPS
      <span class="text-2xl block mt-2 text-white/80">
        (باقي {{getRemainingUpgrades(player?.troops.filter(t => isSuperTroop(t.name)))}} ترقية)
      </span>
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      <div v-for="troop in player?.troops.filter(t => isSuperTroop(t.name))" :key="troop.name"
        class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-yellow-500">
        <div v-if="troop.superTroopIsActive" class="absolute -top-1 -right-1 z-10">
          <span
            class="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full shadow-md animate-pulse">ACTIVE</span>
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
        <h3
          class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-yellow-300 transition-colors">
          {{ troop.name }}</h3>
        <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-orange-400 to-yellow-600'"
            :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- 🏗️ SIEGE MACHINES -->
  <div v-if="siegeMachines.length > 0" class="bg-[#0F172A] p-8 rounded-3xl shadow-2xl border-4 border-white/10">
    <h2
      class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-lg">
      {{ player?.name }} 🏗️ SIEGE MACHINES
      <span class="text-2xl block mt-2 text-white/80">
        (باقي {{ getRemainingUpgrades(siegeMachines) }} ترقية)
      </span>
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      <div v-for="troop in siegeMachines" :key="troop.name"
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
        <h3
          class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-zinc-300 transition-colors">
          {{ troop.name }}</h3>
        <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-gray-400 to-zinc-600'"
            :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- 🐾 HERO PETS -->
  <div v-if="player?.troops && player?.troops.filter(t => isHeroPet(t.name)).length > 0"
    class="bg-[#1e293b] p-8 rounded-3xl shadow-2xl border-4 border-[#DC2626]/30">
    <h2
      class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#DC2626] drop-shadow-lg">
      {{ player?.name }} 🐾 HERO PETS
      <span class="text-2xl block mt-2 text-white/80">
        (باقي {{getRemainingUpgrades(player?.troops.filter(t => isHeroPet(t.name)))}} ترقية)
      </span>
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      <div v-for="troop in player?.troops.filter(t => isHeroPet(t.name))" :key="troop.name"
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
        <h3
          class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-teal-300 transition-colors">
          {{ troop.name }}</h3>
        <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-teal-400 to-emerald-600'"
            :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- 🛠️ BUILDER BASE TROOPS -->
  <div v-if="player?.troops && player?.troops.filter(t => t.village === 'builderBase').length > 0"
    class="bg-[#0F172A] p-8 rounded-3xl shadow-2xl border-4 border-[#DC2626]/40">
    <h2
      class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#DC2626] drop-shadow-lg leading-normal">
      🛠️ BUILDER BASE TROOPS
      <span class="text-2xl block mt-2 text-white/80">
        (باقي {{getRemainingUpgrades(player?.troops.filter(t => t.village === 'builderBase'))}} ترقية)
      </span>
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      <div v-for="troop in player?.troops.filter(t => t.village === 'builderBase')" :key="troop.name"
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
        <h3
          class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-orange-300 transition-colors">
          {{ troop.name }}</h3>
        <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="troop.level === troop.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-orange-400 to-amber-600'"
            :style="{ width: `${(troop.level / troop.maxLevel) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- Home Village Spells -->
  <div v-if="player?.troops && player?.troops.filter(s => s.village === 'home').length > 0"
    class="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
    <h2 class="text-2xl font-black text-center mb-8 text-[#0F172A] border-b border-gray-100 pb-4">
      🔮 <span class="text-[#DC2626]">Home Village Spells</span>
      <span class="text-base block mt-2 text-gray-500 font-medium">(باقي {{getRemainingUpgrades(player?.spells.filter(s => s.village === 'home'))}} ترقية)</span>
    </h2>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
      <div v-for="spell in player?.spells.filter(s => s.village === 'home')" :key="spell.name"
        class="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md hover:border-[#DC2626]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
        <!-- Level Badge -->
        <div class="absolute top-1 left-1 z-10">
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
            :class="spell.level === spell.maxLevel ? 'bg-yellow-400 text-black' : 'bg-[#0F172A] text-white'">
            {{ spell.level }}/{{ spell.maxLevel }}
          </span>
        </div>
        <!-- Spell Image -->
        <div class="flex justify-center items-center h-14 mb-1">
          <img :src="getSpellImageUrl(spell.name)" :alt="spell.name"
            class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 drop-shadow-md"
            :class="{ 'opacity-50 grayscale': spell.level === 0 }" />
        </div>
        <!-- Spell Name -->
        <h3
          class="text-center text-[#0F172A] font-bold text-[10px] mb-1 truncate group-hover:text-[#DC2626] transition-colors">
          {{ spell.name }}
        </h3>
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="spell.level === spell.maxLevel ? 'bg-yellow-400' : 'bg-[#DC2626]'"
            :style="{ width: `${(spell.level / spell.maxLevel) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- Builder Base Spells -->
  <div v-if="player?.spells   && player?.spells.filter(s => s.village === 'builderBase').length > 0"
    class="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
    <h2 class="text-2xl font-black text-center mb-8 text-[#0F172A] border-b border-gray-100 pb-4">
      🔮 <span class="text-[#DC2626]">Builder Base Spells</span>
      <span class="text-base block mt-2 text-gray-500 font-medium">(باقي {{getRemainingUpgrades(player?.spells.filter(s => s.village === 'builderBase'))}} ترقية)</span>
    </h2>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-3">
      <div v-for="spell in player?.spells.filter(s => s.village === 'builderBase')" :key="spell.name"
        class="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md hover:border-[#DC2626]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
        <!-- Level Badge -->
        <div class="absolute top-1 left-1 z-10">
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
            :class="spell.level === spell.maxLevel ? 'bg-yellow-400 text-black' : 'bg-[#0F172A] text-white'">
            {{ spell.level }}/{{ spell.maxLevel }}
          </span>
        </div>
        <!-- Spell Image -->
        <div class="flex justify-center items-center h-14 mb-1">
          <img :src="getSpellImageUrl(spell.name)" :alt="spell.name"
            class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 drop-shadow-md"
            :class="{ 'opacity-50 grayscale': spell.level === 0 }" />
        </div>
        <!-- Spell Name -->
        <h3
          class="text-center text-[#0F172A] font-bold text-[10px] mb-1 truncate group-hover:text-[#DC2626] transition-colors">
          {{ spell.name }}
        </h3>
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="spell.level === spell.maxLevel ? 'bg-yellow-400' : 'bg-[#DC2626]'"
            :style="{ width: `${(spell.level / spell.maxLevel) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
  <h2
    class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#DC2626] drop-shadow-lg">
    {{ player?.name }} 🔮 HOME VILLAGE SPELLS
    <span class="text-2xl block mt-2 text-white/80">
      (باقي {{getRemainingUpgrades(player?.spells.filter(s => s.village === 'home'))}} ترقية)
    </span>
  </h2>
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
    <div v-for="spell in player?.spells.filter(s => s.village === 'home')" :key="spell.name"
      class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-purple-500">
      <!-- Level Badge -->
      <div class="absolute top-1 left-1 z-10">
        <span class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
          :class="spell.level === spell.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'">
          {{ spell.level }}/{{ spell.maxLevel }}
        </span>
      </div>
      <!-- Spell Image -->
      <div class="flex justify-center items-center h-14 mb-1">
        <img :src="getSpellImageUrl(spell.name)" :alt="spell.name"
          class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
          :class="{ 'opacity-50 grayscale': spell.level === 0 }" />
      </div>
      <!-- Spell Name -->
      <h3
        class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-cyan-300 transition-colors">
        {{ spell.name }}
      </h3>
      <!-- Progress Bar -->
      <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500"
          :class="spell.level === spell.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-blue-400 to-purple-600'"
          :style="{ width: `${(spell.level / spell.maxLevel) * 100}%` }"></div>
      </div>
    </div>
  </div>
  <!-- Builder Base Spells (if any exist) -->
  <div v-if="player?.spells && player?.spells.filter(s => s.village === 'builderBase').length > 0"
    class="bg-[#0F172A] p-8 rounded-3xl shadow-2xl border-4 border-white/10">
    <h2
      class="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-lg">
      🔮 BUILDER BASE SPELLS
      <span class="text-2xl block mt-2 text-white/80">
        (باقي {{getRemainingUpgrades(player?.spells.filter(s => s.village === 'builderBase'))}} ترقية)
      </span>
    </h2>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-3">
      <div v-for="spell in player?.spells.filter(s => s.village === 'builderBase')" :key="spell.name"
        class="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-black/90 backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 hover:border-cyan-500">
        <!-- Level Badge -->
        <div class="absolute top-1 left-1 z-10">
          <span class="text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md"
            :class="spell.level === spell.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-black/70'">
            {{ spell.level }}/{{ spell.maxLevel }}
          </span>
        </div>
        <!-- Spell Image -->
        <div class="flex justify-center items-center h-14 mb-1">
          <img :src="getSpellImageUrl(spell.name)" :alt="spell.name"
            class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-xl"
            :class="{ 'opacity-50 grayscale': spell.level === 0 }" />
        </div>
        <!-- Spell Name -->
        <h3
          class="text-center text-white font-bold text-[10px] mb-1 truncate group-hover:text-cyan-300 transition-colors">
          {{ spell.name }}
        </h3>
        <!-- Progress Bar -->
        <div class="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="spell.level === spell.maxLevel ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-cyan-400 to-teal-600'"
            :style="{ width: `${(spell.level / spell.maxLevel) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- Heroes -->
  <!-- Labels -->
  <div v-if="player?.labels && player?.labels.length > 0"
    class="bg-white p-6 rounded-3xl shadow-md border border-gray-200">
    <h2 class="text-2xl font-black mb-6 text-center text-[#0F172A] border-b border-gray-100 pb-3">
      🏷️ <span class="text-[#DC2626]">Labels</span>
    </h2>
    <div class="flex flex-wrap justify-center gap-3">
      <div v-for="label in player?.labels" :key="label.id"
        class="group flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl hover:scale-110 hover:border-[#DC2626]/40 transition-all duration-300 hover:shadow-sm">
        <img :src="label.iconUrls.small" class="w-8 h-8 drop-shadow group-hover:rotate-12 transition-transform"
          :alt="label.name" />
        <span class="text-[#0F172A] font-bold text-sm">{{ label.name }}</span>
      </div>
    </div>
  </div>
  <!-- Player House -->
  <div v-if="player?.playerHouse" class="bg-white p-6 rounded-3xl shadow-md border border-gray-200">
    <h2 class="text-2xl font-black mb-6 text-center text-[#0F172A] border-b border-gray-100 pb-3">
      🏠 <span class="text-[#DC2626]">Player House</span>
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="elem in player?.playerHouse.elements" :key="elem.type"
        class="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col items-center">
        <p class="text-gray-500 text-xs uppercase tracking-widest mb-1">{{ elem.type }}</p>
        <p class="text-[#0F172A] font-black text-xl">#{{ elem.id }}</p>
      </div>
    </div>
  </div>
  <!-- ---------------------------------- -->
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
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
const getRemainingUpgrades = (items) => {
  if (!items) return 0;
  return items.reduce((sum, item) => sum + (item.maxLevel - item.level), 0);
};
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
    "Log Launcher", "Flame Flinger", "Battle Drill", "Troop Launcher", "Sky Wagon"
  ];
  return siegeMachines.includes(name);
};
// أضف هذا السطر هنا:
const siegeMachines = computed(() =>
  (player?.value?.troops ?? []).filter(t => isSiegeMachine(t.name))
);
const isHeroPet = (name) => {
  const heroPets = [
    "L.A.S.S.I", "Electro Owl", "Mighty Yak", "Unicorn", "Frosty", "Diggy",
    "Poison Lizard", "Phoenix", "Spirit Fox", "Angry Jelly", "Sneezy", "Greedy Raven"
  ];
  return heroPets.includes(name);
};
// تجهيز المعدات مقسمة حسب الأبطال
const equipmentGroupedByHero = computed(() => {
  if (!player?.value?.heroEquipment) return {}
  const result = {}
  for (const hero in heroEquipmentByHero) {
    // قائمة كل المعدات الخاصة بالبطل
    result[hero] = heroEquipmentByHero[hero].map(eqName => {
      // دور على العدة في بيانات اللاعب
      const found = player?.value.heroEquipment.find(e => e.name === eqName)
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
//     player?.value = res.data
//     const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2))
//     const downloadAnchor = document.createElement("a")
//     downloadAnchor.setAttribute("href", dataStr)
//     downloadAnchor.setAttribute("download", "player?.json")
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 8s ease infinite;
}
</style>