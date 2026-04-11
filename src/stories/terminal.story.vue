<script setup lang="ts">
import { reactive } from 'vue';
import { Terminal } from '@lionad/vtu-components';

const interactiveState = reactive({
  command: 'npm install',
  stdout: 'added 42 packages in 2s\n\n14 packages are looking for funding\nrun `npm fund` for details',
  stderr: '',
  exitCode: 0,
  durationMs: 2150,
  cwd: '~/projects/my-app',
});

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: 'Unique identifier for the terminal' },
  { name: 'command', type: 'string', required: true, description: 'The command that was executed' },
  { name: 'stdout', type: 'string', description: 'Standard output from the command' },
  { name: 'stderr', type: 'string', description: 'Standard error from the command' },
  { name: 'exitCode', type: 'number', required: true, description: 'Exit code (0 = success, >0 = error)' },
  { name: 'durationMs', type: 'number', description: 'Command execution duration in milliseconds' },
  { name: 'cwd', type: 'string', description: 'Current working directory' },
  { name: 'truncated', type: 'boolean', description: 'Whether output was truncated' },
  { name: 'maxCollapsedLines', type: 'number', description: 'Maximum lines before collapsing' },
  { name: 'css', type: '{ root?: string }', description: 'CSS classes for component elements' },
];

const ansiExamples = {
  success: '\x1b[32m✓\x1b[0m Build completed successfully',
  warning: '\x1b[33m⚠\x1b[0m 3 warnings found',
  error: '\x1b[31m✗\x1b[0m Test failed',
  info: '\x1b[36mℹ\x1b[0m Starting development server...',
  bold: '\x1b[1mBold text\x1b[0m and \x1b[2mdim text\x1b[0m',
  colors: '\x1b[31mRed\x1b[0m \x1b[32mGreen\x1b[0m \x1b[33mYellow\x1b[0m \x1b[34mBlue\x1b[0m \x1b[35mMagenta\x1b[0m \x1b[36mCyan\x1b[0m',
};
</script>

