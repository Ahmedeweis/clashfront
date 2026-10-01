<template>

  <div class="min-h-screen bg-gray-50">
    <!-- Search Section -->
    <div
      class="pt-6 pb-2 flex justify-center sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div class="relative w-full max-w-xl px-4">
        <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
          placeholder="ابحث عن كلان (مثال: #2PYCUY8RG)"
          class="w-full pl-5 pr-28 py-3 rounded-2xl bg-gray-100 border border-gray-300 text-[#0F172A] placeholder-gray-400 focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] transition-all shadow-sm" />
        <button @click="handleSearch"
          class="absolute right-5 top-1.5 bottom-1.5 px-6 rounded-xl bg-[#DC2626] text-white font-bold hover:bg-[#b91c1c] hover:shadow-lg transition-all duration-300 transform active:scale-95">
          بحث
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col justify-center items-center min-h-[50vh]">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DC2626] mb-4"></div>
      <p class="text-[#0F172A]/60 animate-pulse">جارٍ تحميل بيانات الكلان...</p>
    </div>
    <div v-else-if="error" class="text-center text-[#DC2626] font-bold my-10">
      حدث خطأ في تحميل بيانات الكلان. حاول مرة أخرى لاحقاً.
    </div>

    <section v-if="clan" class="p-8 space-y-10 bg-gray-50">
      <!-- ✅ شريط الكلانات فوق -->
      <div class="flex flex-wrap justify-center gap-6 mb-10">
        <div v-for="c in topClans" :key="c.tag"
          class="cursor-pointer bg-[#0F172A] hover:bg-[#1e293b] rounded-2xl shadow-lg p-4 flex flex-col items-center w-40 hover:scale-105 transition-all duration-300 border border-[#DC2626]/30 hover:border-[#DC2626]"
          @click="loadClan(c.tag)">
          <img src="/master.png" alt="Clan Badge" class="w-16 h-16 mb-3 drop-shadow-lg" />
          <h3 class="text-white font-bold text-center truncate text-sm">{{ c.name }}</h3>
        </div>
      </div>

      <!-- القسم الرئيسي: شعار واسم الكلان -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-200 text-[#0F172A] p-4">
        <div
          class="flex flex-col md:flex-row items-start gap-12 p-8 bg-gradient-to-br from-gray-50 via-white to-red-50 rounded-xl border border-gray-100">
          <!-- العمود الأيسر: البادج + الوسوم -->
          <div class="flex flex-col items-start gap-6 md:w-1/3">
            <!-- صورة البادج -->
            <div
              class="relative w-44 h-44 flex-shrink-0 rounded-full overflow-hidden border-4 border-[#DC2626] shadow-xl hover:shadow-red-300 transition-shadow duration-500"
              aria-label="Clan Badge">
              <img :src="clan.badgeUrls.large" alt="Clan Badge"
                class="w-full h-full object-contain bg-gradient-to-tr from-red-50 via-white to-gray-100 p-4"
                loading="lazy" />
              <div
                class="absolute inset-0 rounded-full pointer-events-none animate-pulse border-2 border-[#DC2626] opacity-30">
              </div>
            </div>
            <!-- وسم الكلان -->
            <p class="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
              <span class="opacity-60 text-sm">Tag:</span>
              <span
                class="inline-block px-4 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/40 font-mono tracking-wider select-text text-[#DC2626] font-bold"
                title="وسم الكلان">
                {{ clan.tag }}
              </span>
            </p>
            <!-- الوسوم -->
            <section v-if="clan.labels?.length" class="w-full">
              <div class="flex flex-wrap justify-start gap-3">
                <span v-for="label in clan.labels" :key="label.id"
                  class="flex items-center gap-2 bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg shadow hover:scale-105 transition-transform">
                  <img :src="label.iconUrls.small" alt="Label icon" class="w-6 h-6" />
                </span>
              </div>
            </section>
          </div>

          <!-- العمود الأيمن: معلومات الكلان -->
          <div class="flex-1 space-y-8 text-end md:w-2/3">
            <!-- اسم الكلان -->
            <h1 class="text-6xl h-[75px] font-extrabold tracking-wide
              bg-gradient-to-r from-[#DC2626] via-[#b91c1c] to-[#0F172A]
              bg-clip-text text-transparent drop-shadow-sm
              hover:scale-105 transition-transform duration-500
              cursor-default select-none" title="اسم الكلان">
              {{ clan.name }}
            </h1>
            <!-- الدوري -->
            <section v-if="clan.capitalLeague"
              class="bg-[#0F172A] rounded-xl shadow-lg px-6 py-4 text-white text-center w-fit ml-auto border-l-4 border-[#DC2626]">
              <h2 class="text-xl font-semibold flex items-center justify-center gap-3">
                <img src="/master.png" alt="Capital League" class="w-10" />
                {{ clan.warLeague.name }}
              </h2>
            </section>
            <!-- الوصف -->
            <div class="max-w-2xl ml-auto">
              <p v-if="clan.description"
                class="text-lg leading-relaxed text-[#0F172A]/70 whitespace-pre-wrap font-light">
                {{ clan.description }}
              </p>
              <p v-else class="text-lg leading-relaxed italic text-gray-400 opacity-75">
                لا يوجد وصف متوفر لهذا الكلان حاليًا.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- معلومات الحروب -->
      <section v-if="clan">
        <div class="flex justify-between items-center flex-wrap gap-6">
          <div class="flex flex-wrap justify-start gap-4">
            <div
              class="flex flex-col items-center justify-center w-28 h-28 rounded-2xl text-white shadow-lg bg-[#DC2626]">
              <span class="text-4xl font-extrabold">{{ clan.warWinStreak }}</span>
              <span class="text-sm opacity-90 mt-1">انتصارات</span>
            </div>
            <div
              class="flex flex-col items-center justify-center w-28 h-28 rounded-2xl text-white shadow-lg bg-[#0F172A]">
              <span class="text-4xl font-extrabold">{{ clan.warTies }}</span>
              <span class="text-sm opacity-90 mt-1">تعادلات</span>
            </div>
            <div
              class="flex flex-col items-center justify-center w-28 h-28 rounded-2xl text-white shadow-lg bg-[#1e293b]">
              <span class="text-4xl font-extrabold">{{ clan.warLosses }}</span>
              <span class="text-sm opacity-90 mt-1">خسائر</span>
            </div>
            <div class="flex flex-col items-center justify-center w-28 h-28 rounded-2xl text-white shadow-lg"
              :class="clan.isWarLogPublic ? 'bg-[#DC2626]/80' : 'bg-gray-400'">
              <span class="text-2xl font-bold">{{ clan.isWarLogPublic ? '✔' : '✖' }}</span>
              <span class="text-sm opacity-90 mt-1">سجل عام</span>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 mb-8">
            <h2 class="text-3xl font-extrabold text-[#0F172A]">👥 أعضاء الكلان</h2>
            <span class="px-4 py-1 bg-[#DC2626] text-white text-lg font-bold rounded-full shadow-md">
              {{ clan.members }}/50
            </span>
          </div>
        </div>
      </section>

      <!-- Tabs Navigation -->
      <div class="flex justify-center gap-4 mb-4">
        <button @click="activeTab = 'members'" class="px-6 py-2 rounded-full font-bold transition-all duration-300"
          :class="activeTab === 'members'
            ? 'bg-[#DC2626] text-white shadow-lg scale-105'
            : 'bg-white text-[#0F172A] border border-gray-300 hover:border-[#DC2626] hover:text-[#DC2626]'">
          👥 الأعضاء
        </button>
        <button @click="activeTab = 'warlog'" class="px-6 py-2 rounded-full font-bold transition-all duration-300"
          :class="activeTab === 'warlog'
            ? 'bg-[#DC2626] text-white shadow-lg scale-105'
            : 'bg-white text-[#0F172A] border border-gray-300 hover:border-[#DC2626] hover:text-[#DC2626]'">
          ⚔️ سجل الحروب
        </button>
      </div>

      <!-- War Log Section -->
      <section v-if="activeTab === 'warlog'" class="animate-fade-in">
        <ClanWarLog :clanTag="clan.tag" />
      </section>

      <!-- أعضاء الكلان -->
      <section v-show="activeTab === 'members'" class="animate-fade-in">
        <!-- شريط التاونات -->
        <div class="flex flex-wrap gap-3 justify-center mb-8">
          <div v-for="(members, townLevel) in groupedMembers" :key="`top-${townLevel}`"
            class="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-200 hover:border-[#DC2626] hover:scale-105 transition-all">
            <img :src="getTownhallImage(townLevel)" :alt="`Town Hall Level ${townLevel}`"
              class="w-10 h-10 object-contain" />
            <span class="bg-[#DC2626] text-white px-2 py-0.5 rounded-lg text-sm font-bold">
              {{ members.length }}
            </span>
          </div>
        </div>

        <!-- قائمة الأعضاء -->
        <section v-if="groupedMembers" class="mb-8 px-4 space-y-10"
          style="display: flex; flex-direction: column-reverse;">
          <div v-for="(members, townLevel) in groupedMembers" :key="townLevel" class="space-y-4">
            <!-- عنوان التاون -->
            <div class="flex items-center gap-4">
              <img :src="getTownhallImage(townLevel)" :alt="`Town Hall Level ${townLevel}`"
                class="w-16 h-16 object-contain" />
              <h2 class="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <span
                  class="bg-[#0F172A] text-white px-4 py-1 rounded-full text-sm shadow-sm border-l-2 border-[#DC2626]">
                  👥 {{ members.length }} لاعب
                </span>
              </h2>
            </div>
            <!-- كروت الأعضاء -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <router-link v-for="member in members" :key="member.tag"
                :to="{ name: 'PlayerDetails', params: { tag: member.tag.replace('#', '') } }"
                class="block bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md hover:border-[#DC2626]/40 transition duration-300 transform hover:-translate-y-1 group">
                <div class="flex items-center gap-4 justify-between">
                  <div
                    class="rounded-xl overflow-hidden bg-gray-50 border-2 border-[#DC2626]/20 group-hover:border-[#DC2626]/60 transition-all p-1">
                    <img :src="getTownhallImage(member.townHallLevel)" :alt="`TH ${member.townHallLevel}`"
                      class="w-16 h-16 object-contain" />
                  </div>
                  <div class="flex flex-col items-end flex-grow">
                    <h3 class="font-extrabold text-xl text-[#0F172A] truncate" :title="member.name">
                      {{ member.name }}
                    </h3>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-[#0F172A]/60 font-semibold text-base">🏆 {{ member.trophies }}</span>
                    </div>
                    <span class="font-mono text-sm text-[#DC2626] font-bold mt-1">{{ member.tag }}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </section>
      </section>

      <!-- معلومات عامة (كروت) -->
      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" v-if="clan">
        <InfoCard title="المستوى" :value="clan.clanLevel" />
        <InfoCard title="الأعضاء" :value="`${clan.members} / 50`" />
        <InfoCard title="النقاط" :value="clan.clanPoints" />
        <InfoCard title="عدد الانتصارات في الحروب" :value="clan.warWins" />
        <InfoCard title="دوري الحروب" :value="clan.warLeague?.name || 'غير متوفر'" />
        <InfoCard title="الموقع" :value="clan.location?.name || 'غير محدد'" />
      </section>

      <!-- قلعة الكلان -->
      <section v-if="clan.clanCapital" class="max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-[#0F172A]">🏰 قلعة الكلان</h2>
        <p class="mb-6 font-medium text-[#0F172A]/60 text-center">
          مستوى القلعة:
          <span class="font-extrabold text-lg text-[#DC2626]">{{ clan.clanCapital.capitalHallLevel }}</span>
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <div v-for="district in clan.clanCapital.districts" :key="district.id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:border-[#DC2626]/40 hover:shadow-md transition">
            <h3 class="font-bold text-[#0F172A] mb-2">{{ district.name }}</h3>
            <p class="text-[#DC2626] font-semibold text-sm">المستوى: {{ district.districtHallLevel }}</p>
          </div>
        </div>
      </section>

    </section>
  </div>

</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../utils/axios';
import InfoCard from '../components/InfoCard.vue';
import ClanWarLog from '../components/ClanWarLog.vue';

const activeTab = ref('members');
const clan = ref(null);
const loading = ref(true);
const error = ref(false);
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value) {
    let tag = searchQuery.value.trim().toUpperCase();
    if (!tag.startsWith('#')) {
      tag = '#' + tag;
    }
    loadClan(tag);
    activeTab.value = 'members';
  }
};

onMounted(() => {
  loadClan("#2PYCUY8RG");
});

// دالة تعطي مسار صورة التاون حسب المستوى
const getTownhallImage = (level) => {
  try {
    return new URL(`../assets/townhalls/townhall${level}.png`, import.meta.url).href
  } catch {
    return new URL(`../assets/townhalls/townhall_default.png`, import.meta.url).href
  }
}
const groupedMembers = computed(() => {
  if (!clan.value?.memberList) return {}
  // ترتيب تنازلي للتاون
  const sorted = [...clan.value.memberList].sort((a, b) => b.townHallLevel - a.townHallLevel)
  // تجميع الأعضاء حسب مستوى التاون
  return sorted.reduce((groups, member) => {
    if (!groups[member.townHallLevel]) {
      groups[member.townHallLevel] = []
    }
    groups[member.townHallLevel].push(member)
    return groups
  }, {})
})
const props = defineProps({
  clan: Object,
});
const sortedMembers = computed(() => {
  if (!clan.value?.memberList) return [];
  return [...clan.value.memberList].sort((a, b) => b.townHallLevel - a.townHallLevel);
});
// الكلانات الأربعة الثابتة
import { topClans } from "../constants/clans";
const loadClan = async (tag) => {
  loading.value = true
  error.value = false
  try {
    // لاحظ encodeURIComponent(tag) عشان الـ # تتحول لـ %23
    const res = await api.get(
      `/api/clan/${encodeURIComponent(tag)}`
    )
    clan.value = res.data
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
