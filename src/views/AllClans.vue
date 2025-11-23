<template>
  <section class="p-8 bg-[#0A0918] min-h-screen">
       <button
  @click="downloadPDF"
  class="mt-10 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
>
  📥 تحميل كـ PDF
</button>
<!-- أزرار اختيار اللون -->
<div class="flex gap-4 justify-center my-6">
  <button
    @click="selectedColor = 'red'"
    :class="['px-4 py-2 rounded font-bold', selectedColor === 'red' ? 'bg-red-600 text-white' : 'bg-red-200 text-black']"
  >
    أحمر
  </button>
  <button
    @click="selectedColor = 'green'"
    :class="['px-4 py-2 rounded font-bold', selectedColor === 'green' ? 'bg-green-600 text-white' : 'bg-green-200 text-black']"
  >
    أخضر
  </button>
  <button
    @click="selectedColor = 'yellow'"
    :class="['px-4 py-2 rounded font-bold', selectedColor === 'yellow' ? 'bg-yellow-600 text-white' : 'bg-yellow-200 text-black']"
  >
    أصفر
  </button>
<button
  class="w-4 h-4 bg-gray-400 rounded-full"
  @click="playerColors[m.tag] = null"
>🧹</button>
</div>
<div class="grid md:grid-cols-3 gap-6 mt-16">
  <div
    v-for="c in topClans"
    :key="c.tag"
    class="bg-[#1a172b] rounded-xl shadow-lg p-4 border border-purple-800"
  >
    <!-- عنوان الكلان -->
    <h2 class="text-xl font-bold text-center text-pink-400 mb-4">
      {{ c.name }}
    </h2>
    <!-- جدول الأعضاء -->
    <table class="w-full text-left text-gray-200">
      <thead>
        <tr class="border-b border-gray-600">
          <th class="py-2 px-2">#</th>
          <th class="py-2 px-2">الاسم</th>
          <th class="py-2 px-2">#</th>
          <th class="py-2 px-2">الاسم</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(pair, rowIndex) in chunkMembers(getMembersByClan(c.tag))"
          :key="rowIndex"
          class="hover:bg-purple-900/40 transition"
        >
          <!-- اللاعب الأول -->
          <td class="py-2 px-2">{{ pair[0] ? rowIndex * 2 + 1 : '' }}</td>
          <td
            class="py-2 px-2 flex items-center gap-2 cursor-pointer rounded"
            v-if="pair[0]"
            @click="assignColor(pair[0].tag)"
            :class="playerColors[pair[0].tag] ? colorClasses[playerColors[pair[0].tag]] : ''"
          >
            <img
              :src="getTownhallImage(pair[0].townHallLevel)"
              class="w-6 h-6 object-contain"
            />
            <span class="truncate">{{ pair[0].name }}</span>
          </td>
          <!-- اللاعب الثاني -->
          <td class="py-2 px-2">{{ pair[1] ? rowIndex * 2 + 2 : '' }}</td>
          <td
            class="py-2 px-2 flex items-center gap-2 cursor-pointer rounded"
            v-if="pair[1]"
            @click="assignColor(pair[1].tag)"
            :class="playerColors[pair[1].tag] ? colorClasses[playerColors[pair[1].tag]] : ''"
          >
            <img
              :src="getTownhallImage(pair[1].townHallLevel)"
              class="w-6 h-6 object-contain"
            />
            <span class="truncate">{{ pair[1].name }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<!-- ✅ جدول التجميعي تحت -->
<!-- ✅ جدول تجميعي عمود واحد -->
<div
  v-if="Object.keys(selectedPlayers).length"
  class="mt-16 bg-[#1a172b] p-6 rounded-xl shadow-lg border border-yellow-600"
>
  <h2 class="text-2xl font-bold text-center text-yellow-400 mb-6">
    📋 اللاعبين المختارين
  </h2>
  <!-- شبكة للألوان -->
  <div class="grid md:grid-cols-3 gap-6">
    <div
      v-for="(players, color) in selectedPlayers"
      :key="color"
      class="bg-[#14122b] p-4 rounded-lg shadow-md"
    >
      <!-- عنوان لكل لون -->
      <h3 class="text-lg font-bold mb-2 text-center" :class="colorClasses[color]">
        🎨 {{ color }}
      </h3>
      <table class="w-full text-left text-gray-200">
        <thead>
          <tr class="border-b border-gray-600">
            <th class="py-2 px-2">اللاعبين</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(m, i) in players"
            :key="m.tag"
            :class="colorClasses[color]"
            class="transition"
          >
            <td class="py-2 px-2" dir="ltr">
              {{ i + 1 }} - {{ m.name }} | {{ m.townHallLevel }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
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
  v-for="m in sortedMembers"
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
  <!-- ✅ 3 جداول جنب بعض -->
</template>
<script setup>
import { ref, computed, onMounted } from "vue"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import "../assets/fonts/Cairo-Regular-normal"  // ملف الخط اللي طلعته من المحول
import axios from "axios"
// ✅ دالة تحميل PDF
const downloadPDF = () => {
  const doc = new jsPDF()
  // عنوان رئيسي
  doc.setFontSize(18)
  doc.text("تقرير أعضاء الكلانات", 105, 15, { align: "center" })
  // نعمل جدول لكل كلان
  topClans.value.forEach((c, idx) => {
    const members = getMembersByClan(c.tag)
    // تجهيز البيانات للجدول
    const tableData = members.map((m, i) => [
      i + 1, // رقم
      m.name, // اسم
      m.townHallLevel, // تاون
      m.trophies // كؤوس
    ])
    // العنوان قبل الجدول
    doc.setFontSize(14)
    doc.text(c.name, 14, 30 + idx * 80) // يتحرك لتحت مع كل جدول
    // الجدول
    autoTable(doc, {
      head: [["#", "الاسم", "تاون", "🏆 كؤوس"]],
      body: tableData,
      startY: 35 + idx * 80,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [138, 43, 226] } // بنفسجي
    })
  })
  // حفظ الملف
  doc.save("clans-report.pdf")
}
const chunkMembers = (members) => {
  const result = []
  for (let i = 0; i < members.length; i += 2) {
    result.push([members[i], members[i + 1]])
  }
  return result
}
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
// ✅ تحميل جميع الكلانات مع كاش
const loadAllClans = async () => {
  loadingAll.value = true
  errorAll.value = false
  try {
    // 1) جرب تجيب من الكاش
    const cached = localStorage.getItem("allMembersCache")
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      const now = Date.now()
      // 2) صلاحية الكاش (10 دقائق مثلاً)
      if (now - timestamp < 10 * 60 * 1000) {
        allMembers.value = data
        loadingAll.value = false
        return
      }
    }
    // 3) مفيش كاش أو منتهي → هات من السيرفر
    let all = []
    for (const c of topClans.value) {
      const res = await axios.get(
        `http://localhost:5000/api/clan/${encodeURIComponent(c.tag)}`
      )
      const membersWithClan = res.data.memberList.map((m) => ({
        ...m,
        clan: { name: res.data.name, tag: res.data.tag }
      }))
      all.push(...membersWithClan)
      await delay(500)
    }
    allMembers.value = all
    // 4) خزن في الكاش
    localStorage.setItem(
      "allMembersCache",
      JSON.stringify({ data: all, timestamp: Date.now() })
    )
  } catch (err) {
    console.error(err)
    errorAll.value = true
  } finally {
    loadingAll.value = false
  }
}
const getMembersByClan = (clanTag) => {
  return [...allMembers.value]
    .filter((m) => m.clan?.tag === clanTag)
    .sort((a, b) => b.townHallLevel - a.townHallLevel)
}
onMounted(() => {
  loadAllClans()
})
// اللون النشط حالياً
const selectedColor = ref(null)
// ألوان اللاعبين (مفتاح = tag)
const playerColors = ref({})
// الكلاسات للألوان
const colorClasses = {
  red: "bg-red-500/40",
  green: "bg-green-500/40",
  yellow: "bg-yellow-400/40"
}
// تعيين اللون للاعب
const assignColor = (tag) => {
  if (playerColors.value[tag] === selectedColor.value) {
    // لو اللاعب واخد نفس اللون اللي مختار → امسحه
    delete playerColors.value[tag]
  } else if (selectedColor.value) {
    // لو لون جديد → حط اللون
    playerColors.value[tag] = selectedColor.value
  }
}
// computed لاعبين مختارين فقط
// نفس الـ computed
const selectedPlayers = computed(() => {
  // نجيب كل اللاعبين اللي ليهم لون
  const filtered = allMembers.value.filter(m => playerColors.value[m.tag])
  // نجمعهم جروبات حسب اللون
  const grouped = {}
  filtered.forEach(m => {
    const color = playerColors.value[m.tag]
    if (!grouped[color]) grouped[color] = []
    grouped[color].push(m)
  })
  // نرتب كل جروب داخلياً
  Object.keys(grouped).forEach(color => {
    grouped[color].sort((a, b) => b.townHallLevel - a.townHallLevel)
  })
  return grouped
})
</script>
