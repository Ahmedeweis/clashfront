<template>
  <div class="min-h-screen  py-8">
    <div class=" mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
        <p class="text-white text-xl mt-4 font-bold">⏳ جاري تحميل تفاصيل الحرب...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-600 border-4 border-red-800 rounded-xl p-8 text-center shadow-2xl">
          <p class="text-white text-2xl font-bold mb-4">❌ {{ errorMessage || 'حدث خطأ أثناء تحميل بيانات الحرب' }}</p>
          <button @click="$router.back()"
            class="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-all">
            ← العودة
          </button>
        </div>
      </div>

      <!-- War Data -->
      <div v-else-if="war" class="space-y-6">
        <!-- Header -->
        <!-- <div
          class="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-2xl border-4 border-yellow-400">
          <div class="text-center">
            <h1 class="text-3xl md:text-4xl font-black text-white mb-3"
              style="text-shadow: 3px 3px 6px rgba(0,0,0,0.8)">
              🛡️ {{ war.clan.name }} <span class="text-yellow-200">VS</span> {{ war.opponent.name }} ⚔️
            </h1>
            <div class="flex flex-wrap justify-center gap-4 text-white text-sm md:text-base">
              <span class="bg-black bg-opacity-30 px-4 py-2 rounded-full">📅 {{ formatTime(war.startTime) }}</span>
              <span class="bg-black bg-opacity-30 px-4 py-2 rounded-full">🔚 {{ formatTime(war.endTime) }}</span>
              <span class="bg-black bg-opacity-30 px-4 py-2 rounded-full font-bold">
                🔁 {{ war.state === 'warEnded' ? 'انتهت الحرب' : war.state }}
              </span>
            </div>
          </div>
        </div> -->

        <!-- Score Cards
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-2xl border-4 border-blue-400 transform hover:scale-105 transition-all">
            <div class="flex items-center gap-4 mb-4">
              <div class="relative">
                <img :src="war.clan.badgeUrls.large" alt="Clan Badge"
                  class="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl" />
                <span
                  class="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">Lv.{{
                    war.clan.clanLevel }}</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-white">{{ war.clan.name }}</h2>
                <p class="text-sm text-blue-200 font-mono mt-1">{{ war.clan.tag }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">⭐ النجوم</p>
                <p class="text-white text-3xl font-black">{{ war.clan.stars }}</p>
              </div>
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">💥 نسبة التدمير</p>
                <p class="text-white text-3xl font-black">{{ war.clan.destructionPercentage.toFixed(2) }}%</p>
              </div>
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">🎯 عدد الهجمات</p>
                <p class="text-white text-3xl font-black">{{ totalClanAttacks }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 shadow-2xl border-4 border-red-400 transform hover:scale-105 transition-all">
            <div class="flex items-center gap-4 mb-4">
              <div class="relative">
                <img :src="war.opponent.badgeUrls.large" alt="Opponent Badge"
                  class="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl" />
                <span
                  class="absolute -bottom-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">Lv.{{
                    war.opponent.clanLevel }}</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-white">{{ war.opponent.name }}</h2>
                <p class="text-sm text-red-200 font-mono mt-1">{{ war.opponent.tag }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">⭐ النجوم</p>
                <p class="text-white text-3xl font-black">{{ war.opponent.stars }}</p>
              </div>
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">💥 نسبة التدمير</p>
                <p class="text-white text-3xl font-black">{{ war.opponent.destructionPercentage.toFixed(2) }}%</p>
              </div>
              <div class="bg-black bg-opacity-20 rounded-lg p-4">
                <p class="text-yellow-300 text-sm mb-1">🎯 عدد الهجمات</p>
                <p class="text-white text-3xl font-black">{{ totalOpponentAttacks }}</p>
              </div>
            </div>
          </div>
        </div>
        -->

        <!-- Members Section
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-blue-500">
            <h3 class="text-2xl font-black text-blue-400 mb-6 flex items-center gap-2">
              <span>👑</span> لاعبي القبيلة
            </h3>
            <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="member in war.clan.members" :key="member.tag"
                class="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-4 border-2 border-blue-600 hover:border-yellow-400 transition-all">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1">
                    <h4 class="font-bold text-white text-lg">{{ member.name }}</h4>
                    <div class="flex items-center gap-2 mt-1">
                      <img :src="getTownhallImage(member.townhallLevel)" class="w-8 h-8 object-contain"
                        :title="'Town Hall ' + member.townhallLevel" />
                      <p
                        class="text-xl font-black text-white bg-blue-600 px-3 py-1 rounded-lg shadow-lg border border-blue-400 transform -skew-x-12">
                        <span class="transform skew-x-12 inline-block">#{{ member.mapPosition }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {{ member.attacks?.length || 0 }} هجمات
                    </span>
                  </div>
                </div>

                <div v-if="member.attacks && member.attacks.length > 0"
                  class="bg-black bg-opacity-30 rounded-lg p-3 mb-2">
                  <p class="text-yellow-400 text-sm font-bold mb-2"> الهجمات:</p>
                  <div class="space-y-1">
                    <div v-for="(attack, i) in member.attacks" :key="i"
                      class="text-white text-sm flex justify-between items-center">
                      <span>#{{ getPlayerMapPosition(attack.defenderTag) }} {{ getPlayerName(attack.defenderTag)
                      }}</span>
                      <span class="font-bold text-yellow-300">⭐{{ attack.stars }} | 💥 {{ attack.destructionPercentage
                      }}%</span>
                    </div>
                  </div>
                </div>

                <div v-if="member.bestOpponentAttack" class="bg-red-900 bg-opacity-40 rounded-lg p-3">
                  <p class="text-red-300 text-sm font-bold mb-1">🛡️ أفضل هجوم ضده:</p>
                  <div class="text-white text-sm flex justify-between items-center">

                    <span>#{{ getPlayerMapPosition(member.bestOpponentAttack.attackerTag) }} {{
                      getPlayerName(member.bestOpponentAttack.attackerTag) }}</span>
                    <span class="font-bold text-red-400">⭐{{ member.bestOpponentAttack.stars }} | 💥 {{
                      member.bestOpponentAttack.destructionPercentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-red-500">
            <h3 class="text-2xl font-black text-red-400 mb-6 flex items-center gap-2">
              <span>⚔️</span> لاعبي الخصم
            </h3>
            <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="member in war.opponent.members" :key="member.tag"
                class="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-4 border-2 border-red-600 hover:border-yellow-400 transition-all">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1">
                    <h4 class="font-bold text-white text-lg">{{ member.name }}</h4>
                    <div class="flex items-center gap-2 mt-1">
                      <img :src="getTownhallImage(member.townhallLevel)" class="w-8 h-8 object-contain"
                        :title="'Town Hall ' + member.townhallLevel" />
                      <p
                        class="text-xl font-black text-white bg-red-600 px-3 py-1 rounded-lg shadow-lg border border-red-400 transform -skew-x-12">
                        <span class="transform skew-x-12 inline-block">#{{ member.mapPosition }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {{ member.attacks?.length || 0 }} هجمات
                    </span>
                  </div>
                </div>

                <div v-if="member.attacks && member.attacks.length > 0"
                  class="bg-black bg-opacity-30 rounded-lg p-3 mb-2">
                  <p class="text-yellow-400 text-sm font-bold mb-2"> الهجمات:</p>
                  <div class="space-y-1">
                    <div v-for="(attack, i) in member.attacks" :key="i"
                      class="text-white text-sm flex justify-between items-center">
                      <span>#{{ getPlayerMapPosition(attack.defenderTag) }} {{ getPlayerName(attack.defenderTag)
                      }}</span>
                      <span class="font-bold text-yellow-300">⭐{{ attack.stars }} | 💥 {{ attack.destructionPercentage
                      }}%</span>
                    </div>
                  </div>
                </div>

                <div v-if="member.bestOpponentAttack" class="bg-blue-900 bg-opacity-40 rounded-lg p-3">
                  <p class="text-blue-300 text-sm font-bold mb-1">🛡️ أفضل هجوم ضده:</p>
                  <div class="text-white text-sm flex justify-between items-center">
                    <span>#{{ getPlayerMapPosition(member.bestOpponentAttack.attackerTag) }} {{
                      getPlayerName(member.bestOpponentAttack.attackerTag) }}</span>
                    <span class="font-bold text-blue-400">⭐{{ member.bestOpponentAttack.stars }} | 💥 {{
                      member.bestOpponentAttack.destructionPercentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        -->

        <!-- Town Hall Lineup Comparison -->

        <div
          class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border-4 border-yellow-500">
          <h3 class="text-2xl font-black text-yellow-400 mb-6 text-center">🏰 ({{ war.teamSize }} vs {{ war.teamSize }})
          </h3>

          <!-- Clan Lineup -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-3">
              <img :src="war.clan.badgeUrls.small" class="w-8 h-8" />
              <h4 class="text-blue-300 font-bold">{{ war.clan.name }}</h4>
            </div>
            <div class="flex pb-4 gap-1 flex-wrap">
              <div v-for="i in war.teamSize" :key="'clan-' + i" class="flex-shrink-0 relative group w-12 text-center">
                <template v-if="getMemberAt(war.clan.members, i)">
                  <img :src="getTownhallImage(getMemberAt(war.clan.members, i).townhallLevel)"
                    class="w-10 h-10 mx-auto object-contain filter drop-shadow-lg transition-transform transform group-hover:scale-125" />
                  <span
                    class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 font-mono">
                    {{ i }}
                  </span>
                </template>
                <div v-else class="relative w-full h-full">
                  <img :src="getTownhallImage(1)" class="w-10 h-10 mx-auto object-contain opacity-30 grayscale" />
                  <span
                    class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 font-mono">
                    {{ i }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Opponent Lineup -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <img :src="war.opponent.badgeUrls.small" class="w-8 h-8" />
              <h4 class="text-red-300 font-bold">{{ war.opponent.name }}</h4>
            </div>
            <div class="flex  pb-4 gap-1 flex-wrap">
              <div v-for="i in war.teamSize" :key="'opp-' + i" class="flex-shrink-0 relative group w-12 text-center">
                <template v-if="getMemberAt(war.opponent.members, i)">
                  <img :src="getTownhallImage(getMemberAt(war.opponent.members, i).townhallLevel)"
                    class="w-10 h-10 mx-auto object-contain filter drop-shadow-lg transition-transform transform group-hover:scale-125" />
                  <span
                    class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 font-mono">
                    {{ i }}
                  </span>
                </template>
                <div v-else class="relative w-full h-full">
                  <img :src="getTownhallImage(1)" class="w-10 h-10 mx-auto object-contain opacity-30 grayscale" />
                  <span
                    class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 font-mono">
                    {{ i }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- War Map Section -->
        <!-- War Map Section -->
        <div class="rounded-xl overflow-hidden shadow-2xl relative mt-8 border-[3px] border-[#fbbf24]">
          <!-- Custom War Header (Clash Style) -->
          <div class="relative z-30 mb-[-120px] mx-auto w-full max-w-5xl px-2 mt-4">
            <!-- Main Bar -->
            <div
              class="bg-[#1e1e1e]/90 border-[3px] border-[#333] rounded-lg flex items-center justify-between p-2 py-3 relative shadow-2xl backdrop-blur-sm min-h-[80px]">

              <!-- Left Team (Clan) -->
              <div class="flex items-center flex-1 gap-3 relative">
                <!-- Badge Container -->
                <div class="relative -ml-6 md:-ml-8 z-20 flex-shrink-0">
                  <!-- Level Badge -->
                  <div
                    class="w-14 h-14 md:w-20 md:h-20 bg-[#2a0a3b] border-[3px] border-[#a855f7] rounded-xl transform rotate-3 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                    <span class="text-white font-black text-lg md:text-xl">{{ war.clan.clanLevel }}</span>
                  </div>
                  <!-- Clan Icon -->
                  <img :src="war.clan.badgeUrls.medium || war.clan.badgeUrls.large"
                    class="absolute inset-0 w-full h-full object-contain transform -translate-y-2 scale-110 drop-shadow-lg" />
                </div>

                <!-- Details -->
                <div class="flex flex-col w-full max-w-[140px] md:max-w-[220px]">
                  <h3
                    class="text-white font-black text-sm md:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] truncate leading-tight mb-1 font-[ClashFont]">
                    {{ war.clan.name }}</h3>

                  <!-- Star Bar -->
                  <div class="relative h-4 md:h-6 bg-gray-800 rounded border border-gray-600 shadow-inner">
                    <!-- Progress -->
                    <div
                      class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-l transition-all duration-1000 border-r border-yellow-200/30"
                      :style="{ width: `${(war.clan.stars / (war.teamSize * 3)) * 100}%` }"></div>

                    <!-- Big Star Icon -->
                    <div
                      class="absolute -left-2 -top-1.5 md:-top-2 text-xl md:text-3xl drop-shadow-md filter text-yellow-400">
                      ⭐
                    </div>

                    <!-- Count -->
                    <span
                      class="absolute right-2 top-0 bottom-0 flex items-center text-white font-black text-xs md:text-sm drop-shadow-md leading-none z-10">
                      {{ war.clan.stars }}
                    </span>
                  </div>

                  <!-- Attacks (Swords) -->
                  <!-- Attacks & Destruction -->
                  <div class="flex items-center justify-between w-full mt-1 px-0.5">
                    <div class="flex items-center gap-1 text-gray-300 text-[10px] md:text-xs font-bold">
                      <span class="text-lg">⚔️</span>
                      <span class="text-white">{{ totalClanAttacks }}</span><span class="text-gray-500">/</span><span>{{
                        war.teamSize }}</span>
                    </div>
                    <div class="text-yellow-400 font-black text-xs md:text-sm drop-shadow-md">
                      {{ war.clan.destructionPercentage?.toFixed(2) }}%
                    </div>
                  </div>
                </div>
              </div>

              <!-- Center VS -->
              <div class="flex flex-col items-center justify-center px-1 md:px-4 z-10 -mt-2">
                <span
                  class="text-[#fbbf24] font-black text-xl md:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] italic tracking-widest font-[ClashFont]">VS</span>
                <div class="text-center mt-1 bg-black/40 px-2 py-0.5 rounded border border-white/5 backdrop-blur-sm">
                  <div class="text-white font-bold text-xs md:text-sm whitespace-nowrap text-shadow" dir="ltr">{{
                    timeLeft }}
                  </div>
                </div>
                <span class="text-[#9ca3af] text-[8px] md:text-[10px] font-bold mt-0.5 uppercase tracking-wide">Battle
                  Day</span>
              </div>

              <!-- Right Team (Opponent) -->
              <div class="flex items-center flex-1 gap-3 flex-row-reverse relative">
                <!-- Badge Container -->
                <div class="relative -mr-6 md:-mr-8 z-20 flex-shrink-0">
                  <!-- Level Badge -->
                  <div
                    class="w-14 h-14 md:w-20 md:h-20 bg-[#2a0a3b] border-[3px] border-[#a855f7] rounded-xl transform -rotate-3 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                    <span class="text-white font-black text-lg md:text-xl">{{ war.opponent.clanLevel }}</span>
                  </div>
                  <!-- Clan Icon -->
                  <img :src="war.opponent.badgeUrls.medium || war.opponent.badgeUrls.large"
                    class="absolute inset-0 w-full h-full object-contain transform -translate-y-2 scale-110 drop-shadow-lg" />
                </div>

                <!-- Details -->
                <div class="flex flex-col w-full max-w-[140px] md:max-w-[220px] items-end">
                  <h3
                    class="text-white font-black text-sm md:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] truncate leading-tight mb-1 text-right font-[ClashFont]">
                    {{ war.opponent.name }}</h3>

                  <!-- Star Bar -->
                  <div class="relative h-4 md:h-6 w-full bg-gray-800 rounded border border-gray-600 shadow-inner">
                    <!-- Progress -->
                    <div
                      class="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-[#fbbf24] to-[#f59e0b] rounded-r transition-all duration-1000 border-l border-yellow-200/30"
                      :style="{ width: `${(war.opponent.stars / (war.teamSize * 3)) * 100}%` }"></div>

                    <!-- Big Star Icon -->
                    <div
                      class="absolute -right-2 -top-1.5 md:-top-2 text-xl md:text-3xl drop-shadow-md filter text-yellow-400">
                      ⭐</div>

                    <!-- Count -->
                    <span
                      class="absolute left-2 top-0 bottom-0 flex items-center text-white font-black text-xs md:text-sm drop-shadow-md leading-none z-10">
                      {{ war.opponent.stars }}
                    </span>
                  </div>

                  <!-- Attacks (Swords) -->
                  <!-- Attacks & Destruction -->
                  <div class="flex items-center justify-between w-full mt-1 px-0.5">
                    <div class="text-yellow-400 font-black text-xs md:text-sm drop-shadow-md">
                      {{ war.opponent.destructionPercentage?.toFixed(2) }}%
                    </div>
                    <div class="flex items-center gap-1 text-gray-300 text-[10px] md:text-xs font-bold">
                      <span class="text-white">{{ totalOpponentAttacks }}</span><span
                        class="text-gray-500">/</span><span>{{
                          war.teamSize }}</span>
                      <span class="text-lg">⚔️</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Map Visualization -->
          <div class="war-map-container w-full   bgo">
            <!-- Scrollable Area -->
            <div class=" relative w-full h-full custom-scrollbar z-10">

              <!-- Scrolling Background Layer -->
              <div class="absolute top-0 left-0 right-0 min-h-full z-0 flex flex-col pointer-events-none">
                <!-- Top Section -->
                <img src="../assets/img/map-bg.png" class="w-full object-cover shrink-0 relative z-10" alt="Map Start">
                <!-- Middle/End Section (Repeating or Stretched) -->
                <div class="w-full flex-grow vgo bg-contain bg-repeat -mt-1 relative z-0">
                </div>
                <!-- Overlay Gradient for depth -->
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-30 z-20">
                </div>
                <!-- Vertical Divider Effect -->
                <div
                  class="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-yellow-600/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.5)] z-30">
                </div>
              </div>

              <!-- Content Wrapper -->
              <div class="relative z-10 min-h-full">
                <div class="flex min-h-full ">

                  <!-- Left Side: Clan Members -->
                  <div class="w-1/2  border-r border-white/5 relative">
                    <div class="flex flex-col w-full gap-y-2 py-2 mt-40">
                      <div v-for="(member, index) in sortedClanMembers" :key="member.tag"
                        class="map-base-wrapper flex flex-col items-center relative group cursor-pointer transition-transform duration-300 hover:scale-105 w-1/2"
                        :class="index % 2 === 0 ? 'self-end' : 'self-start'">
                        <!-- Stars -->
                        <!-- Stars -->
                        <div class="flex gap-0.5 px-2 py-0.5 rounded-full backdrop-blur-[2px] mb-1 items-center h-6"
                          :class="{ 'invisible': !member.bestOpponentAttack }">
                          <span v-for="s in 3" :key="s" class="drop-shadow-md">
                            <span v-if="s <= (getBestStars(member, 'clan') || 0)" class="text-lg">⭐</span>
                            <span v-else
                              class="text-2xl leading-none text-gray-500 font-bold relative top-[1px]">☆</span>
                          </span>
                        </div>

                        <!-- Base Position Badge -->
                        <div class="flex items-center gap-1 min-w-max  rounded-full ">
                          <span
                            class="bg-[#1a1a1a] text-white font-black text-xs px-1.5 py-0.5 rounded border border-[#fbbf24]">
                            {{ index + 1 }}
                          </span>
                          <span class="text-white text-sm font-bold truncate">
                            {{ member.name }}
                          </span>
                        </div>

                        <!-- Town Hall -->
                        <div class="relative">
                          <img :src="getBaseImage(member, 'clan')"
                            class="w-20 h-20 object-contain drop-shadow-2xl filter transition-all duration-300" :class="{
                              'brightness-110 drop-shadow-[0_0_15px_rgba(66,153,225,0.4)]': getBestStars(member, 'clan') < 2
                            }" @click="activeMap = 'clan'">

                          <div v-if="getBestStars(member, 'clan') !== null && getBestStars(member, 'clan') > 0"
                            class="absolute -bottom-2 -right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-500 backdrop-blur-sm">
                            {{ getBestDestruction(member, 'clan') }}%
                          </div>

                          <!-- Barbarian Indicator (No Attack) - Right of Village -->
                          <img v-if="!member.attacks?.length" :src="barbarianUrl"
                            class="absolute -right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 object-contain drop-shadow-md z-30"
                            title="لم يهجم بعد">
                        </div>

                        <!-- Attack Info (who attacked us) -->
                        <div
                          class="mt-3 flex items-center gap-1 bg-red-900/80 px-2 py-0.5 rounded border border-red-500 shadow-lg z-20 relative h-[26px]"
                          :class="{ 'invisible': !member.bestOpponentAttack }">
                          <template v-if="member.bestOpponentAttack">
                            <span class="text-white text-[10px] font-bold truncate ">
                              #{{ getPlayerMapPosition(member.bestOpponentAttack.attackerTag) }} {{
                                getPlayerName(member.bestOpponentAttack.attackerTag) }}
                            </span>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Side: Opponent Members -->
                  <div class="w-1/2 relative">
                    <div class="flex flex-col w-full gap-y-2 py-1 mt-40">
                      <div v-for="(member, index) in sortedOpponentMembers" :key="member.tag"
                        class="map-base-wrapper flex flex-col items-center relative group cursor-pointer transition-transform duration-300 hover:scale-105 w-1/2"
                        :class="index % 2 === 0 ? 'self-start' : 'self-end'">
                        <!-- Stars -->
                        <!-- Stars -->
                        <div class="flex gap-0.5 px-2 py-0.5 rounded-full backdrop-blur-[2px] mb-1 items-center h-6"
                          :class="{ 'invisible': !member.bestOpponentAttack }">
                          <span v-for="s in 3" :key="s" class="drop-shadow-md">
                            <span v-if="s <= (getBestStars(member, 'opponent') || 0)" class="text-lg">⭐</span>
                            <span v-else
                              class="text-2xl leading-none text-gray-500 font-bold relative top-[1px]">☆</span>
                          </span>
                        </div>

                        <!-- Base Position Badge -->
                        <div class="flex items-center gap-1 min-w-max  rounded-full ">
                          <span
                            class="bg-[#1a1a1a] text-white font-black text-xs px-1.5 py-0.5 rounded border border-[#fbbf24]">
                            {{ index + 1 }}
                          </span>
                          <span class="text-white text-sm font-bold  truncate">
                            {{ member.name }}
                          </span>
                        </div>

                        <!-- Town Hall -->
                        <div class="relative">
                          <img :src="getBaseImage(member, 'opponent')"
                            class="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl filter transition-all duration-300 transform scale-x-[-1]"
                            :class="{
                              'brightness-110 drop-shadow-[0_0_15px_rgba(245,101,101,0.4)]': getBestStars(member, 'opponent') < 2
                            }" @click="activeMap = 'opponent'">

                          <div v-if="getBestStars(member, 'opponent') !== null && getBestStars(member, 'opponent') > 0"
                            class="absolute -bottom-2 -left-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-500 backdrop-blur-sm">
                            {{ getBestDestruction(member, 'opponent') }}%
                          </div>

                          <!-- Barbarian Indicator (No Attack) - Left of Village -->
                          <img v-if="!member.attacks?.length" :src="barbarianUrl"
                            class="absolute -left-12 top-1/2 transform -translate-y-1/2 w-10 h-10 object-contain drop-shadow-md z-30"
                            title="لم يهجم بعد">
                        </div>

                        <!-- Attack Info (who we attacked) -->
                        <div
                          class="mt-3 flex items-center gap-1 bg-blue-900/80 px-2 py-0.5 rounded border border-blue-500 shadow-lg z-20 relative h-[26px]"
                          :class="{ 'invisible': !member.bestOpponentAttack }">
                          <template v-if="member.bestOpponentAttack">
                            <span class="text-white text-[10px] font-bold truncate ">
                              #{{ getPlayerMapPosition(member.bestOpponentAttack.attackerTag) }} {{
                                getPlayerName(member.bestOpponentAttack.attackerTag) }}
                            </span>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="$router.back()"
              class="px-8 py-4 bg-gradient-to-b from-gray-600 to-gray-800 text-white font-black text-xl rounded-xl shadow-xl border-4 border-gray-500 hover:from-gray-700 hover:to-gray-900 transition-all transform hover:scale-105">
              ← العودة للجولات
            </button>
            <router-link :to="`/clan/${encodeURIComponent(clanTag)}/stats`"
              class="px-8 py-4 bg-gradient-to-b from-yellow-500 to-yellow-700 text-gray-900 font-black text-xl rounded-xl shadow-xl border-4 border-yellow-400 hover:from-yellow-600 hover:to-yellow-800 transition-all transform hover:scale-105 text-center">
              📊 إحصائيات الكلان
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const war = ref(null)
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const clanTag = ref('')

onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/cwl/war/${encodeURIComponent(route.params.warTag)}`)
    war.value = data

    // ترتيب الأعضاء حسب mapPosition
    if (war.value.clan?.members) {
      war.value.clan.members.sort((a, b) => a.mapPosition - b.mapPosition)
    }
    if (war.value.opponent?.members) {
      war.value.opponent.members.sort((a, b) => a.mapPosition - b.mapPosition)
    }

    // استخراج تاج الكلان من البيانات
    clanTag.value = data.clan.tag
  } catch (err) {
    error.value = true
    errorMessage.value = err.response?.data?.error || err.message
    console.error("Frontend Error:", err)
  } finally {
    loading.value = false
  }
})

let timerInterval
onMounted(() => {
  timerInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

// Helper to parse Clash API/ISO dates safely
function parseDate(dateStr) {
  if (!dateStr) return null
  // Fix Clash API format: 20231125T120000.000Z -> 2023-11-25T12:00:00.000Z
  if (dateStr.indexOf('-') === -1 && dateStr.indexOf('T') > -1) {
    return new Date(dateStr.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(.*)$/, '$1-$2-$3T$4:$5:$6$7'))
  }
  return new Date(dateStr)
}

function formatTime(isoString) {
  const date = parseDate(isoString)
  if (!date || isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })
}

const totalClanAttacks = computed(() => {
  return war.value?.clan?.members?.reduce((sum, m) => sum + (m.attacks?.length || 0), 0) || 0
})

const totalOpponentAttacks = computed(() => {
  return war.value?.opponent?.members?.reduce((sum, m) => sum + (m.attacks?.length || 0), 0) || 0
})

const now = ref(Date.now())

const timeLeft = computed(() => {
  if (!war.value?.endTime) return '--'

  const end = parseDate(war.value.endTime)
  if (!end || isNaN(end.getTime())) return '--'

  const diff = end.getTime() - now.value

  if (diff <= 0) return 'انتهت' // Or '0س 0د'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${hours}h ${minutes}m ${seconds}s`
})

