<template>
  <section class="p-8 bg-[#0A0918] min-h-screen">
    <!-- العنوان -->
    <h1 class="text-3xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400">
      👥 جميع الأعضاء
    </h1>
    <!-- التحميل أو الخطأ -->
    <div v-if="loadingAll" class="flex justify-center items-center min-h-[200px]">
      <p class="text-gray-500 text-lg animate-pulse">جارٍ تحميل جميع الأعضاء...</p>
    </div>
    <div v-else-if="errorAll" class="text-center text-red-500 font-bold my-10">
      ⚠️ حدث خطأ أثناء تحميل البيانات
    </div>
    <div v-else>
      <!-- ✅ شريط إحصائيات التاون -->
      <div class="flex flex-wrap justify-center gap-4 mb-10">
        <div
          v-for="stat in townhallStats"
          :key="stat.level"
          class="flex items-center gap-3 bg-gradient-to-tr from-purple-700 via-pink-600 to-red-500 px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <img :src="getTownhallImage(stat.level)" class="w-12 h-12 object-contain drop-shadow-md" />
          <div class="text-white font-semibold text-lg flex items-center gap-2">
            تاون {{ stat.level }}
            <span class="bg-black/40 px-2 py-0.5 rounded-lg text-yellow-300">{{ stat.count }}</span>
          </div>
        </div>
      </div>
      <!-- ✅ شبكة الأعضاء -->
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
<div
  v-for="m in allMembers"
  :key="m.tag"
  @click="$router.push({ name: 'PlayerDetails', params: { tag: m.tag.replace('#', '') } })"
  class="cursor-pointer bg-gradient-to-br from-purple-700 via-purple-900 to-black rounded-xl p-4 shadow-lg hover:scale-105 transition"
>
  <div class="flex items-center gap-3 mb-2">
    <img :src="getTownhallImage(m.townHallLevel)" class="w-10 h-10 object-contain" />
    <h4 class="text-lg font-bold text-white truncate">{{ m.name }}</h4>
  </div>
  <p class="text-sm text-gray-300">🏆 {{ m.trophies }}</p>
  <p class="text-xs text-gray-400">Tag: {{ m.tag }}</p>
  <p class="text-xs text-pink-400">Clan: {{ m.clan?.name }}</p>
</div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "axios"
const topClans = ref([
  { name: "Fiery Wars", tag: "#2PYCUY8RG" },
  { name: "درع العراق", tag: "#QL92PVUC" },
  { name: "ارض النخبة", tag: "#2PPCCLUQV" }
])
const allMembers = ref([])
const loadingAll = ref(false)
const errorAll = ref(false)
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
// صور التاون
const getTownhallImage = (level) => {
  try {
    return new URL(`../assets/townhalls/townhall${level}.png`, import.meta.url).href
  } catch {
    return new URL(`../assets/townhalls/townhall_default.png`, import.meta.url).href
  }
}
// ✅ إحصائيات التاون
const townhallStats = computed(() => {
  const stats = {}
  for (const m of allMembers.value) {
    stats[m.townHallLevel] = (stats[m.townHallLevel] || 0) + 1
  }
  return Object.entries(stats)
    .map(([level, count]) => ({ level, count }))
    .sort((a, b) => b.level - a.level)
})
// ✅ ترتيب الأعضاء
const sortedMembers = computed(() => {
  return [...allMembers.value].sort((a, b) => b.townHallLevel - a.townHallLevel)
})
// ✅ تحميل جميع الكلانات
const loadAllClans = async () => {
  loadingAll.value = true
  errorAll.value = false
  allMembers.value = []
  try {
    for (const c of topClans.value) {
      const res = await axios.get(
        `http://localhost:5000/api/clan/${encodeURIComponent(c.tag)}`
      )
      const membersWithClan = res.data.memberList.map((m) => ({
        ...m,
        clan: { name: res.data.name, tag: res.data.tag }
      }))
      allMembers.value.push(...membersWithClan)
      await delay(500)
    }
  } catch (err) {
    console.error(err)
    errorAll.value = true
  } finally {
    loadingAll.value = false
  }
}
onMounted(() => {
  loadAllClans()
})
</script>
