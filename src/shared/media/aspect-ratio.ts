export const AspectRatioSchema = ['auto', '1:1', '4:3', '16:9', '9:16'] as const;
export type AspectRatio = (typeof AspectRatioSchema)[number];

export const MediaFitSchema = ['cover', 'contain'] as const;
export type MediaFit = (typeof MediaFitSchema)[number];

export const RATIO_CLASS_MAP: Record<AspectRatio, string> = {
  auto: '',
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
};

export function getRatioClass(ratio: AspectRatio): string {
  return RATIO_CLASS_MAP[ratio];
}

export function getFitClass(fit: MediaFit): string {
  return fit === 'cover' ? 'object-cover' : 'object-contain';
}
