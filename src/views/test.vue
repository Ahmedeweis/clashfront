<template>
  <div>
    <h2>⚔️ CWL League Group</h2>
    <div v-if="loading">جاري التحميل...</div>
    <div v-if="error">حدث خطأ أثناء تحميل بيانات CWL</div>
    <div v-if="cwl">
      <div v-for="(round, index) in cwl.rounds" :key="index" class="round">
        <h3>جولة {{ index + 1 }}</h3>
        <ul>
          <li v-for="warTag in round.warTags" :key="warTag">
            War Tag: {{ warTag }}
            <button @click="loadWarDetails(warTag)">عرض التفاصيل</button>
            <div v-if="warDetails[warTag]">
              ⭐ النجوم: {{ warDetails[warTag].clan.stars }} - {{ warDetails[warTag].opponent.stars }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
const cwl = ref(null);
const warDetails = ref({});
const loading = ref(true);
const error = ref(false);
const loadWarDetails = async (warTag) => {
  if (warDetails.value[warTag]) return;
  try {
    const res = await axios.get(`http://localhost:5000/api/cwl/war/${warTag.replace("#", "")}`);
    warDetails.value[warTag] = res.data;
  } catch (err) {
    console.error(err);
  }
};
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/clan/cwl");
    cwl.value = res.data;
  } catch (err) {
    error.value = true;
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>