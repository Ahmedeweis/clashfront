<template>
    <div class="p-4 bg-[#0A0918] min-h-screen">
        <ClanWarLog :clanTag="clanTag" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ClanWarLog from '../components/ClanWarLog.vue';

const route = useRoute();
const clanTag = computed(() => route.params.clanTag);
</script>
