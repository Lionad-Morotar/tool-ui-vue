import type { CitationType } from './schema';

export type TypeIcon = { viewBox: string; path: string };

export const typeIcons: Record<CitationType, TypeIcon> = {
  webpage: {
    viewBox: '0 0 24 24',
    path: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z M3 8h18 M8 12h8 M8 16h5',
  },
  document: {
    viewBox: '0 0 24 24',
    path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8M16 17H8M10 9H8',
  },
  article: {
    viewBox: '0 0 24 24',
    path: 'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2 M18 14h-8 M15 18h-5',
  },
  api: {
    viewBox: '0 0 24 24',
    path: 'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',
  },
  code: {
    viewBox: '0 0 24 24',
    path: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
  },
  other: {
    viewBox: '0 0 24 24',
    path: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6',
  },
};
