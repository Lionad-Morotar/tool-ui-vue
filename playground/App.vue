<script setup lang="ts">
import { ref, h } from 'vue';
import {
  ApprovalCard,
  Audio,
  CodeBlock,
  Terminal,
  CitationList,
  LinkPreview,
  OptionList,
  XPost,
  InstagramPost,
  LinkedInPost,
  StatsDisplay,
  MessageDraft,
  DataTable,
  PreferencesPanel,
  Plan,
  ProgressTracker,
  QuestionFlow,
  ItemCarousel,
  ImageGallery,
  ParameterSlider,
  Chart,
  GeoMap,
  CodeDiff,
  WeatherWidget,
  cn,
} from '../src';

// Toast notifications
const toasts = ref<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 2000);
}

// Gallery layout classes
const GALLERY_LAYOUT_CLASS = 'mx-auto w-full min-w-0 max-w-full overflow-x-hidden pb-20 px-6 sm:px-10 lg:px-12';
const GALLERY_MOBILE_STACK_CLASS = 'flex flex-col gap-0 lg:hidden';
const GALLERY_DESKTOP_GRID_CLASS = 'hidden lg:grid lg:grid-cols-2 lg:items-start lg:gap-5';

// Component card configuration
interface ComponentCard {
  id: string;
  title: string;
  description?: string;
  render: () => Record<string, unknown>;
}

// Gallery card component
function GalleryCard(props: { card: ComponentCard; class?: string }) {
  return h(
    'article',
    {
      class: cn(
        'group/gallery-card relative mb-5 flex w-full max-w-full min-w-0 break-inside-avoid flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-card/40 p-3 pb-5 shadow-sm transition-[background-color,box-shadow] duration-200 focus-within:bg-card/80 hover:bg-card/80',
        props.class
      ),
    },
    [
      h('div', { class: 'w-full flex flex-col items-start gap-1 px-1' }, [
        h('h3', { class: 'text-sm font-semibold text-gray-900' }, props.card.title),
        props.card.description
          ? h('p', { class: 'text-xs text-gray-500' }, props.card.description)
          : null,
      ]),
      h('div', { class: 'flex w-full justify-center' }, props.card.render()),
    ]
  );
}

