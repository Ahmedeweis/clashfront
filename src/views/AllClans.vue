<template>
  <section class="p-8 bg-[#0A0918] min-h-screen">
       <div class="flex gap-4 justify-center items-center mt-10">
  <button
    @click="downloadPDF"
    class="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition transform hover:shadow-2xl"
  >
    📥 تحميل كـ PDF
  </button>
  <button
    @click="downloadExcel"
    class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition transform hover:shadow-2xl"
  >
    📊 تحميل كـ Excel
  </button>
</div>

<!-- ✅ كومبوننت إدارة الواتساب -->


<!-- أزرار اختيار اللون -->
<div class="flex gap-4 justify-center my-6">
  <button
    @click="selectedColor = 'red'"
    :class="['px-4 py-2 rounded font-bold flex flex-col items-center', selectedColor === 'red' ? 'bg-red-600 text-white' : 'bg-red-200 text-black']"
  >
    <span>أحمر</span>
    <span class="text-sm mt-1 bg-white/20 px-2 rounded-full">{{ selectedPlayers['red']?.length || 0 }}</span>
  </button>
  <button
    @click="selectedColor = 'green'"
    :class="['px-4 py-2 rounded font-bold flex flex-col items-center', selectedColor === 'green' ? 'bg-green-600 text-white' : 'bg-green-200 text-black']"
  >
    <span>أخضر</span>
    <span class="text-sm mt-1 bg-white/20 px-2 rounded-full">{{ selectedPlayers['green']?.length || 0 }}</span>
  </button>
  <button
    @click="selectedColor = 'yellow'"
    :class="['px-4 py-2 rounded font-bold flex flex-col items-center', selectedColor === 'yellow' ? 'bg-yellow-600 text-white' : 'bg-yellow-200 text-black']"
  >
    <span>أصفر</span>
    <span class="text-sm mt-1 bg-white/20 px-2 rounded-full">{{ selectedPlayers['yellow']?.length || 0 }}</span>
  </button>
  <button
    @click="selectedColor = 'blue'"
    :class="['px-4 py-2 rounded font-bold flex flex-col items-center', selectedColor === 'blue' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-black']"
  >
    <span>أزرق</span>
    <span class="text-sm mt-1 bg-white/20 px-2 rounded-full">{{ selectedPlayers['blue']?.length || 0 }}</span>
  </button>
<button
  class="w-4 h-4 bg-gray-400 rounded-full"
  @click="playerColors[m.tag] = null"
>🧹</button>
</div>
<div class="grid md:grid-cols-3 gap-6 ">
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
            <!-- تاون {{ stat.level }} -->
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

    <!-- ✅ قسم Player IDs -->
    <div class="mt-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-2xl shadow-2xl border border-purple-500">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
          🆔 معرفات اللاعبين
        </h2>
        <button
          @click="downloadPlayerIDsPDF"
          class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition transform hover:shadow-2xl"
        >
          📥 تحميل IDs كـ PDF
        </button>
      </div>

      <!-- جدول IDs -->
      <div class="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="m in sortedMembers"
            :key="m.tag"
            class=" p-4 rounded-lg border bg-white"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <img :src="getTownhallImage(m.townHallLevel)" class="w-8 h-8 object-contain flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-black font-bold truncate">{{ m.name }}</p>
                  <p class=" text-black">{{ m.clan?.name }}</p>
                  <p v-if="getOwnerWithWhatsappForPlayer(m.tag)" class=" text-green-400 mt-0.5 font-mono">
                    {{ getOwnerWithWhatsappForPlayer(m.tag) }}
                  </p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-cyan-400 font-mono text-sm font-bold">{{ m.tag }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- إحصائيات سريعة -->
      <div class="mt-6 flex flex-wrap gap-4 justify-center">
        <div class="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-3 rounded-lg shadow-lg">
          <p class="text-white font-bold text-center">
            <span class="text-2xl">{{ allMembers.length }}</span>
            <br>
            <span class="text-sm opacity-80">إجمالي اللاعبين</span>
          </p>
        </div>
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 rounded-lg shadow-lg">
          <p class="text-white font-bold text-center">
            <span class="text-2xl">{{ topClans.length }}</span>
            <br>
            <span class="text-sm opacity-80">عدد الكلانات</span>
          </p>
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
import * as XLSX from "xlsx"
import whatsappDataJson from '../data/playersWhatsapp.json'
const whatsappData = ref([...whatsappDataJson])
const getOwnerData = (playerTag) => {
  for (const owner of whatsappData.value) {
    if (owner.villages) {
      for (const village of owner.villages) {
        if (village.villageId === playerTag) {
          return owner
        }
      }
    }
  }
  return null
}

const getOwnerName = (playerTag) => {
  const owner = getOwnerData(playerTag)
  return owner ? owner.ownerName : ""
}

const getWhatsapp = (playerTag) => {
  const owner = getOwnerData(playerTag)
  return owner ? owner.whatsapp : ""
}

