# Kandoo Flowboard - Project Instructions

> Maintained and currently updated by a Codex agent (Codex CLI, GPT-5).

## Project Overview

Kandoo Flowboard is a cyberpunk-themed glass-morphic kanban board application built with React, TypeScript, and Vite. The project emphasizes type safety, accessibility, and modern web development practices.

## Tech Stack

- **React 18** with TypeScript and strict mode
- **Vite** for fast development and optimized builds
- **Zustand** for lightweight state management
- **@dnd-kit** for accessible drag-and-drop
- **Framer Motion** for physics-based animations
- **clsx** for conditional CSS classes

## Workflow Columns

The kanban board has five workflow columns:

1. **Ideas** - Concepts and feature pitches awaiting prioritization
2. **Planning** - Tasks being refined and sequenced for delivery
3. **Coding** - Active development work underway
4. **Testing** - Validation and QA before release
5. **Deployed** - Shipped work available to end users

## Code Standards

### TypeScript
- Strict mode is enabled (`noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`)
- Always provide proper types, avoid `any`
- Use explicit return types for functions
- Leverage TypeScript's type inference where appropriate

### React Patterns
- Use functional components with hooks
- Follow React best practices (StrictMode enabled)
- Keep components focused and single-purpose
- Use proper dependency arrays in hooks

### File Organization
- `src/components/` - React UI components (Header, Footer, Board - upcoming)
- `src/hooks/` - Custom React hooks (useTypewriter)
- `src/stores/` - Zustand state management
- `src/types/` - TypeScript type definitions
- `src/styles/` - CSS modules and global styles (cyberpunk design system established)
- `src/utils/` - Helper functions and utilities

### Naming Conventions
- Components: PascalCase (e.g., `BoardColumn.tsx`)
- Utilities: camelCase (e.g., `storageHelpers.ts`)
- Types: PascalCase (e.g., `Card`, `Column`)
- CSS Modules: Component name + `.module.css` (e.g., `Card.module.css`)

