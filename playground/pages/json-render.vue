<script setup lang="ts">
import { StateProvider } from '@json-render/vue';
import { demoSpec } from '../json-render/spec';
import DemoRenderer from '../json-render/demo-renderer.vue';

const initialState = demoSpec.state ?? {};
</script>

<template>
  <StateProvider :initial-state="initialState">
    <DemoRenderer />
  </StateProvider>
</template>