const getOwnerWithWhatsappForPlayer = (playerTag) => {
  const owner = getOwnerData(playerTag)
  return owner ? `${owner.ownerName} | ${owner.whatsapp}` : ""
}
// ✅ دالة تحميل Excel
const downloadExcel = () => {
  // إنشاء workbook جديد
  const wb = XLSX.utils.book_new()

  // ترتيب الألوان
  const groups = [
    { key: 'red', label: 'Fiery Wars Exllent CWL' },
    { key: 'green', label: 'IRAQ #2nd CWL' },
    { key: 'yellow', label: 'Botat CWL' },
    { key: 'blue', label: 'سوبر CWL' }
  ]

  let allData = []

  groups.forEach(g => {
    const players = selectedPlayers.value[g.key] || []
    if (players.length > 0) {
      players.forEach((m, i) => {
        allData.push({
          "Category": g.label,
          "No": i + 1,
          "Name": m.name,
          "TH": m.townHallLevel,
          "Owner Name": getOwnerName(m.tag),
          "WhatsApp": getWhatsapp(m.tag)
        })
      })
    }
  })

  // تحويل البيانات إلى sheet
  const ws = XLSX.utils.json_to_sheet(allData)

  // ضبط عرض الأعمدة
  const wscols = [
    { wch: 25 }, // Category
    { wch: 5 },  // No
    { wch: 20 }, // Name
    { wch: 5 },  // TH
    { wch: 20 }, // Owner Name
    { wch: 15 }  // WhatsApp
  ]
  ws['!cols'] = wscols

  XLSX.utils.book_append_sheet(wb, ws, "Selected Players")

  // حفظ الملف
  XLSX.writeFile(wb, 'selected-players.xlsx')
}


// ✅ دالة تحميل PDF
const downloadPDF = () => {
  const doc = new jsPDF()

  // عنوان رئيسي
  doc.setFont("Cairo-VariableFont_slnt,wght")
  doc.setFontSize(18)
  doc.text("📋  Choosen Players", 105, 15, { align: "center" })

  let finalY = 30

  const groups = [
    { key: 'red',    label: 'Fiery Wars Exllent CWL',    tag: '#2PYCUY8RG',    color: [255, 0, 0] },
    { key: 'green',  label: 'IRAQ #2nd CWL',             tag: '#QL92PVUC',     color: [0, 128, 0] },
    { key: 'yellow', label: 'Botat CWL',                 tag: '#2PPCCLUQV',    color: [0, 0, 0] },
    { key: 'blue',   label: 'سوبر CWL',                  tag: '#2QGU09G0R',    color: [0, 0, 255] }
  ]

  groups.forEach(g => {
    const players = selectedPlayers.value[g.key] || []
    if (players.length > 0) {

      const linkUrl = `https://link.clashofclans.com/ar?action=OpenClanProfile&tag=${g.tag.replace('#', '')}`

      // عنوان المجموعة
      doc.setFontSize(14)
      doc.setTextColor(g.color[0], g.color[1], g.color[2])
      doc.text(g.label, 14, finalY)

      // رابط لاسم الكلان
      const labelWidth = doc.getTextWidth(g.label)
      doc.link(14, finalY - 4, labelWidth, 5, { url: linkUrl })

      // إضافة الـ tag تحت الاسم
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(g.tag, 14, finalY + 5)

      // رابط للـ tag
      const tagWidth = doc.getTextWidth(g.tag)
      doc.link(14, finalY + 1.5, tagWidth, 4, { url: linkUrl })



      doc.setTextColor(0, 0, 0)

      // جدول بدون عمود التاون هول
      const tableData = players.map((m, i) => [
        i + 1,
        m.name,
        getOwnerName(m.tag),
        getWhatsapp(m.tag)
      ])

      autoTable(doc, {
        head: [["No", "Name", "Owner Name", "WhatsApp"]],
        body: tableData,
        startY: finalY + 10,
        theme: "grid",
        styles: { font: "Cairo-VariableFont_slnt,wght", fontStyle: "normal", halign: "right" },
        headStyles: { fillColor: g.color, halign: "right", textColor: g.key === 'yellow' ? [0,0,0] : [255,255,255] },
        columnStyles: {
          0: { cellWidth: 10 },   // No
          1: { cellWidth: 50 },   // Name
          2: { cellWidth: 50 },   // Owner Name
          3: { cellWidth: 50 }    // WhatsApp
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            const phoneNumber = data.cell.raw
            if (phoneNumber) {
              const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
              const url = `https://wa.me/${cleanNumber}`
              doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: url })
            }
          }
        }
      })

      finalY = doc.lastAutoTable.finalY + 15
    }
  })

  doc.save("selected-players.pdf")
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
  { name: "ارض النخبة", tag: "#2PPCCLUQV" },
  { name: "سوبر", tag: "#2QGU09G0R" }
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
  yellow: "bg-yellow-400/40",
  blue: "bg-blue-500/40"
}
// تعيين اللون للاعب
const assignColor = (tag) => {
  if (playerColors.value[tag] === selectedColor.value) {
    // لو اللاعب واخد نفس اللون اللي مختار → امسحه
    playerColors.value[tag] = null
  } else if (selectedColor.value) {
    // لو لون جديد → حط اللون
    playerColors.value[tag] = selectedColor.value
  }
}
// computed لاعبين مختارين فقط
// نفس الـ computed
const selectedPlayers = computed(() => {
  // نجيب كل اللاعبين اللي ليهم لون (وليس null)
  const filtered = allMembers.value.filter(m => playerColors.value[m.tag] && playerColors.value[m.tag] !== null)
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
