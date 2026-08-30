<script setup lang="ts">
import { CodeDiff } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const SplitDiff = useStoryLocale('content.splitDiff', messages)
const UnifiedDiff = useStoryLocale('content.unifiedDiff', messages)
const PatchMode = useStoryLocale('content.patchMode', messages)
const Modifications = useStoryLocale('content.modifications', messages)

const oldFunction = `export async function fetchUser(id: string) {
  const res = await db.users.findUnique({ where: { id } });
  if (!res) throw new Error("User not found");
  return res;
}`;

const newFunction = `export async function fetchUser(id: string) {
  const res = await db.users.findUnique({ where: { id } });
  if (!res) return null;
  return res;
}`;

const modifyExample = {
  old: `const API_URL = 'http://api.example.com/v1';
const TIMEOUT = 3000;`,
  new: `const API_URL = 'https://api.example.com/v2';
const TIMEOUT = 5000;`
};

const patchExample = `--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1,7 +1,7 @@
 export function greet(name: string): string {
-  return "Hello, " + name;
+  return \`Hello, \${name}!\`;
 }

 export function farewell(name: string): string {
-  return "Goodbye, " + name;
+  return \`Goodbye, \${name}!\`;
 }`;

const longOldCode = `// User service with caching and rate limiting
import { Redis } from 'ioredis';
import { LRUCache } from 'lru-cache';

const redis = new Redis(process.env.REDIS_URL);
const localCache = new LRUCache({ max: 500, ttl: 1000 * 60 * 5 });

export class UserService {
  private async getFromCache(key: string) {
    const local = localCache.get(key);
    if (local) return local;
    const remote = await redis.get(key);
    if (remote) {
      localCache.set(key, remote);
      return remote;
    }
    return null;
  }

  private async setCache(key: string, value: string) {
    localCache.set(key, value);
    await redis.setex(key, 300, value);
  }

  async findById(id: string) {
    const cacheKey = \`user:\${id}\`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) return JSON.parse(cached);
    const user = await db.users.findUnique({ where: { id } });
    if (user) await this.setCache(cacheKey, JSON.stringify(user));
    return user;
  }

  async findMany(ids: string[]) {
    const results = await Promise.all(ids.map(id => this.findById(id)));
    return results.filter(Boolean);
  }
}`;

const longNewCode = `// User service with caching, rate limiting, and event streaming
import { Redis } from 'ioredis';
import { LRUCache } from 'lru-cache';
import { EventEmitter } from 'events';

const redis = new Redis(process.env.REDIS_URL);
const localCache = new LRUCache({ max: 1000, ttl: 1000 * 60 * 10 });
const eventBus = new EventEmitter();

export class UserService {
  private async getFromCache(key: string) {
    const local = localCache.get(key);
    if (local) return local;
    const remote = await redis.get(key);
    if (remote) {
      localCache.set(key, remote);
      return remote;
    }
    return null;
  }

  private async setCache(key: string, value: string, ttl = 600) {
    localCache.set(key, value);
    await redis.setex(key, ttl, value);
  }

  async findById(id: string) {
    const cacheKey = \`user:\${id}\`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) return JSON.parse(cached);
    const user = await db.users.findUnique({ where: { id } });
    if (user) {
      await this.setCache(cacheKey, JSON.stringify(user));
      eventBus.emit('user:found', { id, source: 'database' });
    }
    return user;
  }

  async findMany(ids: string[]) {
    const results = await Promise.all(ids.map(id => this.findById(id)));
    return results.filter(Boolean);
  }

  async invalidateCache(id: string) {
    const cacheKey = \`user:\${id}\`;
    localCache.delete(cacheKey);
    await redis.del(cacheKey);
    eventBus.emit('user:cache:invalidated', { id });
  }
}`;

const splitDiff = SplitDiff
const unifiedDiff = UnifiedDiff
const patchMode = PatchMode
const modifications = Modifications
</script>

<template>
  <Story title="CodeDiff/Modes">
    <Variant :title="splitDiff">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl">
        <code-diff
          id="diff-split"
          language="typescript"
          filename="lib/auth.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="split"
        />
      </div>
    </Variant>

    <Variant :title="unifiedDiff">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-unified"
          language="typescript"
          filename="lib/auth.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant :title="patchMode">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-patch"
          language="typescript"
          filename="src/utils.ts"
          :patch="patchExample"
        />
      </div>
    </Variant>

    <Variant :title="modifications">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-modify"
          language="typescript"
          filename="constants.ts"
          :old-code="modifyExample.old"
          :new-code="modifyExample.new"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant title="折叠长差异 / Collapsed Long Diff">
      <p class="mb-3 text-xs text-muted-foreground">验证折叠后 overflow-y-auto 可滚动 / Verify scrollable after collapse</p>
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-collapsed"
          language="typescript"
          filename="user-service.ts"
          :old-code="longOldCode"
          :new-code="longNewCode"
          diff-style="unified"
          :max-collapsed-lines="10"
        />
      </div>
    </Variant>
  </Story>
</template>
