import { createApp } from 'vue';
import { setMessages, setLocale } from '@lionad/vtu-core/i18n';
import { zhCNAll } from '@lionad/vtu-components';
import App from './App.vue';

setMessages(zhCNAll);
setLocale('zh-CN');

createApp(App).mount('#app');
