<template>
  <section v-if="stats.length" class="p-4 max-w-full overflow-x-auto">
    <h2 class="text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-100">
      📊 إحصائيات لاعبي الكلان: <span class="text-indigo-600">{{ clanName }}</span>
    </h2>
    <table
      class="min-w-full border-collapse table-auto text-sm font-sans rtl"
      style="direction: rtl;"
    >
<thead>
  <tr class="bg-indigo-600 text-white text-center text-xs font-semibold select-none">
    <th class="border border-indigo-400 p-2 w-48 max-w-[12rem] whitespace-nowrap text-ellipsis overflow-hidden">
      اللاعب
    </th>
    <th
      v-for="i in totalWars"
      :key="'war-header-'+i"
      colspan="2"
      class="border border-indigo-400 p-2 w-20"
    >
      حرب {{ i }}
    </th>
    <!-- أعمدة المتوسط -->
    <th colspan="4" class="border border-indigo-400 p-2 w-32">
      المتوسطات ومجموع النجوم والنسب
    </th>
  </tr>
  <tr class="bg-indigo-700 text-white text-center text-xs font-semibold select-none">
    <th class="border border-indigo-400 p-1"></th>
    <template v-for="i in totalWars" :key="'sub-header-' + i">
      <th class="border border-indigo-400 p-1 w-10">هجوم</th>
      <th class="border border-indigo-400 p-1 w-10">دفاع</th>
    </template>
    <th class="border border-indigo-400 p-1 w-24">مجموع نجوم الهجوم</th>
    <th class="border border-indigo-400 p-1 w-24">متوسط نسبة الهجوم</th>
    <th class="border border-indigo-400 p-1 w-24">مجموع نجوم الدفاع</th>
    <th class="border border-indigo-400 p-1 w-24">متوسط نسبة الدفاع</th>
  </tr>
</thead>
      <tbody>
        <template v-for="player in stats" :key="player.name">
          <tr
            @click="toggleDetails(player.name)"
            class="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
          >
            <td
              class="border border-indigo-300 dark:border-indigo-700 p-2 font-semibold whitespace-nowrap truncate max-w-[12rem]"
              :title="player.name"
            >
              {{ player.name }}
            </td>
            <template v-for="(war, idx) in player.wars" :key="idx">
              <td class="border border-indigo-300 dark:border-indigo-700 p-2 text-center w-10">
                {{ war.attackStars !== null ? war.attackStars : '-' }}
                <span v-if="war.attackDestruction !== undefined" class="text-xs text-gray-500">
                  ({{ war.attackDestruction }}%)
                </span>
              </td>
              <td class="border border-indigo-300 dark:border-indigo-700 p-2 text-center w-10">
                {{ war.defenseStars !== null ? war.defenseStars : '-' }}
                <span v-if="war.defenseDestruction !== undefined" class="text-xs text-gray-500">
                  ({{ war.defenseDestruction }}%)
                </span>
              </td>
            </template>
            <!-- أعمدة المتوسط -->
<!-- مجموع نجوم الهجوم -->
<td class="border border-indigo-300 dark:border-indigo-700 p-2 text-center w-24 font-bold">
  {{ formatAttackDefenseStats(player.wars, 'attackStars', 3) }}
</td>
<!-- مجموع نسبة الهجوم -->
<td class="border border-indigo-300 dark:border-indigo-700 p-2 text-center w-24 font-bold">
  {{ formatAttackDefenseStats(player.wars, 'attackDestruction', 100) }}
</td>
<!-- مجموع نجوم الدفاع -->
<td class="border border-indigo-300 dark:border-indigo-700 p-2 text-center w-24 font-bold">
  {{ formatAttackDefenseStats(player.wars, 'defenseStars', 3) }}
</td>
<!-- مجموع نسبة الدفاع -->
<td class="border border-indigo-300 dark:border-indigo-700 p-2 text-center w-24 font-bold">
  {{ formatAttackDefenseStats(player.wars, 'defenseDestruction', 100) }}
</td>
          </tr>
        </template>
      </tbody>
    </table>
  </section>
<section
  class="mt-8 p-4 bg-indigo-50 rounded-md max-w-full overflow-x-auto rtl flex gap-8"
  style="direction: rtl;"
>
<section
  class="mt-8 p-6 bg-indigo-50 rounded-md max-w-full overflow-x-auto rtl flex gap-10"
  style="direction: rtl;"
