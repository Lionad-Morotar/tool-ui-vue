<template>
  <div
    class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    aria-hidden="true"
  >
    <!-- Subtle grid -->
    <div
      class="tech-grid absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
    />

    <!-- Slow drifting orbs -->
    <div
      class="animate-drift tech-orbs absolute -top-1/2 -left-1/2 h-[200%] w-[200%]"
    />

    <!-- Slow scanline -->
    <div class="tech-scanline absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" />

    <!-- Fine noise texture overlay for grain -->
    <div
      class="tech-noise absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
    />
  </div>
</template>

<style scoped>
.tech-grid {
  background-image:
    linear-gradient(to right, oklch(from var(--color-foreground) l c h) 1px, transparent 1px),
    linear-gradient(to bottom, oklch(from var(--color-foreground) l c h) 1px, transparent 1px);
  background-size: 64px 64px;
}

.tech-orbs {
  background:
    radial-gradient(circle at 20% 30%, oklch(from var(--color-primary) l c h / 0.06) 0%, transparent 25%),
    radial-gradient(circle at 80% 70%, oklch(from var(--color-primary) l c h / 0.04) 0%, transparent 25%),
    radial-gradient(circle at 50% 50%, oklch(from var(--color-foreground) l c h / 0.03) 0%, transparent 30%);
}

.tech-scanline {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    oklch(from var(--color-primary) l c h / 0.08) 50%,
    transparent 100%
  );
  background-size: 100% 8px;
  animation: scanline 8s linear infinite;
}

.tech-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

@keyframes drift {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(2%, 1%) rotate(1deg);
  }
  66% {
    transform: translate(-1%, 2%) rotate(-1deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
  }
}

.animate-drift {
  animation: drift 30s ease-in-out infinite;
}
</style>
