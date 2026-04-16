<script setup lang="ts">
import {
  ActionProvider,
  Renderer,
  ValidationProvider,
  VisibilityProvider,
  StateProvider,
} from '@json-render/vue';
import type { Spec } from '@json-render/core';
import { registry } from './registry';

interface Props {
  spec: Spec;
  handlers?: Record<string, (...args: unknown[]) => unknown | Promise<unknown>>;
  initialState?: Record<string, unknown>;
}

const props = defineProps<Props>();
</script>

<template>
  <StateProvider :initial-state="props.initialState ?? {}">
    <ActionProvider :handlers="props.handlers ?? {}">
      <VisibilityProvider>
        <ValidationProvider>
          <Renderer :spec="props.spec" :registry="registry" />
        </ValidationProvider>
      </VisibilityProvider>
    </ActionProvider>
  </StateProvider>
</template>
