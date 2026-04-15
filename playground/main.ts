import { Component, createApp } from 'vue';

const pages = import.meta.glob<true, string, () => Promise<{ default: Component }>>(
  './pages/*.vue'
);

(async () => {
  const name = location.pathname.replace(/^\//, '').replace(/\/$/, '') || 'App';
  const file = pages[`./pages/${name}.vue`];

  if (!file) {
    location.pathname = '/';
    return;
  }

  const App = (await file()).default;
  createApp(App).mount('#app');
})();
