<template>
  <div v-if="loading" class="flex justify-center items-center min-h-[300px] bg-[#0A0918]">
    <p class="text-gray-500 text-lg">جارٍ التحميل...</p>
  </div>
  <div v-else-if="error" class="text-center text-red-600 font-bold my-10">
    حدث خطأ في تحميل بيانات الكلان. حاول مرة أخرى لاحقاً.
  </div>
  <section v-if="clan" class=" p-8 space-y-10  bg-[#0A0918]">
    <!-- ✅ شريط الكلانات الأربعة فوق -->
    <div class="flex flex-wrap justify-center gap-6 mb-10">
      <div v-for="c in topClans" :key="c.tag" class="cursor-pointer bg-gradient-to-tr from-purple-800 via-pink-600 to-red-500
           rounded-2xl shadow-xl p-4 flex flex-col items-center w-40 hover:scale-105
           transition-transform duration-300" @click="loadClan(c.tag)">
        <img :src="c.badge" alt="Clan Badge" class="w-16 h-16 mb-3 drop-shadow-lg" />
        <h3 class="text-white font-bold text-center truncate">{{ c.name }}</h3>
      </div>
    </div>
    <!-- القسم الرئيسي: شعار واسم الكلان -->
    <div
      class="  bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl text-gray-100 p-4">
     <router-link to="/all-clans">All Clan</router-link>
      <!-- شعار الكلان -->
      <div
        class="flex flex-col md:flex-row items-start gap-12 p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-lg">
        <!-- العمود الأيسر: البادج + الوسوم -->
        <div class="flex flex-col items-start gap-6 md:w-1/3">
          <!-- صورة البادج -->
          <div
            class="relative w-44 h-44 flex-shrink-0 rounded-full overflow-hidden border-4 border-pink-500 shadow-xl hover:shadow-pink-600 transition-shadow duration-500"
            aria-label="Clan Badge">
            <img :src="clan.badgeUrls.large" alt="Clan Badge"
              class="w-full h-full object-contain bg-gradient-to-tr from-purple-800 via-pink-600 to-red-500 p-4"
              loading="lazy" />
            <div
              class="absolute inset-0 rounded-full pointer-events-none animate-pulse border-2 border-pink-400 opacity-40">
            </div>
          </div>
          <!-- وسم الكلان -->
          <p class="text-xl font-semibold text-pink-300 flex items-center gap-2">
            <span class="opacity-80">Tag:</span>
            <span
              class="inline-block px-4 py-1 rounded-full bg-pink-600 bg-opacity-60 font-mono tracking-wider select-text"
              title="وسم الكلان">
              {{ clan.tag }}
            </span>
          </p>
          <!-- الوسوم -->
          <section v-if="clan.labels?.length" class="w-full">
            <div class="flex flex-wrap justify-start gap-3">
              <span v-for="label in clan.labels" :key="label.id"
                class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg shadow hover:scale-105 transition-transform">
                <img :src="label.iconUrls.small" alt="Label icon" class="w-6 h-6" />
              </span>
            </div>
          </section>
        </div>
        <!-- العمود الأيمن: معلومات الكلان -->
        <div class="flex-1 space-y-10 text-end md:w-2/3">
          <!-- اسم الكلان -->
          <h1 class="text-6xl h-[75px] font-extrabold tracking-wide
             bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400
             bg-clip-text text-transparent drop-shadow-lg
             hover:scale-105 transition-transform duration-500
             cursor-default select-none" title="اسم الكلان">
            {{ clan.name }}
          </h1>
          <!-- الدوري -->
          <section v-if="clan.capitalLeague" class="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
             rounded-xl shadow-lg px-6 py-4 text-white text-center w-fit ml-auto">
            <h2 class="text-2xl font-semibold flex items-center justify-center gap-3">
              <img src="../assets/img/master.png" alt="Capital League" class="w-10" />
              {{ clan.warLeague.name }}
            </h2>
          </section>
          <!-- متطلبات الانضمام -->
          <!-- <section
      v-if="clan.requiredTownhallLevel || clan.requiredTrophies"
      class="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center border border-white/20"
    >
      <h2 class="text-2xl font-semibold mb-6 flex justify-center items-center gap-2 text-pink-300">
        📌 متطلبات الانضمام
      </h2>
      <div class="space-y-3 text-pink-100">
        <p>
          مستوى مركز المدينة المطلوب:
          <span class="font-bold text-yellow-300">{{ clan.requiredTownhallLevel || 'غير محدد' }}</span>
        </p>
        <p>
          عدد الكؤوس المطلوب:
          <span class="font-bold text-yellow-300">{{ clan.requiredTrophies || 'غير محدد' }}</span>
        </p>
      </div>
    </section> -->
          <!-- لغة الدردشة -->
          <!-- <section
      v-if="clan.chatLanguage"
      class="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center border border-white/20"
    >
      <h2 class="text-2xl font-semibold mb-3 flex justify-center items-center gap-2 text-pink-300">
        🗣️ لغة الدردشة
      </h2>
      <p class="text-lg font-medium text-pink-100">
        {{ clan.chatLanguage.name }}
        <span class="text-sm opacity-75">({{ clan.chatLanguage.languageCode }})</span>
      </p>
    </section> -->
          <!-- الوصف -->
          <div class="max-w-2xl ml-auto">
            <p v-if="clan.description" class="text-lg leading-relaxed text-pink-200 whitespace-pre-wrap font-light">
              {{ clan.description }}
            </p>
            <p v-else class="text-lg leading-relaxed italic text-pink-400 opacity-75">
              لا يوجد وصف متوفر لهذا الكلان حاليًا.
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- معلومات الحروب -->
    <section class="" v-if="clan">
      <div class="flex justify-between item-center">
        <div class="flex flex-wrap justify-start gap-4">
          <div
            class="flex flex-col items-center justify-center w-28 h-28 rounded-lg text-white shadow-md bg-gradient-to-br from-pink-400 to-red-500">
            <span class="text-4xl font-bold">{{ clan.warWinStreak }}</span>
            <span class="text-sm opacity-90">انتصارات</span>
          </div>
          <div
            class="flex flex-col items-center justify-center w-28 h-28 rounded-lg text-white shadow-md bg-gradient-to-br from-yellow-400 to-pink-400">
            <span class="text-4xl font-bold">{{ clan.warTies }}</span>
            <span class="text-sm opacity-90">تعادلات</span>
          </div>
          <div
            class="flex flex-col items-center justify-center w-28 h-28 rounded-lg text-white shadow-md bg-gradient-to-br from-red-500 to-purple-500">
            <span class="text-4xl font-bold">{{ clan.warLosses }}</span>
            <span class="text-sm opacity-90">خسائر</span>
          </div>
          <div
            class="flex flex-col items-center justify-center w-28 h-28 rounded-lg text-white shadow-md bg-gradient-to-br from-purple-600 to-blue-600">
            <span class="text-2xl font-bold">
              {{ clan.isWarLogPublic ? '✔' : '✖' }}
            </span>
            <span class="text-sm opacity-90">سجل عام</span>
          </div>
        </div>
        <div class="flex items-center justify-center gap-3 mb-8">
          <h2 class="text-3xl font-extrabold text-white">👥 أعضاء الكلان</h2>
          <span class="px-4 py-1 bg-purple-800 text-white text-lg font-semibold rounded-full shadow-md">
            {{ clan.members }}/50
          </span>
        </div>
      </div>
    </section>
    <!-- أعضاء الكلان -->
    <!-- ✅ شريط التاونات فوق -->
    <div class="flex flex-wrap gap-4 justify-center mb-6">
      <div v-for="(members, townLevel) in groupedMembers" :key="`top-${townLevel}`"
        class="flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 px-1 py-3 rounded-xl shadow-lg border border-purple-600 hover:scale-105 transition-transform">
        <!-- صورة التاون -->
        <img :src="getTownhallImage(townLevel)" :alt="`Town Hall Level ${townLevel}`"
          class="w-12 h-12 object-contain drop-shadow-md" />
        <!-- النصوص -->
        <div class="flex items-center gap-2 text-yellow-300 font-bold text-lg">
          <span>لاعب</span>
          <span class="bg-black/40 px-2 py-0.5 rounded-lg text-white">
            {{ members.length }}
          </span>
        </div>
      </div>
    </div>
    <!-- ✅ نفس الكود اللي عندك تحت بالظبط (ما لمسناهوش) -->
    <section v-if="groupedMembers" class="mb-8 flex column-reverse px-4 space-y-10"
      style="display: flex; flex-direction: column-reverse;">
      <div v-for="(members, townLevel) in groupedMembers" :key="townLevel" class="space-y-4">
        <!-- عنوان التاون -->
        <div class="flex items-center gap-4">
          <img :src="getTownhallImage(townLevel)" :alt="`Town Hall Level ${townLevel}`"
            class="w-16 h-16 object-contain" />
          <h2 class="text-lg font-semibold text-yellow-300 flex items-center gap-2">
            <span class="bg-[#222] px-3 py-1 rounded-full shadow-lg">
              👥 {{ members.length }} لاعب
            </span>
          </h2>
        </div>
        <!-- عرض أعضاء التاون -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <router-link v-for="member in members" :key="member.tag"
            :to="{ name: 'PlayerDetails', params: { tag: member.tag.replace('#', '') } }"
            class="block bg-gradient-to-br from-purple-700 via-purple-900 to-black rounded-3xl shadow-2xl p-6 hover:shadow-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-2">
            <div class="flex items-center gap-4 mb-5 justify-between">
              <div
                class="relative w-20 h-20 rounded-lg overflow-hidden bg-black shadow-inner border-4 border-purple-600">
                <img :src="getTownhallImage(member.townHallLevel)" :alt="`Town Hall Level ${member.townHallLevel}`"
                  class="w-full h-full object-contain" />
              </div>
              <div class="flex flex-col items-end flex-grow">
                <h3 class="font-extrabold text-2xl text-white truncate drop-shadow-lg" :title="member.name">
                  {{ member.name }}
                </h3>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-white/80 font-semibold text-lg">🏆 {{ member.trophies }}</span>
                </div>
                           <h3 class="font-extrabold text-xl text-white truncate drop-shadow-lg" :title="member.name">  {{ member.tag }}</h3>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>
    <!-- دوري القلعة -->
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
      <h2 class="text-2xl font-semibold mb-6 flex items-center gap-3">🏰 قلعة الكلان</h2>
      <p class="mb-6 font-medium text-gray-700 text-center">
        مستوى القلعة:
        <span class="font-bold text-lg">{{ clan.clanCapital.capitalHallLevel }}</span>
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <div v-for="district in clan.clanCapital.districts" :key="district.id"
          class="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <h3 class="font-semibold text-gray-800 mb-2">{{ district.name }}</h3>
          <p class="text-gray-500 text-sm">المستوى: {{ district.districtHallLevel }}</p>
        </div>
      </div>
    </section>
  </section>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../utils/axios';
