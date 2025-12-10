<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 p-4 md:p-8">
    <!-- Header -->
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-black text-yellow-400 mb-2 drop-shadow-lg" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.8)">
          ⚔️ دوري حروب العشائر ⚔️
        </h1>
        <p class="text-white text-lg opacity-90">Clan War League</p>
      </div>

      <!-- Quick Select Clans -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          v-for="clan in topClans"
          :key="clan.tag"
          @click="selectClan(clan.tag)"
          class="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-800 hover:to-blue-900 border-2 border-gray-600 hover:border-yellow-400 rounded-xl p-3 flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg group"
        >
          <img :src="clan.badge" alt="Badge" class="w-10 h-10 drop-shadow-md group-hover:scale-110 transition-transform" />
          <div class="text-right overflow-hidden">
            <h3 class="text-white font-bold text-sm truncate">{{ clan.name }}</h3>
            <p class="text-gray-400 text-xs truncate">{{ clan.tag }}</p>
          </div>
        </button>
        <!-- Group Clans -->
        <button
          v-for="clan in groupClans"
          :key="clan.tag"
          @click="selectClan(clan.tag)"
          class="bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-5 border-4 border-orange-400 shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 transform hover:scale-105 group"
        >
          <img :src="clan.badgeUrls?.medium || clan.badgeUrls?.small" alt="Badge" class="w-10 h-10 drop-shadow-md group-hover:scale-110 transition-transform" />
          <div class="text-right overflow-hidden">
            <h3 class="text-white font-bold text-sm truncate">{{ clan.name }}</h3>
            <p class="text-gray-200 text-xs truncate">{{ clan.tag }}</p>
          </div>
        </button>
      </div>

      <!-- Clan Input -->
      <div class="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 mb-8 shadow-2xl border-4 border-yellow-400">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            v-model="clanTag"
            placeholder="أدخل رمز القبيلة (مثال: #QL92PVUC)"
            class="flex-1 px-4 py-3 rounded-lg border-4 border-yellow-700 bg-yellow-50 text-gray-900 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
          />
          <button
            @click="fetchCWL"
            :disabled="loading"
            class="px-8 py-3 bg-gradient-to-b from-green-500 to-green-700 text-white font-black text-xl rounded-lg shadow-lg border-4 border-green-400 hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '⏳ جاري التحميل...' : '🔍 بحث' }}
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-600 border-4 border-red-800 rounded-xl p-4 mb-8 text-white text-center font-bold text-lg shadow-xl">
        ❌ {{ error }}
      </div>

      <!-- CWL Data -->
      <div v-if="cwlData && selectedClan" class="space-y-12">

        <!-- Leaderboard Section (The Group) -->
        <div class="max-w-4xl mx-auto" dir="">
            <div class="bg-[#1e2328] rounded-xl overflow-hidden border-[3px] border-[#3d3d3d] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <!-- Header -->
                <div class="bg-gradient-to-b from-[#402e20] to-[#2c2018] py-3 px-4 text-center border-b border-[#5c4a3d] relative">
                    <h2 class="text-[#f0e6d2] font-black text-2xl drop-shadow-md tracking-wide">المجموعة</h2>
                </div>

                <!-- League Name Bar -->
                <div class="bg-gradient-to-b from-[#d97d28] to-[#9b3b0d] py-2 text-center border-b-2 border-[#5c1c05] shadow-inner relative overflow-hidden">
                     <div class="absolute inset-0 bg-yellow-400 opacity-10 skew-x-12 transform -translate-x-full animate-shimmer"></div>
                    <h3 class="text-white font-black text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">الدوري (CWL)</h3>
                </div>

                <!-- Table Header -->
                <div class="flex items-center bg-[#58413b] text-[#f2ce94] font-bold text-sm py-2 px-2 md:px-6 shadow-md border-b border-[#30221c]">
                    <div class="w-12 text-center">الموقع</div>
                    <div class="flex-1 text-right pr-4">القبيلة</div>
                    <div class="w-24 text-center">النجوم</div>
                    <div class="w-24 text-center">الدمار %</div>
                    <div class="w-16 text-center hidden md:block">التفاصيل</div>
                </div>

                <!-- Rows -->
                <div class="divide-y divide-[#15181c]">
                    <div v-for="(clan, index) in clanStandings" :key="clan.tag"
                        class="flex items-center py-2 px-2 md:px-4 transition-all duration-200 group relative cursor-pointer"
                        :class="[
                           clan.tag === clanTag ? 'bg-[#5f84ac] hover:bg-[#6a91bb]' : 'bg-[#eecda6] hover:bg-[#f5dcb9]'
                         ]"
                         @click="selectClan(clan.tag)"
                    >
                        <!-- Rank -->
                        <div class="w-12 flex items-center justify-center">
                            <div class="relative">
                                 <span class="font-black text-2xl drop-shadow-md z-10 relative"
                                    :class="clan.tag === clanTag ? 'text-white' : 'text-[#3f2b1d]'"
                                 >{{ index + 1 }}.</span>
                                 <span v-if="index < 1" class="absolute -left-3 top-1 text-green-500 font-bold text-lg transform">▲</span>
                                <span v-if="index > 5" class="absolute -left-3 top-1 text-red-500 font-bold text-lg transform rotate-180">▲</span> </div>
                        </div>

                        <!-- Clan Info -->
                        <div class="flex-1 flex items-center gap-3 pr-2 min-w-0">
                             <div class="relative">
                                <img :src="clan.badgeUrls.small" class="w-10 h-10 drop-shadow-md transform group-hover:scale-110 transition-transform duration-200">
                                <div class="absolute -bottom-1 -right-1 bg-black text-white text-[9px] px-1 rounded border border-white font-bold">{{ clan.clanLevel }}</div>
                             </div>
                            <div class="flex flex-col truncate">
                                <span class="font-black text-lg truncate drop-shadow-sm"
                                     :class="clan.tag === clanTag ? 'text-white' : 'text-[#3f2b1d]'"
                                >{{ clan.name }}</span>
                            </div>
                        </div>

                         <!-- Stars -->
                        <div class="w-24 flex items-center justify-center">
                             <div class="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-lg border border-white/20 shadow-inner min-w-[70px] justify-center">
                                <span class="font-black text-white text-lg">{{ clan.stars }}</span>
                                <span class="text-yellow-400 text-lg drop-shadow-md">★</span>
                             </div>
                        </div>

                         <!-- Destruction -->
                        <div class="w-24 flex items-center justify-center font-black text-lg drop-shadow-sm"
                              :class="clan.tag === clanTag ? 'text-white' : 'text-[#3f2b1d]'"
                        >
                            {{ clan.destruction.toFixed(0) }}
                        </div>

                        <!-- Action Button -->
                        <div class="w-16 hidden md:flex items-center justify-center">
                            <router-link
                                :to="`/clan/${encodeURIComponent(clan.tag)}/stats`"
                                class="bg-blue-500 hover:bg-blue-400 text-white rounded-lg p-1.5 shadow-lg border-b-4 border-blue-700 hover:border-b-2 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Separator -->
        <div class="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-full opacity-50"></div>

        <!-- Clan Info Card -->
        <div class="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl p-6 shadow-2xl border-4 border-purple-500">
          <div class="flex items-center gap-6 mb-6">
            <img :src="selectedClan.badgeUrls.large" alt="Badge" class="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-xl" />
            <div>
              <h2 class="text-3xl font-black text-yellow-400 mb-1">{{ selectedClan.name }}</h2>
              <p class="text-white text-lg">{{ selectedClan.tag }}</p>
              <p class="text-purple-300 text-sm mt-1">عدد الأعضاء: {{ selectedClan.members.length }}</p>
            </div>
          </div>

          <!-- Members Grid -->
          <!-- <div class="bg-black bg-opacity-30 rounded-xl p-4">
            <h3 class="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span>👥</span> أعضاء القبيلة
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <div
                v-for="member in selectedClan.members"
                :key="member.tag"
                class="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg p-3 border-2 border-blue-500 hover:border-yellow-400 transition-all transform hover:scale-105 cursor-pointer"
              >
                <p class="font-bold text-white text-sm truncate" :title="member.name">{{ member.name }}</p>
                <p class="text-yellow-300 text-xs mt-1">🏛️ TH {{ member.townHallLevel }}</p>
              </div>
            </div>
          </div> -->
        </div>

        <!-- Rounds Section -->
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-gray-700">
          <h3 class="text-3xl font-black text-yellow-400 mb-6 text-center flex items-center justify-center gap-3">
            <span>🎯</span> جولات الحرب <span>🎯</span>
          </h3>

          <div class="grid grid-cols-2 gap-6">
            <div
              v-for="(round, index) in cwlData.rounds"
              :key="index"
              class="bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-5 border-4 border-orange-400 shadow-xl hover:shadow-2xl transition-all"
            >
              <div class="text-center mb-4">
                <h4 class="text-2xl font-black text-white mb-2">
                  ⚔️ الجولة {{ index + 1 }}
                </h4>
                <div class="h-1 bg-yellow-400 rounded-full w-16 mx-auto"></div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="warTag in round.warTags.filter(tag => tag !== '#0')"
                  :key="warTag"
                >
                  <router-link
                    :to="`/cwl/war/${encodeURIComponent(warTag)}`"
                    class="block bg-black bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all transform hover:scale-102"
                  >
                    <!-- War Matchup -->
                    <div v-if="warDetails[warTag]" class="space-y-2">
                      <!-- Clan vs Opponent -->
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 flex-1 min-w-0">
                          <img :src="warDetails[warTag].clan.badgeUrls.small" alt="Clan" class="w-8 h-8 rounded-full border-2 border-blue-400" />
                          <span class="text-white font-bold text-sm truncate">{{ warDetails[warTag].clan.name }}</span>
                        </div>
                        <span class="text-yellow-400 font-black text-lg px-2">VS</span>
                        <div class="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          <span class="text-white font-bold text-sm truncate">{{ warDetails[warTag].opponent.name }}</span>
                          <img :src="warDetails[warTag].opponent.badgeUrls.small" alt="Opponent" class="w-8 h-8 rounded-full border-2 border-red-400" />
                        </div>
                      </div>

                      <!-- Score Board (Clash Style) -->
                      <div class="bg-black bg-opacity-40 rounded-lg p-3 mt-2 border border-gray-600">
                        <div class="flex items-center justify-between">
                          <!-- Clan Stats (Left) -->
                          <div class="flex flex-col items-center w-1/2 border-r border-gray-600 pr-2">
                            <div class="flex items-center gap-1 mb-1">
                              <span class="text-yellow-400 text-xl drop-shadow-md">⭐</span>
                              <span class="text-2xl font-black text-white drop-shadow-md">{{ warDetails[warTag].clan.stars }}</span>
                            </div>
                            <div class="w-full flex justify-between items-center text-xs font-bold">
                              <span class="text-blue-300" title="نسبة التدمير">💥 {{ warDetails[warTag].clan.destructionPercentage.toFixed(1) }}%</span>
                              <span class="text-gray-400" title="عدد الهجمات">⚔️ {{ warDetails[warTag].clan.attacks || 0 }}</span>
                            </div>
                          </div>

                          <!-- Opponent Stats (Right) -->
                          <div class="flex flex-col items-center w-1/2 pl-2">
                            <div class="flex items-center gap-1 mb-1">
                              <span class="text-2xl font-black text-white drop-shadow-md">{{ warDetails[warTag].opponent.stars }}</span>
                              <span class="text-yellow-400 text-xl drop-shadow-md">⭐</span>
                            </div>
                            <div class="w-full flex justify-between items-center text-xs font-bold">
                              <span class="text-gray-400" title="عدد الهجمات">⚔️ {{ warDetails[warTag].opponent.attacks || 0 }}</span>
                              <span class="text-red-300" title="نسبة التدمير">💥 {{ warDetails[warTag].opponent.destructionPercentage.toFixed(1) }}%</span>
                            </div>
                          </div>
                        </div>

                        <!-- Progress Bar Visual -->
                        <div class="flex mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div class="bg-blue-500 h-full" :style="{ width: `${warDetails[warTag].clan.destructionPercentage}%` }"></div>
                          <div class="bg-red-500 h-full ml-auto" :style="{ width: `${warDetails[warTag].opponent.destructionPercentage}%` }"></div>
                        </div>
                      </div>
                    </div>
                    <!-- Loading State -->
                    <div v-else class="text-center text-white text-sm">
                      🗡️ {{ warTag }}
                    </div>
                  </router-link>
                </div>
                <div v-if="round.warTags.filter(tag => tag !== '#0').length === 0" class="text-center text-gray-400 py-4">
                  لا توجد حروب في هذه الجولة
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !cwlData" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
        <p class="text-white text-xl mt-4 font-bold">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { topClans } from "../constants/clans";