>
  <!-- أقوى دفاع -->
  <div class="flex-1 bg-white rounded-lg shadow-md p-4">
    <h3 class="text-2xl font-extrabold mb-5 text-indigo-800 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" />
      </svg>
      📌 إحصائيات أقوى دفاع
    </h3>
    <ol class="list-decimal list-inside space-y-2 text-gray-800">
      <li v-for="(player, index) in sortedDefense" :key="'def-'+player.name" class="flex justify-between items-center p-2 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer">
        <span class="font-semibold text-indigo-900">{{ index + 1 }}. {{ player.name }}</span>
        <span class="flex flex-col items-end text-indigo-700 font-medium">
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
            {{ player.defenseStarsSum }} نجوم من 21 🌟
          </span>
          <span class="text-sm text-indigo-500">
            {{ player.defenseDestructionSum.toFixed(2) }}% من 700%
          </span>
        </span>
      </li>
    </ol>
  </div>
  <!-- أقوى هجوم -->
  <div class="flex-1 bg-white rounded-lg shadow-md p-4">
    <h3 class="text-2xl font-extrabold mb-5 text-indigo-800 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
      </svg>
      📌 إحصائيات أقوى هجوم
    </h3>
    <ol class="list-decimal list-inside space-y-2 text-gray-800">
      <li v-for="(player, index) in sortedAttack" :key="'att-'+player.name" class="flex justify-between items-center p-2 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer">
        <span class="font-semibold text-indigo-900">{{ index + 1 }}. {{ player.name }}</span>
        <span class="flex flex-col items-end text-indigo-700 font-medium">
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
            {{ player.attackStarsSum }} نجوم من 21 🌟
          </span>
          <span class="text-sm text-indigo-500">
            {{ player.attackDestructionSum.toFixed(2) }}% من 700%
          </span>
        </span>
      </li>
    </ol>
  </div>
