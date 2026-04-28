# LexEase Development Roadmap

**Version:** 1.0.0  
**Status:** Foundation Phase (In Progress)  
**Last Updated:** April 28, 2026  
**Total Estimated Duration:** 16-20 weeks (4 phases, ~4-5 weeks per phase)

---

## Table of Contents

1. [Overview & Phases](#overview--phases)
2. [Phase 1: Foundation & Scaffold](#phase-1-foundation--scaffold)
3. [Phase 2: Child's Workspace (Core)](#phase-2-childs-workspace-core)
4. [Phase 3: Guardian's Dashboard & Config](#phase-3-guardians-dashboard--config)
5. [Phase 4: Data Integration & Polish](#phase-4-data-integration--polish)
6. [Success Criteria](#success-criteria)

---

## Overview & Phases

This roadmap outlines a 4-phase development plan for LexEase, prioritizing the **child's core reading experience** (Phase 2) followed by **guardian management tools** (Phase 3). Each phase builds on the foundation while maintaining clean architecture principles and accessibility standards.

### Phase Dependencies

```
Phase 1 (Foundation & Scaffold)
    ├── Folder structure
    ├── Routing setup
    ├── Provider configuration
    └── Auth/Role selection
        ↓
    Phase 2 (Child Core)
    ├── Library screen
    ├── Audio recording & playback
    ├── Text-to-Speech integration
    └── Karaoke Spotlight (audio-text sync)
        ↓
    Phase 3 (Guardian Tools)
    ├── Analytics dashboard
    ├── Visual customizer
    └── Practice scheduler
        ↓
    Phase 4 (Integration & Polish)
    ├── API integration
    ├── Offline mode
    ├── Error handling & edge cases
    └── Performance optimization
```

---

## Phase 1: Foundation & Scaffold

**Duration:** 2-3 weeks  
**Priority:** CRITICAL (blocks all other phases)  
**Owner:** Full-stack engineer + DevOps

### Goals

- ✅ Complete folder structure (clean architecture layers)
- ✅ Expo Router configuration with auth/role-based routing
- ✅ Provider setup (Tamagui, React Query, Zustand, Expo Router)
- ✅ Font loading (OpenDyslexic, Lexend)
- ✅ Basic authentication flow (login, role selection, session management)
- ✅ TypeScript setup + ESLint configuration
- ✅ Documentation (ARCHITECTURE.md, PLAN.md)

### Deliverables

| Task                      | Acceptance Criteria                                                        | Status  |
| ------------------------- | -------------------------------------------------------------------------- | ------- |
| **Folder Structure**      | All directories exist; `.gitkeep` in empty folders; no broken imports      | ✅ WIP  |
| **Routing Layers**        | 3 route groups (`auth`, `child`, `guardian`) with layouts                  | ⏳ TODO |
| **Root Layout Provider**  | Tamagui, React Query, Zustand, Zustand persist middleware initialized      | ⏳ TODO |
| **Auth Flow**             | Login → Role Selection → Child/Guardian dashboard redirect                 | ⏳ TODO |
| **Font Loading**          | OpenDyslexic + Lexend loaded and applied to screens                        | ⏳ TODO |
| **TypeScript Strictness** | All files pass `tsc --noEmit` with strict mode                             | ⏳ TODO |
| **Navigation**            | Bottom-tabs work for child/guardian routes; full-screen reading accessible | ⏳ TODO |
| **Testing**               | Routing works; no console errors; providers hydrate correctly              | ⏳ TODO |

### Implementation Steps

1. **Folder Scaffolding** (1 day)
   - Create `src/` structure with all subdirectories
   - Create `.docs/` with ARCHITECTURE.md and PLAN.md
   - Add `.gitkeep` to empty directories

2. **Root Layout & Providers** (2 days)
   - Create `app/_layout.tsx` with:
     - Tamagui `<TamaguiProvider>` with theme tokens
     - React Query `<QueryClientProvider>`
     - Zustand store hydration (restore from SecureStore/AsyncStorage)
     - Font loading (`useAssets()` hook)
   - Create `app/index.tsx` with redirect logic based on `useAuthStore.role`

3. **Auth Routes** (3 days)
   - Create `app/(auth)/_layout.tsx` as stack navigator
   - Implement `app/(auth)/login.tsx` (email/password, form validation)
   - Implement `app/(auth)/role-selection.tsx` (animated role picker, set store)
   - Zustand `useAuthStore` with persist middleware for token/user

4. **Child Routes Structure** (2 days)
   - Create `app/(child)/_layout.tsx` with bottom-tabs (Library, Reading, History)
   - Create `app/(child)/(tabs)/library.tsx` (placeholder screen)
   - Create `app/(child)/(tabs)/history.tsx` (placeholder screen)
   - Create `app/(child)/reading/[id].tsx` (full-screen, no tabs)

5. **Guardian Routes Structure** (2 days)
   - Create `app/(guardian)/_layout.tsx` with bottom-tabs (Dashboard, Config, Scheduler)
   - Create `app/(guardian)/(tabs)/dashboard.tsx` (placeholder screen)
   - Create `app/(guardian)/(tabs)/config.tsx` (placeholder screen)
   - Create `app/(guardian)/(tabs)/scheduler.tsx` (placeholder screen)

6. **Store Boilerplate** (2 days)
   - Create `useAuthStore.ts` (role, token, user profile, persist)
   - Create `useReadingStore.ts` (currentIndex, speed, isPlaying, audioState)
   - Create `useConfigStore.ts` (font size, colors, spacing, persist)

7. **API Client Setup** (1 day)
   - Create `src/data/api/apiClient.ts` with Axios instance
   - Configure auth interceptor (add token to headers)
   - Configure error interceptor (handle 401, network errors)

8. **Testing & Documentation** (2 days)
   - Run `tsc --noEmit` — fix all type errors
   - Run `npm run lint` — fix all linting issues
   - Manual testing: Navigate through auth → child → guardian routes
   - Document any deviations from ARCHITECTURE.md

### Success Criteria (Phase 1)

- [ ] All folders exist; TypeScript compilation succeeds
- [ ] All stores are created and hydrate correctly from device storage
- [ ] Navigation flow: Login → Role Selection → Child/Guardian Dashboard
- [ ] Fonts load correctly (OpenDyslexic visible on screens)
- [ ] ESLint + TypeScript strict mode: 0 errors
- [ ] All screens are accessible (accessibility roles/labels applied)
- [ ] No console warnings or errors
- [ ] Device storage persists auth state across app restarts

---

## Phase 2: Child's Workspace (Core)

**Duration:** 4-5 weeks  
**Priority:** CRITICAL (core feature)  
**Owner:** Frontend engineer + Audio specialist

### Goals

- ✅ Book library screen (list, search, filter)
- ✅ Audio recording & playback (Expo AV)
- ✅ Text-to-Speech with speed control (Turtle/Hare)
- ✅ **Karaoke Spotlight**: Real-time audio-text sync with word highlighting
- ✅ History/Audio Vault screen (recorded readings)
- ✅ Full-screen reading experience with animations

### Deliverables

| Task                  | Acceptance Criteria                                                                          | Status  |
| --------------------- | -------------------------------------------------------------------------------------------- | ------- |
| **Library Screen**    | Display books; search by title; filter by difficulty; open reading screen                    | ⏳ TODO |
| **Audio Recording**   | Tap to record child's voice; save to device; playback recording                              | ⏳ TODO |
| **TTS Integration**   | Text-to-speech playback; Turtle (0.75x) & Hare (1.5x) speed control                          | ⏳ TODO |
| **Karaoke Spotlight** | Word highlighting synced with TTS audio; smooth transitions; Reanimated animations           | ⏳ TODO |
| **History Screen**    | List of recorded readings; playback with speaker icon; delete recordings                     | ⏳ TODO |
| **Reading Screen**    | Full-screen immersive experience; hide tabs; show highlighted words; controls                | ⏳ TODO |
| **Animations**        | Moti/Reanimated used for smooth highlight transitions; no jank                               | ⏳ TODO |
| **Testing**           | Audio sync never drifts >100ms; touch targets 48dp+; a11y labels on all interactive elements | ⏳ TODO |

### Implementation Steps

1. **Library Screen** (3 days)
   - Fetch books from API (React Query hook `useBooksQuery`)
   - Display as FlatList (grid or list layout)
   - Search bar + difficulty filter
   - Tap book → navigate to `app/(child)/reading/[id]`
   - Component: `src/components/child/BookTile.tsx`

2. **Reading Screen Layout** (3 days)
   - Create full-screen layout (no bottom tabs visible)
   - Display book title, author, reading stats
   - Render words/phrases in a scrollable container
   - Add controls: Play/Pause, Speed toggle, Record button
   - Component: `src/components/child/WordHighlighter.tsx`, `ReadingControls.tsx`

3. **TTS Integration** (4 days)
   - Use Expo Speech for text-to-speech synthesis
   - Implement speed control (Turtle 0.75x, Hare 1.5x)
   - Pause/Resume TTS
   - Generate word timestamps from TTS metadata (or pre-compute from text)
   - Store config in `useReadingStore`
   - Hook: `src/hooks/useTextToSpeech.ts`

4. **Audio Sync Logic** (5 days)
   - Implement `useAudioSync` hook with Reanimated animations
   - Sync word highlighting with TTS playback position
   - Calculate word boundaries + timestamps
   - Update `useReadingStore.currentIndex` as audio progresses
   - Create shared values for Reanimated animations
   - Hook: `src/hooks/useAudioSync.ts`

5. **Karaoke Animations** (4 days)
   - Use Reanimated to animate word tile color/scale as highlight moves
   - Create smooth interpolation: `background → highlight color` over word duration
   - Animate 1-2 words ahead (visual lookahead)
   - Component: `src/components/child/KaraokeTile.tsx` with Reanimated

6. **Audio Recording** (3 days)
   - Use Expo AV to record child's voice during reading
   - Save recording to device (SQLite + local file system)
   - Playback recorded audio with overlay TTS
   - Component: `src/components/child/RecordButton.tsx`
   - Hook: `src/hooks/useAudioRecording.ts`

7. **History Screen** (2 days)
   - Query SQLite for list of recordings
   - Display recordings as list with date, duration, playback button
   - Allow delete with confirmation
   - Component: `src/components/child/RecordingTile.tsx`

8. **Performance Optimization** (2 days)
   - Profile animations with React Native Debugger
   - Ensure audio sync never drifts >100ms
   - Optimize FlatList rendering for large book lists
   - Memoize components (`React.memo`)

### Success Criteria (Phase 2)

- [ ] TTS audio playback works at 0.75x and 1.5x speeds
- [ ] Word highlighting stays in sync with audio (±100ms tolerance)
- [ ] Animations are smooth (60fps, no jank)
- [ ] Tap 48dp+ buttons; all interactive elements have a11y labels
- [ ] Recording saves successfully; playback works
- [ ] History screen displays all past recordings
- [ ] No console errors related to audio or animations
- [ ] Reading experience is immersive and accessible

---

## Phase 3: Guardian's Dashboard & Config

**Duration:** 3-4 weeks  
**Priority:** HIGH (enables parent oversight)  
**Owner:** Frontend engineer + Designer

### Goals

- ✅ Analytics dashboard (reading time, comprehension, progress)
- ✅ Visual customizer (Dyslexia-friendly UI settings with live preview)
- ✅ Practice scheduler (set reading goals, practice reminders)
- ✅ Settings management (save to device storage, sync with backend)

### Deliverables

| Task                    | Acceptance Criteria                                                       | Status  |
| ----------------------- | ------------------------------------------------------------------------- | ------- |
| **Analytics Dashboard** | Display reading time, comprehension score, reading streak, progress graph | ⏳ TODO |
| **Charts & Graphs**     | Victory Native charts; time-series data; legend and labels                | ⏳ TODO |
| **Visual Customizer**   | Sliders for font size, line spacing, letter spacing, background color     | ⏳ TODO |
| **Live Preview**        | Real-time preview of customizations applied to child's reading screen     | ⏳ TODO |
| **Persistent Settings** | Customizer settings saved to device; sync across app sessions             | ⏳ TODO |
| **Scheduler**           | Create/edit practice schedules (e.g., "30 min reading, 3x/week")          | ⏳ TODO |
| **Notifications**       | Push notifications for practice reminders (optional Phase 4 integration)  | ⏳ TODO |

### Implementation Steps

1. **Dashboard Screen Layout** (2 days)
   - Create `app/(guardian)/(tabs)/dashboard.tsx`
   - Display cards for: Total Reading Time, Comprehension Score, Reading Streak, Words Read
   - Component: `src/components/guardian/StatCard.tsx`, `DashboardGrid.tsx`

2. **Analytics Data & Queries** (3 days)
   - Create React Query hook `useAnalyticsQuery` to fetch guardian dashboard data
   - Data: reading time, comprehension, progress metrics
   - API endpoint: `GET /api/guardian/analytics`
   - Hook: `src/hooks/useAnalyticsQuery.ts`

3. **Charts Integration** (3 days)
   - Integrate Victory Native for line charts (reading time over time)
   - Implement bar charts (daily reading time)
   - Pie charts (reading by difficulty)
   - Component: `src/components/guardian/AnalyticsChart.tsx`

4. **Visual Customizer Screen** (4 days)
   - Create `app/(guardian)/(tabs)/config.tsx`
   - Sliders for:
     - Font size (12-24pt)
     - Background color (palette of 5-6 Dyslexia-friendly colors)
     - Letter spacing (normal, 1.5x, 2x)
     - Line spacing (normal, 1.5x, 2x)
   - Live preview of text changes
   - Components: `src/components/guardian/ConfigSlider.tsx`, `PreviewPanel.tsx`

5. **Config Store & Persistence** (2 days)
   - Create/update `useConfigStore` with all customizer settings
   - Add Zustand `persist` middleware to save to AsyncStorage
   - Sync settings to backend (optional Phase 4)
   - Store: `src/store/useConfigStore.ts`

6. **Scheduler Screen** (3 days)
   - Create `app/(guardian)/(tabs)/scheduler.tsx`
   - Display practice schedule (calendar view or week view)
   - Add/edit schedule: Set days, time, duration
   - Component: `src/components/guardian/SchedulerCard.tsx`, `ScheduleModal.tsx`

7. **Notifications Setup** (2 days, optional Phase 4 carry-over)
   - Integrate `expo-notifications` for practice reminders
   - Schedule local notifications based on scheduler
   - Hook: `src/hooks/useScheduleNotifications.ts`

### Success Criteria (Phase 3)

- [ ] Dashboard loads and displays analytics data correctly
- [ ] Charts render without errors; legend and labels visible
- [ ] Customizer sliders update live preview in real-time
- [ ] Settings persist across app restarts
- [ ] Scheduler allows creating and editing practice schedules
- [ ] No console errors; all interactive elements have a11y labels
- [ ] Customizer settings apply to child's reading screen immediately
- [ ] Guardian experience is intuitive and polished

---

## Phase 4: Data Integration & Polish

**Duration:** 3-4 weeks  
**Priority:** HIGH (production readiness)  
**Owner:** Full-stack engineer + QA

### Goals

- ✅ Complete API integration (books, progress, analytics)
- ✅ Offline mode (cache data locally, sync when online)
- ✅ Error handling & edge cases (network failures, permissions, storage limits)
- ✅ Performance profiling & optimization
- ✅ Bug fixes & QA testing
- ✅ App store submission preparation

### Deliverables

| Task                   | Acceptance Criteria                                                      | Status  |
| ---------------------- | ------------------------------------------------------------------------ | ------- |
| **API Integration**    | All endpoints implemented; React Query properly caches and invalidates   | ⏳ TODO |
| **Offline Mode**       | App works without network; cached data displayed; sync queue when online | ⏳ TODO |
| **Error Handling**     | Network errors caught; user-friendly messages; retry logic               | ⏳ TODO |
| **Permissions**        | Audio recording permission prompt; proper handling of denials            | ⏳ TODO |
| **Storage Management** | SQLite/file limits handled gracefully; old data archived or deleted      | ⏳ TODO |
| **Performance**        | App cold-start <3s; navigation transitions <500ms; animations 60fps      | ⏳ TODO |
| **Testing**            | E2E tests for critical flows; unit tests for hooks; integration tests    | ⏳ TODO |
| **Documentation**      | README updated; API docs; deployment guide; troubleshooting guide        | ⏳ TODO |

### Implementation Steps

1. **API Client Completion** (3 days)
   - Implement all API endpoints in `src/data/api/`:
     - `bookApi.ts` — Get books, search, get by ID
     - `progressApi.ts` — Log reading session, update comprehension
     - `analyticsApi.ts` — Get analytics data
     - `authApi.ts` — Login, logout, refresh token
   - Error handling with user-friendly messages

2. **React Query Integration** (3 days)
   - Create hooks for all data fetching:
     - `useBooksQuery`, `useAnalyticsQuery`, `useProgressQuery`
   - Set staleTime, cacheTime, and refetch policies
   - Implement mutations: `useUpdateProgressMutation`, `useCreateReadingSessionMutation`
   - Hooks: `src/hooks/useApi*`

3. **Offline Mode** (4 days)
   - Use SQLite to cache books, progress, analytics locally
   - Implement sync queue (store failed mutations; retry when online)
   - React Query `useNetworkStatus` hook to detect connectivity
   - Hooks: `src/hooks/useOfflineMode.ts`, `useSyncQueue.ts`

4. **Error Handling & Edge Cases** (3 days)
   - Network error boundary component
   - Permission errors for audio recording
   - Storage quota warnings
   - Graceful degradation (show cached data if API fails)
   - Components: `src/components/shared/ErrorBoundary.tsx`

5. **Performance Profiling** (3 days)
   - Use React Native Debugger / Flipper to profile:
     - App startup time
     - Navigation transition times
     - Animation frame rates
   - Optimize large list rendering (FlatList window size)
   - Code-split routes with Expo Router

6. **Testing Suite** (4 days)
   - Unit tests for hooks (`useAudioSync`, `useBooksQuery`, etc.)
   - Integration tests for stores (Zustand)
   - E2E tests for critical flows (login → read → record → save)
   - Test framework: Jest + React Native Testing Library

7. **QA & Bug Fixes** (3 days)
   - Device testing (iOS, Android, web)
   - Accessibility audit with screen reader
   - Edge cases: Low battery, low memory, poor network
   - Bug triage and fixes

8. **Documentation & Deployment** (2 days)
   - Update README with setup instructions
   - API documentation (Swagger/OpenAPI if applicable)
   - Deployment guide (EAS Build, TestFlight, Google Play)
   - Troubleshooting guide for common issues

### Success Criteria (Phase 4)

- [ ] All API endpoints functional and tested
- [ ] App works offline; syncs when online
- [ ] Network errors handled gracefully with user-friendly messages
- [ ] Audio permission prompt shown; denied state handled
- [ ] Cold startup <3 seconds; navigation transitions smooth
- [ ] All tests passing (unit, integration, E2E)
- [ ] Accessibility audit: WCAG 2.1 AA compliant
- [ ] No console errors or warnings in production build
- [ ] App ready for App Store / Google Play submission

---

## Success Criteria

### Phase 1 (Foundation)

- ✅ All folders, files, and boilerplate code created
- ✅ TypeScript: `tsc --noEmit` with 0 errors
- ✅ ESLint: `npm run lint` with 0 errors
- ✅ Routing: Auth → Child/Guardian flows work
- ✅ Accessibility: All interactive elements have roles and labels

### Phase 2 (Child Core)

- ✅ TTS audio playback works at multiple speeds
- ✅ Audio-text sync: ±100ms drift tolerance
- ✅ Animations: 60fps, no jank
- ✅ Audio recording: Save and playback working
- ✅ History: Display all recordings
- ✅ Touch targets: 48dp+ for all buttons
- ✅ Accessibility: Screen reader works on all screens

### Phase 3 (Guardian)

- ✅ Analytics dashboard displays data correctly
- ✅ Charts render and update without errors
- ✅ Customizer settings persist and apply in real-time
- ✅ Scheduler creates and manages schedules
- ✅ All interactive elements accessible

### Phase 4 (Integration & Polish)

- ✅ API fully integrated; all data flows working
- ✅ Offline mode: App works without network
- ✅ Error handling: Network errors caught; user-friendly messages
- ✅ Performance: <3s cold start; <500ms transitions; 60fps animations
- ✅ Testing: >80% code coverage; critical paths E2E tested
- ✅ Accessibility: WCAG 2.1 AA compliant
- ✅ Documentation: Complete and up-to-date
- ✅ Ready for app store submission

---

## Key Milestones

| Milestone                   | Target Date | Phase   | Deliverable                                  |
| --------------------------- | ----------- | ------- | -------------------------------------------- |
| **M1: Foundation Complete** | Week 4      | Phase 1 | Folder structure, routing, auth flow working |
| **M2: Child Reading MVP**   | Week 8      | Phase 2 | Library, TTS, Karaoke Spotlight (alpha)      |
| **M3: Recording Feature**   | Week 10     | Phase 2 | Audio recording, history, playback           |
| **M4: Guardian Dashboard**  | Week 14     | Phase 3 | Analytics, customizer, scheduler (alpha)     |
| **M5: API Integration**     | Week 18     | Phase 4 | Backend connected, offline mode working      |
| **M6: Production Ready**    | Week 20     | Phase 4 | Bug fixes, testing, store submission ready   |

---

## Risk Mitigation

### High-Risk Items

| Risk                               | Impact                | Mitigation                                     |
| ---------------------------------- | --------------------- | ---------------------------------------------- |
| **Audio Sync Drift**               | Poor UX, low adoption | Early spike on Reanimated; tolerance testing   |
| **Performance on Low-End Devices** | Excluded users        | Early profiling on budget Android devices      |
| **Dyslexia Feature Efficacy**      | Low engagement        | User testing with dyslexic children in Phase 2 |
| **API Delays**                     | Blocked integration   | Mock API in Phase 2; parallel development      |

---

## Communication Plan

- **Weekly Standup**: Tuesday 10:00 AM (15 min)
- **Sprint Review**: Friday 3:00 PM (30 min, end of 2-week sprint)
- **Architecture Review**: End of each phase (2 hours)
- **Stakeholder Demo**: End of Phase 2 & 4 (1 hour)

---

## Next Steps (Week 1)

1. ✅ Create ARCHITECTURE.md and PLAN.md ← **IN PROGRESS**
2. ⏳ Scaffold folder structure and boilerplate code
3. ⏳ Set up root layout with providers
4. ⏳ Test TypeScript compilation and ESLint
5. ⏳ Schedule kick-off meeting with team

---

**Plan Owner:** Tech Lead  
**Last Updated:** April 28, 2026  
**Next Review:** End of Phase 1 (Week 4, 2026)