const destroyedBaseUrl = new URL('../assets/img/wasdeletedatall.jpg', import.meta.url).href
const twoStarsAttackUrl = new URL('../assets/img/two_stars_attack.png', import.meta.url).href
const barbarianUrl = new URL('../assets/img/barbeor.png', import.meta.url).href

const getBaseImage = (member, side) => {
  const stars = getBestStars(member, side)
  if (stars === 3) return destroyedBaseUrl
  if (stars === 2) return twoStarsAttackUrl
  return getTownhallImage(member.townhallLevel)
}

const getTownhallImage = (level) => {
  try {
    return new URL(`../assets/townhalls/townhall${level}.png`, import.meta.url).href
  } catch {
    return new URL(`../assets/townhalls/townhall_default.png`, import.meta.url).href
  }
}
const getMemberAt = (members, position) => {
  return members?.find(m => m.mapPosition == position)
}

// Helper function to get player name from tag
const getPlayerName = (tag) => {
  if (!war.value) return tag

  // Search in clan members
  const clanMember = war.value.clan?.members?.find(m => m.tag === tag)
  if (clanMember) return clanMember.name

  // Search in opponent members
  const opponentMember = war.value.opponent?.members?.find(m => m.tag === tag)
  if (opponentMember) return opponentMember.name

  // If not found, return the tag
  return tag
}

