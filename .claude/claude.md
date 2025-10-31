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
- **Post-review Adjustments (Codex - 2025-11-02)**: Added drag origin tracking with cancel restoration to revert previews, introduced optional persistence flags so preview moves skip storage writes, and treated column-surface drops as move-to-end operations that persist only after drop completion.

### ✅ Phase 5: Tag Management System (Completed)
- **Store Extensions**: Extended `src/stores/boardStore.ts` with global tag state and comprehensive tag management:
  - Added `tags: Tag[]` to BoardState with 9 preset tags (Tech Stack: React/cyan, Python/emerald, API/purple, Database/gold, UI/UX/magenta; Priority: Critical/coral, High/pink, Medium/yellow, Low/cyan)
  - Updated `addCard` action to accept optional `tagIds` parameter and map to full Tag objects from store
  - Implemented 5 new tag management actions: `addTag(label, color)` for creating custom tags with unique IDs, `updateTag(tagId, updates)` for editing tag properties, `deleteTag(tagId)` for removing tags with cascade delete from all cards, `addTagToCard(cardId, tagId)` for tag-card association, `removeTagFromCard(cardId, tagId)` for removing associations
  - All actions use immutable update patterns and trigger debounced localStorage persistence
- **Storage Utility Updates**: Modified `src/utils/storage.ts` to persist tags alongside columns:
  - Extended `StorageData` interface to include `tags: Tag[]`
  - Updated `loadFromStorage` with backward compatibility handling for older localStorage data without tags (returns empty array for tags if not present)
  - All save operations now persist both columns and tags in single storage object
- **TagSelector Component**: Created `src/components/TagSelector/TagSelector.tsx` for tag selection in card creation:
  - Props: availableTags (Tag[]), selectedTagIds (string[]), onTagToggle (callback), optional maxTags (limit)
  - Renders scrollable tag list (max-height 150px) with clickable chip buttons
  - Visual states: selected chips have 2px solid border and 30% background opacity, disabled chips when maxTags reached
  - Each chip displays colored dot indicator and label with color-mix() backgrounds
  - Empty state hint when no tags selected
  - Full accessibility: aria-pressed attributes, keyboard navigation, focus-visible states
  - Styled via `TagSelector.module.css` with cyberpunk design system, custom scrollbar, reduced-motion support
- **TagManager Component**: Created `src/components/TagManager/TagManager.tsx` for global tag management modal:
  - Props: isOpen (boolean), onClose (callback)
  - Modal features: create/edit tag form with label input and color selection, preset color palette (8 swatches) plus native color picker, tags list displaying all available tags with edit/delete actions
  - Preset tags (initial 9) are read-only with disabled edit/delete buttons (identified by hardcoded ID array)
  - Custom tags fully editable and deletable with cascade delete confirmation via window.confirm
  - Form validation: label required with error messaging
  - Local state: editingTagId (tracks edit mode), newTagLabel/newTagColor (form inputs), labelError (validation)
  - Full modal accessibility: Escape key handler, focus trap, ARIA dialog attributes, keyboard navigation
  - Styled via `TagManager.module.css` with glass-morphism, color swatch grid, responsive mobile adjustments, reduced-motion support
- **AddCardModal Integration**: Updated `src/components/AddCardModal/AddCardModal.tsx` to include tag selection:
  - Imported TagSelector component and useBoardStore for tags array
  - Added selectedTagIds state (string[]) with toggle handler for selection/deselection
  - Updated onSubmit prop signature to accept optional `tagIds?: string[]` parameter
  - Rendered TagSelector between description textarea and action buttons
  - Form submission passes selectedTagIds to parent, form reset clears selected tags
- **Column Component Updates**: Modified `src/components/Column/Column.tsx` to handle tag IDs:
  - Updated onAddCard prop signature to accept optional `tagIds?: string[]` parameter
  - Updated handleSubmit to pass tagIds through to Board component
- **Board Component Integration**: Updated `src/components/Board/Board.tsx` to include TagManager access:
  - Imported TagManager component
  - Added isTagManagerOpen state with handlers (handleOpenTagManager, handleCloseTagManager)
  - Rendered floating action button (🏷 emoji) positioned fixed bottom-right for tag management access
  - Rendered TagManager modal with isOpen/onClose props
  - addCard action already has correct signature after store modifications
- **Board Styling**: Extended `src/components/Board/Board.module.css` with manage tags button:
  - `.manageTagsButton`: 56px circular button, fixed positioning (bottom: calc(var(--spacing-xl) + 60px), right: var(--spacing-xl)), glass-morphism background, 2px cyan border, cyan glow shadow, z-index 100
  - Hover state: translateY(-2px) scale(1.05) lift effect, enhanced glow shadow, cyan-tinted background
  - Focus-visible: 2px cyan outline with 4px offset
  - Mobile responsive: 48px size, adjusted positioning for smaller screens
  - Reduced-motion: disabled transform animations
- **Technical Implementation**: Global tag state centralized in Zustand store, cascade delete removes tags from all cards when deleting tag, tag IDs mapped to full Tag objects during card creation preventing orphaned references, debounced persistence (500ms) for all tag operations, backward-compatible storage schema supporting older saves without tags, preset vs custom tag distinction for UI restrictions (read-only presets), color-mix() CSS for consistent tag chip styling across components
- **Accessibility Features**: Full keyboard navigation in TagManager (Tab, Escape), TagSelector chips with aria-pressed, focus traps in modal dialogs, semantic HTML (button, form, label elements), ARIA labels on all interactive elements, reduced-motion support for all animations, screen reader compatibility via proper dialog markup
- **User Experience**: Inline tag selection during card creation (no context switching), persistent tag library across sessions, visual color coding with 8 preset colors plus custom color picker, cascade delete protection via confirmation dialog, hover-revealed edit/delete actions in tag list, empty state hints and validation feedback, responsive mobile-optimized layouts
- **File Organization**: Created new component directories (TagSelector/, TagManager/) following established pattern with co-located CSS Modules, updated existing components (AddCardModal, Column, Board) with tag integration, extended central store and storage utilities
- Completion marker: `~/.traycer/yolo_artifacts/f1b9995e-0196-44a1-92b1-ccfb73f1b04e.json`

### 🔄 Next Phase: Advanced Features
- Add card editing capability (updateCard action exists but no UI yet)
- Add keyboard shortcuts for power users
- Implement card filtering and search functionality
- Add card archiving/completion workflows
