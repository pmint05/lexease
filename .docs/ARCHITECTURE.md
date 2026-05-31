# LexEase Architecture & Coding Standards

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Active (Foundation Phase)

This document is the **single source of truth** for all architectural decisions, code conventions, and patterns used in the LexEase project. All team members must adhere to these standards.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Folder Structure](#folder-structure)
3. [Clean Architecture Principles](#clean-architecture-principles)
4. [State Management Rules](#state-management-rules)
5. [Accessibility & UI Standards](#accessibility--ui-standards)
6. [Code Conventions & TypeScript](#code-conventions--typescript)
7. [Audio Sync Logic Pattern](#audio-sync-logic-pattern)
8. [Common Patterns & Anti-Patterns](#common-patterns--anti-patterns)
9. [Testing & Performance](#testing--performance)

---

## Tech Stack Overview

### Core Framework & Routing

- **Expo 54+**: Managed React Native for iOS/Android/Web
- **Expo Router 6.0+**: File-based routing (App Router pattern similar to Next.js)
- **React Native 0.81+**: Cross-platform UI framework
- **TypeScript 5.9+**: Strict type safety

### UI & Styling

- **Tamagui 2.0.0-rc.41+**: Component library + design system (replaces bare StyleSheet)
  - All UI MUST use Tamagui components (`XStack`, `YStack`, `Button`, `Input`, `Card`, etc.)
  - Bare React Native `<View>`, `<Text>` are **prohibited** in production code
  - Tamagui provides design tokens, themes, responsive styles, and animations via `moti`

### State Management

- **Zustand 5.0+**: Lightweight store for global UI state (user role, auth, session config, UI customizer settings)
- **React Query 5.100+**: Server state management (dashboard analytics, book library, user progress metrics)
  - Paired with Axios for HTTP requests
  - Handles caching, invalidation, and background fetching

### Data Layer & Storage

- **Axios 1.15+**: HTTP client with interceptors for auth and error handling
- **Expo SQLite 16.0+**: Local relational database for offline books, reading progress, annotations
- **Expo Secure Store 15.0+**: Encrypted local storage for auth tokens, sensitive user preferences
- **Async Storage 3.0+**: Non-critical user preferences (UI customizer settings via Zustand persist)

### Animations & Interactivity

- **Moti 0.30+**: Spring-based animations with Reanimated 4 under the hood
- **React Native Reanimated 4.1+**: GPU-accelerated animations for karaoke spotlight and scroll effects
- **React Native Gesture Handler 2.28+**: Touch/gesture recognition (swipe to advance books, pinch to zoom text)

### Accessibility & Media

- **Expo Speech 14.0+**: Text-to-speech (Turtle/Hare speed modes)
- **Expo AV 16.0+**: Audio playback and recording (voice recordings, TTS audio sync)
- **Expo Font 14.0+**: Font loading for OpenDyslexic, Lexend
- **Lucide React Native 1.11+**: Icon library (accessible, scalable SVG icons)

### Analytics & Charts

- **Victory Native 41.20+**: Charts for guardian dashboard analytics (reading streak, comprehension, time on task)

### Additional Libraries

- **React 19.1+**: Latest React with concurrent rendering support
- **React DOM 19.1+**: For web platform support
- **React Native Web 0.21+**: Allows Expo app to run on web
- **React Native SVG 15.12+**: SVG support for custom illustrations

---

## Folder Structure

### Overview

```
LexEase/
├── .docs/                    # Documentation (architecture, plans, style guides)
├── .expo/                    # Expo build metadata (gitignored)
├── .git/                     # Git version control
├── .vscode/                  # VS Code settings (optional, for team consistency)
├── app/                      # Expo Router routing layer (file-based routes)
│   ├── _layout.tsx           # Root layout (providers wrapper)
│   ├── index.tsx             # Entry point (redirect logic)
│   ├── (auth)/               # Auth routes group
│   ├── (child)/              # Child routes group (bottom-tabs + full-screen reading)
│   └── (guardian)/           # Guardian routes group (bottom-tabs dashboard)
├── src/                      # Clean architecture layers
│   ├── core/                 # Domain layer (types, constants, business entities)
│   ├── data/                 # Data layer (API clients, local storage, adapters)
│   ├── store/                # State layer (Zustand stores)
│   ├── components/           # Presentation layer (UI components, organized by domain)
│   ├── hooks/                # Custom React hooks (business logic, React Query wrappers)
│   ├── utils/                # Utility functions, helpers, formatters, validators
│   └── assets/               # Fonts, images, static media
├── assets/                   # Expo-managed assets (icons, splash screens)
├── components/               # (Legacy, deprecated) Move to src/components/
├── constants/                # (Legacy, deprecated) Move to src/core/constants/
├── hooks/                    # (Legacy, deprecated) Move to src/hooks/
├── scripts/                  # Build and utility scripts
├── app.json                  # Expo configuration
├── eslint.config.js          # ESLint configuration (strict)
├── expo-env.d.ts             # Expo type definitions
├── package.json              # Dependencies
├── README.md                 # Project overview
└── tsconfig.json             # TypeScript configuration (strict mode enabled)
```

### Folder Purposes

#### `app/` — Routing & Screen Layer

- **File-based routing** using Expo Router (similar to Next.js)
- Routes are **screen components** that consume data and state via hooks
- **MUST NOT** contain business logic, API calls, or complex state management
- **Layout files** (`_layout.tsx`) define navigation structure (tabs, stacks, modals)
- **Route groups** use parentheses: `(auth)`, `(child)`, `(guardian)` — these are logical groupings, not URL segments
- Screen files should be thin wrappers that compose components from `src/components/`

**Route Structure:**

```
app/
├── _layout.tsx               # Root layout with TamagiProvider, QueryClientProvider, Zustand hydration + Auth Guard
├── index.tsx                 # Entry point (Placeholder, redirection handled by guard)
├── (auth)/
│   ├── _layout.tsx           # Auth stack layout
│   ├── login.tsx             # Email/password login
│   ├── register.tsx          # Account creation + role selection
│   └── forgot-password.tsx   # Password recovery request
├── (child)/
│   ├── _layout.tsx           # Child bottom-tabs: [Library, Reading, History]
│   ├── (tabs)/
│   │   ├── library.tsx       # Book library & book picker
│   │   ├── history.tsx       # Audio vault / recording history
│   │   └── index.tsx         # (Alias for library, optional)
│   └── reading/[id].tsx      # Dynamic full-screen reading space (hides tabs)
└── (guardian)/
    ├── _layout.tsx           # Guardian bottom-tabs: [Dashboard, Config, Scheduler]
    ├── (tabs)/
    │   ├── dashboard.tsx     # Progress analytics with Victory charts
    │   ├── config.tsx        # Visual customizer (Dyslexia UI settings)
    │   ├── scheduler.tsx     # Practice scheduler
    │   └── index.tsx         # (Alias for dashboard, optional)
```

#### `src/core/` — Domain Layer

- **Types & Interfaces**: Domain entities (Book, ReadingSession, User, ProgressMetric, etc.)
- **Constants**: App-wide constants (API base URLs, feature flags, default config values)
- **Business Rules**: Pure logic functions that don't depend on React or I/O (e.g., karaoke index calculation)

```
src/core/
├── types/
│   ├── index.ts              # Barrel export of all types
│   ├── user.ts               # User, Guardian, Child types
│   ├── reading.ts            # Book, ReadingSession, ProgressMetric types
│   └── ...
├── constants/
│   ├── index.ts              # Barrel export
│   ├── config.ts             # API endpoints, timeouts, feature flags
│   ├── colors.ts             # Dyslexia-friendly color palette (design tokens)
│   └── ...
```

#### `src/data/` — Data Layer

- **API Client**: Axios instance with interceptors (auth, error handling, retries)
- **Local Storage Adapters**: SQLite helpers, SecureStore wrappers, data migration functions
- **Query Functions**: Data fetching logic (can be wrapped by React Query hooks)

```
src/data/
├── api/
│   ├── apiClient.ts          # Axios instance, interceptors, request/response helpers
│   ├── bookApi.ts            # Book-related endpoints (list, get, search)
│   ├── progressApi.ts        # Progress & analytics endpoints
│   └── ...
├── local/
│   ├── sqliteDb.ts           # SQLite setup and migrations
│   ├── secureStore.ts        # Auth token, sensitive data storage
│   └── ...
```

#### `src/store/` — State Layer (Zustand)

- **Global UI State**: User role, auth status, current session config
- **Session Config**: Karaoke playback state (currentIndex, speed, isPlaying)
- **Customizer Settings**: Dyslexia UI settings (font size, colors, spacing, persisted to device)
- **Derived State**: Selectors for optimized re-renders

**Store Files:**

- `useAuthStore.ts` — User role (child/guardian), auth token, logged-in user profile
- `useReadingStore.ts` — Karaoke playback state (currentIndex, speed, audioState)
- `useConfigStore.ts` — Dyslexia UI customizer settings (persisted via Zustand middleware)

```
src/store/
├── useAuthStore.ts           # Zustand: auth state + actions
├── useReadingStore.ts        # Zustand: reading session state + actions
├── useConfigStore.ts         # Zustand: persisted UI customizer state + actions
```

#### `src/components/` — Presentation Layer (Tamagui)

- **Shared Components**: Generic, reusable UI (Button, Input, Card, Modal, etc.)
- **Child Components**: Child-facing specific UIs (KaraokeTile, RecordButton, WordHighlighter, etc.)
- **Guardian Components**: Guardian-facing specific UIs (AnalyticsChart, ConfigSlider, SchedulerCard, etc.)
- **MUST use Tamagui** for all styling (no inline styles, no bare React Native `StyleSheet`)
- **MUST be dumb/presentational**: Accept props, no direct API calls, no Zustand stores (consume via hooks)
- **MUST export named exports** for all components

```
src/components/
├── shared/
│   ├── Button.tsx            # Tamagui Button wrapper with a11y defaults
│   ├── Input.tsx             # Tamagui Input wrapper
│   ├── Card.tsx              # Reusable card component
│   ├── Modal.tsx             # Modal wrapper
│   └── ...
├── child/
│   ├── KaraokeTile.tsx       # Word/phrase tile with highlight effect
│   ├── RecordButton.tsx      # Audio recording trigger button
│   ├── TtsSpeedControl.tsx   # Turtle/Hare speed picker
│   └── ...
├── guardian/
│   ├── AnalyticsChart.tsx    # Victory chart wrapper
│   ├── ConfigSlider.tsx      # Dyslexia setting slider
│   ├── SchedulerCard.tsx     # Practice schedule card
│   └── ...
```

#### `src/hooks/` — Custom React Hooks

- **Business Logic Hooks**: `useAudioSync`, `useKaraokeIndex`, `useReadingProgress`, etc.
- **React Query Wrappers**: `useBooksQuery`, `useAnalyticsQuery`, etc. (server state)
- **Effect Hooks**: `usePermissions`, `useOfflineMode`, etc.
- **MUST have explicit return types**
- **MUST NOT contain JSX**

```
src/hooks/
├── useAudioSync.ts           # TTS audio playback sync with text index
├── useKaraokeIndex.ts        # Karaoke word/phrase index calculation
├── useBooksQuery.ts          # React Query wrapper for book library
├── useAnalyticsQuery.ts      # React Query wrapper for dashboard analytics
├── usePermissions.ts         # Audio recording permissions
├── ...
```

#### `src/utils/` — Utility Functions

- Helper functions, formatters, validators (pure functions)
- NO side effects, NO React hooks, NO API calls
- Examples: `formatReadingTime()`, `validateEmail()`, `calculateReadingSpeed()`, `highlightWords()`

```
src/utils/
├── formatters.ts             # Date, time, number formatting
├── validators.ts             # Email, password, content validation
├── textProcessing.ts         # Text split, word boundary, karaoke index calculation
├── storage.ts                # SecureStore and SQLite helpers
├── ...
```

#### `src/assets/` — Fonts & Images

- **Fonts**: OpenDyslexic (primary for children), Lexend (accessible fallback)
- **Images**: Illustrations, avatars, custom icons (if not using Lucide)

```
src/assets/
├── fonts/
│   ├── OpenDyslexic-Regular.ttf
│   ├── OpenDyslexic-Bold.ttf
│   ├── Lexend-Regular.ttf
│   └── ...
├── images/
│   ├── illustrations/
│   └── avatars/
```

---

## Clean Architecture Principles

### Rule 1: No Direct API Calls in UI Components

❌ **PROHIBITED:**

```typescript
// app/(child)/(tabs)/library.tsx — WRONG
export function LibraryScreen() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // ❌ Direct API call in component
    axios.get('/api/books').then(res => setBooks(res.data));
  }, []);

  return <YStack>{/* ... */}</YStack>;
}
```

✅ **CORRECT:**

```typescript
// src/hooks/useBooksQuery.ts
export const useBooksQuery = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => booksApi.getBooks(),
  });
};

// app/(child)/(tabs)/library.tsx
export function LibraryScreen() {
  const { data: books } = useBooksQuery();
  return <YStack>{/* ... */}</YStack>;
}
```

### Rule 2: Business Logic Lives in Hooks or Stores, NOT in Components

❌ **PROHIBITED:**

```typescript
// WRONG: State & logic mixed in component
export function ReadingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioPos, setAudioPos] = useState(0);

  useEffect(() => {
    // ❌ Complex sync logic in component
    if (audioPos >= wordTimestamps[currentIndex]) {
      setCurrentIndex(i => i + 1);
    }
  }, [audioPos, wordTimestamps]);

  return <YStack>{/* ... */}</YStack>;
}
```

✅ **CORRECT:**

```typescript
// src/hooks/useAudioSync.ts
export const useAudioSync = (wordTimestamps: number[]) => {
  const { currentIndex, setIndex } = useReadingStore();
  const [audioPos, setAudioPos] = useState(0);

  useEffect(() => {
    // Complex sync logic in custom hook
    if (audioPos >= wordTimestamps[currentIndex]) {
      setIndex(i => i + 1);
    }
  }, [audioPos, wordTimestamps, currentIndex, setIndex]);

  return { currentIndex, audioPos, setAudioPos };
};

// app/(child)/reading/[id].tsx
export function ReadingScreen() {
  const { currentIndex, audioPos } = useAudioSync(wordTimestamps);
  return <YStack>{/* ... */}</YStack>;
}
```

### Rule 3: Unidirectional Data Flow

- **Data Flow**: Stores/Hooks → Components (props only)
- **State Updates**: Components dispatch actions to stores/hooks
- **No circular dependencies**: Never import `app/` files from `src/` (only opposite direction)

```
app/ (routing/screens)
  ↓ consumes hooks/stores
src/hooks/ (custom logic)
  ↓ consumes
src/store/ (state)
  ↓ consumes
src/data/ (API layer)
  ↓ consumes
src/core/ (types, constants)
```

### Rule 4: Typed at All Levels

- **Function returns**: All functions and hooks must have explicit return types
- **Props interfaces**: All components must have Props interfaces
- **Store state**: All Zustand stores must have State/Actions interfaces
- **API responses**: All API calls must have typed response interfaces

```typescript
// ✅ CORRECT: Explicit types everywhere
interface BookProps {
  book: Book;
  onSelect: (id: string) => void;
}

export const BookTile: React.FC<BookProps> = ({ book, onSelect }) => {
  return <Pressable onPress={() => onSelect(book.id)}>
    {/* ... */}
  </Pressable>;
};
```

---

## State Management Rules

### Zustand Stores (Global UI State)

**When to Use Zustand:**

- User role (child/guardian)
- Auth state (logged in, token, user profile)
- Reading session config (current book, current speed, playback index)
- Dyslexia UI customizer settings (font size, colors, spacing) — persisted to device
- UI overlays (modal open/close state)

**Pattern:**

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReadingStoreState {
  currentIndex: number;
  speed: "turtle" | "hare";
  isPlaying: boolean;
  setIndex: (index: number) => void;
  setSpeed: (speed: "turtle" | "hare") => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useReadingStore = create<ReadingStoreState>((set) => ({
  currentIndex: 0,
  speed: "hare",
  isPlaying: false,
  setIndex: (index) => set({ currentIndex: index }),
  setSpeed: (speed) => set({ speed }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));

// For persisted stores (UI customizer):
export const useConfigStore = create<ConfigStoreState>(
  persist(
    (set) => ({
      fontSize: 16,
      backgroundColor: "#FFF8F0",
      setFontSize: (size) => set({ fontSize: size }),
      // ...
    }),
    {
      name: "lexease-config",
      storage: createSecureStorage(), // or AsyncStorage
    },
  ),
);
```

### React Query (Server State)

**When to Use React Query:**

- Book library data (list, search, get by ID)
- Dashboard analytics (reading time, comprehension, progress)
- User progress metrics
- Any remote data that can be cached, invalidated, and refetched

**Pattern:**

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { booksApi } from "@/src/data/api/bookApi";

export const useBooksQuery = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => booksApi.getBooks(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateProgressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProgressRequest) =>
      progressApi.updateProgress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};
```

### Decision Matrix

| State Type                             | Zustand | React Query |
| -------------------------------------- | ------- | ----------- |
| User role (child/guardian)             | ✅      | ❌          |
| Auth token & logged-in user            | ✅      | ❌          |
| Current reading session (index, speed) | ✅      | ❌          |
| UI customizer settings (persisted)     | ✅      | ❌          |
| Book library list                      | ❌      | ✅          |
| Dashboard analytics                    | ❌      | ✅          |
| User progress metrics                  | ❌      | ✅          |
| Modal/overlay open state               | ✅      | ❌          |
| Form input state (non-persisted)       | ✅      | ❌          |

---

## Accessibility & UI Standards

### Tamagui Usage (REQUIRED)

**All UI MUST use Tamagui. NO exceptions.**

✅ **CORRECT:**

```typescript
import { YStack, XStack, Button, Input, Text } from 'tamagui';

export function LoginScreen() {
  return (
    <YStack padding="$4" backgroundColor="$colorTokenName">
      <Input
        placeholder="Email"
        size="$4"
        accessibilityLabel="Email input field"
      />
      <Button>Login</Button>
    </YStack>
  );
}
```

❌ **PROHIBITED:**

```typescript
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  /* ... */
});
// ❌ No bare React Native View, Text, TouchableOpacity, or StyleSheet
```

### Color Palette (Dyslexia-Friendly)

- **Background**: Warm, soft pastels (avoid pure white #FFFFFF)
  - Primary: `#FFF8F0` (warm cream)
  - Secondary: `#F0F8FF` (alice blue)
  - Safe: Tamagui's built-in tokens (`$background`, `$backgroundColor`)
- **Text**: High contrast, avoid pure black (#000000)
  - Primary: `#2C2C2C` (dark gray, 95% black)
  - Readable: Lucide icons with `size="$5"` minimum
- **Interactive**: Bright, saturated colors with clear focus states
  - Primary action: `#4CAF50` (green)
  - Secondary: `#2196F3` (blue)
  - Alert: `#FF5252` (red)

**Pattern:**

```typescript
import { YStack, Button } from 'tamagui';

export function Component() {
  return (
    <YStack
      backgroundColor="$colorCream"
      // ❌ NOT #FFFFFF (pure white)
      padding="$4"
    >
      <Button backgroundColor="$green" color="$textDark">
        Click Me
      </Button>
    </YStack>
  );
}
```

### Typography & Fonts

- **Primary Font**: OpenDyslexic (children screens)
  - Increased letter spacing, slightly wider letterforms designed for dyslexics
- **Fallback Font**: Lexend (fallback, also dyslexia-friendly)
- **Load via Expo Font** in root layout

**Pattern:**

```typescript
// src/core/constants/fonts.ts
export const FONT_FAMILIES = {
  opendyslexic: 'OpenDyslexic',
  lexend: 'Lexend',
};

// app/_layout.tsx
import * as Font from 'expo-font';

useEffect(() => {
  Font.loadAsync({
    OpenDyslexic: require('@/src/assets/fonts/OpenDyslexic-Regular.ttf'),
    Lexend: require('@/src/assets/fonts/Lexend-Regular.ttf'),
  });
}, []);

// src/components/shared/ThemedText.tsx
export function ThemedText(props: TextProps) {
  return (
    <Text {...props} fontFamily="$opendyslexic" />
    // or use Tamagui <Text> with fontFamily prop
  );
}
```

### Touch Targets (WCAG 2.1 AA)

- **Minimum Size**: 48dp × 48dp (recommended), 44dp minimum for fingertip interaction
- **Spacing**: 8dp minimum between interactive elements
- **Hit Area**: Use Tamagui's `padding` and `size` props

**Pattern:**

```typescript
import { Button, YStack } from 'tamagui';

export function ControlPanel() {
  return (
    <YStack gap="$3" padding="$4">
      {/* ✅ 48dp button via size prop */}
      <Button size="$5">Record</Button>
      {/* ✅ 44dp with padding for hit area */}
      <Button size="$4" padding="$3">
        Play
      </Button>
    </YStack>
  );
}
```

### Accessibility Attributes (WCAG 2.1 A)

- **accessibilityRole**: Semantic role (button, tab, image, list, etc.)
- **accessibilityLabel**: Short description of component
- **accessibilityHint**: Additional context (optional)
- **accessible**: Set to `true` on interactive elements

**Pattern:**

```typescript
import { Pressable, YStack } from 'tamagui';

export function BookTile({ book, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Read "${book.title}" by ${book.author}`}
      accessibilityHint="Double-tap to start reading with Karaoke mode"
    >
      <YStack>{/* content */}</YStack>
    </Pressable>
  );
}
```

---

## Code Conventions & TypeScript

### TypeScript Strictness

- **tsconfig.json** has `"strict": true`
- **All functions/hooks** must have explicit return types
- **All interfaces/types** must be exported as named exports from `src/core/types/`
- **No `any` type** unless absolutely necessary (and documented with comment)

### Component Structure

**Naming:**

- Functional components: `PascalCase` (e.g., `BookTile`, `ReadingScreen`)
- Hooks: `camelCase` with `use` prefix (e.g., `useAudioSync`, `useBooksQuery`)
- Utilities: `camelCase` (e.g., `formatReadingTime`, `validateEmail`)
- Types/Interfaces: `PascalCase` (e.g., `Book`, `ReadingSession`)

**Exports:**

- Components: Named export (not default)
- Hooks: Named export
- Utilities: Named export (can have multiple per file)

```typescript
// ✅ CORRECT

// src/components/child/BookTile.tsx
interface BookTileProps {
  book: Book;
  onPress: (id: string) => void;
}

export const BookTile: React.FC<BookTileProps> = ({ book, onPress }) => {
  return <Pressable onPress={() => onPress(book.id)}>{/* ... */}</Pressable>;
};

// src/hooks/useAudioSync.ts
export const useAudioSync = (wordTimestamps: number[]): UseAudioSyncReturn => {
  // ...
};

// src/utils/formatters.ts
export const formatReadingTime = (ms: number): string => {
  // ...
};
```

### Arrow Functions & Functional Components

```typescript
// ✅ CORRECT: Arrow functions for all components and utilities
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <YStack>{/* ... */}</YStack>;
};

export const myUtility = (arg: string): boolean => {
  return arg.length > 0;
};

// ❌ AVOID: Function declarations
export function MyComponent(props: Props) {
  // ...
}

export function myUtility(arg: string) {
  // ...
}
```

### File Organization

```typescript
// src/components/child/KaraokeTile.tsx

// 1. Imports
import React from 'react';
import { Pressable, YStack, Text } from 'tamagui';
import { Book } from '@/src/core/types/reading';

// 2. Type definitions (Props, interfaces)
interface KaraokeTileProps {
  word: string;
  isHighlighted: boolean;
  onPress?: () => void;
}

// 3. Component
export const KaraokeTile: React.FC<KaraokeTileProps> = ({
  word,
  isHighlighted,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} accessible accessibilityRole="button">
      <YStack
        backgroundColor={isHighlighted ? '$yellow' : '$background'}
        padding="$2"
      >
        <Text>{word}</Text>
      </YStack>
    </Pressable>
  );
};
```

### Import Organization

1. React & React Native
2. Third-party libraries (Tamagui, Zustand, React Query, etc.)
3. Internal types (`@/src/core/types/`)
4. Internal stores (`@/src/store/`)
5. Internal hooks (`@/src/hooks/`)
6. Internal components (`@/src/components/`)
7. Internal utilities (`@/src/utils/`)

```typescript
import React from "react";
import { YStack, Button, Text } from "tamagui";
import { useQuery } from "@tanstack/react-query";

import { Book } from "@/src/core/types/reading";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useBooksQuery } from "@/src/hooks/useBooksQuery";
import { BookTile } from "@/src/components/child/BookTile";
import { formatReadingTime } from "@/src/utils/formatters";
```

---

## Audio Sync Logic Pattern

### Overview

The **Karaoke Spotlight** feature synchronizes text-to-speech (TTS) audio playback with visual highlighting of words. This is implemented via the `useAudioSync` hook.

### Algorithm Pseudocode

```
1. Load audio file and word timestamps array
   - word timestamps: [0, 1200, 2400, 3600, ...] (milliseconds)
   - words array: ["The", "quick", "brown", "fox", ...]

2. Start audio playback
   - useAudioSync receives onAudioPositionUpdate callback from Expo.AV

3. On each audio position update:
   - Current audio position: 1500ms
   - Find index where audioPos >= wordTimestamps[index]
   - Highlight current word and next 1-2 words (visual lookahead)
   - Update store: useReadingStore.setIndex(currentIndex)

4. Reanimated animation (synchronized via shared value):
   - Animate word tile color from background → highlight color
   - Animate word tile scale from 1 → 1.05
   - Animate word tile background from transparent → yellow
   - Duration: interpolate based on next word's timestamp

5. On speed change (Turtle/Hare):
   - Recalculate word timestamps based on playback rate
   - OR: Pause audio, adjust rate, resume
```

### Hook Pattern

```typescript
// src/hooks/useAudioSync.ts
import { useEffect, useState, useRef } from "react";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import { useReadingStore } from "@/src/store/useReadingStore";

interface UseAudioSyncProps {
  wordTimestamps: number[];
  isPlaying: boolean;
  speed: "turtle" | "hare";
}

interface UseAudioSyncReturn {
  currentIndex: number;
  audioPosition: Animated.Reanimated.SharedValue<number>;
  nextWordTimestamp: number;
  highlightProgress: Animated.Reanimated.SharedValue<number>;
}

export const useAudioSync = ({
  wordTimestamps,
  isPlaying,
  speed,
}: UseAudioSyncProps): UseAudioSyncReturn => {
  // Shared values for Reanimated animation
  const audioPosition = useSharedValue(0);
  const highlightProgress = useSharedValue(0);

  // Store state
  const { currentIndex, setIndex } = useReadingStore();

  // On audio position update (called from Expo.AV)
  const handleAudioPositionUpdate = (position: number) => {
    audioPosition.value = position;

    // Find current word index
    const newIndex = wordTimestamps.findIndex(
      (ts, i) =>
        position >= ts && position < (wordTimestamps[i + 1] || Infinity),
    );

    if (newIndex !== currentIndex && newIndex >= 0) {
      runOnJS(setIndex)(newIndex);
    }

    // Calculate highlight progress for animation
    const currentTs = wordTimestamps[newIndex];
    const nextTs = wordTimestamps[newIndex + 1];
    if (nextTs) {
      highlightProgress.value = (position - currentTs) / (nextTs - currentTs);
    }
  };

  useEffect(() => {
    // Subscribe to audio position updates
    // (actual subscription handled in component using Expo.AV)
  }, [isPlaying, speed]);

  return {
    currentIndex,
    audioPosition,
    nextWordTimestamp: wordTimestamps[currentIndex + 1] ?? 0,
    highlightProgress,
  };
};
```

### Integration Pattern (in Screen)

```typescript
// app/(child)/reading/[id].tsx
import { useAudioSync } from '@/src/hooks/useAudioSync';
import { useReadingStore } from '@/src/store/useReadingStore';

export function ReadingScreen() {
  const { currentIndex, speed, setIsPlaying } = useReadingStore();
  const audioRef = useRef(null);

  const { audioPosition, nextWordTimestamp } = useAudioSync({
    wordTimestamps,
    isPlaying: useReadingStore((s) => s.isPlaying),
    speed,
  });

  useEffect(() => {
    if (!audioRef.current) return;

    // Update audio position to useAudioSync hook
    const subscription = Sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isPlaying) {
        handleAudioPositionUpdate(status.positionMillis);
      }
    });

    return () => subscription?.remove();
  }, []);

  return (
    <YStack>
      {words.map((word, idx) => (
        <KaraokeTile
          key={idx}
          word={word}
          isHighlighted={idx === currentIndex}
          // Animation based on audioPosition shared value
        />
      ))}
    </YStack>
  );
}
```

---

## Common Patterns & Anti-Patterns

### ✅ CORRECT: Separation of Concerns

```typescript
// src/hooks/useBooksQuery.ts
export const useBooksQuery = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['books', searchTerm],
    queryFn: () => booksApi.getBooks(searchTerm),
  });
};

// src/components/child/LibraryScreen.tsx
export const LibraryScreen: React.FC = () => {
  const { data: books } = useBooksQuery();
  return <YStack>{/* Display books */}</YStack>;
};
```

### ❌ INCORRECT: API Calls in Components

```typescript
// ❌ DO NOT DO THIS
export function LibraryScreen() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('/api/books').then(res => setBooks(res.data));
  }, []);

  return <YStack>{/* ... */}</YStack>;
}
```

### ✅ CORRECT: Store for Session State

```typescript
// src/store/useReadingStore.ts
export const useReadingStore = create<ReadingState>((set) => ({
  currentIndex: 0,
  speed: 'hare',
  setIndex: (index) => set({ currentIndex: index }),
  setSpeed: (speed) => set({ speed }),
}));

