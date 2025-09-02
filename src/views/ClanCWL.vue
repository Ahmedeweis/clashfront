<template>
<nav v-if="cwl && cwl.rounds && cwl.rounds.length" class="mb-6 flex flex-wrap gap-3 border-b border-gray-300 pb-2">
  <router-link
    v-for="round in cwl.rounds"
    :key="round.warTags.join('-')"
    :to="{ name: 'ClanMembersStats', params: { clanTag: round.warTags[0]?.replace('#','') } }"
    class="text-blue-600 hover:text-blue-800 border border-blue-600 rounded px-3 py-1 text-sm font-semibold transition-colors duration-200"
  >
    {{ round.warTags[0] ? round.warTags[0] : 'جولة غير معروفة' }}
  </router-link>
</nav>
<div v-else>
  لا توجد بيانات للعرض
</div>
  <div v-if="loading">جاري التحميل...</div>
  <div v-if="error">حدث خطأ أثناء تحميل بيانات CWL</div>
  <section v-if="cwl">
    <h2 class="text-2xl font-bold mb-4">⚔️ Clan War League Group</h2>
    <div class="space-y-4">
<div v-for="(round, index) in cwl.rounds" :key="index" class="mb-4 bg-white p-4 rounded shadow">
  <h3 class="text-lg font-bold mb-2">🗓️ جولة رقم {{ index + 1 }}</h3>
<ul class="grid grid-cols-2 gap-4 text-sm">
    <li
      v-for="warTag in round.warTags"
      :key="warTag"
      v-if="warTag !== '#0'"
      class="border p-2 rounded relative"
    >
      <!-- ✅ عرض التفاصيل لو متاحة -->
      <div v-if="warDetails[warTag]" class="mb-2 bg-gray-50 p-2 rounded text-xs">
        <div>🏆 {{ warDetails[warTag].clan.name }} vs {{ warDetails[warTag].opponent.name }}</div>
        <div>⭐ النجوم: {{ warDetails[warTag].clan.stars }} - {{ warDetails[warTag].opponent.stars }}</div>
<div>
  🎯 الهجمات:
  {{
    warDetails[warTag].opponent.members?.reduce((total, member) => {
      return total + (member.attacks?.length || 0)
    }, 0) || 0
  }} / 15
</div>
        <div>🔥 التدمير: {{ warDetails[warTag].clan.destructionPercentage }}% - {{ warDetails[warTag].opponent.destructionPercentage }}%</div>
      </div>
      <!-- ✅ التاج نفسه -->
      War Tag: {{ warTag }}
      <!-- ✅ الزر الأصلي ما اتغيرش -->
      <router-link
        :to="{ name: 'CWLWarDetails', params: { warTag: warTag.replace('#', '') } }"
        class="ml-2 text-blue-600 underline text-xs"
      >
        عرض التفاصيل
      </router-link>
    </li>
    <!-- لو الجولة لسه مش بدأت -->
    <li
      v-if="round.warTags.every(tag => tag === '#0')"
      class="text-gray-400 italic"
    >
      هذه الجولة لم تبدأ بعد
    </li>
  </ul>
</div>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const cwl = ref(null)
const loading = ref(true)
const error = ref(false)
const warDetails = ref({})
const loadWarDetails = async (warTag) => {
  const cleanedTag = warTag.replace('#', '')
  if (warDetails.value[warTag]) return // لو متحملة بالفعل
  try {
    // بعد
const clanTag = '2PYCUY8RG' // خليها ديناميكية من state أو input
    const res = await axios.get(`http://localhost:5000/api/clan/${clanTag}/cwl`)
    warDetails.value[warTag] = res.data
  } catch (err) {
    console.error(`❌ خطأ في تحميل تفاصيل الحرب: ${warTag}`, err)
  }
}
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/clan/cwl')
    cwl.value = res.data
  } catch (err) {
    error.value = true
    console.error(err)
  } finally {
    loading.value = false
  }
})
onMounted(async () => {
  try {
const res = await axios.get(`http://localhost:5000/api/clan/${clanTag}/cwl/war/${cleanedTag}`)
    cwl.value = res.data
    // ✅ تحميل تفاصيل كل warTag تلقائيًا (ما عدا #0)
    for (const round of cwl.value.rounds) {
      for (const warTag of round.warTags) {
        if (warTag !== '#0') {
          loadWarDetails(warTag)
        }
      }
    }
  } catch (err) {
    error.value = true
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>