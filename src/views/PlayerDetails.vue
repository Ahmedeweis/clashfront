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
<div class="relative rounded-3xl overflow-hidden shadow-2xl">
  <!-- Gradient Animated Background -->
  <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 animate-gradient-x opacity-80"></div>
  <!-- Overlay Pattern / Glow -->
  <div class="absolute inset-0 bg-[url('/assets/hexagon-pattern.svg')] bg-repeat opacity-20 mix-blend-overlay"></div>
  <!-- Content -->
  <div class="relative p-8 md:p-12 text-white flex flex-col md:flex-row items-center md:justify-between gap-6">
    <!-- Player Info -->
    <div>
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg">
        {{ player.name }}
        <span class="text-lg md:text-2xl opacity-90">({{ player.tag }})</span>
      </h1>
      <p class="mt-3 text-lg md:text-xl font-semibold">Level {{ player.expLevel }} | 🏆 Trophies: {{ player.trophies }} | ⭐ Best: {{ player.bestTrophies }}</p>
      <p class="mt-1 text-md md:text-lg opacity-80">War Stars: {{ player.warStars }} | Attacks: {{ player.attackWins }} | Defenses: {{ player.defenseWins }}</p>
    </div>
    <!-- Stats Cards -->
    <div class="flex flex-wrap gap-4">
      <div class="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/20">
        <p class="text-sm md:text-base font-medium opacity-80">Trophies</p>
        <p class="text-xl md:text-2xl font-bold">{{ player.trophies }}</p>
      </div>
      <div class="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/20">
        <p class="text-sm md:text-base font-medium opacity-80">Best Trophies</p>
        <p class="text-xl md:text-2xl font-bold">{{ player.bestTrophies }}</p>
      </div>
      <div class="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/20">
        <p class="text-sm md:text-base font-medium opacity-80">War Stars</p>
        <p class="text-xl md:text-2xl font-bold">{{ player.warStars }}</p>
      </div>
    </div>
  </div>
</div>
    <!-- Heroes with Equipment -->
<div v-if="player.heroes && player.heroes.length" class="bg-[#0A0918] p-8 space-y-10 rounded-3xl">
  <h2 class="text-3xl font-extrabold text-yellow-300 border-b pb-4 mb-8">    {{ player.name }} 🦸 Heroes & Equipment</h2>
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
          <img :src="getHeroEquipmentImageUrl(eq.name) || 'https://via.placeholder.com/48/cccccc/999999?text=?'"
               :alt="eq.name"
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
    <div v-if="player.clan" class="bg-white p-5 rounded-lg shadow-md border">
      <h2 class="text-xl font-semibold text-blue-700 border-b pb-2">🏰 Clan: {{ player.clan.name }} ({{ player.clan.tag }})</h2>
      <p>Clan Level: {{ player.clan.clanLevel }}</p>
      <img :src="player.clan.badgeUrls.medium" alt="Clan Badge" class="mt-2 w-16 h-16 object-contain" />
    </div>
    <!-- Town Hall & Builder Base -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-5 rounded-lg shadow-md border">
        <h2 class="text-xl font-semibold text-green-700 border-b pb-2">🏡 Home Base</h2>
        <p>Town Hall: {{ player.townHallLevel }} (Weapon: {{ player.townHallWeaponLevel }})</p>
        <p>League: {{ player.league?.name }}</p>
        <img :src="player.league?.iconUrls?.medium" alt="League" class="mt-2 w-12 h-12" />
      </div>
      <div class="bg-white p-5 rounded-lg shadow-md border">
        <h2 class="text-xl font-semibold text-orange-700 border-b pb-2">🛠️ Builder Base</h2>
        <p>Builder Hall: {{ player.builderHallLevel }}</p>
        <p>Trophies: {{ player.builderBaseTrophies }} (Best: {{ player.bestBuilderBaseTrophies }})</p>
        <p>League: {{ player.builderBaseLeague?.name }}</p>
      </div>
    </div>