</section>
</section>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const clanTag = ref("#2PYCUY8RG");
const stats = ref([])
const clanName = ref('')
const totalWars = 7
const expandedPlayer = ref(null)
function toggleDetails(name) {
  expandedPlayer.value = expandedPlayer.value === name ? null : name
}
function calculateAverage(wars, key) {
  const values = wars
    .map(w => w[key])
    .filter(v => v !== null && v !== undefined)
  if (values.length === 0) return '-'
  const sum = values.reduce((a, b) => a + b, 0)
  const average = sum / values.length
  const maxStars = 3 * wars.length // مثال: 3 نجوم لكل حرب
  const maxPercent = 100 * wars.length
  if (key === 'attackStars' || key === 'defenseStars') {
    return `${average.toFixed(2)} من ${maxStars} نجمة`
  } else if (key === 'attackDestruction' || key === 'defenseDestruction') {
    return `${average.toFixed(2)}% من ${maxPercent}%`
  }
  return average.toFixed(2)
}
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/clan/${encodeURIComponent(clanTag.value)}/cwl`);
    const cwl = res.data;
    // استخراج جميع warTags غير الصفرية من كل الجولات
    const warTags = cwl.rounds.flatMap(round =>
      round.warTags.filter(tag => tag !== '#0')
    )
    const uniqueWarTags = [...new Set(warTags)]
    // جلب بيانات كل حرب بشكل متوازي
    const warDataArray = await Promise.all(
      uniqueWarTags.map(async (warTag) => {
        const cleaned = warTag.replace('#', '')
        const warRes = await axios.get(`http://localhost:5000/api/cwl/war/${cleaned}`)
        return { tag: warTag, data: warRes.data }
      })
    )
    const warData = {}
    warDataArray.forEach(({ tag, data }) => {
      warData[tag] = data
    })
    // تجميع كل اللاعبين من كل الحروب التي تشمل الكلان (clan أو opponent)
    const allPlayersSet = new Set()
    for (const warTag in warData) {
      const warInfo = warData[warTag]
      if (warInfo.clan.tag.replace('#', '') === clanTag.replace('#', '')) {
        warInfo.clan.members.forEach(m => allPlayersSet.add(m.name))
      }
      if (warInfo.opponent.tag.replace('#', '') === clanTag.replace('#', '')) {
        warInfo.opponent.members.forEach(m => allPlayersSet.add(m.name))
      }
    }
    const players = Array.from(allPlayersSet)
    // تحديد اسم الكلان من أول حرب تشمل الكلان
    const exampleWarTag = Object.keys(warData).find(tag =>
      warData[tag].clan.tag.replace('#', '') === clanTag.replace('#', '') ||
      warData[tag].opponent.tag.replace('#', '') === clanTag.replace('#', '')
    )
    if (!exampleWarTag) {
      console.warn('Clan not found in any war')
      return
    }
    clanName.value = warData[exampleWarTag].clan.name
    // بناء بيانات الإحصائيات لكل لاعب مع تفاصيل هجماته وأفضل هجوم ضده
    stats.value = players.map(playerName => {
      const wars = []
      let detailedAttacks = []
      let bestOpponentAttack = null
      for (const round of cwl.rounds) {
        const warTag = round.warTags.find(tag =>
          tag !== '#0' &&
          (warData[tag]?.clan.tag.replace('#', '') === clanTag.replace('#', '') ||
           warData[tag]?.opponent.tag.replace('#', '') === clanTag.replace('#', ''))
        )
        if (warTag && warData[warTag]) {
          const warInfo = warData[warTag]
          const clanSide = warInfo.clan.tag.replace('#', '') === clanTag.replace('#', '') ? 'clan' : 'opponent'
          const enemySide = clanSide === 'clan' ? 'opponent' : 'clan'
          const player = warInfo[clanSide].members.find(m => m.name === playerName)
          if (player) {
            wars.push({
              attackStars: player.attacks?.reduce((sum, a) => sum + a.stars, 0) || 0,
              attackDestruction: player.attacks?.reduce((sum, a) => sum + a.destructionPercentage, 0) || 0,
              defenseStars: null,
              defenseDestruction: null,
            })
            if (!detailedAttacks.length && player.attacks) {
              detailedAttacks = player.attacks
            }
          } else {
            wars.push({ attackStars: null, defenseStars: null })
          }
          const enemyAttacks = warInfo[enemySide].members.flatMap(m => m.attacks || [])
          const defense = enemyAttacks.find(a => a.defenderTag === player?.tag)
          if (defense) {
            wars[wars.length - 1].defenseStars = defense.stars
            wars[wars.length - 1].defenseDestruction = defense.destructionPercentage
            if (!bestOpponentAttack) bestOpponentAttack = defense
          }
        } else {
          wars.push({ attackStars: null, defenseStars: null })
        }
      }
      return {
        name: playerName,
        wars,
        attacks: detailedAttacks,
        bestOpponentAttack,
      }
    })
  } catch (err) {
    console.error('Error loading CWL data:', err)
  }
})
function calculateSum(wars, key) {
  const values = wars
    .map(w => w[key])
    .filter(v => v !== null && v !== undefined)
  if (values.length === 0) return '-'
  const sum = values.reduce((a, b) => a + b, 0)
  // لو المفروض نجمع النجوم
  if (key === 'attackStars' || key === 'defenseStars') {
    return `${sum} نجمة`
  } else if (key === 'attackDestruction' || key === 'defenseDestruction') {
    return `${sum.toFixed(2)}%`
  }
  return sum.toFixed(2)
}
function formatAttackDefenseStats(wars, key, maxPerWar) {
  const values = wars
    .map(w => w[key])
    .filter(v => v !== null && v !== undefined)
  if (values.length === 0) return '-'
  const sum = values.reduce((a, b) => a + b, 0)
  const maxTotal = maxPerWar * wars.length
  if (key === 'attackStars' || key === 'defenseStars') {
    return `${sum}  ${maxTotal} `
  } else if (key === 'attackDestruction' || key === 'defenseDestruction') {
    return `${sum.toFixed(2)}%  ${maxTotal}%`
  }
  return sum.toFixed(2)
}
import { computed } from 'vue'
// بعد بناء stats.value، نضيف المجموعات المحسوبة:
const sortedDefense = computed(() => {
  return stats.value
    .map(player => {
      const defenseStarsSum = player.wars.reduce((acc, w) => acc + (w.defenseStars ?? 0), 0)
      const defenseDestructionSum = player.wars.reduce((acc, w) => acc + (w.defenseDestruction ?? 0), 0)
      return {
        name: player.name,
        defenseStarsSum,
        defenseDestructionSum,
      }
    })
    .sort((a, b) => {
      // أقل نجوم دفاع أولًا
      if (a.defenseStarsSum !== b.defenseStarsSum)
        return a.defenseStarsSum - b.defenseStarsSum
      // لو نفس النجوم، أقل نسبة دفاع أولًا (يعني أقل نجوم اتجاب منه)
      return a.defenseDestructionSum - b.defenseDestructionSum
    })
})
const sortedAttack = computed(() => {
  return stats.value
    .map(player => {
      const attackStarsSum = player.wars.reduce((acc, w) => acc + (w.attackStars ?? 0), 0)
      const attackDestructionSum = player.wars.reduce((acc, w) => acc + (w.attackDestruction ?? 0), 0)
      return {
        name: player.name,
        attackStarsSum,
        attackDestructionSum,
      }
    })
    .sort((a, b) => {
      // أكثر نجوم هجوم أولًا
      if (b.attackStarsSum !== a.attackStarsSum)
        return b.attackStarsSum - a.attackStarsSum
      // لو نفس النجوم، أعلى نسبة هجوم أولًا
      return b.attackDestructionSum - a.attackDestructionSum
    })
})
</script>
