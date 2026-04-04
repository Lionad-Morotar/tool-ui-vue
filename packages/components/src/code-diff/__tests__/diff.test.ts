import { describe, it, expect } from 'vitest';
import { computeDiff, computeWordDiff, type DiffLine } from '../diff';

describe('computeDiff', () => {
  it('should correctly identify context lines (same lines)', () => {
    const oldCode = 'line1\nline2\nline3';
    const newCode = 'line1\nline2\nline3';

    const result = computeDiff(oldCode, newCode);

    expect(result.lines).toHaveLength(3);
    expect(result.lines.every((l: DiffLine) => l.type === 'context')).toBe(true);
    expect(result.additions).toBe(0);
    expect(result.deletions).toBe(0);
  });

  it('should correctly identify deletion lines', () => {
    const oldCode = 'line1\nline2\nline3';
    const newCode = 'line1\nline3';

    const result = computeDiff(oldCode, newCode);

    const deletionLines = result.lines.filter((l: DiffLine) => l.type === 'deletion');
    expect(deletionLines).toHaveLength(1);
    expect(deletionLines[0].content).toBe('line2');
    expect(deletionLines[0].oldLineNum).toBe(2);
    expect(result.deletions).toBe(1);
    expect(result.additions).toBe(0);
  });

  it('should correctly identify addition lines', () => {
    const oldCode = 'line1\nline3';
    const newCode = 'line1\nline2\nline3';

    const result = computeDiff(oldCode, newCode);

    const additionLines = result.lines.filter((l: DiffLine) => l.type === 'addition');
    expect(additionLines).toHaveLength(1);
    expect(additionLines[0].content).toBe('line2');
    expect(additionLines[0].newLineNum).toBe(2);
    expect(result.additions).toBe(1);
    expect(result.deletions).toBe(0);
  });

  it('should handle empty string input', () => {
    const result1 = computeDiff('', '');
    expect(result1.lines).toHaveLength(0);
    expect(result1.additions).toBe(0);
    expect(result1.deletions).toBe(0);

    const result2 = computeDiff('', 'new line');
    expect(result2.lines).toHaveLength(1);
    expect(result2.lines[0].type).toBe('addition');
    expect(result2.additions).toBe(1);

    const result3 = computeDiff('old line', '');
    expect(result3.lines).toHaveLength(1);
    expect(result3.lines[0].type).toBe('deletion');
    expect(result3.deletions).toBe(1);
  });

  it('should handle complex multi-line differences', () => {
    const oldCode = `export async function fetchUser(id: string) {
  const res = await db.users.findUnique({ where: { id } });
  if (!res) throw new Error("User not found");
  return res;
}`;

    const newCode = `export async function fetchUser(id: string) {
  const res = await db.users.findUnique({ where: { id } });
  if (!res) return null;
  return res;
}`;

    const result = computeDiff(oldCode, newCode);

    // Should have context lines, one deletion, and one addition
    expect(result.lines.length).toBeGreaterThan(0);

    const deletionLines = result.lines.filter((l: DiffLine) => l.type === 'deletion');
    const additionLines = result.lines.filter((l: DiffLine) => l.type === 'addition');
    const contextLines = result.lines.filter((l: DiffLine) => l.type === 'context');

    expect(deletionLines.length).toBeGreaterThan(0);
    expect(additionLines.length).toBeGreaterThan(0);
    expect(contextLines.length).toBeGreaterThan(0);

    // Check line numbers are correct
    expect(result.lines[0].oldLineNum).toBe(1);
    expect(result.lines[0].newLineNum).toBe(1);

    expect(result.additions).toBe(additionLines.length);
    expect(result.deletions).toBe(deletionLines.length);
  });

  it('should handle completely different content', () => {
    const oldCode = 'old line 1\nold line 2';
    const newCode = 'new line 1\nnew line 2';

    const result = computeDiff(oldCode, newCode);

    expect(result.deletions).toBe(2);
    expect(result.additions).toBe(2);
    expect(result.lines).toHaveLength(4);
  });

  it('should maintain correct line number ordering', () => {
    const oldCode = 'a\nb\nc\nd';
    const newCode = 'a\nx\nc\nd';

    const result = computeDiff(oldCode, newCode);

    // Check that line numbers are sequential
    let lastOldLine = 0;
    let lastNewLine = 0;

    for (const line of result.lines) {
      if (line.oldLineNum !== undefined) {
        expect(line.oldLineNum).toBeGreaterThanOrEqual(lastOldLine);
        lastOldLine = line.oldLineNum;
      }
      if (line.newLineNum !== undefined) {
        expect(line.newLineNum).toBeGreaterThanOrEqual(lastNewLine);
        lastNewLine = line.newLineNum;
      }
    }
  });
});

