import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import config from '../../../histoire.config';

/**
 * E2E Test: Histoire Configuration
 *
 * Verifies histoire.config.ts stays aligned with directory-based story structure.
 */

describe('E2E: Histoire Configuration', () => {
  test('storyIgnored contains a pattern matching tailwind-test', () => {
    const ignored = (config.storyIgnored ?? []) as string[];
    const hasTailwindTest = ignored.some((pattern) =>
      /tailwind-test/.test(pattern),
    );
    expect(hasTailwindTest).toBe(true);
  });

  test('every discovered src/stories/*/index.story.vue matches exactly one tree group', () => {
    const cwd = process.cwd();
    const storiesDir = join(cwd, 'src', 'stories');
    const entries = readdirSync(storiesDir, { withFileTypes: true });
    const storyNames = entries
      .filter((d) => d.isDirectory())
      .filter((d) => {
        try {
          const sub = readdirSync(join(storiesDir, d.name));
          return sub.includes('index.story.vue');
        } catch { return false; }
      })
      .map((d) => d.name);

    const ignored = (config.storyIgnored ?? []) as string[];
    const isIgnored = (story: string) =>
      ignored.some((pattern) =>
        new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')).test(`src/stories/${story}/index.story.vue`),
      );

    const groups = (config.tree?.groups ?? []) as Array<{
      title: string;
      include: (file: { path: string }) => boolean;
    }>;

    for (const story of storyNames) {
      if (isIgnored(story)) continue;
      const file = { path: `src/stories/${story}/index.story.vue` };
      const matchedGroups = groups.filter((g) => g.include(file));
      expect(
        matchedGroups.length,
        `Story "${story}" should match exactly one tree group, but matched ${matchedGroups.length}`,
      ).toBe(1);
    }
  });
});
