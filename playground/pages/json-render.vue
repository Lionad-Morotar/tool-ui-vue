<script setup lang="ts">
import { StateProvider } from '@json-render/vue';
import DemoRenderer from '../json-render/demo-renderer.vue';
import { demoSpec } from '../json-render/spec';

const initialState = demoSpec.state ?? {};
</script>

<template>
  <state-provider :initial-state="initialState">
    <demo-renderer />
  </state-provider>
</template>
