// Histoire setup file - imports Tailwind CSS
// This file is loaded once when Histoire initializes

import './tailwind.css';
import { createApp } from 'vue'
import LocaleToggle from './LocaleToggle.vue'

console.log('[Histoire Setup] Tailwind CSS loaded');

// Redirect root path to the branded landing story
// This replaces the default Histoire HomeView with our custom landing page
// Only run in the main window, not in sandbox iframes
if (typeof window !== 'undefined' && window.self === window.top) {
  const hash = window.location.hash;
  if (hash === '' || hash === '#' || hash === '#/') {
    window.location.replace('#/story/src-stories-landing-story-vue');
  }

  // Mount locale toggle button
  mountLocaleToggle();
}

/**
 * Mount the LocaleToggle component into Histoire's nav bar.
 * Uses MutationObserver to wait for the DOM element to appear.
 */
function mountLocaleToggle(): void {
  const mountTarget = () => {
    // Try Histoire nav bar classes
    const navBar = document.querySelector('.flex.items-center.gap-2')
      ?? document.querySelector('[class*="nav"]')
      ?? document.querySelector('#histoire-app > div > div:first-child');

    if (!navBar) return false;

    // Check if already mounted
    if (document.getElementById('vtu-locale-toggle')) return true;

    const container = document.createElement('div');
    container.id = 'vtu-locale-toggle';
    container.style.marginLeft = 'auto';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    navBar.appendChild(container);

    createApp(LocaleToggle).mount(container);
    return true;
  };

  if (!mountTarget()) {
    // DOM not ready yet — use MutationObserver
    const observer = new MutationObserver(() => {
      if (mountTarget()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Safety fallback: if nav bar never appears after 5s, use fixed position
    setTimeout(() => {
      observer.disconnect();
      if (!document.getElementById('vtu-locale-toggle')) {
        mountFixedFallback();
      }
    }, 5000);
  }
}

/**
 * Fixed position fallback if nav bar mounting fails.
 */
function mountFixedFallback(): void {
  const container = document.createElement('div');
  container.id = 'vtu-locale-toggle';
  container.style.cssText = 'position:fixed;top:8px;right:12px;z-index:9999;display:flex;align-items:center';
  document.body.appendChild(container);
  createApp(LocaleToggle).mount(container);
}
