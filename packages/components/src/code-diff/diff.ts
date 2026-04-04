import {
  diffLines,
  diffWords,
  parsePatch,
} from 'diff';
import type { StructuredPatch, StructuredPatchHunk, Change } from 'diff';

export type DiffType = 'context' | 'addition' | 'deletion';

export interface WordDiff {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export interface DiffLine {
  type: DiffType;
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
  wordDiffs?: WordDiff[];
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface FileDiff {
  hunks: DiffHunk[];
  additions: number;
  deletions: number;
  unifiedLineCount: number;
}

export interface DiffResult {
  lines: DiffLine[];
  additions: number;
  deletions: number;
}

export interface SplitLine {
  oldLine?: {
    content: string;
    lineNum: number;
    type: 'context' | 'deletion';
    wordDiffs?: WordDiff[];
  };
  newLine?: {
    content: string;
    lineNum: number;
    type: 'context' | 'addition';
    wordDiffs?: WordDiff[];
  };
}

export interface SplitDiff {
  lines: SplitLine[];
  additions: number;
  deletions: number;
}

export function computeWordDiff(oldText: string, newText: string): WordDiff[] {
  const changes = diffWords(oldText, newText);
  return changes.map((change: Change) => ({
    value: change.value,
    added: change.added,
    removed: change.removed,
  }));
}

function enrichWithWordDiffs(lines: DiffLine[]): DiffLine[] {
  const result: DiffLine[] = [];
  const pendingDeletions: DiffLine[] = [];

  for (const line of lines) {
    if (line.type === 'deletion') {
      pendingDeletions.push(line);
    } else if (line.type === 'addition') {
      if (pendingDeletions.length > 0) {
        const matchedDeletion = pendingDeletions.shift()!;
        const wordDiffs = computeWordDiff(matchedDeletion.content, line.content);
        result.push({
          ...matchedDeletion,
          wordDiffs: wordDiffs.map(w => ({ value: w.value, removed: w.removed, added: false })),
        });
        result.push({
          ...line,
          wordDiffs: wordDiffs.map(w => ({ value: w.value, added: w.added, removed: false })),
        });
      } else {
        result.push(line);
      }
    } else {
      result.push(...pendingDeletions);
      pendingDeletions.length = 0;
      result.push(line);
    }
  }
  result.push(...pendingDeletions);
  return result;
}

function parseHunkToLines(hunk: StructuredPatchHunk): DiffLine[] {
  const lines: DiffLine[] = [];
  let oldLineNum = hunk.oldStart;
  let newLineNum = hunk.newStart;

  for (const line of hunk.lines) {
    if (line === '\\ No newline at end of file') continue;
    if (line.startsWith('+')) {
      lines.push({ type: 'addition', content: line.slice(1), newLineNum });
      newLineNum++;
    } else if (line.startsWith('-')) {
      lines.push({ type: 'deletion', content: line.slice(1), oldLineNum });
      oldLineNum++;
    } else {
      const content = line.startsWith(' ') ? line.slice(1) : line;
      lines.push({ type: 'context', content, oldLineNum, newLineNum });
      oldLineNum++;
      newLineNum++;
    }
  }
  return enrichWithWordDiffs(lines);
}

function parsePatchToFileDiff(patch: string): FileDiff {
  const parsed = parsePatch(patch);
  if (!parsed || parsed.length === 0) {
    return { hunks: [], additions: 0, deletions: 0, unifiedLineCount: 0 };
  }
  const firstFile = parsed[0] as unknown as StructuredPatch;
  const hunks: DiffHunk[] = [];
  let additions = 0;
  let deletions = 0;

  for (const hunk of firstFile.hunks) {
    const lines = parseHunkToLines(hunk);
    for (const line of lines) {
      if (line.type === 'addition') additions++;
      if (line.type === 'deletion') deletions++;
    }
    hunks.push({
      oldStart: hunk.oldStart,
      oldLines: hunk.oldLines,
      newStart: hunk.newStart,
      newLines: hunk.newLines,
      lines,
    });
  }
  const unifiedLineCount = hunks.reduce((sum, h) => sum + h.lines.length, 0);
  return { hunks, additions, deletions, unifiedLineCount };
}

function convertUnifiedToSplit(fileDiff: FileDiff): SplitDiff {
  const lines: SplitLine[] = [];
  let additions = 0;
  let deletions = 0;

  for (const hunk of fileDiff.hunks) {
    const pendingDeletions: Array<{ content: string; lineNum: number; wordDiffs?: WordDiff[] }> = [];
    const pendingAdditions: Array<{ content: string; lineNum: number; wordDiffs?: WordDiff[] }> = [];

    for (const line of hunk.lines) {
      if (line.type === 'deletion') {
        pendingDeletions.push({ content: line.content, lineNum: line.oldLineNum!, wordDiffs: line.wordDiffs });
        deletions++;
      } else if (line.type === 'addition') {
        pendingAdditions.push({ content: line.content, lineNum: line.newLineNum!, wordDiffs: line.wordDiffs });
        additions++;
      } else {
        while (pendingDeletions.length > 0 || pendingAdditions.length > 0) {
          if (pendingDeletions.length > 0 && pendingAdditions.length > 0) {
            const del = pendingDeletions.shift()!;
            const add = pendingAdditions.shift()!;
            lines.push({ oldLine: { ...del, type: 'deletion' }, newLine: { ...add, type: 'addition' } });
          } else if (pendingDeletions.length > 0) {
            const del = pendingDeletions.shift()!;
            lines.push({ oldLine: { ...del, type: 'deletion' } });
          } else {
            const add = pendingAdditions.shift()!;
            lines.push({ newLine: { ...add, type: 'addition' } });
          }
        }
        lines.push({
          oldLine: { content: line.content, lineNum: line.oldLineNum!, type: 'context' },
          newLine: { content: line.content, lineNum: line.newLineNum!, type: 'context' },
        });
      }
    }
    while (pendingDeletions.length > 0 || pendingAdditions.length > 0) {
      if (pendingDeletions.length > 0 && pendingAdditions.length > 0) {
        const del = pendingDeletions.shift()!;
        const add = pendingAdditions.shift()!;
        lines.push({ oldLine: { ...del, type: 'deletion' }, newLine: { ...add, type: 'addition' } });
      } else if (pendingDeletions.length > 0) {
        const del = pendingDeletions.shift()!;
        lines.push({ oldLine: { ...del, type: 'deletion' } });
      } else {
        const add = pendingAdditions.shift()!;
        lines.push({ newLine: { ...add, type: 'addition' } });
      }
    }
  }
  return { lines, additions, deletions };
}

function computeFileDiffFromFiles(oldCode: string, newCode: string, _filename = 'file'): FileDiff {
  // Handle identical content - return all lines as context
  if (oldCode === newCode) {
    if (oldCode === '') {
      return { hunks: [], additions: 0, deletions: 0, unifiedLineCount: 0 };
    }
    const lines = oldCode.split('\n').map((content, index) => ({
      type: 'context' as const,
      content,
      oldLineNum: index + 1,
      newLineNum: index + 1,
    }));
    return {
      hunks: [{
        oldStart: 1,
        oldLines: lines.length,
        newStart: 1,
        newLines: lines.length,
        lines,
      }],
      additions: 0,
      deletions: 0,
      unifiedLineCount: lines.length,
    };
  }

  // Use diffLines for reliable line-by-line diffing
  const changes = diffLines(oldCode, newCode);
  const result: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;
  let additions = 0;
  let deletions = 0;

  for (const change of changes) {
    // Skip empty trailing change
    if (change.value === '') continue;

    // Split into lines, handling trailing newline
    const lines = change.value.endsWith('\n')
      ? change.value.slice(0, -1).split('\n')
      : change.value.split('\n');

    for (const content of lines) {
      if (change.added) {
        result.push({ type: 'addition', content, newLineNum });
        newLineNum++;
        additions++;
      } else if (change.removed) {
        result.push({ type: 'deletion', content, oldLineNum });
        oldLineNum++;
        deletions++;
      } else {
        result.push({ type: 'context', content, oldLineNum, newLineNum });
        oldLineNum++;
        newLineNum++;
      }
    }
  }

  // Apply word-level diff highlighting
  const enrichedLines = enrichWithWordDiffs(result);

  // Calculate old and new line counts
  const oldLines = oldCode === '' ? 0 : oldCode.split('\n').length;
  const newLines = newCode === '' ? 0 : newCode.split('\n').length;

  const hunks: DiffHunk[] = result.length === 0 ? [] : [{
    oldStart: 1,
    oldLines,
    newStart: 1,
    newLines,
    lines: enrichedLines,
  }];

  return {
    hunks,
    additions,
    deletions,
    unifiedLineCount: result.length,
  };
}

export function computeDiff(oldCode: string, newCode: string): DiffResult {
  const fileDiff = computeFileDiffFromFiles(oldCode, newCode);
  return {
    lines: fileDiff.hunks.flatMap((h) => h.lines),
    additions: fileDiff.additions,
    deletions: fileDiff.deletions,
  };
}

export function computeUnifiedDiff(oldCode: string, newCode: string, filename = 'file'): FileDiff {
  return computeFileDiffFromFiles(oldCode, newCode, filename);
}

export function computeSplitDiff(oldCode: string, newCode: string, filename = 'file'): SplitDiff {
  const unified = computeFileDiffFromFiles(oldCode, newCode, filename);
  return convertUnifiedToSplit(unified);
}

export function parsePatchToUnifiedDiff(patch: string): FileDiff {
  return parsePatchToFileDiff(patch);
}

export function parsePatchToSplitDiff(patch: string): SplitDiff {
  const unified = parsePatchToFileDiff(patch);
  return convertUnifiedToSplit(unified);
}