const clanTag = ref("#2PYCUY8RG");
const cwlData = ref(null);
const warDetails = ref({});
const loading = ref(false);
const error = ref("");

const selectClan = (tag) => {
  clanTag.value = tag;
  fetchCWL();
};

// البحث عن القبيلة الصحيحة من الـ CWL group
const selectedClan = computed(() => {
  if (!cwlData.value) return null;

  // البحث عن القبيلة بالتاج
  const clan = cwlData.value.clans.find(c =>
    c.tag.replace('#', '').toLowerCase() === clanTag.value.replace('#', '').toLowerCase()
  );

  // لو ملقاش، يرجع أول قبيلة
  return clan || cwlData.value.clans[0];
});

const groupClans = computed(() => {
  if (!cwlData.value || !cwlData.value.clans) return [];
  return cwlData.value.clans.filter(c =>
    c.tag.replace('#', '').toLowerCase() !== clanTag.value.replace('#', '').toLowerCase()
  );
});

const fetchCWL = async () => {
  if (!clanTag.value) return;
  loading.value = true;
  error.value = "";
  cwlData.value = null;
  warDetails.value = {};

  try {
    const response = await axios.get(`http://localhost:5000/api/clan/${encodeURIComponent(clanTag.value)}/cwl`);
    cwlData.value = response.data;

    // جلب تفاصيل كل الحروب
    const allWarTags = cwlData.value.rounds.flatMap(round =>
      round.warTags.filter(tag => tag !== '#0')
    );

    const uniqueWarTags = [...new Set(allWarTags)];

    // جلب بيانات كل حرب
    const warPromises = uniqueWarTags.map(async (warTag) => {
      try {
        const warRes = await axios.get(`http://localhost:5000/api/cwl/war/${encodeURIComponent(warTag)}`);
        return { tag: warTag, data: warRes.data };
      } catch (err) {
        console.error(`Error fetching war ${warTag}:`, err);
        return { tag: warTag, data: null };
      }
    });

    const wars = await Promise.all(warPromises);
    wars.forEach(({ tag, data }) => {
      if (data) {
        warDetails.value[tag] = data;
      }
    });

  } catch (err) {
    error.value = err.response?.data?.error || "فشل في تحميل بيانات دوري الحروب";
  } finally {
    loading.value = false;
  }
};