<!-- Legend Statistics -->
<div v-if="player.legendStatistics" class="bg-yellow-50 p-5 rounded-lg shadow-md border border-yellow-200">
  <h2 class="text-xl font-semibold text-yellow-800 border-b pb-2">👑 Legend Statistics</h2>
  <p>Current: {{ player.legendStatistics.legendTrophies }} trophies</p>
  <p v-if="player.legendStatistics.bestSeason">
    Best Season: Rank #{{ player.legendStatistics.bestSeason.rank }} ({{ player.legendStatistics.bestSeason.trophies }} trophies)
  </p>
  <p v-if="player.legendStatistics.bestBuilderBaseSeason">
    Best Builder: Rank #{{ player.legendStatistics.bestBuilderBaseSeason.rank }} ({{ player.legendStatistics.bestBuilderBaseSeason.trophies }} trophies)
  </p>
</div>
    <!-- Role & Donations -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-5 rounded-lg shadow-md border">
        <h2 class="text-xl font-semibold text-indigo-700 border-b pb-2">👤 Profile</h2>
        <p>Role: {{ player.role }}</p>
        <p>War Preference: {{ player.warPreference === 'in' ? 'Fights in wars' : 'Skips wars' }}</p>
        <p>Donations: {{ player.donations }} | Received: {{ player.donationsReceived }}</p>
        <p>Clan Capital: {{ formatNumber(player.clanCapitalContributions) }}</p>
      </div>
      <div class="bg-white p-5 rounded-lg shadow-md border">
        <h2 class="text-xl font-semibold text-pink-700 border-b pb-2">🏆 Achievements</h2>
        <p>Total: {{ player.achievements?.length }}</p>
        <p>Stars: {{ player.achievements?.reduce((sum, a) => sum + a.stars, 0) }}/?</p>
      </div>
    </div>
    <!-- Troops -->
    <div v-if="player.troops && player.troops.length > 0" class="bg-white p-5 rounded-lg shadow-md border">
      <h2 class="text-xl font-semibold text-red-700 border-b pb-2">⚔️ Troops</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
        <div v-for="troop in player.troops" :key="troop.name" class="text-center p-2 bg-gray-50 rounded text-sm">
          <span class="font-medium">{{ troop.name }}</span>
          <p class="text-green-600">Lvl {{ troop.level }} / {{ troop.maxLevel }}</p>
          <p v-if="troop.superTroopIsActive" class="text-red-500 text-xs font-bold">ACTIVE</p>
        </div>
      </div>
    </div>
    <!-- Spells -->
    <div v-if="player.spells && player.spells.length > 0" class="bg-white p-5 rounded-lg shadow-md border">
      <h2 class="text-xl font-semibold text-purple-700 border-b pb-2">🔮 Spells</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
        <div v-for="spell in player.spells" :key="spell.name" class="text-center p-2 bg-gray-50 rounded text-sm">
          <span class="font-medium">{{ spell.name }}</span>
          <p class="text-blue-600">Lvl {{ spell.level }} / {{ spell.maxLevel }}</p>
        </div>
      </div>
    </div>
    <!-- Heroes -->
    <!-- Labels -->
    <div v-if="player.labels && player.labels.length > 0" class="bg-white p-5 rounded-lg shadow-md border">
      <h2 class="text-xl font-semibold text-teal-700 border-b pb-2">🏷️ Labels</h2>
      <div class="flex flex-wrap gap-2 mt-3">
        <span v-for="label in player.labels" :key="label.id" class="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
          <img :src="label.iconUrls.small" class="w-4 h-4" :alt="label.name" />
          {{ label.name }}
        </span>
      </div>
    </div>
    <!-- Player House -->
    <div v-if="player.playerHouse" class="bg-white p-5 rounded-lg shadow-md border">
      <h2 class="text-xl font-semibold text-indigo-700 border-b pb-2">🏠 Player House</h2>
      <p class="text-sm">Elements:</p>
      <ul class="list-disc list-inside mt-2 text-sm">
        <li v-for="elem in player.playerHouse.elements" :key="elem.type">{{ elem.type }}: {{ elem.id }}</li>
      </ul>
    </div>
  </div>
  <!-- ---------------------------------- -->
</template>
<script setup>
import { ref, onMounted , computed } from 'vue'
import { getHeroEquipmentImageUrl } from '../utils/heroEquipmentImages'
import { heroEquipmentByHero } from '../utils/heroEquipmentByHero'
import { heroesData } from '../utils/heroesData'
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