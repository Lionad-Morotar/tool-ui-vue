import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(__dirname, '..', 'dist-histoire', 'index.html');
const html = readFileSync(indexPath, 'utf-8');

const redirectScript = `<script>
  if (window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#/') {
    window.location.replace('#/story/src-stories-landing-index-story-vue');
  }
</script>`;

// Insert before </head>
const modified = html.replace('</head>', `${redirectScript}\n</head>`);

writeFileSync(indexPath, modified, 'utf-8');
console.log('[post-build-histoire] Injected root redirect into index.html');