// Computed Logic for Standings
const clanStandings = computed(() => {
  if (!cwlData.value || !cwlData.value.clans) return [];

  const standings = cwlData.value.clans.map(clan => {
    let stars = 0;
    let destruction = 0;

    // Iterate over all loaded wars
    Object.values(warDetails.value).forEach(war => {
      const isWarEnded = war.state === 'warEnded';

      // Helper to calculate total destruction from members' attacks
      const calculateTotalDestruction = (members) => {
        const total = members.reduce((total, member) => {
          const attacksDestruction = member.attacks
            ? member.attacks.reduce((sum, attack) => {
                console.log(`Member ${member.name}: +${attack.destructionPercentage}%`);
                return sum + attack.destructionPercentage;
            }, 0)
            : 0;
          return total + attacksDestruction;
        }, 0);
        console.log(`Total destruction for clan: ${total}%`);
        return total;
      };

      // Check if clan participated as 'clan'
      if (war.clan.tag === clan.tag) {
        stars += war.clan.stars;
        destruction += calculateTotalDestruction(war.clan.members);
        if (isWarEnded && war.clan.stars > war.opponent.stars) {
          stars += 10;
        }
      }
      // Check if clan participated as 'opponent'
      else if (war.opponent.tag === clan.tag) {
        stars += war.opponent.stars;
        destruction += calculateTotalDestruction(war.opponent.members);
        if (isWarEnded && war.opponent.stars > war.clan.stars) {
          stars += 10;
        }
      }
    });

    return {
      ...clan,
      stars,
      destruction
    };
  });

  // Sort: Stars DESC, then Destruction DESC
  return standings.sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.destruction - a.destruction;
  });
});

// جلب البيانات عند تحميل الصفحة
fetchCWL();
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-150%) skewX(12deg); }
  50% { transform: translateX(150%) skewX(12deg); }
  100% { transform: translateX(150%) skewX(12deg); }
}
.animate-shimmer {
  animation: shimmer 2.5s infinite;
}
</style>