describe('computeWordDiff', () => {
  it('should detect word-level changes between two strings', () => {
    const oldText = 'const x = 1;';
    const newText = 'const y = 2;';

    const result = computeWordDiff(oldText, newText);

    // Should identify "x" as removed and "y" as added
    const removedParts = result.filter((p) => p.removed);
    const addedParts = result.filter((p) => p.added);

    expect(removedParts.length).toBeGreaterThan(0);
    expect(addedParts.length).toBeGreaterThan(0);
  });

  it('should return single part for identical strings', () => {
    const text = 'function test() {}';

    const result = computeWordDiff(text, text);

    expect(result.length).toBe(1);
    expect(result[0].value).toBe(text);
    expect(result[0].added).toBeFalsy();
    expect(result[0].removed).toBeFalsy();
  });

  it('should handle completely different strings', () => {
    const oldText = 'hello world';
    const newText = 'goodbye moon';

    const result = computeWordDiff(oldText, newText);

    const removedParts = result.filter((p) => p.removed);
    const addedParts = result.filter((p) => p.added);

    expect(removedParts.length).toBeGreaterThan(0);
    expect(addedParts.length).toBeGreaterThan(0);
  });
});

describe('word-level diff in computeDiff', () => {
  it('should include wordDiffs for modified lines', () => {
    const oldCode = 'const x = 1;';
    const newCode = 'const y = 2;';

    const result = computeDiff(oldCode, newCode);

    // Find the deletion and addition lines
    const deletionLine = result.lines.find((l: DiffLine) => l.type === 'deletion');
    const additionLine = result.lines.find((l: DiffLine) => l.type === 'addition');

    expect(deletionLine).toBeDefined();
    expect(additionLine).toBeDefined();

    // Both lines should have wordDiffs
    expect(deletionLine!.wordDiffs).toBeDefined();
    expect(additionLine!.wordDiffs).toBeDefined();
    expect(deletionLine!.wordDiffs!.length).toBeGreaterThan(0);
    expect(additionLine!.wordDiffs!.length).toBeGreaterThan(0);
  });

  it('should not include wordDiffs for context lines', () => {
    const oldCode = 'line1\nline2';
    const newCode = 'line1\nline2';

    const result = computeDiff(oldCode, newCode);

    // All lines should be context without wordDiffs
    expect(result.lines.every((l: DiffLine) => l.type === 'context')).toBe(true);
    expect(result.lines.every((l: DiffLine) => l.wordDiffs === undefined)).toBe(true);
  });

  it('should correctly highlight changed words within a line', () => {
    const oldCode = 'if (!res) throw new Error("User not found");';
    const newCode = 'if (!res) return null;';

    const result = computeDiff(oldCode, newCode);

    const deletionLine = result.lines.find((l: DiffLine) => l.type === 'deletion');
    const additionLine = result.lines.find((l: DiffLine) => l.type === 'addition');

    expect(deletionLine).toBeDefined();
    expect(additionLine).toBeDefined();

    // Check that wordDiffs exist
    expect(deletionLine!.wordDiffs).toBeDefined();
    expect(additionLine!.wordDiffs).toBeDefined();

    // The deletion line should have some parts marked as removed
    const removedParts = deletionLine!.wordDiffs!.filter((w) => w.removed);
    expect(removedParts.length).toBeGreaterThan(0);

    // The addition line should have some parts marked as added
    const addedParts = additionLine!.wordDiffs!.filter((w) => w.added);
    expect(addedParts.length).toBeGreaterThan(0);
  });
});
