<script setup lang="ts">
import {
  ActionProvider,
  Renderer,
  ValidationProvider,
  VisibilityProvider,
  StateProvider,
} from '@json-render/vue';
import { registry } from './registry';
import type { Spec } from '@json-render/core';

interface Props {
  spec: Spec;
  handlers?: Record<string, (...args: unknown[]) => unknown | Promise<unknown>>;
  initialState?: Record<string, unknown>;
}

const props = defineProps<Props>();
</script>

<template>
  <state-provider :initial-state="props.initialState ?? {}">
    <action-provider :handlers="props.handlers ?? {}">
      <visibility-provider>
        <validation-provider>
          <renderer :spec="props.spec" :registry="registry" />
        </validation-provider>
      </visibility-provider>
    </action-provider>
  </state-provider>
</template>
