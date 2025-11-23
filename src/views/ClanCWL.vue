<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Clan War League (CWL)</h1>
    <!-- إدخال رمز الكلان -->
    <div class="mb-4">
      <input
        v-model="clanTag"
        placeholder="Enter Clan Tag (مثال: #2PYCUY8RG)"
        class="border p-2 rounded w-full"
      />
      <button @click="fetchCWL" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
        Fetch CWL
      </button>
    </div>
    <!-- رسالة التحميل -->
    <div v-if="loading" class="mb-4 text-gray-500">Loading...</div>
    <!-- رسالة الخطأ -->
    <div v-if="error" class="mb-4 text-red-500">{{ error }}</div>
    <!-- عرض CWL -->
    <div v-if="cwlData">
      <h2 class="text-xl font-semibold mb-2">Clan: {{ cwlData.clans[0].name }}</h2>
      <img :src="cwlData.clans[0].badgeUrls.medium" alt="Badge" class="w-16 h-16 mb-4" />
      <h3 class="font-semibold mb-2">Members:</h3>
      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        <li
          v-for="member in cwlData.clans[0].members"
          :key="member.tag"
          class="border p-2 rounded shadow"
        >
          <p class="font-bold">{{ member.name }}</p>
          <p>Town Hall Level: {{ member.townHallLevel }}</p>
          <p>Tag: {{ member.tag }}</p>
        </li>
      </ul>
      <h3 class="font-semibold mb-2">Rounds:</h3>
      <div v-for="(round, index) in cwlData.rounds" :key="index" class="mb-4">
        <p class="font-bold mb-1">Round {{ index + 1 }}</p>
        <ul class="list-disc pl-6">
          <li
            v-for="warTag in round.warTags"
            :key="warTag"
          >
            <router-link
              :to="`/cwl/war/${encodeURIComponent(warTag)}`"
              class="text-blue-600 hover:underline"
            >
              {{ warTag }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
const clanTag = ref("#2PYCUY8RG");
const cwlData = ref(null);
const loading = ref(false);
const error = ref("");
const fetchCWL = async () => {
  if (!clanTag.value) return;
  loading.value = true;
  error.value = "";
  cwlData.value = null;
  try {
    const response = await axios.get(`http://localhost:5000/api/clan/${encodeURIComponent(clanTag.value)}/cwl`);
    cwlData.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to fetch CWL data";
  } finally {
    loading.value = false;
  }
};
// جلب البيانات عند تحميل الصفحة
fetchCWL();
</script>