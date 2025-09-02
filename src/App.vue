<template>
    <header class="bg-gray-100 border-b p-4 flex gap-4 text-sm font-semibold">
    <router-link to="/clan" class="text-blue-600 hover:underline">📋 الكلان</router-link>
    <router-link to="/ClanCWL" class="text-blue-600 hover:underline">⚔️ CWL الكلان</router-link>
    <router-link to="/player/%23YOURTAG" class="text-blue-600 hover:underline">👤 لاعب (Tag)</router-link>
    <router-link to="/cwl/war/YOURWARTAG" class="text-blue-600 hover:underline">🗡️ تفاصيل حرب CWL</router-link>
        <router-link to="/test" class="text-blue-600 hover:underline">Test</router-link>
  </header>
  <div>
    <router-view />
  </div>
</template>
<script setup>
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
