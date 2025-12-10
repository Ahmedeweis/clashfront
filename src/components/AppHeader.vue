<template>
  <header class="sticky top-0 bg-[#101828] z-50 w-full border-b ">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-indigo-500/25">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span class="hidden font-bold text-xl tracking-tight text-white sm:inline-block">
          Clash<span class="text-indigo-400">System</span>
        </span>
      </router-link>

      <!-- Navigation -->
      <nav class="flex items-center gap-1 overflow-x-auto no-scrollbar mask-linear-fade">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group whitespace-nowrap"
          active-class="bg-white/10 text-white shadow-inner"
          :class="[$route.path === link.to ? '' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        >
          <!-- Icon -->
          <component :is="link.icon" class="h-4 w-4 transition-colors duration-300" :class="[$route.path === link.to ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-300']" />

          <span>{{ link.label }}</span>

          <!-- Active Indicator -->
          <span v-if="$route.path === link.to" class="absolute bottom-0 left-1/2 h-0.5 w-1/2 -translate-x-1/2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
        </router-link>
      </nav>

      <!-- Mobile Menu Button (Optional placeholder for future) -->
      <!-- <button class="ml-4 md:hidden text-slate-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button> -->
    </div>
  </header>
</template>

<script setup>
import { h } from 'vue'

// Simple Icon Components
const IconClan = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
  h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
  h('circle', { cx: '9', cy: '7', r: '4' }),
  h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
  h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
])

const IconSwords = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
  h('polyline', { points: '14.5 17.5 3 6 3 3 6 3 17.5 14.5' }),
  h('line', { x1: '13', y1: '19', x2: '19', y2: '13' }),
  h('line', { x1: '16', y1: '16', x2: '20', y2: '20' }),
  h('line', { x1: '19', y1: '21', x2: '21', y2: '19' })
])

const IconUser = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
  h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
  h('circle', { cx: '12', cy: '7', r: '4' })
])

const IconShield = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
  h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
])

const IconTest = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
  h('path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' })
])

const links = [
  { to: '/clan', label: 'Clan', icon: IconClan },
  { to: '/ClanCWL', label: 'CWL League', icon: IconSwords },
  { to: '/player/#YOURTAG', label: 'Player', icon: IconUser },
  { to: '/cwl/war/YOURWARTAG', label: 'War', icon: IconShield },
  { to: '/all-clans',label: 'All Clans', icon: IconTest},
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
