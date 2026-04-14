<script setup lang="ts">
import { onMounted } from 'vue';
import { ApprovalCard } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const cancelLabel = useStoryLocale('content.cancelLabel', messages)
const component = useStoryLocale('content.component', messages)
const okLabel = useStoryLocale('content.okLabel', messages)
const tailwindTestDesc = useStoryLocale('content.tailwindTestDesc', messages)
const tailwindTestTitle = useStoryLocale('content.tailwindTestTitle', messages)
const testCardDesc = useStoryLocale('content.testCardDesc', messages)
const testCardTitle = useStoryLocale('content.testCardTitle', messages)
const withTailwind = useStoryLocale('content.withTailwind', messages)

// Load Tailwind CSS
onMounted(() => {
  if (!document.getElementById('tailwind-cdn')) {
    const script = document.createElement('script');
    script.id = 'tailwind-cdn';
    script.src = 'https://cdn.tailwindcss.com';
    script.onload = () => {
      // @ts-expect-error -- intentional type mismatch for testing
      if (typeof tailwind !== 'undefined') {
        // @ts-expect-error -- intentional type mismatch for testing
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                border: 'hsl(240 5.9% 90%)',
                input: 'hsl(240 5.9% 90%)',
                ring: 'hsl(240 5.9% 10%)',
                background: 'hsl(0 0% 100%)',
                foreground: 'hsl(240 10% 3.9%)',
                primary: { DEFAULT: 'hsl(240 5.9% 10%)', foreground: 'hsl(0 0% 98%)' },
                secondary: { DEFAULT: 'hsl(240 4.8% 95.9%)', foreground: 'hsl(240 5.9% 10%)' },
                destructive: { DEFAULT: 'hsl(0 84.2% 60.2%)', foreground: 'hsl(0 0% 98%)' },
                muted: { DEFAULT: 'hsl(240 4.8% 95.9%)', foreground: 'hsl(240 3.8% 46.1%)' },
                accent: { DEFAULT: 'hsl(240 4.8% 95.9%)', foreground: 'hsl(240 5.9% 10%)' },
                card: { DEFAULT: 'hsl(0 0% 100%)', foreground: 'hsl(240 10% 3.9%)' },
              },
            },
          },
        };
      }
      console.log('Tailwind loaded from story');
    };
    document.head.appendChild(script);
  }
});

</script>

<template>
  <Story title="TailwindTest/Test">
    <Variant :title="withTailwind">
      <div class="rounded-lg bg-gray-100 p-6">
        <h2 class="text-xl font-bold text-blue-600">{{ tailwindTestTitle }}</h2>
        <p class="mt-2 text-gray-700">{{ tailwindTestDesc }}</p>
      </div>
    </Variant>
    <Variant :title="component">
      <approval-card
        id="test-approval"
        :title="testCardTitle"
        :description="testCardDesc"
        icon="check"
        :confirm-label="okLabel"
        :cancel-label="cancelLabel"
      />
    </Variant>
  </Story>
</template>