// Gallery cards - aligned with React gallery (25 components)
const galleryCards: ComponentCard[] = [
  {
    id: 'option-list',
    title: 'OptionList',
    description: 'Multi-select with max selections',
    render: () =>
      h(OptionList, {
        id: 'demo-option-list',
        options: [
          { id: 'good', label: 'Good', description: 'High quality work' },
          { id: 'fast', label: 'Fast', description: 'Quick turnaround' },
          { id: 'cheap', label: 'Cheap', description: 'Low cost' },
        ],
        selectionMode: 'multi',
        minSelections: 1,
        maxSelections: 2,
        actions: [
          { id: 'cancel', label: 'Reset' },
          { id: 'confirm', label: 'Confirm', variant: 'default' },
        ],
      }),
  },
  {
    id: 'question-flow',
    title: 'QuestionFlow',
    description: 'Upfront question flow with multiple steps',
    render: () =>
      h(QuestionFlow, {
        id: 'demo-question-flow',
        steps: [
          {
            id: 'language',
            title: 'Select a programming language',
            description: 'This determines which frameworks and tools are available.',
            options: [
              { id: 'python', label: 'Python' },
              { id: 'typescript', label: 'TypeScript' },
              { id: 'go', label: 'Go' },
            ],
          },
          {
            id: 'framework',
            title: 'Choose a framework',
            description: "Pick the framework you're most comfortable with.",
            options: [
              { id: 'fastapi', label: 'FastAPI' },
              { id: 'django', label: 'Django' },
              { id: 'flask', label: 'Flask' },
            ],
          },
          {
            id: 'database',
            title: 'Select your database',
            description: 'Your data will be stored and queried from here.',
            options: [
              { id: 'postgres', label: 'PostgreSQL' },
              { id: 'mysql', label: 'MySQL' },
              { id: 'mongodb', label: 'MongoDB' },
            ],
          },
        ],
        onStepChange: (stepId: string) => console.log('Step changed:', stepId),
        onComplete: (answers: Record<string, string[]>) => showToast(`Flow complete: ${JSON.stringify(answers)}`, 'success'),
      }),
  },
  {
    id: 'weather-widget',
    title: 'WeatherWidget',
    description: 'Weather display with effects',
    render: () =>
      h(WeatherWidget, {
        id: 'demo-weather-widget',
        location: 'San Francisco, CA',
        current: {
          temperature: 64,
          tempMin: 58,
          tempMax: 72,
          conditionCode: 'thunderstorm',
        },
        forecast: [
          { day: 'Tue', tempMin: 56, tempMax: 68, conditionCode: 'rain' },
          { day: 'Wed', tempMin: 54, tempMax: 66, conditionCode: 'cloudy' },
          { day: 'Thu', tempMin: 58, tempMax: 70, conditionCode: 'partly-cloudy' },
          { day: 'Fri', tempMin: 60, tempMax: 74, conditionCode: 'sunny' },
          { day: 'Sat', tempMin: 62, tempMax: 76, conditionCode: 'sunny' },
        ],
        updatedAt: '2026-01-29T02:30:00Z',
        effects: { enabled: true, quality: 'low' },
      }),
  },
  {
    id: 'plan',
    title: 'Plan',
    description: 'Todo list with progress and expandable items',
    render: () =>
      h(Plan, {
        id: 'demo-plan',
        title: 'Feature Implementation Plan',
        description: 'Step-by-step guide for implementing the new authentication system',
        todos: [
          { id: '1', label: 'Review existing auth flow', status: 'completed', description: 'Analyzed current session-based auth and identified pain points' },
          { id: '2', label: 'Design new token structure', status: 'completed', description: 'Created JWT schema with access/refresh token separation' },
          { id: '3', label: 'Implement JWT middleware', status: 'in_progress', description: 'Adding token validation and refresh logic to API routes' },
          { id: '4', label: 'Add refresh token logic', status: 'pending' },
          { id: '5', label: 'Update user model', status: 'pending' },
          { id: '6', label: 'Write integration tests', status: 'pending', description: 'Cover auth flows, token expiry, and edge cases' },
          { id: '7', label: 'Update API documentation', status: 'pending' },
          { id: '8', label: 'Deploy to staging', status: 'pending' },
        ],
      }),
  },
  {
    id: 'parameter-slider',
    title: 'ParameterSlider',
    description: 'Photo adjustment controls',
    render: () =>
      h(ParameterSlider, {
        id: 'demo-parameter-slider',
        title: 'Photo Adjustments',
        sliders: [
          { id: 'brightness', label: 'Brightness', min: -100, max: 100, step: 1, value: 0 },
          { id: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1, value: 0 },
          { id: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1, value: 0 },
        ],
      }),
  },
  {
    id: 'item-carousel',
    title: 'ItemCarousel',
    description: 'TV shows to watch next',
    render: () =>
      h('div', { class: 'w-full max-w-full min-w-0' }, [
        h(ItemCarousel, {
          id: 'demo-item-carousel',
          title: 'Recommended',
          description: 'TV shows to watch next',
          interactive: true,
          items: [
            { id: 'rec-1', name: 'Deadwood', subtitle: 'HBO · 2004', color: '#8b6f47', actions: [{ id: 'info', label: 'Details', variant: 'secondary' }, { id: 'watch', label: 'Watch' }] },
            { id: 'rec-2', name: 'The Wire', subtitle: 'HBO · 2002', color: '#1e293b', actions: [{ id: 'info', label: 'Details', variant: 'secondary' }, { id: 'watch', label: 'Watch' }] },
            { id: 'rec-3', name: 'Twin Peaks', subtitle: 'ABC · 1990', color: '#7f1d1d', actions: [{ id: 'info', label: 'Details', variant: 'secondary' }, { id: 'watch', label: 'Watch' }] },
            { id: 'rec-4', name: 'The Simpsons', subtitle: 'Fox · 1989', color: '#fbbf24', actions: [{ id: 'add', label: 'Add to List' }] },
            { id: 'rec-5', name: 'Mad Men', subtitle: 'AMC · 2007', color: '#c2410c', actions: [{ id: 'info', label: 'Details', variant: 'secondary' }, { id: 'watch', label: 'Watch' }] },
          ],
        }),
      ]),
  },
  {
    id: 'code-diff',
    title: 'CodeDiff',
    description: 'Code diff view',
    render: () =>
      h(CodeDiff, {
        id: 'demo-code-diff',
        title: 'Refactor: Extract useAuth Hook',
        description: 'Improves reusability and testability',
        oldCode: "// Before: Auth logic in component\nfunction LoginForm() {\n  const [user, setUser] = useState(null);\n  const login = async (creds) => {\n    const res = await fetch('/api/login', {\n      method: 'POST',\n      body: JSON.stringify(creds)\n    });\n    const data = await res.json();\n    setUser(data.user);\n  };\n  // ... component JSX\n}",
        newCode: "// After: Using extracted hook\nfunction LoginForm() {\n  const { user, login } = useAuth();\n  // ... component JSX\n}\n\n// Reusable across components\nfunction useAuth() {\n  const [user, setUser] = useState(null);\n  const login = async (creds) => {\n    const res = await api.post('/login', creds);\n    setUser(res.data.user);\n  };\n  return { user, login };\n}",
        language: 'typescript',
      }),
  },
  {
    id: 'data-table',
    title: 'DataTable',
    description: 'Stock prices with trends',
    render: () =>
      h('div', { class: 'w-full max-w-full min-w-0' }, [
        h(DataTable, {
          id: 'demo-data-table',
          title: 'Stock Prices',
          description: 'Real-time market data with 24h trends',
          columns: [
            { key: 'symbol', header: 'Symbol', width: '100px' },
            { key: 'price', header: 'Price', width: '120px' },
            { key: 'change', header: '24h Change', width: '140px' },
            { key: 'volume', header: 'Volume', width: '120px' },
          ],
          data: [
            { symbol: 'AAPL', price: 189.52, change: 2.34, changePercent: 1.25, volume: '52.3M', trend: [170, 175, 172, 180, 185, 182, 189] },
            { symbol: 'GOOGL', price: 141.8, change: -1.2, changePercent: -0.84, volume: '28.1M', trend: [145, 143, 146, 144, 142, 143, 141] },
            { symbol: 'MSFT', price: 378.91, change: 5.67, changePercent: 1.52, volume: '21.7M', trend: [360, 365, 362, 370, 375, 372, 378] },
            { symbol: 'AMZN', price: 178.35, change: 3.21, changePercent: 1.83, volume: '38.9M', trend: [165, 168, 170, 172, 175, 174, 178] },
            { symbol: 'TSLA', price: 238.45, change: -8.32, changePercent: -3.37, volume: '98.2M', trend: [250, 245, 255, 248, 242, 246, 238] },
          ],
        }),
      ]),
  },
  {
    id: 'stats-display',
    title: 'StatsDisplay',
    description: 'Business metrics',
    render: () =>
      h(StatsDisplay, {
        id: 'demo-stats-display',
        title: 'Business Metrics',
        description: 'Monthly performance overview',
        stats: [
          { id: 'revenue', label: 'Revenue', value: '$124.5K', change: { value: '+12.5%', trend: 'up' }, period: 'vs last month' },
          { id: 'users', label: 'Active Users', value: '8,432', change: { value: '+5.2%', trend: 'up' }, period: 'vs last month' },
          { id: 'churn', label: 'Churn Rate', value: '2.4%', change: { value: '-0.8%', trend: 'down' }, period: 'vs last month', invertChangeColor: true },
        ],
      }),
  },
  {
    id: 'geo-map',
    title: 'GeoMap',
    description: 'Fleet tracking',
    render: () =>
      h(GeoMap, {
        id: 'gallery-geo-map',
        title: 'Fleet Locations',
        description: 'Real-time vehicle tracking',
        viewport: { mode: 'fit' as const },
        markers: [
          { id: 'v1', lat: 37.7749, lng: -122.4194, label: 'Vehicle 1' },
          { id: 'v2', lat: 37.7849, lng: -122.4094, label: 'Vehicle 2' },
          { id: 'v3', lat: 37.7649, lng: -122.4294, label: 'Vehicle 3' },
        ],
      }),
  },
  {
    id: 'image-gallery',
    title: 'ImageGallery',
    description: 'Search results',
    render: () =>
      h(ImageGallery, {
        id: 'demo-image-gallery',
        title: 'Search Results',
        images: [
          { id: '1', src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop', alt: 'Mountain landscape', title: 'Mountain Vista', source: 'Unsplash' },
          { id: '2', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop', alt: 'Alpine lake', title: 'Alpine Lake', source: 'Unsplash' },
          { id: '3', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=280&fit=crop', alt: 'Forest path', title: 'Forest Path', source: 'Unsplash' },
          { id: '4', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', alt: 'Coastal view', title: 'Coastal View', source: 'Unsplash' },
        ],
      }),
  },
  {
    id: 'code-block',
    title: 'CodeBlock',
    description: 'TypeScript example',
    render: () =>
      h(CodeBlock, {
        id: 'demo-code-block',
        code: 'interface User {\n  id: string;\n  name: string;\n  email: string;\n  role: "admin" | "user";\n}\n\nasync function getUser(id: string): Promise<User> {\n  const response = await fetch(`/api/users/${id}`);\n  if (!response.ok) {\n    throw new Error(`Failed to fetch user: ${response.statusText}`);\n  }\n  return response.json();\n}',
        language: 'typescript',
        filename: 'user-service.ts',
      }),
  },
  {
    id: 'audio',
    title: 'Audio',
    description: 'Audio player',
    render: () =>
      h(Audio, {
        id: 'demo-audio',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'SoundHelix Song',
        artist: 'T. Schürger',
      }),
  },
  {
    id: 'terminal',
    title: 'Terminal',
    description: 'Command output',
    render: () =>
      h(Terminal, {
        id: 'demo-terminal',
        content: [
          { type: 'input', text: 'npm run build' },
          { type: 'output', text: '> tool-ui@0.2.0 build' },
          { type: 'output', text: '> next build' },
          { type: 'output', text: '' },
          { type: 'output', text: '✓ Creating an optimized production build' },
          { type: 'output', text: '✓ Compiled successfully' },
          { type: 'output', text: '✓ Linting and checking validity of types' },
          { type: 'output', text: '✓ Collecting page data' },
          { type: 'output', text: '✓ Generating static pages (12/12)' },
          { type: 'success', text: '✓ Build completed in 8.42s' },
        ],
      }),
  },
  {
    id: 'chart',
    title: 'Chart',
    description: 'Revenue chart',
    render: () =>
      h(Chart, {
        id: 'gallery-chart',
        type: 'bar',
        title: 'Quarterly Revenue',
        description: 'Revenue by quarter (2024)',
        data: [
          { quarter: 'Q1', revenue: 125000, target: 120000 },
          { quarter: 'Q2', revenue: 148000, target: 140000 },
          { quarter: 'Q3', revenue: 162000, target: 150000 },
          { quarter: 'Q4', revenue: 189000, target: 170000 },
        ],
        xKey: 'quarter',
        series: [
          { key: 'revenue', label: 'Revenue' },
          { key: 'target', label: 'Target' },
        ],
        showLegend: true,
        showGrid: true,
      }),
  },
  {
    id: 'link-preview',
    title: 'LinkPreview',
    description: 'Article preview',
    render: () =>
      h(LinkPreview, {
        id: 'demo-link-preview',
        url: 'https://example.com/article',
        title: 'Building Accessible UI Components',
        description: 'Learn best practices for creating inclusive web interfaces that work for everyone.',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop',
        faviconUrl: 'https://example.com/favicon.ico',
        siteName: 'Example Blog',
      }),
  },
  {
    id: 'citation',
    title: 'Citation',
    description: 'Source citations',
    render: () =>
      h(CitationList, {
        id: 'gallery-citations',
        citations: [
          { id: '1', title: 'The Pragmatic Programmer', url: 'https://example.com/book1', type: 'book' },
          { id: '2', title: 'Clean Code', url: 'https://example.com/book2', type: 'book' },
          { id: '3', title: 'Design Patterns', url: 'https://example.com/book3', type: 'book' },
        ],
        variant: 'stacked',
      }),
  },
  {
    id: 'approval-card',
    title: 'ApprovalCard',
    description: 'Code review request',
    render: () =>
      h(ApprovalCard, {
        id: 'demo-approval-card',
        request: 'Can you review the authentication refactor before we merge?',
        domain: 'github.com',
        metadata: [
          { icon: 'git-branch', label: 'feature/auth-refactor' },
          { icon: 'git-commit', label: '12 commits' },
          { icon: 'clock', label: '+340 lines' },
        ],
        actions: [
          { id: 'decline', label: 'Not now', variant: 'ghost' },
          { id: 'approve', label: 'Review PR', variant: 'default' },
        ],
      }),
  },
  {
    id: 'message-draft',
    title: 'MessageDraft',
    description: 'Email composition',
    render: () =>
      h('div', { class: 'w-full max-w-full min-w-0' }, [
        h(MessageDraft, {
          id: 'demo-message-draft',
          channel: 'email',
          subject: 'Project Update - Q4 Roadmap',
          body: 'Hi team,\n\nI wanted to share the latest updates on our Q4 roadmap...',
          to: ['team@example.com'],
          from: 'sender@example.com',
        }),
      ]),
  },
  {
    id: 'progress-tracker',
    title: 'ProgressTracker',
    description: 'Order status',
    render: () =>
      h('div', { class: 'w-full max-w-full min-w-0' }, [
        h(ProgressTracker, {
          id: 'demo-progress-tracker',
          title: 'Order #12345',
          description: 'Estimated delivery: Jan 30, 2026',
          steps: [
            { id: 'ordered', label: 'Ordered', status: 'completed', timestamp: 'Jan 25, 2:30 PM' },
            { id: 'processed', label: 'Processed', status: 'completed', timestamp: 'Jan 26, 9:15 AM' },
            { id: 'shipped', label: 'Shipped', status: 'in_progress', timestamp: 'Jan 27, 10:00 AM' },
            { id: 'delivered', label: 'Delivered', status: 'pending' },
          ],
        }),
      ]),
  },
  {
    id: 'preferences-panel',
    title: 'PreferencesPanel',
    description: 'Privacy settings',
    render: () =>
      h('div', { class: 'w-full max-w-full min-w-0' }, [
        h(PreferencesPanel, {
          id: 'demo-preferences-panel',
          title: 'Privacy Settings',
          sections: [
            {
              heading: 'Data Collection',
              items: [
                { id: 'analytics', type: 'switch', label: 'Analytics', description: 'Help us improve by sharing usage data' },
                { id: 'cookies', type: 'switch', label: 'Cookies', description: 'Allow third-party cookies' },
              ],
            },
            {
              heading: 'Notifications',
              items: [
                { id: 'email', type: 'toggle', label: 'Email notifications', options: [{ value: 'all', label: 'All' }, { value: 'important', label: 'Important' }, { value: 'none', label: 'None' }] },
              ],
            },
          ],
        }),
      ]),
  },
  {
    id: 'x-post',
    title: 'XPost',
    description: 'Social post',
    render: () =>
      h(XPost, {
        id: 'demo-x-post',
        post: {
          id: 'demo-x-post',
          author: { name: 'Jane Developer', handle: '@janedev', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', verified: true },
          text: 'Just shipped a major update to our design system! 🎉\n\nNew components:\n• DataTable with sorting\n• Chart with multiple types\n• GeoMap with clustering\n\nCheck it out →',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          stats: { likes: 156, isLiked: false },
        },
      }),
  },
  {
    id: 'instagram-post',
    title: 'InstagramPost',
    description: 'Photo post',
    render: () =>
      h(InstagramPost, {
        id: 'demo-instagram-post',
        post: {
          id: 'demo-instagram-post',
          author: { name: 'Mountain Photographer', handle: 'photographer', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', verified: true },
          text: 'Golden hour in the mountains 🏔️✨',
          media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop', alt: 'Mountain view' }],
          stats: { likes: 2341, isLiked: false },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      }),
  },
  {
    id: 'linkedin-post',
    title: 'LinkedInPost',
    description: 'Professional update',
    render: () =>
      h(LinkedInPost, {
        id: 'demo-linkedin-post',
        post: {
          id: 'demo-linkedin-post',
          author: { name: 'Alex Chen', handle: 'alexchen', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', headline: 'Senior Engineer at TechCorp' },
          text: "Excited to share that I've just completed my certification in cloud architecture! 🎓\n\nAfter 6 months of study and hands-on projects, I'm now AWS Solutions Architect certified.\n\nLooking forward to applying these skills to build more scalable and resilient systems.",
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          stats: { likes: 89, isLiked: false },
        },
      }),
  },
];

// Stack rank order (same as React gallery)
const stackRankOrder = [
  'option-list',
  'question-flow',
  'weather-widget',
  'plan',
  'parameter-slider',
  'item-carousel',
  'code-diff',
  'data-table',
  'stats-display',
  'geo-map',
  'image-gallery',
  'code-block',
  'audio',
  'terminal',
  'chart',
  'link-preview',
  'citation',
  'approval-card',
  'message-draft',
  'progress-tracker',
  'preferences-panel',
  'x-post',
  'instagram-post',
  'linkedin-post',
];

const stackRankById = new Map(stackRankOrder.map((id, rank) => [id, rank]));

const rankedGalleryCards = galleryCards
  .map((card, originalIndex) => ({ card, originalIndex }))
  .sort((a, b) => {
    const aRank = stackRankById.get(a.card.id) ?? Number.POSITIVE_INFINITY;
    const bRank = stackRankById.get(b.card.id) ?? Number.POSITIVE_INFINITY;
    if (aRank !== bRank) return aRank - bRank;
    return a.originalIndex - b.originalIndex;
  })
  .map(({ card }) => card);

// Split into columns for desktop
const [leftColumnCards, rightColumnCards] = rankedGalleryCards.reduce<[ComponentCard[], ComponentCard[]]>(
  (columns, card, index) => {
    columns[index % 2].push(card);
    return columns;
  },
  [[], []]
);
</script>

<template>
  <main :class="GALLERY_LAYOUT_CLASS" aria-label="Tool UI component gallery">
    <h1 class="sr-only">Tool UI Component Gallery</h1>

    <!-- Mobile: Single column -->
    <div :class="GALLERY_MOBILE_STACK_CLASS">
      <gallery-card
        v-for="card in rankedGalleryCards"
        :key="card.id"
        :card="card"
        class="mb-5 flex break-inside-avoid justify-center"
      />
    </div>

    <!-- Desktop: Two columns -->
    <div :class="GALLERY_DESKTOP_GRID_CLASS">
      <div class="flex flex-col gap-0">
        <gallery-card
          v-for="card in leftColumnCards"
          :key="card.id"
          :card="card"
          class="mb-5 flex break-inside-avoid justify-center"
        />
      </div>
      <div class="flex flex-col gap-0">
        <gallery-card
          v-for="card in rightColumnCards"
          :key="card.id"
          :card="card"
          class="mb-5 flex break-inside-avoid justify-center"
        />
      </div>
    </div>

    <!-- Toast notifications -->
    <div class="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="cn(
          'rounded-lg px-4 py-2 text-sm shadow-lg transition-all',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        )"
      >
        {{ toast.message }}
      </div>
    </div>
  </main>
</template>
