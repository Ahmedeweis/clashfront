<template>
  <div class="min-h-screen bg-gray-100 py-10 px-4 md:px-12">
    <div v-if="loading" class="text-center text-lg font-semibold">⏳ جاري تحميل تفاصيل الحرب...</div>
    <div v-else-if="error" class="text-center text-red-600 font-semibold">❌ حدث خطأ أثناء تحميل بيانات الحرب</div>
    <div v-else-if="war" class="space-y-8">
      <!-- العنوان -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">🛡️ {{ war.clan.name }} <span class="text-gray-400">VS</span> {{ war.opponent.name }}</h2>
        <p class="text-sm text-gray-500">📅 {{ formatTime(war.startTime) }} - {{ formatTime(war.endTime) }}</p>
        <p class="text-sm text-gray-600 mt-2">🔁 الحالة: <span class="font-semibold text-blue-600">{{ war.state }}</span></p>
      </div>
           <!-- النتيجة -->
      <div class="grid grid-cols-2 gap-6 text-center">
        <div class="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-600">
          <h3 class="text-xl font-bold text-blue-700">{{ war.clan.name }}</h3>
          <p class="text-gray-600 mt-2">⭐ النجوم: {{ war.clan.stars }}</p>
          <p class="text-gray-600">💥 التدمير: {{ war.clan.destructionPercentage }}%</p>
        </div>
        <div class="bg-white shadow-md rounded-xl p-6 border-t-4 border-red-600">
          <h3 class="text-xl font-bold text-red-700">{{ war.opponent.name }}</h3>
          <p class="text-gray-600 mt-2">⭐ النجوم: {{ war.opponent.stars }}</p>
          <p class="text-gray-600">💥 التدمير: {{ war.opponent.destructionPercentage }}%</p>
        </div>
      </div>
      <!-- <div class="flex flex-wrap gap-1">
  <div
  v-for="member in war.opponent.members"
  :key="member.tag"
  class="bg-white p-4 rounded-lg shadow mb-4 flex justify-between"
>
  {{ member.name }}
  (TH{{ member.townhallLevel }})
                <ul class="text-sm text-gray-600 list-disc ml-5" style="list-style: none;">
                <li v-for="(attack, i) in member.attacks" :key="i">
                 ⭐{{ attack.stars }} | 💥 {{ attack.destructionPercentage }}%
                </li>
              </ul>
</div>
</div> -->
<!-- ملخص الهجمات -->
<div class="grid grid-cols-2 gap-6 text-center mb-4">
  <div class="bg-white shadow-md rounded-xl p-4 border-t-4 border-blue-400">
    <h3 class="text-lg font-bold text-blue-700">{{ war.clan.name }}</h3>
    <p class="text-gray-600 mt-1">عدد الهجمات:
      <span class="font-semibold">{{ totalClanAttacks }}</span>
    </p>
  </div>
  <div class="bg-white shadow-md rounded-xl p-4 border-t-4 border-red-400">
    <h3 class="text-lg font-bold text-red-700">{{ war.opponent.name }}</h3>
    <p class="text-gray-600 mt-1">عدد الهجمات:
      <span class="font-semibold">{{ totalOpponentAttacks }}</span>
    </p>
  </div>
</div>
      <!-- <div class="flex flex-wrap gap-1">
  <div
  v-for="member in war.opponent.members"
  :key="member.tag"
  class="bg-white p-4 rounded-lg shadow mb-4 flex justify-between"
>
  {{ member.name }}
  (TH{{ member.townhallLevel }})
                <ul class="text-sm text-gray-600 list-disc ml-5" style="list-style: none;">
                <li v-for="(attack, i) in member.attacks" :key="i">
                 ⭐{{ attack.stars }} | 💥 {{ attack.destructionPercentage }}%
                </li>
              </ul>
</div>
</div> -->
      <!-- اللاعبين -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 class="text-lg font-semibold text-blue-700 mb-3">👑 لاعبي الكلان</h4>
          <div v-for="member in war.clan.members" :key="member.tag" class="bg-white p-4 rounded-lg shadow mb-4">
            <div class="flex justify-between items-center">
              <div>
                <h5 class="font-bold text-gray-800">{{ member.name }} <span class="text-sm text-gray-500">(TH{{ member.townhallLevel }})</span></h5>
                <p class="text-xs text-gray-500">📍 Position: {{ member.mapPosition }}</p>
              </div>
              <div class="text-sm text-gray-600">🔰 Attacks: {{ member.attacks?.length || 0 }}</div>
            </div>
            <div v-if="member.attacks" class="mt-3 space-y-1">
              <p class="text-sm font-semibold text-gray-700">🎯 الهجمات:</p>
              <ul class="text-sm text-gray-600 list-disc ml-5">
                <li v-for="(attack, i) in member.attacks" :key="i">
                  على {{ attack.defenderTag }}: ⭐{{ attack.stars }} | 💥 {{ attack.destructionPercentage }}%
                </li>
              </ul>
            </div>
            <div v-if="member.bestOpponentAttack" class="mt-2">
              <p class="text-sm font-semibold text-gray-700">🛡️ أفضل هجوم ضده:</p>
              <p class="text-sm text-red-500">
                من {{ member.bestOpponentAttack.attackerTag }}: ⭐{{ member.bestOpponentAttack.stars }} | 💥 {{ member.bestOpponentAttack.destructionPercentage }}%
              </p>
            </div>
          </div>
        </div>
        <div>
          <h4 class="text-lg font-semibold text-red-700 mb-3">⚔️ لاعبي الخصم</h4>
          <div v-for="member in war.opponent.members" :key="member.tag" class="bg-white p-4 rounded-lg shadow mb-4">
            <div class="flex justify-between items-center">
              <div>
                <h5 class="font-bold text-gray-800">{{ member.name }} <span class="text-sm text-gray-500">(TH{{ member.townhallLevel }})</span></h5>
                <p class="text-xs text-gray-500">📍 Position: {{ member.mapPosition }}</p>
              </div>
              <div class="text-sm text-gray-600">🔰 Attacks: {{ member.attacks?.length || 0 }}</div>
            </div>
            <div v-if="member.attacks" class="mt-3 space-y-1">
              <p class="text-sm font-semibold text-gray-700">🎯 الهجمات:</p>
              <ul class="text-sm text-gray-600 list-disc ml-5">
                <li v-for="(attack, i) in member.attacks" :key="i">
                  على {{ attack.defenderTag }}: ⭐{{ attack.stars }} | 💥 {{ attack.destructionPercentage }}%
                </li>
              </ul>
            </div>
            <div v-if="member.bestOpponentAttack" class="mt-2">
              <p class="text-sm font-semibold text-gray-700">🛡️ أفضل هجوم ضده:</p>
              <p class="text-sm text-blue-500">
                من {{ member.bestOpponentAttack.attackerTag }}: ⭐{{ member.bestOpponentAttack.stars }} | 💥 {{ member.bestOpponentAttack.destructionPercentage }}%
              </p>
            </div>
          </div>
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
onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/cwl/war/${route.params.warTag}`)
    war.value = data
  } catch (err) {
    error.value = true
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
</script>
<style scoped>
/* تقدر تضيف أي ستايل إضافي حسب رغبتك */
</style>