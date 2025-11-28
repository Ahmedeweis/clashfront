<template>
  <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
    <p class="text-gray-500 text-sm">{{ title }}</p>
    <p class="text-2xl font-bold text-gray-900 mt-2">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number]
})
</script>
