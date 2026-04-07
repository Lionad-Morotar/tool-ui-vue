// Histoire setup file - imports Tailwind CSS
// This file is loaded once when Histoire initializes

import './tailwind.css';

console.log('[Histoire Setup] Tailwind CSS loaded');

// Redirect root path to the branded landing story
// This replaces the default Histoire HomeView with our custom landing page
// Only run in the main window, not in sandbox iframes
if (typeof window !== 'undefined' && window.self === window.top) {
  const hash = window.location.hash;
  if (hash === '' || hash === '#' || hash === '#/') {
    window.location.replace('#/story/src-stories-landing-story-vue');
  }
}
