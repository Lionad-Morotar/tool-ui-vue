<script setup lang="ts">
import { GeoMap, Plan } from '@lionad/vtu-components'
import { ref } from 'vue'

const step = ref(1)
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4">
    <!-- 用户首轮 -->
    <div class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        周末想去杭州走走，西湖和灵隐寺都要去，帮我安排一个轻松的两日游。
      </div>
    </div>

    <!-- Agent 回复路线 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[95%] space-y-4">
        <p class="text-sm text-muted-foreground">
          没问题，这条路线兼顾了湖光山色和禅意清幽，节奏也比较舒缓。先看一下路线：
        </p>

        <ClientOnly>
          <template #fallback>
            <div class="flex h-48 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
              加载地图中...
            </div>
          </template>
          <GeoMap
            id="demo-travel-map"
            title="杭州两日游路线"
            :markers="[
              { id: 'm1', lat: 30.2489, lng: 120.1460, label: '西湖', description: '断桥残雪、苏堤春晓' },
              { id: 'm2', lat: 30.2406, lng: 120.0986, label: '灵隐寺', description: '千年古刹，禅意清幽' },
            ]"
            :routes="[
              {
                id: 'r1',
                points: [
                  { lat: 30.2489, lng: 120.1460 },
                  { lat: 30.2406, lng: 120.0986 },
                ],
                label: 'Day 1 路线',
                color: '#3b82f6',
                weight: 4,
              },
            ]"
            :viewport="{ mode: 'fit', padding: 40 }"
          />
        </ClientOnly>
      </div>
    </div>

    <!-- 用户追问 -->
    <div class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        路线看起来不错，具体行程怎么安排？希望能详细一点。
      </div>
    </div>

    <!-- Agent 给出行程 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[95%] space-y-4">
        <p class="text-sm text-muted-foreground">
          好的，我为您整理了一份轻松惬意的两日游行程：
        </p>

        <Plan
          id="demo-travel-plan"
          title="杭州周末行程"
          description="轻松惬意的两日游"
          :todos="[
            { id: 't1', label: '周六上午 · 西湖游船', status: 'pending', description: '手划船体验，约 1.5 小时' },
            { id: 't2', label: '周六下午 · 断桥漫步', status: 'pending', description: '欣赏湖光山色，拍照打卡' },
            { id: 't3', label: '周日上午 · 灵隐寺祈福', status: 'pending', description: '参观飞来峰造像' },
            { id: 't4', label: '周日下午 · 龙井问茶', status: 'pending', description: '茶园品茶，采购伴手礼' },
          ]"
        />

        <div class="flex items-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            @click="step = 2"
          >
            帮我加入待办
          </button>
        </div>
      </div>
    </div>

    <!-- 用户行动 -->
    <div v-if="step >= 2" class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        帮我加入待办吧，这样就不会忘记了。
      </div>
    </div>

    <!-- Agent 最终确认 -->
    <div v-if="step >= 2" class="flex justify-start">
      <div class="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2 text-sm text-muted-foreground">
        已为您添加到待办清单，并设置了周六早上 8:00 的出发提醒。祝您旅途愉快！
      </div>
    </div>
  </div>
</template>