// Helper function to get player map position from tag
const getPlayerMapPosition = (tag) => {
  if (!war.value) return '?'

  // Search in clan members
  const clanMember = war.value.clan?.members?.find(m => m.tag === tag)
  if (clanMember) return clanMember.mapPosition

  // Search in opponent members
  const opponentMember = war.value.opponent?.members?.find(m => m.tag === tag)
  if (opponentMember) return opponentMember.mapPosition

  return '?'
}

const sortedClanMembers = computed(() => {
  if (!war.value?.clan?.members) return []
  return [...war.value.clan.members].sort((a, b) => a.mapPosition - b.mapPosition)
})

const sortedOpponentMembers = computed(() => {
  if (!war.value?.opponent?.members) return []
  return [...war.value.opponent.members].sort((a, b) => a.mapPosition - b.mapPosition)
})

// Update helper functions to handle explicit sides
const getBestStars = (member, side) => {
  // If viewing CLAN member (on left), we want to see if they defended well (Opponent's Attack)
  // `bestOpponentAttack` usually represents the best attack AGAINST this member.
  return member.bestOpponentAttack ? member.bestOpponentAttack.stars : 0
}

const getBestDestruction = (member, side) => {
  return member.bestOpponentAttack ? member.bestOpponentAttack.destructionPercentage : 0
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #fbbf24, #f59e0b);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #f59e0b, #d97706);
}

.bgo {
  background-image: url('../assets/img/middleendbg.png');
  /* background-size: cover; */
  background-position: center;
  background-repeat: repeat
}
</style>
