<template>
    <div class="war-log-container bg-[#0A0918] text-white p-4 rounded-xl">
        <h2
            class="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
            سجل الحروب
        </h2>

        <div v-if="loading" class="flex justify-center p-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>

        <div v-else-if="error === 'private'"
            class="flex flex-col items-center justify-center p-8 bg-white/5 rounded-lg border border-white/10">
            <div class="text-5xl mb-4">🔒</div>
            <h3 class="text-xl font-bold text-red-500 mb-2">سجل الحروب خاص</h3>
            <p class="text-gray-400 text-center">
                قام هذا الكلان بإخفاء سجل حروبه ولا يمكن عرضه للعامة.
            </p>
        </div>

        <div v-else-if="error" class="text-center text-red-500 p-4">
            {{ error }}
        </div>

        <div v-else class="space-y-4">
            <div v-for="(war, index) in warLog" :key="index"
                class="war-card relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 shadow-lg border-l-4 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                :class="getResultClass(war.result)">

                <!-- Result Badge -->
                <div class="absolute top-0 right-0 px-3 py-1 rounded-bl-lg font-bold text-sm uppercase"
                    :class="getResultBadgeClass(war.result)">
                    {{ war.result === 'win' ? 'انتصار' : war.result === 'lose' ? 'خسارة' : 'تعادل' }}
                </div>

                <div class="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
                    <!-- My Clan (Left or Right depending on RTL, assuming RTL layout based on previous file) -->
                    <div class="flex items-center gap-3 flex-1 justify-end">
                        <div class="text-right">
                            <div class="font-bold text-lg md:text-xl">{{ war.clan.name }}</div>
                            <div class="text-xs text-gray-400 italic">{{ war.clan.tag }}</div>
                            <div class="text-yellow-400 text-sm mt-1">
                                ⭐ {{ war.clan.stars }} | 💥 {{ war.clan.destructionPercentage.toFixed(1) }}%
                            </div>
                        </div>
                        <img :src="war.clan.badgeUrls.small" alt="Badge"
                            class="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md">
                    </div>

                    <!-- VS / General Info -->
                    <div class="flex flex-col items-center justify-center px-4 min-w-[120px]">
                        <div class="text-sm text-gray-400 mb-1">{{ formatDate(war.endTime) }}</div>
                        <div class="font-bold text-2xl text-white">VS</div>
                        <div class="text-xs text-gray-500 mt-1">{{ war.teamSize }} vs {{ war.teamSize }}</div>
                    </div>

                    <!-- Opponent Clan -->
                    <div class="flex items-center gap-3 flex-1 justify-start">
                        <img :src="war.opponent.badgeUrls.small" alt="Badge"
                            class="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md">
                        <div class="text-left">
                            <div class="font-bold text-lg md:text-xl">{{ war.opponent.name }}</div>
                            <div class="text-xs text-gray-400 italic">{{ war.opponent.tag }}</div>
                            <div class="text-yellow-400 text-sm mt-1">
                                ⭐ {{ war.opponent.stars }} | 💥 {{ war.opponent.destructionPercentage.toFixed(1) }}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="warLog.length === 0" class="text-center text-gray-500 py-8">
                لا يوجد سجلات متاحة حاليا
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getClanWarLog } from '../utils/apiService';

const props = defineProps({
    clanTag: {
        type: String,
        required: true
    }
});

const warLog = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchWarLog = async () => {
    if (!props.clanTag) return;

    loading.value = true;
    error.value = null;
    try {
        const response = await getClanWarLog(props.clanTag, { limit: 15 });
        // API response structure: { items: [...] } or just array if direct from my controller but standard api returns { items: [] }
        // My controller returns res.json(data), and data comes from fetchData which returns axios data.
        // Standard COC API returns { items: [...] }
        warLog.value = response.data.items || response.data;
    } catch (err) {
        console.error("Failed to fetch war log:", err);
        if (err.response && err.response.status === 403) {
            error.value = "private";
        } else {
            error.value = "فشل في جلب سجل الحروب";
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchWarLog();
});

watch(() => props.clanTag, () => {
    fetchWarLog();
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    // COC API format: 20260125T141147.000Z
    // We need to parse this manually or use a library. 
    // Standard simple parsing:
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}/${month}/${day}`;
};

const getResultClass = (result) => {
    switch (result) {
        case 'win': return 'border-green-500/50 shadow-green-900/20';
        case 'lose': return 'border-red-500/50 shadow-red-900/20';
        case 'tie': return 'border-gray-500/50 shadow-gray-900/20';
        default: return 'border-gray-500/50';
    }
};

const getResultBadgeClass = (result) => {
    switch (result) {
        case 'win': return 'bg-green-600 text-white';
        case 'lose': return 'bg-red-600 text-white';
        case 'tie': return 'bg-gray-600 text-white';
        default: return 'bg-gray-600';
    }
};
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