### Styling
- Use CSS Modules for component-specific styles
- Cyberpunk color palette established in `src/styles/global.css`:
  - Primary: Cyan (#4fd1ff), Magenta (#f472b6), Emerald (#34d399)
  - Secondary: Purple (#c084fc), Gold (#fbbf24), Coral (#f87171)
  - Background: Dark gradients (#030712 → #0f172a)
- Glass-morphism effects via `.glass-panel` utility class
- Neon glow effects via `.neon-glow-cyan` utility class
- Responsive design with mobile-first approach
- Use `clsx` for conditional class names
- Monospace typography via `.monospace` utility for code-like elements

### State Management
- Use Zustand for global state (cards, columns, tags)
- Keep state minimal and normalized
- Implement proper TypeScript types for stores
- Use selectors to prevent unnecessary re-renders

### Accessibility
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support (especially for drag-and-drop)
- Screen reader compatibility
- Focus management

### Performance
- Debounce localStorage saves
- Optimize re-renders with proper memoization
- Lazy load components where appropriate
- Use Framer Motion's layout animations efficiently

## Development Workflow

1. **Starting Development**: `npm run dev`
2. **Type Checking**: Automatic via TypeScript compiler
3. **Linting**: `npm run lint`
4. **Building**: `npm run build`
5. **Preview**: `npm run preview`

## Key Features to Implement

- Drag-and-drop card movement between columns
- Tag creation and assignment with color coding
- LocalStorage persistence with debouncing
- Card creation, editing, and deletion
- Cyberpunk aesthetic with glass-morphism
- Responsive layout for mobile and desktop
- Keyboard shortcuts for power users

## Design Philosophy

- **Minimalist Core**: Build only what's needed, no feature bloat
- **Type Safety First**: Leverage TypeScript's strict mode fully
- **Accessibility**: Not optional, required for all features
- **Performance**: Smooth 60fps animations, fast interactions
- **User Experience**: Intuitive, delightful, visually striking

## Implementation Status

### ✅ Phase 1: Layout & Animation Foundation (Completed)
- **Design System**: Cyberpunk color palette, glass-morphism, utility classes established in `src/styles/global.css`
- **Custom Hooks**: `useTypewriter` hook with accessibility support (reduced-motion), completion callbacks, configurable speed/delay
- **Header Component**: Animated title with neon-glow effect, syntax-highlighted subtitle with token-based color mapping
- **Footer Component**: Coordinated animation with 3s delay, 5-minute restart cycle, fixed positioning
- **App Layout**: Flexbox structure with animation state coordination between Header and Footer
- **File Structure**: Component directories with co-located CSS Modules (Header/, Footer/), hooks/ directory established

### ✅ Phase 2: Board Component Implementation (Completed)
- **Type Definitions**: Created `src/types/index.ts` with Tag, Card, and Column interfaces for type safety
- **Board Component**: Implemented `src/components/Board/Board.tsx` with responsive grid layout (5 columns on desktop, horizontal scroll on mobile) and pre-populated sample data for all five workflow columns
- **Column Component**: Built `src/components/Column/Column.tsx` with glass-panel styling, colored accent bars using CSS custom properties, card counting with pluralization, and hover lift effects
- **Card Component**: Created `src/components/Card/Card.tsx` with layered glass effects, optional descriptions, tag display with color-mix backgrounds, colored dot indicators, and hover animations
- **Sample Data**: Populated board with realistic task examples across all columns (Ideas, Planning, Coding, Testing, Deployed) demonstrating various tag combinations and descriptions
- **CSS Modules**: Component-specific styles with mobile responsiveness, reduced-motion support, and cyberpunk design system integration
- **App Integration**: Updated `src/App.tsx` to render Board component in main content area

### ✅ Phase 2.5: CodeRain Background Animation (Completed)
- **Code Snippets Data**: Created `src/components/CodeRain/codeSnippets.ts` with 30 pre-defined, tokenized code snippets from JavaScript, Python, HTML, and CSS with proper syntax highlighting token types (keyword, string, function, number, punctuation, plain)
- **Animation Hook**: Evolved `src/components/CodeRain/useCodeRainAnimation.ts` into the single source of truth for reduced-motion handling and resizing, added devicePixelRatio-aware canvas scaling for HiDPI crispness, cached token widths to avoid per-frame `measureText`, and continued managing 40-60 falling snippets with randomized properties, CSS-variable-driven colors, and cleanup via requestAnimationFrame lifecycle
- **CodeRain Component**: Simplified `src/components/CodeRain/CodeRain.tsx` so it primarily exposes the canvas ref and delegates motion concerns to the hook while keeping aria-hidden accessibility semantics
- **Styling**: Created `src/components/CodeRain/CodeRain.module.css` with fixed positioning covering full viewport, z-index 0 for background placement, pointer-events: none for non-interference, 0.4 opacity for subtlety, and reduced-motion media query to hide animation
- **Z-Index Layering**: Updated `src/App.module.css` to establish proper stacking context (CodeRain canvas z-index: 0, app container z-index: 1, main content z-index: 2)
- **Integration**: Added CodeRain component as first child in `src/App.tsx` to ensure background placement behind all content
- **Performance**: Native Canvas API for optimal rendering, token-based syntax highlighting using established cyberpunk color palette, smooth 60fps animation with proper frame timing

### ✅ Phase 3: Interactive Card Management (Completed)
- **Storage Utility**: Created `src/utils/storage.ts` with localStorage persistence layer, debounced save functionality (500ms delay), error handling, and TypeScript type safety for StorageData structure
- **Zustand Store**: Built `src/stores/boardStore.ts` as single source of truth for board state with CRUD actions (addCard, updateCard, deleteCard, loadFromStorage), migrated all sample data from Board component, integrated debounced localStorage persistence, and used crypto.randomUUID() for unique card IDs
- **AddCardButton Component**: Implemented `src/components/AddCardButton/` with simple trigger button, cyberpunk styling (glass effect, cyan accents), accessible ARIA labels, and reduced-motion support
- **AddCardModal Component**: Created `src/components/AddCardModal/` with full-featured modal dialog, form validation (required title, optional description), keyboard navigation (Escape to close, focus trap), click-outside-to-close behavior, Framer Motion animations (fade + scale), accessible dialog markup (role, aria-modal, aria-labelledby), and mobile responsive design
- **Card Component Enhancements**: Added delete functionality with onDelete prop, wrapped with motion.div for entrance/exit animations (fade + scale), hover-revealed delete button (×) with coral accent, keyboard accessibility (focus-visible states), and layout animations
- **Column Component Integration**: Integrated AddCardButton and AddCardModal, added modal state management (useState), wrapped card list with AnimatePresence (mode="popLayout"), implemented event handlers (onAddCard, onDeleteCard), and proper delegation to Board component
- **Board Component Refactor**: Removed hardcoded sample data, integrated Zustand store with selective hooks, added loadFromStorage on mount via useEffect, connected store actions to column props, clean implementation using store as single source of truth
- **Animation System**: Implemented smooth card entrance/exit with Framer Motion (opacity + scale transitions), AnimatePresence with popLayout mode for layout shift handling, and proper reduced-motion media query support throughout
- **Accessibility**: Full keyboard navigation support, proper ARIA attributes on interactive elements, focus management in modal, screen reader compatibility with semantic HTML
- **State Persistence**: Automatic localStorage saves with debouncing to prevent performance issues, state restoration on page load, proper error handling for storage operations
- **Post-review Refinements (Codex - 2025-11-01)**: Ensured AddCardModal remains mounted within `AnimatePresence` so exit animations play, kept modal-responsible close logic to avoid duplicate invocations from parent columns, and added environment guards before touching `localStorage` to support SSR/tests.

### ✅ Phase 4: Drag-and-Drop Implementation (Completed)
- **Store Extensions**: Extended `src/stores/boardStore.ts` with `moveCard` action for cross-column card movement and `reorderCards` action for within-column reordering, both using immutable update patterns and triggering debounced localStorage persistence
- **DndContext Integration**: Integrated `@dnd-kit/core` DndContext into `src/components/Board/Board.tsx` with multi-sensor support (PointerSensor, TouchSensor, KeyboardSensor with sortableKeyboardCoordinates for accessibility), activeId state tracking for visual feedback coordination
- **Event Handlers**: Implemented three drag event handlers in Board component:
  - `handleDragStart`: Tracks which card is actively being dragged via activeId state
  - `handleDragOver`: Handles real-time cross-column moves by detecting destination column and calculating insertion index, updates store immediately during drag
  - `handleDragEnd`: Handles within-column reordering using arrayMove utility, resets activeId state on drop
- **SortableContext Integration**: Wrapped card lists in `src/components/Column/Column.tsx` with SortableContext using rectSortingStrategy, made columns droppable with useDroppable hook for empty column drops, added visual drop-target feedback via conditional CSS class
- **Sortable Cards**: Enhanced `src/components/Card/Card.tsx` with useSortable hook, applied @dnd-kit transforms and transitions via inline styles, conditionally disabled framer-motion layout animations during drag (layout={!isDragging}) to prevent transform conflicts, added event.stopPropagation() to delete button to prevent drag interference
- **Drag Styling**: Added `.cardDragging` class in `src/components/Card/Card.module.css` with reduced opacity (0.5), enhanced cyan glow shadow, brighter border, grabbing cursor, and z-index: 1000 for prominence, included prefers-reduced-motion support
- **Drop-Target Styling**: Added `.columnDropTarget` class in `src/components/Column/Column.module.css` with subtle cyan background tint, brighter border, glow effect, and smooth 0.2s transition, included prefers-reduced-motion support
- **Transform Conflict Resolution**: Resolved framer-motion/dnd-kit transform conflicts by conditionally disabling layout animations during drag, allowing @dnd-kit transforms to control positioning while preserving framer-motion for entrance/exit animations
- **Accessibility**: Full keyboard drag-and-drop support via KeyboardSensor with sortableKeyboardCoordinates, touch support for mobile devices, proper ARIA attributes, focus management maintained throughout drag operations
- **Performance**: Optimized with debounced state persistence (500ms delay), efficient immutable updates, proper React re-render optimization through selective Zustand selectors

### 🔄 Next Phase: Advanced Features
- Add card editing capability (update existing cards via modal)
- Implement tag creation and assignment with color coding
- Build tag management system with color picker
- Add keyboard shortcuts for power users
- Implement card filtering and search functionality
