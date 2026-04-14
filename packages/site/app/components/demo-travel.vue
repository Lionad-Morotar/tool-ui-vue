<script setup lang="ts">
import { GeoMap, Plan } from '@lionad/vtu-components'
import { ref } from 'vue'

const step = ref(1)
const { t, locale } = useSiteLocale()
const isEn = computed(() => locale.value === 'en')
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4">
    <!-- 用户首轮 -->
    <div class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        {{ t('demoTravel.userIntro') }}
      </div>
    </div>

    <!-- Agent 回复路线 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[95%] space-y-4">
        <p class="text-sm text-muted-foreground">
          {{ t('demoTravel.agentMap') }}
        </p>

        <ClientOnly>
          <template #fallback>
            <div class="flex h-48 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
              {{ isEn ? 'Loading map...' : '加载地图中...' }}
            </div>
          </template>
          <GeoMap
            id="demo-travel-map"
            :title="t('demoTravel.mapTitle').value"
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
      </div>
    </div>

    <!-- 用户追问 -->
    <div class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        {{ t('demoTravel.userAskPlan') }}
      </div>
    </div>

    <!-- Agent 给出行程 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[95%] space-y-4">
        <p class="text-sm text-muted-foreground">
          {{ t('demoTravel.agentPlan') }}
        </p>

        <Plan
          id="demo-travel-plan"
          :title="t('demoTravel.planTitle').value"
          :description="t('demoTravel.planDesc').value"
          :todos="[
            { id: 't1', label: t('demoTravel.todo1').value, status: 'pending', description: t('demoTravel.todo1Desc').value },
            { id: 't2', label: t('demoTravel.todo2').value, status: 'pending', description: t('demoTravel.todo2Desc').value },
            { id: 't3', label: t('demoTravel.todo3').value, status: 'pending', description: t('demoTravel.todo3Desc').value },
            { id: 't4', label: t('demoTravel.todo4').value, status: 'pending', description: t('demoTravel.todo4Desc').value }
          ]"
        />

        <div class="flex items-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            @click="step = 2"
          >
            {{ t('demoTravel.actionAddTodo') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 用户行动 -->
    <div
      v-if="step >= 2"
      class="flex justify-end"
    >
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        {{ t('demoTravel.userAddTodo') }}
      </div>
    </div>

    <!-- Agent 最终确认 -->
    <div
      v-if="step >= 2"
      class="flex justify-start"
    >
      <div class="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2 text-sm text-muted-foreground">
        {{ t('demoTravel.agentDone') }}
      </div>
    </div>
  </div>
</template>
