<script setup lang="ts">
import { GeoMap, Plan } from '@lionad/vtu-components'
import { computed, ref } from 'vue'
import DemoDelayedShow from './demo-delayed-show.vue'

const step = ref(1)
const { t, locale } = useSiteLocale()
const isEn = computed(() => locale.value === 'en')

const ZH_TILE_URL = 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
const tileUrl = computed(() => isEn.value ? undefined : ZH_TILE_URL)
</script>

<template>
  <div class="space-y-4 mx-auto max-w-3xl">
    <!-- 用户首轮 -->
    <DemoChatMessage role="user" :content="t('demoTravel.userIntro').value" :delay="0" :order="0" />

    <!-- Agent 回复路线 -->
    <div class="flex justify-start">
      <div class="space-y-4 w-full max-w-[95%]">
        <DemoChatMessage role="agent" :content="t('demoTravel.agentMap').value" :delay="120" :order="1" />

        <DemoDelayedShow :order="2">
          <ClientOnly>
            <template #fallback>
              <div class="flex justify-center items-center bg-muted/30 border border-border rounded-lg h-48 text-muted-foreground text-sm">
                {{ isEn ? 'Loading map...' : '加载地图中...' }}
              </div>
            </template>
            <GeoMap
              id="demo-travel-map"
              :title="t('demoTravel.mapTitle').value"
              :tile-url="tileUrl"
              :tile-subdomains="['1', '2', '3', '4']"
              :markers="[
                { id: 'm1', lat: 30.2489, lng: 120.1460, label: t('demoTravel.markerWestLake').value, description: t('demoTravel.markerWestLakeDesc').value },
                { id: 'm2', lat: 30.2406, lng: 120.0986, label: t('demoTravel.markerLingyin').value, description: t('demoTravel.markerLingyinDesc').value }
              ]"
              :routes="[
                {
                  id: 'r1',
                  points: [
                    { lat: 30.2489, lng: 120.1460 },
                    { lat: 30.2406, lng: 120.0986 }
                  ],
                  label: t('demoTravel.routeDay1').value,
                  color: '#3b82f6',
                  weight: 4
                }
              ]"
              :viewport="{ mode: 'fit', padding: 40 }"
            />
          </ClientOnly>
        </DemoDelayedShow>
      </div>
    </div>

    <!-- 用户追问 -->
    <DemoChatMessage role="user" :content="t('demoTravel.userAskPlan').value" :delay="0" :order="2" />

    <!-- Agent 给出行程 -->
    <div class="flex justify-start">
      <div class="space-y-4 w-full max-w-[95%]">
        <DemoChatMessage role="agent" :content="t('demoTravel.agentPlan').value" :delay="120" :order="3" />

        <DemoDelayedShow :order="4">
          <Plan
            id="demo-travel-plan"
            :title="t('demoTravel.planTitle').value"
            :description="t('demoTravel.planDesc').value"
            :default-expanded="true"
            :todos="[
              { id: 't1', label: t('demoTravel.todo1').value, status: 'pending', description: t('demoTravel.todo1Desc').value },
              { id: 't2', label: t('demoTravel.todo2').value, status: 'pending', description: t('demoTravel.todo2Desc').value },
              { id: 't3', label: t('demoTravel.todo3').value, status: 'pending', description: t('demoTravel.todo3Desc').value },
              { id: 't4', label: t('demoTravel.todo4').value, status: 'pending', description: t('demoTravel.todo4Desc').value }
            ]"
          />

          <div class="flex items-center gap-2">
            <button
              class="bg-primary mt-2 px-3 py-1.5 rounded-md font-medium text-primary-foreground text-xs"
              @click="step = 2"
            >
              {{ t('demoTravel.actionAddTodo').value }}
            </button>
          </div>
        </DemoDelayedShow>
      </div>
    </div>

    <!-- 用户行动 — 点击后立即出现，order 重置 -->
    <DemoChatMessage
      v-if="step >= 2"
      role="user"
      :content="t('demoTravel.userAddTodo').value"
      :delay="0"
      :order="0"
    />

    <!-- Agent 最终确认 -->
    <DemoChatMessage
      v-if="step >= 2"
      role="agent"
      :content="t('demoTravel.agentDone').value"
      :delay="0"
      :order="1"
    />
  </div>
</template>