import axios from 'axios'
const clan = ref(null)
const loading = ref(true)
const error = ref(false)
onMounted(async () => {
  try {
    const tag = "#2PYCUY8RG";
    const encodedTag = encodeURIComponent(tag);
    const res = await api.get(`/api/clan/${encodedTag}`);
    clan.value = res.data;
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
});
// مكون فرعي للبطاقات الصغيرة (يمكن وضعه في ملف منفصل لو تحب)
const InfoCard = {
  props: ['title', 'value'],
  template: `
    <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
      <p class="text-gray-500 text-sm">{{ title }}</p>
      <p class="text-2xl font-bold text-gray-900 mt-2">{{ value }}</p>
    </div>
  `
}
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
const topClans = ref([
  {
    name: "Fiery Wars",
    tag: "#2PYCUY8RG",
    badge: new URL("../assets/img/master.png", import.meta.url).href
  },
  {
    name: "درع العراق",
    tag: "#QL92PVUC",
    badge: new URL("../assets/img/master.png", import.meta.url).href
  },
  {
    name: "ارض النخبة",
    tag: "#2PPCCLUQV",
    badge: new URL("../assets/img/master.png", import.meta.url).href
  }
])
const loadClan = async (tag) => {
  loading.value = true
  error.value = false
  try {
    // لاحظ encodeURIComponent(tag) عشان الـ # تتحول لـ %23
    const res = await axios.get(
      `http://localhost:5000/api/clan/${encodeURIComponent(tag)}`
    )
    clan.value = res.data
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