// app/(child)/reading/[id].tsx
export function ReadingScreen() {
  const { currentIndex, speed } = useReadingStore();
  return <YStack>{/* Highlight based on currentIndex */}</YStack>;
}
```

### ✅ CORRECT: Typed Props & Return Types

```typescript
interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false,
}) => {
  return <Pressable>{/* ... */}</Pressable>;
};
```

### ✅ CORRECT: React Query for Async Data

```typescript
const { data, isLoading, error } = useBooksQuery();

if (isLoading) return <Text>Loading...</Text>;
if (error) return <Text>Error: {error.message}</Text>;
if (!data) return <Text>No books found</Text>;

return (
  <YStack>
    {data.map((book) => (
      <BookTile key={book.id} book={book} />
    ))}
  </YStack>
);
```

---

## Testing & Performance

### Unit Testing Pattern

- Use Jest + React Native Testing Library
- Test hooks with `@testing-library/react` hooks API
- Test components with accessible queries (e.g., `getByLabelText`, `getByRole`)
- Mock Zustand stores and React Query

```typescript
// __tests__/hooks/useAudioSync.test.ts
import { renderHook, act } from "@testing-library/react";
import { useAudioSync } from "@/src/hooks/useAudioSync";

describe("useAudioSync", () => {
  it("should update currentIndex when audio position advances", () => {
    const { result } = renderHook(() =>
      useAudioSync({
        wordTimestamps: [0, 1000, 2000],
        isPlaying: true,
        speed: "hare",
      }),
    );

    expect(result.current.currentIndex).toBe(0);
  });
});
```

### Performance Considerations

1. **Memoization**: Use `useMemo` and `useCallback` for expensive computations and callbacks
2. **Reanimated Animations**: Always use shared values and `runOnJS` for state updates
3. **React Query**: Enable caching, stale time, and background refetching
4. **Large Lists**: Use `FlatList` (not `ScrollView` + `map`) for book library, history
5. **Code Splitting**: Use Expo Router's route-based code splitting automatically

---

## Versioning & Updates

- **Architecture Version**: 1.0.0 (April 2026)
- **Last Review**: April 2026
- **Next Review**: End of Phase 2 (after Karaoke Spotlight implementation)
- **Breaking Changes**: Document in this file with date and version bump

---

## References

- [Expo Router Docs](https://expo.dev/router)
- [Tamagui Docs](https://tamagui.dev)
- [Zustand Docs](https://zustand.dev)
- [React Query Docs](https://tanstack.com/query/latest)
- [OpenDyslexic Font](https://opendyslexic.org)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)

---

**Last Updated by:** Staff Engineer  
**Last Updated:** April 28, 2026  
**Next Reviewer:** Team Lead (End of Phase 1)
