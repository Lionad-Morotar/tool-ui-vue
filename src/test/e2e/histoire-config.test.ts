import { describe, expect, test } from 'vitest';
import { globSync } from 'glob';
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
    const paths = globSync('src/stories/*/index.story.vue', { cwd });

    // Extract story directory names (e.g., landing, code-block)
    const storyNames = paths.map((p) => {
      const match = p.match(/^src\/stories\/([^/]+)\/index\.story\.vue$/);
      if (!match) throw new Error(`Unexpected story path: ${p}`);
      return match[1];
    });

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
