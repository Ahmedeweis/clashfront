<template>
  <!-- CWL Clan Selector -->
  <section class="p-4 pb-0 max-w-5xl mx-auto" dir="rtl">
    <!-- Header -->
    <div class="mb-4 text-center">
      <h2
        class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-1">
        ⚔️ دوري حروب العشائر ⚔️
      </h2>
      <p class="text-slate-400 text-xs">اختر كلانًا أساسيًا لعرض إحصائياته ومجموعته</p>
    </div>
    <!-- 4 Primary Clans -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      <button v-for="clan in topClans" :key="clan.tag" @click="selectPrimaryClan(clan.tag)"
        class="flex items-center gap-2 p-3 rounded-xl border-2 transition-all transform hover:scale-105 shadow-md"
        :class="activePrimaryTag === clan.tag
          ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-yellow-400 shadow-yellow-400/30'
          : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 hover:border-indigo-400'">
        <img :src="clan.badge" alt="Badge" class="w-9 h-9 drop-shadow-md shrink-0" />
        <div class="text-right overflow-hidden min-w-0">
          <h3 class="font-bold text-sm truncate"
            :class="activePrimaryTag === clan.tag ? 'text-yellow-300' : 'text-white'">{{ clan.name }}</h3>
          <p class="text-[10px] truncate"
            :class="activePrimaryTag === clan.tag ? 'text-yellow-500/70' : 'text-slate-500'">{{ clan.tag }}</p>
        </div>
      </button>
    </div>
    <!-- Loading group clans spinner -->
    <div v-if="cwlGroupLoading" class="text-center py-3">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400"></div>
      <span class="text-slate-400 text-xs mr-2">جاري تحميل المجموعة...</span>
    </div>
    <!-- CWL Group Clans (the other 7 in the league) -->
    <template v-else-if="cwlGroupClans.length">
      <div class="flex items-center gap-2 mb-2">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <div class="flex flex-col items-center gap-1 px-4">
          <span class="text-xs text-slate-500 font-bold">الكلانات المشاركة في المجموعة</span>
          <button @click="fetchAllGroupClans" :disabled="loading || loadingAll"
            class="group relative overflow-hidden px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            <div v-if="loadingAll" class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-3 w-3 border-t-2 border-white"></div>
              <span>جاري تحميل {{ loadedClansCount }}/{{ totalClansToLoad }}</span>
            </div>
            <div v-else class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>تحميل جميع أعضاء المجموعة</span>
            </div>
          </button>
        </div>
        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        <button v-for="clan in cwlGroupClans" :key="clan.tag" @click="selectClan(clan.tag)"
          class="flex items-center gap-2 p-2 rounded-xl border-2 transition-all transform hover:scale-105 shadow-sm"
          :class="clanTag === clan.tag
            ? 'bg-gradient-to-br from-orange-600 to-red-700 border-yellow-400 shadow-yellow-400/20'
            : 'bg-gradient-to-br from-slate-900 to-gray-900 border-slate-700 hover:border-orange-500'">
          <!-- Name on the LEFT, badge on the RIGHT -->
          <div class="text-left overflow-hidden min-w-0 flex-1">
            <h3 class="font-bold text-xs truncate" :class="clanTag === clan.tag ? 'text-yellow-300' : 'text-white'">{{
              clan.name }}</h3>
            <p class="text-[9px] truncate" :class="clanTag === clan.tag ? 'text-yellow-500/70' : 'text-slate-600'">{{
              clan.tag }}</p>
          </div>
          <img :src="clan.badgeUrls?.medium || clan.badgeUrls?.small" alt="Badge"
            class="w-7 h-7 drop-shadow-md shrink-0" />
        </button>
      </div>
    </template>
  </section>
  <!-- Search Section -->
  <section class="p-6 max-w-5xl mx-auto mb-8">
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-2xl">
      <!-- Decorative background elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-10"></div>
      <div class="relative z-10 p-8">
        <!-- Header -->
        <div class="text-center mb-6">
          <h2
            class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
            🔍 البحث عن كلان
          </h2>
          <p class="text-slate-400 text-sm">ابحث عن إحصائيات أي كلان في CWL</p>
        </div>
        <!-- Search Input -->
        <div class="flex gap-3 items-center mb-6" style="direction: rtl;">
          <div class="flex-1 relative">
            <input v-model="searchTag" @keyup.enter="handleSearch" type="text"
              placeholder="أدخل تاج الكلان (مثال: #2PYCUY8RG)"
              class="w-full px-5 py-4 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white placeholder-slate-500 font-semibold text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all backdrop-blur-sm" />
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
          </div>
          <button @click="handleSearch" :disabled="loading"
            class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 flex items-center gap-2">
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span v-if="!loading">بحث</span>
            <span v-else>جاري البحث...</span>
          </button>
        </div>
        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p class="text-red-400 text-center font-semibold flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            {{ error }}
          </p>
        </div>
        <!-- War Filter -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-700">
          <label for="warFilter" class="font-bold text-lg text-slate-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            عدد الحروب المحتسبة
          </label>
          <select v-model="warFilter" id="warFilter"
            class="px-6 py-3 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none cursor-pointer hover:bg-slate-700/50 transition-all backdrop-blur-sm">
            <option :value="1">أول حرب فقط</option>
            <option :value="2">أول حربين</option>
            <option :value="3">أول 3 حروب</option>
            <option :value="4">أول 4 حروب</option>
            <option :value="5">أول 5 حروب</option>
            <option :value="6">أول 6 حروب</option>
            <option :value="7">كل الحروب (7)</option>
          </select>
        </div>
      </div>
    </div>
  </section>
  <section v-if="stats.length" class="p-4 max-w-full overflow-x-auto" dir="rtl">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
        📊 إحصائيات لاعبي الكلان: <span class="text-indigo-600">{{ clanName }}</span>
      </h2>
      <!-- PDF Export Button -->
      <button @click="exportToPDF" :disabled="loading"
        class="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>تنزيل تقرير PDF</span>
      </button>
      <!-- Excel Export Button -->
      <button @click="exportToExcel" :disabled="loading"
        class="mr-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/25 transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>تنزيل تقرير Excel</span>
      </button>
    </div>
    <!-- MVP Section -->
    <div v-if="mvpPlayer"
      class="mb-8 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-1 shadow-2xl transform hover:scale-[1.01] transition-all duration-500">
      <div
        class="bg-gray-900 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-500 blur-[60px] opacity-20 rounded-full"></div>
        <div class="flex items-center gap-6 z-10">
          <div class="relative">
            <div class="absolute -top-6 -right-6 text-6xl animate-bounce">👑</div>
            <div
              class="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] overflow-hidden bg-gray-800">
              <img v-if="mvpPlayer.townhallLevel" :src="getTownhallImage(mvpPlayer.townhallLevel)"
                class="w-full h-full object-contain p-2" />
            </div>
          </div>
          <div>
            <h3 class="text-yellow-400 font-black text-3xl mb-1">MVP - أفضل لاعب</h3>
            <p class="text-white text-2xl font-bold">{{ mvpPlayer.name }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span
                class="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30">
                الفئة الأولى
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-8 text-center z-10">
          <div>
            <p class="text-gray-400 text-sm mb-1">النجوم</p>
            <p class="text-red-400 text-xl font-black">{{ mvpPlayer.stats.totalDefenseStars }} / {{ mvpPlayer.stats.maxDefenseStars }}</p>
          </div>
          <div class="w-px bg-gray-700"></div>
          <div>
            <p class="text-gray-400 text-sm mb-1">الدمار</p>
            <p class="text-orange-400 text-xl font-black">{{ mvpPlayer.stats.totalDefenseDest.toFixed(0) }}%</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Rest of Leaderboard -->
    <!-- <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div v-for="(player, index) in sortedByScore.slice(1)" :key="player.name"
        class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-lg hover:bg-slate-800/50 transition-colors">
        <div class="flex items-center gap-3 mb-3">
          <div class="flex flex-col items-center gap-1">
            <span class="text-slate-500 font-bold text-sm">#{{ index + 2 }}</span>
            <div class="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 p-1">
              <img v-if="player.townhallLevel" :src="getTownhallImage(player.townhallLevel)"
                class="w-full h-full object-contain" alt="TH">
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-white font-bold truncate" :title="player.name">{{ player.name }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <div class="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full rounded-full" :class="getScoreBarColor(player.stats.totalScore)"
                  :style="{ width: `${player.stats.totalScore}%` }"></div>
              </div>
              <span class="text-xs font-bold" :class="getScoreColor(player.stats.totalScore)">{{
                player.stats.totalScore.toFixed(0) }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 text-xs border-t border-slate-700 pt-3">
          <div class="flex-1 text-center">
            <p class="text-slate-400 text-xs mb-1">هجوم</p>
            <p class="text-green-400 text-lg font-black">{{ player.stats.attackScore.toFixed(0) }}</p>
          </div>
          <div class="w-px bg-slate-700"></div>
          <div class="flex-1 text-center">
            <p class="text-slate-400 text-xs mb-1">دفاع</p>
            <p class="text-blue-400 text-lg font-black">{{ player.stats.defenseScore.toFixed(0) }}</p>
          </div>
        </div>
      </div>
    </div> -->
    <div class="flex justify-center mb-8">
      <button @click="exportFullWarBreakdownPDF" :disabled="loading"
        class="overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-[#0f172a] px-8 py-3 text-white font-bold hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
        Full War Breakdown (Attack | Defense)
      </button>
    </div>
    <!-- War Breakdown Table (STRICT UI) -->
    <div class="overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-[#0f172a]">
      <table class="w-full text-sm border-collapse">
        <thead
          class="bg-[#020617] text-slate-400 uppercase text-[11px] font-bold tracking-wider sticky top-0 z-30 shadow-lg">
          <tr>
            <th
              class="sticky right-0 z-50 bg-[#020617] p-4 text-right min-w-[220px] border-b border-slate-800/80 shadow-[4px_0_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
              <div class="flex items-center gap-2">
                <span class="text-indigo-400">#</span>
                <span>اللاعب</span>
              </div>
            </th>
            <th v-for="i in warFilter" :key="i"
              class="p-4 text-center min-w-[160px] border-b border-l border-slate-800/80 bg-[#020617]/95 backdrop-blur-md">
              <div class="flex flex-col gap-1">
                <span class="text-slate-300">الحرب {{ i }}</span>
                <span class="text-[10px] text-slate-600 font-normal">هجوم | دفاع</span>
              </div>
            </th>
            <!-- <th
              class="p-4 text-center min-w-[140px] bg-indigo-950/20 border-b border-l border-slate-800/80 text-yellow-500 backdrop-blur-sm">
              مجموع الهجوم
            </th>
            <th
              class="p-4 text-center min-w-[140px] bg-red-950/20 border-b border-l border-slate-800/80 text-red-400 backdrop-blur-sm">
              مجموع الدفاع
            </th>
            <th
              class="p-4 text-center min-w-[120px] bg-indigo-500/10 border-b border-l border-slate-800/80 text-indigo-400 backdrop-blur-sm">
              الرقم الفيصل
            </th> -->
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          <tr v-for="(player, idx) in sortedByScore" :key="player.tag || player.name"
            class="group hover:bg-slate-800/30 transition-all duration-200">
            <td
              class="sticky right-0 z-40 bg-[#0f172a] group-hover:bg-[#1e293b] transition-colors p-3 border-l border-slate-800/80 shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
              <div class="flex items-center gap-3">
                <span class="text-slate-600 font-mono text-xs w-4">{{ idx + 1 }}</span>
                <div class="relative w-11 h-11 shrink-0 transition-transform group-hover:scale-105 duration-300">
                  <img v-if="player.townhallLevel" :src="getTownhallImage(player.townhallLevel)"
                    class="w-full h-full object-contain drop-shadow-lg filter brightness-110" alt="TH">
                  <div v-else
                    class="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-xs border border-slate-700">
                    ?</div>

                  <span
                    class="absolute -bottom-1.5 -right-1.5 bg-slate-900 text-[10px] font-bold text-white px-1.5 py-0.5 rounded border border-slate-700 shadow-sm">
                    {{ player.townhallLevel || '-' }}
                  </span>
                </div>
                <div class="flex flex-col items-center gap-0.5 w-14 shrink-0">
                  <img :src="player.clanBadge" class="w-6 h-6 rounded-full border border-slate-700 shadow-sm" alt="Clan" />
                  <span class="text-[8px] text-slate-400 font-bold text-center truncate w-full" :title="player.clanName">{{ player.clanName }}</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span class="font-bold text-slate-200 truncate max-w-[130px] group-hover:text-white transition-colors"
                    :title="player.name">{{ player.name }}</span>
                  <div class="flex flex-col gap-0">
                    <span class="text-[9px] text-indigo-400 font-bold">لعب {{ player.stats.warsPlayed }} حروب</span>
                    <span class="text-[9px]" :class="player.stats.hasPhantomDefense ? 'text-yellow-400 font-extrabold' : 'text-red-400'">النجوم: {{ player.stats.totalDefenseStars }} / {{
                      player.stats.maxDefenseStars }}</span>
                    <span class="text-[9px]" :class="player.stats.hasPhantomDefense ? 'text-yellow-400 font-extrabold' : 'text-orange-400'">الدمار: {{ player.stats.totalDefenseDest.toFixed(0) }}% / {{
                      player.stats.maxDefenseDest }}%</span>
                  </div>
                </div>
              </div>
            </td>
            <td v-for="(war, idx) in player.wars.slice(0, warFilter)" :key="idx"
              class="p-2 border-l border-slate-800/60 align-top bg-slate-900/20 group-hover:bg-slate-800/20 transition-colors">
              <div v-if="!war.inRoster" class="h-full flex items-center justify-center">
                <span class="text-[10px] text-slate-700 bg-slate-900/50 px-2 py-1 rounded-full border border-slate-800">
                  {{ war.hasWar ? 'لم يشارك' : '-' }}
                </span>
              </div>
              <div v-else class="flex gap-2 h-full items-center">
                <!-- Attack Column -->
                <div class="flex-1 flex flex-col items-center gap-1.5 min-w-[60px]">
                  <div class="flex gap-0.5 filter drop-shadow-sm">
                    <svg v-for="s in 3" :key="s" class="w-3.5 h-3.5 transition-all duration-300"
                      :class="s <= war.attackStars ? 'text-yellow-400 fill-current scale-110' : 'text-slate-800'"
                      viewBox="0 0 24 24">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="text-xs font-bold font-mono"
                      :class="war.attackDestruction === 100 ? 'text-green-400' : 'text-slate-400'">
                      {{ war.attackDestruction }}%
                    </span>
                  </div>
                  <div v-if="war.attackedTHs && war.attackedTHs.length" class="flex gap-1 flex-wrap justify-center mt-auto">
                    <span v-for="(th, ti) in war.attackedTHs" :key="ti"
                      class="text-[9px] font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      TH{{ th }}
                    </span>
                  </div>
                </div>
                <div class="w-px h-12 bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
                <!-- Defense Column -->
                <div class="flex-1 flex flex-col items-center gap-1.5 min-w-[60px]">
                  <div v-if="war.defenseStars !== null" class="flex gap-0.5 filter drop-shadow-sm">
                    <svg v-for="s in 3" :key="s" class="w-3.5 h-3.5 transition-all duration-300"
                      :class="s <= war.defenseStars ? 'text-red-500 fill-current scale-110' : 'text-slate-800'"
                      viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <span v-else class="text-slate-700 text-xs">-</span>
                  <span v-if="war.defenseDestruction !== null" class="text-xs font-mono text-slate-500 font-medium">
                    {{ war.defenseDestruction }}%
                  </span>
                  <span v-if="war.attackerTH"
                    class="text-[9px] font-bold bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 mt-auto">
                    TH{{ war.attackerTH }}
                  </span>
                </div>
              </div>
            </td>
            <!-- <td
              class="p-3 bg-indigo-950/10 border-l border-slate-800/60 text-center relative overflow-hidden group-hover:bg-indigo-950/20 transition-colors">
              <div class="flex flex-col items-center justify-center gap-2 relative z-10">
                <div class="flex items-baseline gap-1">
                  <span class="text-lg font-black text-yellow-400 drop-shadow-sm">{{ player.stats.totalAttackStars
                  }}</span>
                  <span class="text-slate-600 text-[10px] font-bold">/ {{ player.stats.maxAttackStars }}</span>
                </div>
                <div
                  class="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                  <div
                    class="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
                    :style="{ width: `${(player.stats.totalAttackDest / player.stats.maxAttackDest) * 100}%` }"></div>
                </div>
                <span class="text-[11px] font-mono text-slate-400">{{ player.stats.totalAttackDest.toFixed(0) }}% <span
                    class="text-slate-600">/ {{ player.stats.maxAttackDest }}%</span></span>
              </div>
            </td>
            <td
              class="p-3 bg-red-950/10 border-l border-slate-800/60 text-center relative overflow-hidden group-hover:bg-red-950/20 transition-colors">
              <div class="flex flex-col items-center justify-center gap-2 relative z-10">
                <div class="flex items-baseline gap-1">
                  <span class="text-lg font-black text-red-400 drop-shadow-sm">{{ player.stats.totalDefenseStars
                  }}</span>
                  <span class="text-slate-600 text-[10px] font-bold">/ {{ player.stats.maxDefenseStars }}</span>
                </div>
                <div
                  class="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                  <div class="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]"
                    :style="{ width: `${(player.stats.totalDefenseDest / player.stats.maxDefenseDest) * 100}%` }"></div>
                </div>
                <span class="text-[11px] font-mono text-slate-400">{{ player.stats.totalDefenseDest.toFixed(0) }}% <span
                    class="text-slate-600">/ {{ player.stats.maxDefenseDest }}%</span></span>
              </div>
            </td> -->
            <!-- <td
              class="p-3 bg-indigo-500/10 border-l border-slate-800/60 text-center group-hover:bg-indigo-500/20 transition-all">
              <div class="flex flex-col items-center">
                <span class="text-xl font-black text-indigo-300 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]">
                </span>
                <span class="text-[9px] text-slate-500 font-bold uppercase">الصمود</span>
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section
    class="mt-8  bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-2xl max-w-full overflow-x-auto shadow-2xl border-4 border-yellow-500"
    style="direction: rtl;">
    <!-- أقوى هجوم - Full Width -->
    <div class="bg-gradient-to-br from-green-800 to-green-900 rounded-xl shadow-2xl p-6 border-4 border-green-500 mb-8">
      <h3 class="text-3xl font-black mb-6 text-yellow-400 flex items-center gap-3"
        style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8)">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
        </svg>
        ⚔️ أقوى هجوم
      </h3>
      <!-- Top 3 - Podium Style -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- 1st Place -->
        <div v-if="sortedAttack[0]" class="order-2 md:order-1">
          <div
            class="group bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 border-4 border-yellow-400 shadow-2xl transform hover:scale-105 transition-all relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="text-6xl">🥇</span>
            </div>
            <div class="text-center mt-8">
              <div
                class="bg-yellow-900 bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 relative group-hover:rotate-6 transition-transform">
                <span class="text-4xl font-black text-white">1</span>
                <button @click.stop="deletePlayer(sortedAttack[0].name)"
                  class="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Player">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h4 class="text-xl font-black text-white mb-2">{{ sortedAttack[0].name }}</h4>
              <div class="bg-black bg-opacity-30 rounded-lg p-3 space-y-1">
                <p class="text-yellow-200 font-bold text-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  {{ sortedAttack[0].attackStarsSum }} / {{ warFilter * 3 }}
                </p>
                <p class="text-green-200 text-sm">💥 {{ sortedAttack[0].attackDestructionSum.toFixed(1) }}% / {{
                  warFilter * 100 }}%</p>
                <p class="text-white text-sm flex items-center justify-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 2.727 1.17a1 1 0 10.788-1.838l-2.25-1.125a3.01 3.01 0 00-.356.257l-2.641 1.131 2.641 1.131a3.01 3.01 0 00.356.257L12 9.051l2.641 1.131a3.01 3.01 0 00.356-.257l4-1.714a1 1 0 11.788 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838l2.727-1.17-2.727-1.17a1 1 0 010-1.838l7-3z" />
                  </svg>
                  <span class="font-bold">{{ sortedAttack[0].warsPlayed }}</span> <span class="opacity-70">/ {{
                    warFilter }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 2nd Place -->
        <div v-if="sortedAttack[1]" class="order-1 md:order-2">
          <div
            class="group bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl p-6 border-4 border-gray-300 shadow-2xl transform hover:scale-105 transition-all relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="text-6xl">🥈</span>
            </div>
            <div class="text-center mt-8">
              <div
                class="bg-gray-700 bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 relative group-hover:rotate-6 transition-transform">
                <span class="text-4xl font-black text-white">2</span>
                <button @click.stop="deletePlayer(sortedAttack[1].name)"
                  class="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Player">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h4 class="text-xl font-black text-white mb-2">{{ sortedAttack[1].name }}</h4>
              <div class="bg-black bg-opacity-30 rounded-lg p-3 space-y-1">
                <p class="text-gray-200 font-bold text-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  {{ sortedAttack[1].attackStarsSum }} / {{ warFilter * 3 }}
                </p>
                <p class="text-green-200 text-sm">💥 {{ sortedAttack[1].attackDestructionSum.toFixed(1) }}% / {{
                  warFilter * 100 }}%</p>
                <p class="text-white text-sm flex items-center justify-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 2.727 1.17a1 1 0 10.788-1.838l-2.25-1.125a3.01 3.01 0 00-.356.257l-2.641 1.131 2.641 1.131a3.01 3.01 0 00.356.257L12 9.051l2.641 1.131a3.01 3.01 0 00.356-.257l4-1.714a1 1 0 11.788 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838l2.727-1.17-2.727-1.17a1 1 0 010-1.838l7-3z" />
                  </svg>
                  <span class="font-bold">{{ sortedAttack[1].warsPlayed }}</span> <span class="opacity-70">/ {{
                    warFilter }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 3rd Place -->
        <div v-if="sortedAttack[2]" class="order-3">
          <div
            class="group bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6 border-4 border-orange-400 shadow-2xl transform hover:scale-105 transition-all relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="text-6xl">🥉</span>
            </div>
            <div class="text-center mt-8">
              <div
                class="bg-orange-900 bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 relative group-hover:rotate-6 transition-transform">
                <span class="text-4xl font-black text-white">3</span>
                <button @click.stop="deletePlayer(sortedAttack[2].name)"
                  class="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Player">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h4 class="text-xl font-black text-white mb-2">{{ sortedAttack[2].name }}</h4>
              <div class="bg-black bg-opacity-30 rounded-lg p-3 space-y-1">
                <p class="text-orange-200 font-bold text-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  {{ sortedAttack[2].attackStarsSum }} / {{ warFilter * 3 }}
                </p>
                <p class="text-green-200 text-sm">💥 {{ sortedAttack[2].attackDestructionSum.toFixed(1) }}% / {{
                  warFilter * 100 }}%</p>
                <p class="text-white text-sm flex items-center justify-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 2.727 1.17a1 1 0 10.788-1.838l-2.25-1.125a3.01 3.01 0 00-.356.257l-2.641 1.131 2.641 1.131a3.01 3.01 0 00.356.257L12 9.051l2.641 1.131a3.01 3.01 0 00.356-.257l4-1.714a1 1 0 11.788 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838l2.727-1.17-2.727-1.17a1 1 0 010-1.838l7-3z" />
                  </svg>
                  <span class="font-bold">{{ sortedAttack[2].warsPlayed }}</span> <span class="opacity-70">/ {{
                    warFilter }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Rest of Rankings -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="(player, index) in sortedAttack.slice(3)" :key="'att-' + player.name"
          class="bg-black flex  items-center justify-between bg-opacity-40 rounded-lg p-5 hover:bg-opacity-60 transition-all border-2 border-green-600 hover:border-yellow-400">
          <div style="flex:0.4;" class="flex items-center gap-3 mb-3">
            <span
              class="text-2xl font-black text-yellow-400 bg-green-700 rounded-lg w-12 h-12 flex items-center justify-center shadow-lg">
              {{ index + 4 }}
            </span>
            <div class="flex-1 flex flex-col">
              <span class="font-bold text-white text-lg leading-tight mb-1">{{ player.name }}</span>
              <span
                class="text-xs text-gray-200 font-bold flex items-center gap-1.5 bg-gray-800/80 px-2 py-1 rounded w-fit border border-gray-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-yellow-500" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 2.727 1.17a1 1 0 10.788-1.838l-2.25-1.125a3.01 3.01 0 00-.356.257l-2.641 1.131 2.641 1.131a3.01 3.01 0 00.356.257L12 9.051l2.641 1.131a3.01 3.01 0 00.356-.257l4-1.714a1 1 0 11.788 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838l2.727-1.17-2.727-1.17a1 1 0 010-1.838l7-3z" />
                </svg>
                <span class="text-yellow-400">{{ player.warsPlayed }}</span> <span
                  class="text-gray-400 font-normal">/</span> {{ warFilter }}
              </span>
            </div>
          </div>
          <div style="flex:0.6;">
            <!-- Stars Progress -->
            <div class="mb-2">
              <div class="flex justify-between items-center mb-1">
                <span class="text-yellow-300 text-sm font-semibold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  النجوم
                </span>
                <span class="text-white font-bold text-sm">{{ player.attackStarsSum }} / {{ warFilter * 3 }}</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  :style="{ width: `${(player.attackStarsSum / (warFilter * 3)) * 100}%` }"></div>
              </div>
            </div>
            <!-- Destruction Progress -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-green-300 text-sm font-semibold">💥 التدمير</span>
                <span class="text-white font-bold text-sm">{{ player.attackDestructionSum.toFixed(1) }}% / {{ warFilter
                  * 100 }}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  :style="{ width: `${(player.attackDestructionSum / (warFilter * 100)) * 100}%` }"></div>
              </div>
            </div>
          </div>
          <button @click.stop="deletePlayer(player.name)"
            class="text-red-500 hover:text-red-400 p-2 transition-colors self-center" title="Delete Player">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- أقوى دفاع - Full Width -->
    <div class="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl shadow-2xl p-6 border-4 border-blue-500">
      <h3 class="text-3xl font-black mb-6 text-yellow-400 flex items-center gap-3"
        style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8)">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" />
        </svg>
        🛡️ أقوى دفاع
      </h3>
      <!-- Top 3 - Podium Style -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- 1st Place -->
        <div v-if="sortedDefense[0]" class="order-2 md:order-1">
          <div
            class="group bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 border-4 border-yellow-400 shadow-2xl transform hover:scale-105 transition-all relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="text-6xl">🥇</span>
            </div>
            <div class="text-center mt-8">
              <div
                class="bg-yellow-900 bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 relative group-hover:rotate-6 transition-transform">
                <span class="text-4xl font-black text-white">1</span>
                <button @click.stop="deletePlayer(sortedDefense[0].name)"
                  class="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Player">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h4 class="text-xl font-black text-white mb-2">{{ sortedDefense[0].name }}</h4>
              <div class="bg-black bg-opacity-30 rounded-lg p-3 space-y-1">
                <p class="text-yellow-200 font-bold text-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  <span :class="sortedDefense[0].hasPhantomDefense ? 'text-yellow-400 font-extrabold' : ''">{{ sortedDefense[0].defenseStarsSum }} / {{ sortedDefense[0].warsPlayed * 3 }}</span>
                </p>
                <p class="text-sm" :class="sortedDefense[0].hasPhantomDefense ? 'text-yellow-400 font-bold' : 'text-blue-200'">💥 {{ sortedDefense[0].defenseDestructionSum.toFixed(1) }}% / {{
                  warFilter * 100 }}%</p>
                <p class="text-white text-sm flex items-center justify-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 2.727 1.17a1 1 0 10.788-1.838l-2.25-1.125a3.01 3.01 0 00-.356.257l-2.641 1.131 2.641 1.131a3.01 3.01 0 00.356.257L12 9.051l2.641 1.131a3.01 3.01 0 00.356-.257l4-1.714a1 1 0 11.788 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838l2.727-1.17-2.727-1.17a1 1 0 010-1.838l7-3z" />
                  </svg>
                  <span class="font-bold">{{ sortedDefense[0].warsPlayed }}</span> <span class="opacity-70">/ {{
                    warFilter }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 2nd Place -->
        <div v-if="sortedDefense[1]" class="order-1 md:order-2">
          <div
            class="group bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl p-6 border-4 border-gray-300 shadow-2xl transform hover:scale-105 transition-all relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="text-6xl">🥈</span>
            </div>
            <div class="text-center mt-8">
              <div
                class="bg-gray-700 bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 relative group-hover:rotate-6 transition-transform">
                <span class="text-4xl font-black text-white">2</span>
                <button @click.stop="deletePlayer(sortedDefense[1].name)"
                  class="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Player">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h4 class="text-xl font-black text-white mb-2">{{ sortedDefense[1].name }}</h4>
              <div class="bg-black bg-opacity-30 rounded-lg p-3 space-y-1">
                <p class="text-gray-200 font-bold text-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  <span :class="sortedDefense[1].hasPhantomDefense ? 'text-yellow-400 font-extrabold' : ''">{{ sortedDefense[1].defenseStarsSum }} / {{ sortedDefense[1].warsPlayed * 3 }}</span>
                </p>
                <p class="text-sm" :class="sortedDefense[1].hasPhantomDefense ? 'text-yellow-400 font-bold' : 'text-blue-200'">💥 {{ sortedDefense[1].defenseDestructionSum.toFixed(1) }}% / {{
                  warFilter * 100 }}%</p>
                <p class="text-white text-sm flex items-center justify-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 2.727 1.17a1 1 0 10.788-1.838l-2.25-1.125a3.01 3.01 0 00-.356.257l-2.641 1.131 2.641 1.131a3.01 3.01 0 00.356.257L12 9.051l2.641 1.131a3.01 3.01 0 00.356-.257l4-1.714a1 1 0 11.788 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838l2.727-1.17-2.727-1.17a1 1 0 010-1.838l7-3z" />
                  </svg>
                  <span class="font-bold">{{ sortedDefense[1].warsPlayed }}</span> <span class="opacity-70">/ {{
                    warFilter }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 3rd Place -->
        <div v-if="sortedDefense[2]" class="order-3">
          <div
            class="group bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6 border-4 border-orange-400 shadow-2xl transform hover:scale-105 transition-all relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="text-6xl">🥉</span>
            </div>
            <div class="text-center mt-8">
              <div
                class="bg-orange-900 bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 relative group-hover:rotate-6 transition-transform">
                <span class="text-4xl font-black text-white">3</span>
                <button @click.stop="deletePlayer(sortedDefense[2].name)"
                  class="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Player">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h4 class="text-xl font-black text-white mb-2">{{ sortedDefense[2].name }}</h4>
              <div class="bg-black bg-opacity-30 rounded-lg p-3 space-y-1">
                <p class="text-orange-200 font-bold text-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  <span :class="sortedDefense[2].hasPhantomDefense ? 'text-yellow-400 font-extrabold' : ''">{{ sortedDefense[2].defenseStarsSum }} / {{ sortedDefense[2].warsPlayed * 3 }}</span>
                </p>
                <p class="text-sm" :class="sortedDefense[2].hasPhantomDefense ? 'text-yellow-400 font-bold' : 'text-blue-200'">💥 {{ sortedDefense[2].defenseDestructionSum.toFixed(1) }}% / {{
                  warFilter * 100 }}%</p>
                <p class="text-white text-sm flex items-center justify-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 2.727 1.17a1 1 0 10.788-1.838l-2.25-1.125a3.01 3.01 0 00-.356.257l-2.641 1.131 2.641 1.131a3.01 3.01 0 00.356.257L12 9.051l2.641 1.131a3.01 3.01 0 00.356-.257l4-1.714a1 1 0 11.788 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838l2.727-1.17-2.727-1.17a1 1 0 010-1.838l7-3z" />
                  </svg>
                  <span class="font-bold">{{ sortedDefense[2].warsPlayed }}</span> <span class="opacity-70">/ {{
                    warFilter }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Rest of Rankings -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="(player, index) in sortedDefense.slice(3)" :key="'def-' + player.name"
          class="bg-black flex items-center justify-between bg-opacity-40 rounded-lg p-5 hover:bg-opacity-60 transition-all border-2 border-blue-600 hover:border-yellow-400">
          <div style="flex:0.4;" class="flex items-center gap-3 mb-3">
            <span
              class="text-2xl font-black text-yellow-400 bg-blue-700 rounded-lg w-12 h-12 flex items-center justify-center shadow-lg">
              {{ index + 4 }}
            </span>
            <div class="flex-1 flex flex-col">
              <span class="font-bold text-white text-lg leading-tight mb-1">{{ player.name }}</span>
              <span
                class="text-xs text-gray-200 font-bold flex items-center gap-1.5 bg-gray-800/80 px-2 py-1 rounded w-fit border border-gray-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-yellow-500" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 2.727 1.17a1 1 0 10.788-1.838l-2.25-1.125a3.01 3.01 0 00-.356.257l-2.641 1.131 2.641 1.131a3.01 3.01 0 00.356.257L12 9.051l2.641 1.131a3.01 3.01 0 00.356-.257l4-1.714a1 1 0 11.788 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838l2.727-1.17-2.727-1.17a1 1 0 010-1.838l7-3z" />
                </svg>
                <span class="text-yellow-400">{{ player.warsPlayed }}</span> <span
                  class="text-gray-400 font-normal">/</span> {{ warFilter }}
              </span>
            </div>
          </div>
          <div style="flex:0.6;">
            <!-- Stars Progress -->
            <div class="mb-2">
              <div class="flex justify-between items-center mb-1">
                <span class="text-yellow-300 text-sm font-semibold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.644 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  النجوم
                </span>
                <span class="font-bold text-sm" :class="player.hasPhantomDefense ? 'text-yellow-400' : 'text-white'">{{ player.defenseStarsSum }} / {{ player.warsPlayed * 3
                }}</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  :style="{ width: `${(player.defenseStarsSum / (player.warsPlayed * 3)) * 100}%` }"></div>
              </div>
            </div>
            <!-- Destruction Progress -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-blue-300 text-sm font-semibold">💥 التدمير</span>
                <span class="font-bold text-sm" :class="player.hasPhantomDefense ? 'text-yellow-400' : 'text-white'">{{ player.defenseDestructionSum.toFixed(1) }}% / {{ warFilter
                  * 100 }}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  :style="{ width: `${(player.defenseDestructionSum / (warFilter * 100)) * 100}%` }"></div>
              </div>
            </div>
          </div>
          <button @click.stop="deletePlayer(player.name)"
            class="text-red-500 hover:text-red-400 p-2 transition-colors self-center" title="Delete Player">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
  <!-- Custom PDF Export Section with Member Selection -->
  <section v-if="stats.length"
    class="mt-8 p-6 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl border-4 border-yellow-400 shadow-2xl max-w-full overflow-x-auto"
    style="direction: rtl;">
    <h2 class="text-3xl font-black mb-6 text-yellow-400 flex items-center gap-3"
      style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      ⚔️ اقوي هجوم واقوي دفاع 🛡️
    </h2>
    <p class="text-white text-lg mb-6 bg-black bg-opacity-30 rounded-lg p-4">
      اختر اللاعبين من قسم الهجوم أو الدفاع لتصدير تقرير PDF مخصص
    </p>
    <!-- Attack Selection -->
    <div class="mb-8">
      <h3 class="text-2xl font-black mb-4 text-green-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
        </svg>
        ⚔️ اختر من أقوى هجوم
        <span class="text-sm text-white bg-green-600 px-3 py-1 rounded-full">
          {{ selectedAttackMembers.size }} محدد
        </span>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(player, index) in sortedAttack" :key="'attack-select-' + player.name"
          @click="toggleAttackSelection(player.name)"
          class="relative cursor-pointer bg-gradient-to-br rounded-xl p-4 border-4 shadow-xl transform transition-all duration-300"
          :class="selectedAttackMembers.has(player.name)
            ? 'from-green-600 to-green-800 border-yellow-400 scale-105 shadow-2xl'
            : 'from-gray-700 to-gray-900 border-green-600 hover:scale-102 hover:border-yellow-400'">
          <!-- Selection Checkmark -->
          <div v-if="selectedAttackMembers.has(player.name)"
            class="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-900" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="flex items-center gap-3 mb-3">
            <span
              class="text-2xl font-black text-yellow-400 bg-green-700 rounded-lg w-12 h-12 flex items-center justify-center shadow-lg">
              {{ index + 1 }}
            </span>
            <div class="flex-1">
              <h4 class="font-bold text-white text-lg truncate">{{ player.name }}</h4>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-yellow-300">⭐ {{ player.attackStarsSum }} نجمة</span>
                <span class="text-xs text-green-300">💥 {{ player.attackDestructionSum.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Defense Selection -->
    <div class="mb-8">
      <h3 class="text-2xl font-black mb-4 text-blue-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
        </svg>
        🛡️ اختر من أقوى دفاع
        <span class="text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
          {{ selectedDefenseMembers.size }} محدد
        </span>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(player, index) in sortedDefense" :key="'defense-select-' + player.name"
          @click="toggleDefenseSelection(player.name)"
          class="relative cursor-pointer bg-gradient-to-br rounded-xl p-4 border-4 shadow-xl transform transition-all duration-300"
          :class="selectedDefenseMembers.has(player.name)
            ? 'from-blue-600 to-blue-800 border-yellow-400 scale-105 shadow-2xl'
            : 'from-gray-700 to-gray-900 border-blue-600 hover:scale-102 hover:border-yellow-400'">
          <!-- Selection Checkmark -->
          <div v-if="selectedDefenseMembers.has(player.name)"
            class="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="flex items-center gap-3 mb-3">
            <span
              class="text-2xl font-black text-yellow-400 bg-blue-700 rounded-lg w-12 h-12 flex items-center justify-center shadow-lg">
              {{ index + 1 }}
            </span>
            <div class="flex-1">
              <h4 class="font-bold text-white text-lg truncate">{{ player.name }}</h4>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-yellow-300">⭐ {{ player.defenseStarsSum }} نجمة</span>
                <span class="text-xs text-blue-300">💥 {{ player.defenseDestructionSum.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Export Button -->
    <div class="flex justify-center">
      <button @click="exportSelectedMembersPDF" :disabled="totalSelectedMembers === 0 || loading"
        class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-3 text-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span v-if="totalSelectedMembers === 0">اختر لاعبين أولاً</span>
        <span v-else>تنزيل PDF للاعبين المحددين ({{ totalSelectedMembers }})</span>
      </button>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { topClans } from '../constants/clans'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import "../assets/fonts/Cairo-Regular-normal"
import * as XLSX from 'xlsx'
import playersWhatsappData from '../data/playersWhatsapp.json'
// Helper to generate Star/Shield icons as DataURL
const createIcons = async (count, type) => {
  if (!count) return null
  const canvas = document.createElement('canvas')
  const size = 20
  const gap = 2
  canvas.width = (size * count) + (gap * (count - 1))
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const starPath = new Path2D('M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z')
  const shieldPath = new Path2D('M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z')
  const path = type === 'star' ? starPath : shieldPath
  const color = type === 'star' ? '#FACC15' : '#EF4444' // Yellow-400 : Red-500
  for (let i = 0; i < count; i++) {
    ctx.save()
    ctx.translate((size + gap) * i, 0)
    ctx.scale(size / 24, size / 24)
    ctx.fillStyle = color
    ctx.fill(path)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.stroke(path)
    ctx.restore()
  }
  return canvas.toDataURL('image/png')
}
const route = useRoute()
const clanTag = ref("#2PYCUY8RG");
const searchTag = ref("");
const stats = ref([])
const clanName = ref('Fiery Wars')
const warFilter = ref(7)
const totalWars = 7
const expandedPlayer = ref(null)
const loading = ref(false)
const error = ref('')
// New state for batch loading
const loadingAll = ref(false)
const loadedClansCount = ref(0)
const totalClansToLoad = ref(0)
// CWL Group clans (the other 7 clans in the league group)
const cwlGroupClans = ref([])
const cwlGroupLoading = ref(false)
const activePrimaryTag = ref('')
// Select primary clan: load its group, then load its stats
const selectPrimaryClan = async (tag) => {
  activePrimaryTag.value = tag;
  cwlGroupClans.value = [];
  cwlGroupLoading.value = true;
  try {
    const res = await axios.get(`http://localhost:5000/api/clan/${encodeURIComponent(tag)}/cwl`);
    // All clans except the selected primary
    cwlGroupClans.value = (res.data.clans || []).filter(
      c => c.tag.replace('#', '').toLowerCase() !== tag.replace('#', '').toLowerCase()
    );
  } catch (e) {
    cwlGroupClans.value = [];
  } finally {
    cwlGroupLoading.value = false;
  }
  // Also load stats for this primary clan
  await selectClan(tag);
};
// Function to fetch all clans in the group with delay
const fetchAllGroupClans = async () => {
  if (!activePrimaryTag.value && !cwlGroupClans.value.length) return;
  const clansToLoad = [];
  if (activePrimaryTag.value) {
    clansToLoad.push({ tag: activePrimaryTag.value });
  }
  cwlGroupClans.value.forEach(c => {
    if (c.tag !== activePrimaryTag.value) {
      clansToLoad.push({ tag: c.tag });
    }
  });
  if (clansToLoad.length === 0) return;
  loadingAll.value = true;
  loadedClansCount.value = 0;
  totalClansToLoad.value = clansToLoad.length;
  stats.value = [];
  clanName.value = 'جاري تحميل جميع الكلانات...';
  try {
    for (const clan of clansToLoad) {
      clanTag.value = clan.tag;
      await fetchClanData(true); // true means append
      loadedClansCount.value++;
      // Delay between requests (e.g., 800ms)
      if (loadedClansCount.value < totalClansToLoad.value) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
    clanName.value = 'جميع أعضاء المجموعة';
  } catch (err) {
    console.error('Error in batch loading:', err);
    error.value = 'حدث خطأ أثناء تحميل بعض الكلانات.';
  } finally {
    loadingAll.value = false;
  }
};
// Select any clan (primary or group) → load its stats
const selectClan = async (tag) => {
  clanTag.value = tag;
  searchTag.value = tag;
  await fetchClanData();
};
// Selection state for custom PDF export
const selectedAttackMembers = ref(new Set())
const selectedDefenseMembers = ref(new Set())
function toggleDetails(name) {
  expandedPlayer.value = expandedPlayer.value === name ? null : name
}
// Toggle member selection for attack
function toggleAttackSelection(playerName) {
  if (selectedAttackMembers.value.has(playerName)) {
    selectedAttackMembers.value.delete(playerName)
  } else {
    selectedAttackMembers.value.add(playerName)
  }
  // Trigger reactivity
  selectedAttackMembers.value = new Set(selectedAttackMembers.value)
}
// Toggle member selection for defense
function toggleDefenseSelection(playerName) {
  if (selectedDefenseMembers.value.has(playerName)) {
    selectedDefenseMembers.value.delete(playerName)
  } else {
    selectedDefenseMembers.value.add(playerName)
  }
  // Trigger reactivity
  selectedDefenseMembers.value = new Set(selectedDefenseMembers.value)
}
const deletePlayer = (playerName) => {
  if (confirm(`Are you sure you want to delete ${playerName} from the stats?`)) {
    stats.value = stats.value.filter(p => p.name !== playerName);
  }
}
// Get owner info from playersWhatsapp.json by matching player tag
const getOwnerInfoByTag = (playerTag) => {
  if (!playerTag) return { ownerName: 'غير متوفر', whatsapp: '-' }
  // Remove # from tag for comparison
  const cleanTag = playerTag.replace('#', '')
  // Find owner by matching village ID
  for (const owner of playersWhatsappData) {
    const hasVillage = owner.villages.some(v =>
      v.villageId.replace('#', '') === cleanTag
    )
    if (hasVillage) {
      return {
        ownerName: owner.ownerName,
        whatsapp: owner.whatsapp
      }
    }
  }
  return { ownerName: 'غير متوفر', whatsapp: '-' }
}
// Computed: Total selected members count
const totalSelectedMembers = computed(() => {
  return selectedAttackMembers.value.size + selectedDefenseMembers.value.size
})
const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = url
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
  })
}
// PDF Export Function - Full War Breakdown ONLY
const exportFullWarBreakdownPDF = async () => {
  loading.value = true
  // Preload images
  const thLevels = [...new Set(sortedByScore.value.map(p => p.townhallLevel).filter(l => l))]
  const thImages = {}
  await Promise.all(thLevels.map(async (level) => {
    const url = getTownhallImage(level)
    thImages[level] = await loadImage(url)
  }))
  const doc = new jsPDF('l', 'mm', 'a4') // Landscape for better table fit
  doc.setFont("Cairo-VariableFont_slnt,wght")
  let currentY = 15
  // Title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text(`Full War Breakdown (Attack | Defense) - ${clanName.value}`, 148, currentY, { align: 'center' })
  currentY += 10
  doc.setFontSize(12)
  doc.text(`Wars Counted: ${warFilter.value}`, 148, currentY, { align: 'center' })
  currentY += 12
  // Prepare Headers
  const headerRow1 = [
    { content: '#', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
    { content: 'Player', rowSpan: 2, styles: { valign: 'middle', halign: 'left' } }
  ]
  const headerRow2 = []
  // Add War Headers dynamically
  for (let i = 1; i <= warFilter.value; i++) {
    headerRow1.push({ content: `War ${i}`, colSpan: 1, styles: { halign: 'center' } })
    headerRow2.push({ content: 'Atk | Def', styles: { halign: 'center', fontSize: 7 } })
  }
  // Add Totals Header
  headerRow1.push({ content: 'Totals', colSpan: 2, styles: { halign: 'center', valign: 'middle' } })
  headerRow2.push('Atk', 'Def')
  const detailedData = sortedByScore.value.map((player, idx) => {
    const row = [
      idx + 1,
      player.name
    ]
    // Loop through all potential wars up to the filter
    for (let i = 0; i < warFilter.value; i++) {
      const war = player.wars[i] || {}
      if (!war.hasWar && !war.inRoster) {
        row.push({ content: '-', styles: { halign: 'center', valign: 'middle', textColor: [200, 200, 200] } })
      } else if (!war.inRoster) {
        row.push({ content: 'Out', styles: { halign: 'center', valign: 'middle', textColor: [200, 200, 200], fontSize: 7 } })
      } else {
        // Attack Details
        let atkDetails = '-'
        if (war.attackStars !== null) {
          atkDetails = `${war.attackStars}*`
          if (war.attackDestruction !== undefined) atkDetails += ` ${war.attackDestruction}%`
        }
        // Defense Details
        let defDetails = '-'
        if (war.defenseStars !== null) {
          defDetails = `${war.defenseStars}*`
          if (war.defenseDestruction !== undefined) defDetails += ` ${war.defenseDestruction}%`
        }
        const entry = `A: ${atkDetails}\nD: ${defDetails}`
        row.push({ content: entry, styles: { halign: 'center', fontSize: 6, cellPadding: 1 } })
      }
    }
    // Totals
    row.push({ content: `${player.stats.totalAttackStars}`, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: [0, 128, 0] } })
    row.push({ content: `${player.stats.totalDefenseStars}`, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: [0, 0, 255] } })
    return row
  })
  autoTable(doc, {
    head: [headerRow1, headerRow2],
    body: detailedData,
    startY: currentY,
    theme: 'grid',
    styles: {
      font: 'Cairo-VariableFont_slnt,wght',
      fontSize: 8,
      cellPadding: 1,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 35, cellPadding: { top: 1, right: 1, bottom: 1, left: 8 } }, // Padding for image
      // Dynamic columns will take remaining space
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const player = sortedByScore.value[data.row.index]
        if (player && player.townhallLevel && thImages[player.townhallLevel]) {
          const imgSize = 5
          const x = data.cell.x + 1 // Left padding
          const y = data.cell.y + (data.cell.height / 2) - (imgSize / 2)
          doc.addImage(thImages[player.townhallLevel], 'PNG', x, y, imgSize, imgSize)
        }
      }
    }
  })
  loading.value = false
  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Page ${i} of ${pageCount}`, 148, 205, { align: 'center' })
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 148, 208, { align: 'center' })
  }
  // Save PDF
  const fileName = `CWL_Breakdown_${clanName.value.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
// PDF Export Function - Comprehensive Report
const exportToPDF = async () => {
  loading.value = true
  // Preload images
  const thLevels = [...new Set(sortedByScore.value.map(p => p.townhallLevel).filter(l => l))]
  const thImages = {}
  await Promise.all(thLevels.map(async (level) => {
    const url = getTownhallImage(level)
    thImages[level] = await loadImage(url)
  }))
  const doc = new jsPDF('l', 'mm', 'a4') // Landscape for better table fit
  // Set Arabic font
  doc.setFont("Cairo-VariableFont_slnt,wght")
  let currentY = 15
  // Title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text(`CWL Statistics Report - Fiery Wars`, 148, currentY, { align: 'center' })
  currentY += 10
  doc.setFontSize(12)
  doc.text(`Wars Counted: ${warFilter.value}`, 148, currentY, { align: 'center' })
  currentY += 12
  // MVP Section
  if (mvpPlayer.value) {
    doc.setFontSize(16)
    doc.setTextColor(255, 193, 7)
    doc.text('MVP - Best Player', 14, currentY)
    currentY += 8
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`Name: ${mvpPlayer.value.name}`, 14, currentY)
    doc.text(`Category: ${mvpPlayer.value.stats.sortCategory}`, 80, currentY)
    doc.text(`Defense Stars: ${mvpPlayer.value.stats.totalDefenseStars}`, 130, currentY)
    doc.text(`Destruction: ${mvpPlayer.value.stats.totalDefenseDest.toFixed(0)}%`, 180, currentY)
    currentY += 10
  }
  // Detailed War Statistics
  doc.setFontSize(14)
  doc.setTextColor(79, 70, 229)
  doc.text('Detailed War Statistics', 14, currentY)
  currentY += 6
  // Add explanation note
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Note: Percentages are cumulative totals out of ${warFilter.value * 100}% (${warFilter.value} wars × 100%)`, 14, currentY)
  currentY += 5
  const warStatsData = sortedByScore.value.map((player, idx) => {
    const row = [
      idx + 1,
      player.name,
      `${player.stats.totalAttackStars}/${player.stats.maxAttackStars}`,
      `${player.stats.totalAttackDest.toFixed(0)}%`,
      `${player.stats.totalDefenseStars}/${player.stats.maxDefenseStars}`,
      `${player.stats.totalDefenseDest.toFixed(0)}%`,
      player.clanName || '-'
    ]
    return row
  })
  autoTable(doc, {
    head: [['#', 'Player', 'Atk Stars', 'Atk %', 'Def Stars', 'Def %', 'Clan']],
    body: warStatsData,
    startY: currentY,
    theme: 'striped',
    styles: {
      font: 'Cairo-VariableFont_slnt,wght',
      fontSize: 8,
      halign: 'right'
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      halign: 'center',
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 20, halign: 'center' },
      6: { cellWidth: 40, halign: 'center' }
    }
  })
  currentY = doc.lastAutoTable.finalY + 10
  // Check if we need a new page
  if (currentY > 180) {
    doc.addPage()
    currentY = 15
  }
  // Top Attackers - Show ALL players
  doc.setFontSize(14)
  doc.setTextColor(0, 128, 0)
  doc.text('Top Attackers', 14, currentY)
  currentY += 5
  const topAttackers = sortedAttack.value.map((player, index) => [
    index + 1,
    player.name,
    `${player.attackStarsSum} / ${warFilter.value * 3}`,
    `${player.attackDestructionSum.toFixed(1)}% / ${warFilter.value * 100}%`
  ])
  autoTable(doc, {
    head: [['Rank', 'Player', 'Stars', 'Destruction']],
    body: topAttackers,
    startY: currentY,
    theme: 'grid',
    styles: {
      font: 'Cairo-VariableFont_slnt,wght',
      fontSize: 9,
      halign: 'right'
    },
    headStyles: {
      fillColor: [0, 128, 0],
      textColor: [255, 255, 255],
      halign: 'center',
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 80 },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 40, halign: 'center' }
    }
  })
  currentY = doc.lastAutoTable.finalY + 10
  // Check if we need a new page
  if (currentY > 180) {
    doc.addPage()
    currentY = 15
  }
  // Top Defenders - Show ALL players
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 255)
  doc.text('Top Defenders (Least Stars Conceded)', 14, currentY)
  currentY += 5
  const topDefenders = sortedDefense.value.map((player, index) => [
    index + 1,
    player.name,
    `${player.defenseStarsSum} / ${warFilter.value * 3}`,
    `${player.defenseDestructionSum.toFixed(1)}% / ${warFilter.value * 100}%`
  ])
  autoTable(doc, {
    head: [['Rank', 'Player', 'Stars Conceded', 'Destruction Conceded']],
    body: topDefenders,
    startY: currentY,
    theme: 'grid',
    styles: {
      font: 'Cairo-VariableFont_slnt,wght',
      fontSize: 9,
      halign: 'right'
    },
    headStyles: {
      fillColor: [0, 0, 255],
      textColor: [255, 255, 255],
      halign: 'center',
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 80 },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 40, halign: 'center' }
    }
  })
  currentY = doc.lastAutoTable.finalY + 10
  // Check if we need a new page
  if (currentY > 180) {
    doc.addPage()
    currentY = 15
  }
  // --- Full War Breakdown Table ---
  doc.setFontSize(14)
  doc.setTextColor(255, 152, 0) // Orange color for title
  doc.text('Full War Breakdown (Attack | Defense)', 14, currentY)
  currentY += 5
  // Prepare Headers
  const headerRow1 = [
    { content: '#', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
    { content: 'Player', rowSpan: 2, styles: { valign: 'middle', halign: 'left' } }
  ]
  const headerRow2 = []
  // Add War Headers dynamically
  for (let i = 1; i <= warFilter.value; i++) {
    headerRow1.push({ content: `War ${i}`, colSpan: 1, styles: { halign: 'center' } })
    headerRow2.push({ content: 'Atk | Def', styles: { halign: 'center', fontSize: 7 } })
  }
  // Add Totals Header
  headerRow1.push({ content: 'Totals', colSpan: 2, styles: { halign: 'center', valign: 'middle' } })
  headerRow2.push('Atk', 'Def')
  const detailedData = sortedByScore.value.map((player, idx) => {
    const row = [
      idx + 1,
      player.name
    ]
    // Loop through all potential wars up to the filter
    for (let i = 0; i < warFilter.value; i++) {
      const war = player.wars[i] || {}
      if (!war.hasWar && !war.inRoster) {
        row.push({ content: '-', styles: { halign: 'center', valign: 'middle', textColor: [200, 200, 200] } })
      } else if (!war.inRoster) {
        row.push({ content: 'Out', styles: { halign: 'center', valign: 'middle', textColor: [200, 200, 200], fontSize: 7 } })
      } else {
        // Attack Details
        let atkDetails = '-'
        if (war.attackStars !== null) {
          atkDetails = `${war.attackStars}*`
          if (war.attackDestruction !== undefined) atkDetails += ` ${war.attackDestruction}%`
          if (war.attackedTHs && war.attackedTHs.length > 0) {
            const ths = war.attackedTHs.filter(th => th).join(',')
            if (ths) {
              atkDetails += ` (${ths})`
            }
          }
        }
        // Defense Details
        let defDetails = '-'
        if (war.defenseStars !== null) {
          defDetails = `${war.defenseStars}*`
          if (war.defenseDestruction !== undefined) defDetails += ` ${war.defenseDestruction}%`
        }
        const entry = `A: ${atkDetails}\nD: ${defDetails}`
        row.push({ content: entry, styles: { halign: 'center', fontSize: 6, cellPadding: 1 } })
      }
    }
    // Totals
    row.push({ content: `${player.stats.totalAttackStars}`, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: [0, 128, 0] } })
    row.push({ content: `${player.stats.totalDefenseStars}`, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: [0, 0, 255] } })
    return row
  })
  autoTable(doc, {
    head: [headerRow1, headerRow2],
    body: detailedData,
    startY: currentY,
    theme: 'grid',
    styles: {
      font: 'Cairo-VariableFont_slnt,wght',
      fontSize: 8,
      cellPadding: 1,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 35, cellPadding: { top: 1, right: 1, bottom: 1, left: 8 } }, // Padding for image
      // Dynamic columns will take remaining space
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const player = sortedByScore.value[data.row.index]
        if (player && player.townhallLevel && thImages[player.townhallLevel]) {
          const imgSize = 5
          const x = data.cell.x + 1 // Left padding
          const y = data.cell.y + (data.cell.height / 2) - (imgSize / 2)
          doc.addImage(thImages[player.townhallLevel], 'PNG', x, y, imgSize, imgSize)
        }
      }
    }
  })
  loading.value = false
  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Page ${i} of ${pageCount}`, 148, 205, { align: 'center' })
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 148, 208, { align: 'center' })
  }
  // Save PDF
  const fileName = `CWL_Full_Report_${clanName.value.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
// Excel Export Function
// Excel Export Function
const exportToExcel = () => {
  const excelData = sortedByScore.value.map((player, idx) => {
    const row = {
      'Rank': idx + 1,
      'Player Name': player.name,
    }
    // Add per-war columns
    for (let i = 0; i < warFilter.value; i++) {
      const warNum = i + 1
      const war = player.wars[i] || {}
      // Attack
      let atkText = '-'
      if (war.hasWar === false && war.inRoster === false) atkText = '-'
      else if (war.inRoster === false) atkText = 'Out'
      else if (war.attackStars !== null) {
        atkText = `${war.attackStars}*`
        if (war.attackDestruction !== undefined) atkText += ` ${war.attackDestruction}%`
      }
      row[`War ${warNum} Attack`] = atkText
      // Defense
      let defText = '-'
      if (war.hasWar === false && war.inRoster === false) defText = '-'
      else if (war.inRoster === false) defText = 'Out'
      else if (war.defenseStars !== null) {
        defText = `${war.defenseStars}*`
        if (war.defenseDestruction !== undefined) defText += ` ${war.defenseDestruction}%`
      }
      row[`War ${warNum} Defense`] = defText
    }
    // Totals
    row['Total Atk Stars'] = player.stats.totalAttackStars
    row['Total Atk %'] = `${player.stats.totalAttackDest.toFixed(0)}%`
    row['Total Def Stars'] = player.stats.totalDefenseStars
    row['Total Def %'] = `${player.stats.totalDefenseDest.toFixed(0)}%`
    row['Category'] = player.stats.sortCategory
    return row
  })
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)
  // 🔥 Wider column widths
  const wscols = [
    { wch: 8 },  // Rank
    { wch: 30 }, // Player Name
  ]
  // War columns wider (30)
  for (let i = 0; i < warFilter.value; i++) {
    wscols.push({ wch: 30 }) // War X Atk
    wscols.push({ wch: 30 }) // War X Def
  }
  // Total columns wider (25)
  wscols.push({ wch: 25 })
  wscols.push({ wch: 25 })
  wscols.push({ wch: 25 })
  wscols.push({ wch: 25 })
  wscols.push({ wch: 25 })
  ws['!cols'] = wscols
  XLSX.utils.book_append_sheet(wb, ws, "CWL Stats")
  const fileName = `CWL_Stats_${clanName.value.replace(/[^a-z0-9]/gi, '_')}.xlsx`
  XLSX.writeFile(wb, fileName)
}
// Custom PDF Export for Selected Members
const exportSelectedMembersPDF = async () => {
  if (totalSelectedMembers.value === 0) {
    return
  }
  loading.value = true
  try {
    const doc = new jsPDF('p', 'mm', 'a4') // Portrait for better readability
    doc.setFont("Cairo-VariableFont_slnt,wght")
    let currentY = 15
    // Title
    doc.setFontSize(22)
    doc.setTextColor(40, 40, 40)
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    doc.text(`Bonus Report ${currentMonth}/${currentYear}`, 105, currentY, { align: 'center' })
    currentY += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`Clan: ${clanName.value}`, 105, currentY, { align: 'center' })
    currentY += 8
    doc.text(`Wars Count: ${warFilter.value}`, 105, currentY, { align: 'center' })
    currentY += 12
    // Prepare data for selected members
    const selectedData = []
    let sequentialNo = 1
    // Add selected attack members
    selectedAttackMembers.value.forEach(playerName => {
      const attackPlayer = sortedAttack.value.find(p => p.name === playerName)
      const fullPlayerData = processedStats.value.find(p => p.name === playerName)
      if (attackPlayer && fullPlayerData) {
        // Get player tag from stats
        const playerTag = fullPlayerData.tag
        // Get owner info using player tag
        const ownerInfo = getOwnerInfoByTag(playerTag)
        const rank = sortedAttack.value.findIndex(p => p.name === playerName) + 1
        selectedData.push({
          no: sequentialNo++,
          name: playerName,
          th: fullPlayerData.townhallLevel || '-',
          ownerName: ownerInfo.ownerName,
          whatsapp: ownerInfo.whatsapp,
          why: 'Attack',
          stars: attackPlayer.attackStarsSum,
          percentage: attackPlayer.attackDestructionSum.toFixed(1),
          rank: rank
        })
      }
    })
    // Add selected defense members
    selectedDefenseMembers.value.forEach(playerName => {
      const defensePlayer = sortedDefense.value.find(p => p.name === playerName)
      const fullPlayerData = processedStats.value.find(p => p.name === playerName)
      if (defensePlayer && fullPlayerData) {
        // Get player tag from stats
        const playerTag = fullPlayerData.tag
        // Get owner info using player tag
        const ownerInfo = getOwnerInfoByTag(playerTag)
        const rank = sortedDefense.value.findIndex(p => p.name === playerName) + 1
        selectedData.push({
          no: sequentialNo++,
          name: playerName,
          th: fullPlayerData.townhallLevel || '-',
          ownerName: ownerInfo.ownerName,
          whatsapp: ownerInfo.whatsapp,
          why: 'Defense',
          stars: defensePlayer.defenseStarsSum,
          percentage: defensePlayer.defenseDestructionSum.toFixed(1),
          rank: rank
        })
      }
    })
    // Prepare attack data and sort by rank
    const attackData = selectedData.filter(p => p.why === 'Attack').sort((a, b) => a.rank - b.rank)
    const defenseData = selectedData.filter(p => p.why === 'Defense').sort((a, b) => a.rank - b.rank)
    // Generate Attack Table
    if (attackData.length > 0) {
      doc.setFontSize(16)
      doc.setTextColor(0, 128, 0)
      doc.text('⚔️ Best Attack', 105, currentY, { align: 'center' })
      currentY += 8
      const attackTableData = attackData.map((player, index) => [
        index + 1,
        player.name,
        player.th,
        player.ownerName,
        player.stars,
        `${player.percentage}%`,
        player.rank
      ])
      autoTable(doc, {
        head: [['No', 'Name', 'TH', 'Owner Name', 'Stars', 'Percentage', 'Rank']],
        body: attackTableData,
        startY: currentY,
        theme: 'grid',
        styles: {
          font: 'Cairo-VariableFont_slnt,wght',
          fontSize: 10,
          halign: 'right',
          cellPadding: 3
        },
        headStyles: {
          fillColor: [0, 128, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 45, halign: 'right' },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 40, halign: 'right' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 25, halign: 'center' },
          6: { cellWidth: 20, halign: 'center' }
        },
        alternateRowStyles: {
          fillColor: [245, 255, 245]
        }
      })
      currentY = doc.lastAutoTable.finalY + 15
    }
    // Generate Defense Table
    if (defenseData.length > 0) {
      if (currentY > 200) {
        doc.addPage()
        currentY = 15
      }
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 255)
      doc.text('🛡️ Best Defense', 105, currentY, { align: 'center' })
      currentY += 8
      const defenseTableData = defenseData.map((player, index) => [
        index + 1,
        player.name,
        player.th,
        player.ownerName,
        player.stars,
        `${player.percentage}%`,
        player.rank
      ])
      autoTable(doc, {
        head: [['No', 'Name', 'TH', 'Owner Name', 'Stars', 'Percentage', 'Rank']],
        body: defenseTableData,
        startY: currentY,
        theme: 'grid',
        styles: {
          font: 'Cairo-VariableFont_slnt,wght',
          fontSize: 10,
          halign: 'right',
          cellPadding: 3
        },
        headStyles: {
          fillColor: [0, 0, 255],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 45, halign: 'right' },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 40, halign: 'right' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 25, halign: 'center' },
          6: { cellWidth: 20, halign: 'center' }
        },
        alternateRowStyles: {
          fillColor: [245, 245, 255]
        }
      })
      currentY = doc.lastAutoTable.finalY + 10
    }
    // currentY already set above
    // Footer
    doc.setFontSize(9)
    doc.setTextColor(128, 128, 128)
    const footerY = doc.internal.pageSize.height - 15
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}`, 105, footerY, { align: 'center' })
    doc.text(`Total Players: ${attackData.length + defenseData.length}`, 105, footerY + 5, { align: 'center' })
    // Save PDF
    const fileName = `Bonus_Report_${currentMonth}_${currentYear}_${clanName.value.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('حدث خطأ أثناء إنشاء ملف PDF')
  } finally {
    loading.value = false
  }
}
// Function to handle search
const handleSearch = async () => {
  if (!searchTag.value.trim()) {
    error.value = 'الرجاء إدخال تاج الكلان';
    return;
  }
  // Add # if not present
  let tag = searchTag.value.trim();
  if (!tag.startsWith('#')) {
    tag = '#' + tag;
  }
  clanTag.value = tag;
  await fetchClanData();
};
// Function to fetch clan data
const fetchClanData = async (append = false) => {
  try {
    if (!append) {
      loading.value = true;
      error.value = '';
      stats.value = [];
      clanName.value = '';
    }
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
        const warRes = await axios.get(`http://localhost:5000/api/cwl/war/${encodeURIComponent(warTag)}`)
        return { tag: warTag, data: warRes.data }
      })
    )
    const warData = {}
    warDataArray.forEach(({ tag, data }) => {
      warData[tag] = data
    })
    // تجميع كل اللاعبين من كل الحروب بالاعتماد على التاج لتجنب تكرار الأسماء
    const allPlayersMap = new Map()
    for (const warTag in warData) {
      const warInfo = warData[warTag]
      if (warInfo.clan.tag.replace('#', '') === clanTag.value.replace('#', '')) {
        warInfo.clan.members.forEach(m => allPlayersMap.set(m.tag, m.name))
      }
      if (warInfo.opponent.tag.replace('#', '') === clanTag.value.replace('#', '')) {
        warInfo.opponent.members.forEach(m => allPlayersMap.set(m.tag, m.name))
      }
    }
    const players = Array.from(allPlayersMap.entries()).map(([tag, name]) => ({ tag, name }))

    // تحديد اسم الكلان من أول حرب تشمل الكلان
    const exampleWarTag = Object.keys(warData).find(tag =>
      warData[tag].clan.tag.replace('#', '') === clanTag.value.replace('#', '') ||
      warData[tag].opponent.tag.replace('#', '') === clanTag.value.replace('#', '')
    )
    if (!exampleWarTag) {
      console.warn('Clan not found in any war')
      return
    }
    if (!append) {
      clanName.value = warData[exampleWarTag].clan.name
    }

    // بناء بيانات الإحصائيات لكل لاعب
    const newStats = players.map(playerInfo => {
      const playerName = playerInfo.name
      const targetTag = playerInfo.tag
      const wars = []
      let detailedAttacks = []
      let bestOpponentAttack = null
      let clanBadge = null
      let playerClanName = null

      for (const round of cwl.rounds) {
        const warTag = round.warTags.find(tag =>
          tag !== '#0' &&
          (warData[tag]?.clan.tag.replace('#', '') === clanTag.value.replace('#', '') ||
            warData[tag]?.opponent.tag.replace('#', '') === clanTag.value.replace('#', ''))
        )
        if (warTag && warData[warTag]) {
          const warInfo = warData[warTag]
          const clanSide = warInfo.clan.tag.replace('#', '') === clanTag.value.replace('#', '') ? 'clan' : 'opponent'
          const enemySide = clanSide === 'clan' ? 'opponent' : 'clan'

          const player = warInfo[clanSide].members.find(m => m.tag === targetTag)

          if (player) {
            if (!clanBadge) {
              clanBadge = warInfo[clanSide].badgeUrls?.small || warInfo[clanSide].badgeUrls?.medium
            }
            if (!playerClanName) {
              playerClanName = warInfo[clanSide].name
            }
            
            let attackedTownHalls = []
            if (player.attacks) {
              attackedTownHalls = player.attacks.map(attack => {
                const defender = warInfo[enemySide].members.find(m => m.tag === attack.defenderTag)
                return defender?.townhallLevel || null
              })
            }

            wars.push({
              inRoster: true,
              hasWar: true,
              attackStars: player.attacks?.reduce((sum, a) => sum + a.stars, 0) || 0,
              attackDestruction: player.attacks?.reduce((sum, a) => sum + a.destructionPercentage, 0) || 0,
              attackedTHs: attackedTownHalls,
              defenseStars: null,
              defenseDestruction: null,
              attackerTH: null,
              playerTownHall: player.townhallLevel || null,
            })

            if (!detailedAttacks.length && player.attacks) {
              detailedAttacks = player.attacks
            }
          } else {
            wars.push({ inRoster: false, hasWar: true, attackStars: null, defenseStars: null, attackedTHs: [], attackerTH: null })
          }

          const enemyAttacks = warInfo[enemySide].members.flatMap(m => m.attacks || [])
          const defense = enemyAttacks.find(a => a.defenderTag === targetTag)

          if (defense) {
            wars[wars.length - 1].defenseStars = defense.stars
            wars[wars.length - 1].defenseDestruction = defense.destructionPercentage
            const attacker = warInfo[enemySide].members.find(m => m.attacks?.some(a => a.defenderTag === targetTag))
            wars[wars.length - 1].attackerTH = attacker?.townhallLevel || null
            if (!bestOpponentAttack) bestOpponentAttack = defense
          }
        } else {
          wars.push({ inRoster: false, hasWar: false, attackStars: null, defenseStars: null, attackedTHs: [], attackerTH: null })
        }
      }

      return {
        name: playerName,
        tag: targetTag, // Use targetTag directly
        clanBadge,
        clanName: playerClanName,
        wars,
        attacks: detailedAttacks,
        bestOpponentAttack,
        townhallLevel: wars.find(w => w.playerTownHall)?.playerTownHall || null, // Get TH level from first war
      }
    })
    if (append) {
      stats.value = [...stats.value, ...newStats]
    } else {
      stats.value = newStats
    }
  } catch (err) {
    console.error('Error loading CWL data:', err);
    error.value = 'حدث خطأ أثناء تحميل البيانات. تأكد من صحة تاج الكلان.';
  } finally {
    loading.value = false;
  }
};
// Load default clan on mount
onMounted(async () => {
  // Check if tag is provided in query params
  if (route.query.tag) {
    clanTag.value = route.query.tag;
    searchTag.value = route.query.tag;
  }
  await fetchClanData();
});
const processedStats = computed(() => {
  return stats.value.map(player => {
    const filteredWars = player.wars.slice(0, warFilter.value)
    const warsInRoster = filteredWars.filter(w => w.inRoster)
    // Attack Stats
    const totalAttackStars = warsInRoster.reduce((sum, w) => sum + (w.attackStars || 0), 0)
    const maxAttackStars = warFilter.value * 3
    const totalAttackDest = warsInRoster.reduce((sum, w) => sum + (w.attackDestruction || 0), 0)
    const maxAttackDest = warFilter.value * 100
    // Defense Stats
    let totalDefenseStars = 0
    let totalDefenseDest = 0
    let unattackedWars = 0

    warsInRoster.forEach(w => {
      if (w.defenseStars !== null) {
        totalDefenseStars += w.defenseStars
        totalDefenseDest += w.defenseDestruction
      } else {
        totalDefenseStars += 3
        totalDefenseDest += 100
        unattackedWars++
      }
    })

    const warsPlayed = warsInRoster.length;
    const maxDefenseStars = warsPlayed * 3
    const maxDefenseDest = warsPlayed * 100;
    const warsAttackedIn = warsPlayed - unattackedWars;
    const hasPhantomDefense = unattackedWars > 0;

    let sortCategory = 1;
    if (warsPlayed < warFilter.value) {
      sortCategory = 2; // من غاب ينزل تحت
    } else {
      sortCategory = 1; // الباقي طبيعي
    }

    return {
      ...player,
      stats: {
        totalAttackStars,
        maxAttackStars,
        totalAttackDest,
        maxAttackDest,
        totalDefenseStars,
        maxDefenseStars,
        totalDefenseDest,
        maxDefenseDest,
        warsPlayed,
        warsAttackedIn,
        hasPhantomDefense,
        sortCategory,
      }
    }
  })
})
const sortedByScore = computed(() => {
  return [...processedStats.value].sort((a, b) => {
    if (a.stats.sortCategory !== b.stats.sortCategory) {
      return a.stats.sortCategory - b.stats.sortCategory
    }
    if (a.stats.totalDefenseStars !== b.stats.totalDefenseStars) {
      return a.stats.totalDefenseStars - b.stats.totalDefenseStars
    }
    return a.stats.totalDefenseDest - b.stats.totalDefenseDest
  })
})
const mvpPlayer = computed(() => {
  if (sortedByScore.value.length > 0) {
    return sortedByScore.value[0]
  }
  return null
})
const sortedDefense = computed(() => {
  return stats.value
    .map(player => {
      const relevantWars = player.wars.slice(0, warFilter.value)
      const warsInRoster = relevantWars.filter(w => w.inRoster)
      const warsPlayed = warsInRoster.length

      let defenseStarsSum = 0
      let defenseDestructionSum = 0
      let unattackedWars = 0

      warsInRoster.forEach(w => {
        if (w.defenseStars !== null) {
          defenseStarsSum += w.defenseStars
          defenseDestructionSum += w.defenseDestruction
        } else {
          defenseStarsSum += 3
          defenseDestructionSum += 100
          unattackedWars++
        }
      })

      const warsAttackedIn = warsPlayed - unattackedWars
      const hasPhantomDefense = unattackedWars > 0

      let sortCategory = 1;
      if (warsPlayed < warFilter.value) {
        sortCategory = 2; // فقط من غاب ينزل تحت
      } else {
        sortCategory = 1; // الباقي يعامل طبيعي
      }

      return {
        name: player.name,
        defenseStarsSum,
        defenseDestructionSum,
        warsPlayed,
        warsAttackedIn,
        hasPhantomDefense,
        sortCategory
      }
    })
    .sort((a, b) => {
      // 1. الترتيب حسب الفئة
      if (a.sortCategory !== b.sortCategory) {
        return a.sortCategory - b.sortCategory
      }
      // 2. الأقل استقبالا للنجوم هو الأفضل
      if (a.defenseStarsSum !== b.defenseStarsSum) {
        return a.defenseStarsSum - b.defenseStarsSum
      }
      // 3. الأقل في الدمار المستقبَل هو الأفضل
      return a.defenseDestructionSum - b.defenseDestructionSum
    })
})
const sortedAttack = computed(() => {
  return stats.value
    .map(player => {
      const relevantWars = player.wars.slice(0, warFilter.value)
      const attackStarsSum = relevantWars.reduce((acc, w) => acc + (w.attackStars ?? 0), 0)
      const attackDestructionSum = relevantWars.reduce((acc, w) => acc + (w.attackDestruction ?? 0), 0)
      const warsPlayed = relevantWars.filter(w => w.inRoster).length
      return {
        name: player.name,
        attackStarsSum,
        attackDestructionSum,
        warsPlayed,
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
// Helper function to get Town Hall image
const getTownhallImage = (level) => {
  try {
    // قائمة المستويات المتوفرة (6-18)
    const availableLevels = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    // لو المستوى موجود في القائمة، استخدم الصورة المخصصة
    if (availableLevels.includes(level)) {
      return new URL(`../assets/townhalls/townhall${level}.png`, import.meta.url).href
    }
    // لو المستوى مش موجود (1-5 أو أي رقم غريب)، استخدم الصورة الافتراضية
    return new URL(`../assets/townhalls/townhall_default.png`, import.meta.url).href
  } catch (error) {
    console.warn(`Failed to load townhall image for level ${level}:`, error)
    // في حالة حدوث أي خطأ، استخدم الصورة الافتراضية
    return new URL(`../assets/townhalls/townhall_default.png`, import.meta.url).href
  }
}
// Helper for Score Colors
const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}
const getScoreBarColor = (score) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}
// Check for route parameter on mount
onMounted(() => {
  // Check if clanTag is provided as a route parameter
  if (route.params.clanTag) {
    const decoded = decodeURIComponent(route.params.clanTag);
    clanTag.value = decoded;
    searchTag.value = decoded;
    fetchClanData();
  }
});
</script>