<template>
  <Story title="Terminal/All">
    <Variant title="Props">
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">Terminal Props</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ prop.default || '-' }}</td>
                <td>{{ prop.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>

    <Variant title="ANSI Color Support">
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">ANSI Color Codes</h2>
        <p class="mb-4 text-sm text-muted-foreground">
          Terminal component supports ANSI escape codes for colors and formatting.
        </p>
        <div class="space-y-2 font-mono text-sm">
          <div v-for="(example, name) in ansiExamples" :key="name" class="flex items-center gap-4">
            <span class="w-20 font-semibold capitalize">{{ name }}:</span>
            <code class="text-muted-foreground">{{ example }}</code>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Exit Codes">
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">Exit Code Display</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold text-emerald-600">Exit Code 0</h3>
            <p class="text-sm text-muted-foreground">Displayed in muted color indicating success</p>
          </div>
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold text-red-600">Exit Code &gt; 0</h3>
            <p class="text-sm text-muted-foreground">Displayed in red indicating an error</p>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Success with ANSI Colors">
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-ansi-colors"
          command="pnpm test"
          :stdout="`\x1b[32m✓\x1b[0m src/utils.test.ts \x1b[90m(5 tests)\x1b[0m \x1b[33m23ms\x1b[0m\n\x1b[32m✓\x1b[0m src/api.test.ts \x1b[90m(12 tests)\x1b[0m \x1b[33m156ms\x1b[0m\n\x1b[32m✓\x1b[0m src/vtu-components.test.ts \x1b[90m(8 tests)\x1b[0m \x1b[33m89ms\x1b[0m\n\n\x1b[1mTest Files\x1b[0m  \x1b[32m3 passed\x1b[0m (3)\n\x1b[1m     Tests\x1b[0m  \x1b[32m25 passed\x1b[0m (25)\n\x1b[1m  Start at\x1b[0m  10:23:45\n\x1b[1m  Duration\x1b[0m  312ms`"
          :exit-code="0"
          :duration-ms="312"
          cwd="~/project"
        />
      </div>
    </Variant>

    <Variant title="Lint Output with ANSI Colors">
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-lint-ansi"
          command="npm run lint"
          :stdout="`\x1b[32m✔\x1b[0m No ESLint warnings or errors\n\x1b[36minfo\x1b[0m Checking formatting...\n\x1b[33m⚠\x1b[0m 2 files need formatting\n  \x1b[90msrc/utils.ts\x1b[0m\n  \x1b[90msrc/api.ts\x1b[0m\n\x1b[32m✔\x1b[0m TypeScript compilation successful\n\x1b[1m\x1b[32mAll checks passed!\x1b[0m`"
          :exit-code="0"
          :duration-ms="2341"
        />
      </div>
    </Variant>

    <Variant title="Docker Build Output">
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-docker-build"
          command="docker build -t myapp:latest ."
          :stdout="`[+] Building 45.2s (12/12) FINISHED\n => [internal] load build definition from Dockerfile\n => [internal] load .dockerignore\n => [internal] load metadata for node:20-alpine\n => [1/7] FROM node:20-alpine@sha256:abc123...\n => [2/7] WORKDIR /app\n => [3/7] COPY package*.json ./\n => [4/7] RUN npm ci --only=production\n => [5/7] COPY . .\n => [6/7] RUN npm run build\n => [7/7] EXPOSE 3000\n => exporting to image\n => => naming to docker.io/library/myapp:latest\n\nSuccessfully built image myapp:latest`"
          :exit-code="0"
          :duration-ms="45200"
        />
      </div>
    </Variant>

    <Variant title="With Error">
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-error"
          command="npm test"
          stdout="> tool-ui@1.0.0 test
> vitest

 FAIL  src/vtu-components/__tests__/Button.test.ts > Button > renders correctly
AssertionError: expected true to be false
 ❯ src/vtu-components/__tests__/Button.test.ts:15:23"
          stderr="Test failed: 1 test failed"
          :exit-code="1"
          :duration-ms="2450"
        />
      </div>
    </Variant>

    <Variant title="With Working Directory">
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-cwd"
          command="git status"
          stdout="On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use 'git add [file]...' to update what will be committed)
  (use 'git restore [file]...' to discard changes in working directory)
	modified:   src/vtu-components/Button.tsx

no changes added to commit"
          :exit-code="0"
          cwd="~/projects/my-app"
        />
      </div>
    </Variant>

    <Variant title="Long Output (Collapsed)">
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-long"
          command="ls -la"
          stdout="total 128
drwxr-xr-x  12 user staff   384 Jan 15 10:30 .
drwxr-xr-x   5 user staff   160 Jan 15 10:00 ..
-rw-r--r--   1 user staff  6148 Jan 15 10:30 .DS_Store
-rw-r--r--   1 user staff   220 Jan 15 09:00 .gitignore
-rw-r--r--   1 user staff  1082 Jan 15 09:00 LICENSE
-rw-r--r--   1 user staff  2845 Jan 15 10:15 README.md
drwxr-xr-x   3 user staff    96 Jan 15 09:00 dist
drwxr-xr-x   3 user staff    96 Jan 15 09:00 node_modules
-rw-r--r--   1 user staff  1523 Jan 15 09:00 package.json
drwxr-xr-x   4 user staff   128 Jan 15 09:00 src
drwxr-xr-x   3 user staff    96 Jan 15 09:00 tests
-rw-r--r--   1 user staff  8932 Jan 15 10:30 tsconfig.json
-rw-r--r--   1 user staff  1245 Jan 15 09:00 vite.config.ts"
          :exit-code="0"
          :max-collapsed-lines="8"
        />
      </div>
    </Variant>

    <Variant title="Truncated">
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-truncated"
          command="cat large-file.log"
          stdout="[2024-01-15 10:00:00] INFO: Starting application...
[2024-01-15 10:00:01] INFO: Loading configuration...
[2024-01-15 10:00:02] INFO: Connecting to database...
[2024-01-15 10:00:03] INFO: Database connected successfully
..."
          :exit-code="0"
          :truncated="true"
        />
      </div>
    </Variant>

    <Variant title="No Output">
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-empty"
          command="echo -n ''"
          :exit-code="0"
          :duration-ms="50"
        />
      </div>
    </Variant>

    <Variant title="Simple Command">
      <div class="w-full max-w-md">
        <terminal
          id="terminal-simple"
          command="echo 'Hello World'"
          stdout="Hello World"
          :exit-code="0"
          :duration-ms="50"
        />
      </div>
    </Variant>

    <Variant title="Dark Theme - Success">
      <div class="dark w-full max-w-2xl">
        <terminal
          id="terminal-dark-success"
          command="pnpm build"
          :stdout="`\x1b[32m✓\x1b[0m 45 modules transformed.\n\x1b[32m✓\x1b[0m built in 2.34s\n\x1b[32m✓\x1b[0m Build completed successfully`"
          :exit-code="0"
          :duration-ms="2340"
          cwd="~/project"
        />
      </div>
    </Variant>

    <Variant title="Dark Theme - Error">
      <div class="dark w-full max-w-2xl">
        <terminal
          id="terminal-dark-error"
          command="npm test"
          stdout="FAIL src/utils.test.ts"
          stderr="Error: Expected 5 to be 10"
          :exit-code="1"
          :duration-ms="1200"
        />
      </div>
    </Variant>

    <Variant title="Interactive" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-muted p-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Command:</label>
            <input
              v-model="interactiveState.command"
              type="text"
              class="w-40 rounded-md border-border border bg-background px-3 py-1 text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Exit Code:</label>
            <input
              v-model.number="interactiveState.exitCode"
              type="number"
              min="0"
              class="w-20 rounded-md border-border border bg-background px-3 py-1 text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Duration (ms):</label>
            <input
              v-model.number="interactiveState.durationMs"
              type="number"
              min="0"
              class="w-24 rounded-md border-border border bg-background px-3 py-1 text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">CWD:</label>
            <input
              v-model="interactiveState.cwd"
              type="text"
              class="w-32 rounded-md border-border border bg-background px-3 py-1 text-sm"
            />
          </div>
        </div>
        <terminal
          id="terminal-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
