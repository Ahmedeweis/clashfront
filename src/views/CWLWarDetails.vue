<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 py-8 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
        <p class="text-white text-xl mt-4 font-bold">⏳ جاري تحميل تفاصيل الحرب...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-600 border-4 border-red-800 rounded-xl p-8 text-center shadow-2xl">
          <p class="text-white text-2xl font-bold mb-4">❌ {{ errorMessage || 'حدث خطأ أثناء تحميل بيانات الحرب' }}</p>
          <button @click="$router.back()" class="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-all">
            ← العودة
          </button>
        </div>
      </div>

      <!-- War Data -->
      <div v-else-if="war" class="space-y-6">
        <!-- Header -->
        <div class="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-2xl border-4 border-yellow-400">
          <div class="text-center">
            <h1 class="text-3xl md:text-4xl font-black text-white mb-3" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.8)">
              🛡️ {{ war.clan.name }} <span class="text-yellow-200">VS</span> {{ war.opponent.name }} ⚔️
            </h1>
            <div class="flex flex-wrap justify-center gap-4 text-white text-sm md:text-base">
              <span class="bg-black bg-opacity-30 px-4 py-2 rounded-full">📅 {{ formatTime(war.startTime) }}</span>
              <span class="bg-black bg-opacity-30 px-4 py-2 rounded-full">🔚 {{ formatTime(war.endTime) }}</span>
              <span class="bg-black bg-opacity-30 px-4 py-2 rounded-full font-bold">
                🔁 {{ war.state === 'warEnded' ? 'انتهت الحرب' : war.state }}
              </span>
            </div>
          </div>
        </div>

        <!-- Score Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Clan Score -->
          <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-2xl border-4 border-blue-400 transform hover:scale-105 transition-all">
            <div class="flex items-center gap-4 mb-4">
              <div class="relative">
                <img :src="war.clan.badgeUrls.large" alt="Clan Badge" class="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl" />
                <span class="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">Lv.{{ war.clan.clanLevel }}</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-white">{{ war.clan.name }}</h2>
                <p class="text-sm text-blue-200 font-mono mt-1">{{ war.clan.tag }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">⭐ النجوم</p>
                <p class="text-white text-3xl font-black">{{ war.clan.stars }}</p>
              </div>
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">💥 نسبة التدمير</p>
                <p class="text-white text-3xl font-black">{{ war.clan.destructionPercentage.toFixed(2) }}%</p>
              </div>
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">🎯 عدد الهجمات</p>
                <p class="text-white text-3xl font-black">{{ totalClanAttacks }}</p>
              </div>
            </div>
          </div>

          <!-- Opponent Score -->
          <div class="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 shadow-2xl border-4 border-red-400 transform hover:scale-105 transition-all">
            <div class="flex items-center gap-4 mb-4">
              <div class="relative">
                <img :src="war.opponent.badgeUrls.large" alt="Opponent Badge" class="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl" />
                <span class="absolute -bottom-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">Lv.{{ war.opponent.clanLevel }}</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-white">{{ war.opponent.name }}</h2>
                <p class="text-sm text-red-200 font-mono mt-1">{{ war.opponent.tag }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">⭐ النجوم</p>
                <p class="text-white text-3xl font-black">{{ war.opponent.stars }}</p>
              </div>
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">💥 نسبة التدمير</p>
                <p class="text-white text-3xl font-black">{{ war.opponent.destructionPercentage.toFixed(2) }}%</p>
              </div>
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">🎯 عدد الهجمات</p>
                <p class="text-white text-3xl font-black">{{ totalOpponentAttacks }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Members Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Clan Members -->
          <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-blue-500">
            <h3 class="text-2xl font-black text-blue-400 mb-6 flex items-center gap-2">
              <span>👑</span> لاعبي القبيلة
            </h3>
            <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div
                v-for="member in war.clan.members"
                :key="member.tag"
                class="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-4 border-2 border-blue-600 hover:border-yellow-400 transition-all"
              >
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1">
                    <h4 class="font-bold text-white text-lg">{{ member.name }}</h4>
                    <div class="flex items-center gap-2 mt-1">
                      <img :src="getTownhallImage(member.townhallLevel)" class="w-8 h-8 object-contain" :title="'Town Hall ' + member.townhallLevel" />
                      <p class="text-xl font-black text-white bg-blue-600 px-3 py-1 rounded-lg shadow-lg border border-blue-400 transform -skew-x-12">
                        <span class="transform skew-x-12 inline-block">#{{ member.mapPosition }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                       {{ member.attacks?.length || 0 }} هجمات
                    </span>
                  </div>
                </div>

                <!-- Attacks -->
                <div v-if="member.attacks && member.attacks.length > 0" class="bg-black bg-opacity-30 rounded-lg p-3 mb-2">
                  <p class="text-yellow-400 text-sm font-bold mb-2"> الهجمات:</p>
                  <div class="space-y-1">
                    <div v-for="(attack, i) in member.attacks" :key="i" class="text-white text-sm flex justify-between items-center">
                      <span>#{{ getPlayerMapPosition(attack.defenderTag) }} {{ getPlayerName(attack.defenderTag) }}</span>
                      <span class="font-bold text-yellow-300">⭐{{ attack.stars }} | 💥 {{ attack.destructionPercentage }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Best Defense -->
                <div v-if="member.bestOpponentAttack" class="bg-red-900 bg-opacity-40 rounded-lg p-3">
                  <p class="text-red-300 text-sm font-bold mb-1">🛡️ أفضل هجوم ضده:</p>
                  <div class="text-white text-sm flex justify-between items-center">

                    <span>#{{ getPlayerMapPosition(member.bestOpponentAttack.attackerTag) }} {{ getPlayerName(member.bestOpponentAttack.attackerTag) }}</span>
                    <span class="font-bold text-red-400">⭐{{ member.bestOpponentAttack.stars }} | 💥 {{ member.bestOpponentAttack.destructionPercentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Opponent Members -->
          <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-red-500">
            <h3 class="text-2xl font-black text-red-400 mb-6 flex items-center gap-2">
              <span>⚔️</span> لاعبي الخصم
            </h3>
            <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div
                v-for="member in war.opponent.members"
                :key="member.tag"
                class="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-4 border-2 border-red-600 hover:border-yellow-400 transition-all"
              >
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1">
                    <h4 class="font-bold text-white text-lg">{{ member.name }}</h4>
                    <div class="flex items-center gap-2 mt-1">
                      <img :src="getTownhallImage(member.townhallLevel)" class="w-8 h-8 object-contain" :title="'Town Hall ' + member.townhallLevel" />
                      <p class="text-xl font-black text-white bg-red-600 px-3 py-1 rounded-lg shadow-lg border border-red-400 transform -skew-x-12">
                        <span class="transform skew-x-12 inline-block">#{{ member.mapPosition }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                       {{ member.attacks?.length || 0 }} هجمات
                    </span>
                  </div>
                </div>

                <!-- Attacks -->
                <div v-if="member.attacks && member.attacks.length > 0" class="bg-black bg-opacity-30 rounded-lg p-3 mb-2">
                  <p class="text-yellow-400 text-sm font-bold mb-2"> الهجمات:</p>
                  <div class="space-y-1">
                    <div v-for="(attack, i) in member.attacks" :key="i" class="text-white text-sm flex justify-between items-center">
                      <span>#{{ getPlayerMapPosition(attack.defenderTag) }} {{ getPlayerName(attack.defenderTag) }}</span>
                      <span class="font-bold text-yellow-300">⭐{{ attack.stars }} | 💥 {{ attack.destructionPercentage }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Best Defense -->
                <div v-if="member.bestOpponentAttack" class="bg-blue-900 bg-opacity-40 rounded-lg p-3">
                  <p class="text-blue-300 text-sm font-bold mb-1">🛡️ أفضل هجوم ضده:</p>
                  <div class="text-white text-sm flex justify-between items-center">
                    <span>#{{ getPlayerMapPosition(member.bestOpponentAttack.attackerTag) }} {{ getPlayerName(member.bestOpponentAttack.attackerTag) }}</span>
                    <span class="font-bold text-blue-400">⭐{{ member.bestOpponentAttack.stars }} | 💥 {{ member.bestOpponentAttack.destructionPercentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Town Hall Lineup Comparison -->

        <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border-4 border-yellow-500">
          <h3 class="text-2xl font-black text-yellow-400 mb-6 text-center">🏰 ({{ war.teamSize }} vs {{ war.teamSize }})</h3>

          <!-- Clan Lineup -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-3">
              <img :src="war.clan.badgeUrls.small" class="w-8 h-8" />
              <h4 class="text-blue-300 font-bold">{{ war.clan.name }}</h4>
            </div>
            <div class="flex pb-4 gap-1 flex-wrap">
              <div
                v-for="i in war.teamSize"
                :key="'clan-' + i"
                class="flex-shrink-0 relative group w-12 text-center"
              >
                <template v-if="getMemberAt(war.clan.members, i)">
                  <img
                    :src="getTownhallImage(getMemberAt(war.clan.members, i).townhallLevel)"
                    class="w-10 h-10 mx-auto object-contain filter drop-shadow-lg transition-transform transform group-hover:scale-125"
                  />
                  <span class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 font-mono">
                    {{ i }}
                  </span>
                </template>
                <div v-else class="w-10 h-10 mx-auto bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-xs">
                  ?
                </div>
              </div>
            </div>
          </div>

          <!-- Opponent Lineup -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <img :src="war.opponent.badgeUrls.small" class="w-8 h-8" />
              <h4 class="text-red-300 font-bold">{{ war.opponent.name }}</h4>
            </div>
            <div class="flex  pb-4 gap-1 flex-wrap">
              <div
                v-for="i in war.teamSize"
                :key="'opp-' + i"
                class="flex-shrink-0 relative group w-12 text-center"
              >
                <template v-if="getMemberAt(war.opponent.members, i)">
                  <img
                    :src="getTownhallImage(getMemberAt(war.opponent.members, i).townhallLevel)"
                    class="w-10 h-10 mx-auto object-contain filter drop-shadow-lg transition-transform transform group-hover:scale-125"
                  />
                  <span class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 font-mono">
                    {{ i }}
                  </span>
                </template>
                <div v-else class="w-10 h-10 mx-auto bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-xs">
                  ?
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="$router.back()"
            class="px-8 py-4 bg-gradient-to-b from-gray-600 to-gray-800 text-white font-black text-xl rounded-xl shadow-xl border-4 border-gray-500 hover:from-gray-700 hover:to-gray-900 transition-all transform hover:scale-105"
          >
            ← العودة للجولات
          </button>
          <router-link
            :to="`/clan/${encodeURIComponent(clanTag)}/stats`"
            class="px-8 py-4 bg-gradient-to-b from-yellow-500 to-yellow-700 text-gray-900 font-black text-xl rounded-xl shadow-xl border-4 border-yellow-400 hover:from-yellow-600 hover:to-yellow-800 transition-all transform hover:scale-105 text-center"
          >
            📊 إحصائيات الكلان
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const war = ref(null)
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const clanTag = ref('')

onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/cwl/war/${encodeURIComponent(route.params.warTag)}`)
    war.value = data

    // ترتيب الأعضاء حسب mapPosition
    if (war.value.clan?.members) {
      war.value.clan.members.sort((a, b) => a.mapPosition - b.mapPosition)
    }
    if (war.value.opponent?.members) {
      war.value.opponent.members.sort((a, b) => a.mapPosition - b.mapPosition)
    }

    // استخراج تاج الكلان من البيانات
    clanTag.value = data.clan.tag
  } catch (err) {
    error.value = true
    errorMessage.value = err.response?.data?.error || err.message
    console.error("Frontend Error:", err)
  } finally {
    loading.value = false
  }
})

function formatTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })
}

const totalClanAttacks = computed(() => {
  return war.value?.clan?.members?.reduce((sum, m) => sum + (m.attacks?.length || 0), 0) || 0
})

const totalOpponentAttacks = computed(() => {
  return war.value?.opponent?.members?.reduce((sum, m) => sum + (m.attacks?.length || 0), 0) || 0
})
const getTownhallImage = (level) => {
  try {
    return new URL(`../assets/townhalls/townhall${level}.png`, import.meta.url).href
  } catch {
    return new URL(`../assets/townhalls/townhall_default.png`, import.meta.url).href
  }
}
const getMemberAt = (members, position) => {
  return members?.find(m => m.mapPosition === position)
}

// Helper function to get player name from tag
const getPlayerName = (tag) => {
  if (!war.value) return tag

  // Search in clan members
  const clanMember = war.value.clan?.members?.find(m => m.tag === tag)
  if (clanMember) return clanMember.name

  // Search in opponent members
  const opponentMember = war.value.opponent?.members?.find(m => m.tag === tag)
  if (opponentMember) return opponentMember.name

  // If not found, return the tag
  return tag
}

// Helper function to get player map position from tag
const getPlayerMapPosition = (tag) => {
  if (!war.value) return '?'

  // Search in clan members
  const clanMember = war.value.clan?.members?.find(m => m.tag === tag)
  if (clanMember) return clanMember.mapPosition

  // Search in opponent members
  const opponentMember = war.value.opponent?.members?.find(m => m.tag === tag)
  if (opponentMember) return opponentMember.mapPosition

  return '?'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #fbbf24, #f59e0b);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #f59e0b, #d97706);
}
</style>