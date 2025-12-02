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
      <div v-if="cwlData && selectedClan" class="space-y-8">
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
          <div class="bg-black bg-opacity-30 rounded-xl p-4">
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
          </div>
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
                      <!-- Score -->
                      <div class="flex items-center justify-center gap-4 text-xs">
                        <span class="text-blue-300">⭐ {{ warDetails[warTag].clan.stars }}</span>
                        <span class="text-gray-400">-</span>
                        <span class="text-red-300">⭐ {{ warDetails[warTag].opponent.stars }}</span>
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

const clanTag = ref("#2PYCUY8RG");
const cwlData = ref(null);
const warDetails = ref({});
const loading = ref(false);
const error = ref("");

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

// جلب البيانات عند تحميل الصفحة
fetchCWL();
</script>