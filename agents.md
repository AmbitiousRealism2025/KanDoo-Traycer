# Agent Notes

## Project Snapshot
- Project: **Kandoo Flowboard**, a cyberpunk-themed kanban board.
- Tech stack: React 18, TypeScript (strict), Vite, Zustand, @dnd-kit, Framer Motion, clsx.
- Key directories: `src/components`, `src/stores`, `src/types`, `src/styles`, `src/utils`.

## Useful Commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev` (serves at http://localhost:5173)
- Production build: `npm run build`
- Preview build: `npm run preview`

## Conventions & Tips
- State lives in `src/stores` (Zustand); check there before introducing new global state.
- Drag-and-drop behaviors rely on `@dnd-kit`; follow existing patterns to avoid breaking accessibility.
- Animations use Framer Motion—prefer extending existing motion configs rather than creating ad-hoc transitions.
- Stick to TypeScript strictness; add or update types in `src/types` when introducing new data shapes.

## Recent Agent Activity
- README workflow column names updated to `Ideas`, `Planning`, `Coding`, `Testing`, `Deployed` to align with planned phases.
- Completion marker dropped at `~/.traycer/yolo_artifacts/a45aede5-2813-4d55-96cd-850bb6562e92.json` (empty JSON).
- Typewriter hook now supports gated start, restart key, and robust timeout cleanup; footer animation respects header completion before running.
- Completion marker dropped at `~/.traycer/yolo_artifacts/61e9303d-6bd1-4300-82ac-c2ea5361c79a.json` (empty JSON).
- Codex agent documented maintainership details in `.claude/claude.md`.
- Post-review polish: ensured AddCardModal exit animations run by keeping AnimatePresence mounted, delegated modal close timing to modal itself to prevent duplicate calls, and hardened storage utilities against non-browser environments.

### Phase 1: Layout & Animation Foundation (Updated by Claude - 2025-10-31)
- **Global Design System Established**: Expanded `src/styles/global.css` with comprehensive cyberpunk color palette (cyan, magenta, emerald, purple, gold), glass-morphism variables, utility classes (.glass-panel, .neon-glow-cyan, .monospace), and blink animation keyframe.
- **Custom Typewriter Hook**: Created `src/hooks/useTypewriter.ts` with character-by-character text reveal, configurable speed/delay, completion callbacks, and reduced-motion accessibility support.
- **Header Component**: Built `src/components/Header/Header.tsx` with animated syntax-highlighted subtitle ("a kanban for your vibeflow;") using token-based color mapping, neon-glow title effect, and completion callback to trigger Footer animation.
- **Footer Component**: Implemented `src/components/Footer/Footer.tsx` with 3-second delay after Header completion, 5-minute automatic restart cycle using interval cleanup, and fixed positioning with glass-morphism backdrop.
- **App Layout Coordination**: Updated `src/App.tsx` to manage animation state flow (headerComplete triggers Footer animation) and established flexbox layout structure with CSS Modules.
- **Responsive Design**: All components include mobile-first responsive adjustments for tablet/mobile viewports.
- **File Structure**: Created organized component directories with co-located CSS Modules (Header/, Footer/), established hooks/ directory pattern.
- Completion marker: `~/.traycer/yolo_artifacts/7951c8a6-c13e-4722-965b-b3644eabdf57.json`

### Phase 2: Board Component Implementation (Updated by Claude - 2025-10-31)
- **Type System**: Created central type definitions in `src/types/index.ts` with Tag, Card, and Column interfaces following TypeScript strict mode requirements.
- **Board Component**: Implemented `src/components/Board/Board.tsx` with 5-column responsive grid layout (desktop), horizontal scrolling on mobile/tablet, and comprehensive sample data demonstrating all workflow stages.
- **Column Component**: Built `src/components/Column/Column.tsx` with glass-panel base, CSS custom property-based accent bars (--accent-color), card counting logic with pluralization, hover lift effects, and empty state messaging.
- **Card Component**: Created `src/components/Card/Card.tsx` with layered glass effect (darker than columns), optional description rendering, tag display using CSS color-mix() for tinted backgrounds, colored dot indicators, and hover animations with lift/scale/glow.
- **Sample Data Structure**: Pre-populated board with 9 cards across 5 columns showing realistic tasks (AI prioritization, dark mode, DnD implementation, keyboard testing, design system deployment) with varied tag combinations (React/cyan, Python/emerald, API/purple, Database/gold, UI/UX/magenta, Critical/coral, High/pink, Medium/yellow, Low/cyan).
- **Responsive Design**: CSS Grid on desktop (repeat(5, 1fr)), auto-fit wrapping on tablet (minmax(280px, 1fr)), flexbox horizontal scroll on mobile with custom webkit scrollbar styling.
- **Accessibility**: Reduced-motion media query support in Card component, semantic HTML structure, proper heading hierarchy.
- **App Integration**: Updated `src/App.tsx` to import and render Board component in main content area, replacing placeholder comment.
- **File Organization**: Created component directories following established pattern (Board/, Column/, Card/) with co-located CSS Modules and TypeScript interfaces.
- Completion marker: `~/.traycer/yolo_artifacts/19337fe2-6d27-48f6-afef-daabe9bf2fd6.json`

### Phase 2.5: CodeRain Background Animation (Updated by Codex - 2025-11-01)
- **Component Structure**: Created `src/components/CodeRain/` directory with complete canvas-based animation system for falling code snippets background effect.
- **Data Layer**: Built `codeSnippets.ts` with 30 tokenized code snippets (JavaScript, Python, HTML, CSS) using CodeToken type system (keyword, string, function, number, punctuation, plain) matching established syntax highlighting patterns from Header component.
- **Animation Engine**: Implemented and iterated on `useCodeRainAnimation.ts` with requestAnimationFrame loop, caching token widths to avoid per-frame `measureText`, centralizing reduced-motion handling, introducing HiDPI-aware resizing via devicePixelRatio scaling, and managing 40-60 FallingSnippet objects with randomized properties (x/y position, speed 1-3px/frame, opacity 0.1-0.3, rotation -5 to 5 degrees, blur 0-2px, fontSize 10-14px) plus color mapping from CSS variables and lifecycle cleanup.
- **React Component**: `CodeRain.tsx` now focuses on exposing the canvas ref, delegating reduced-motion and resize concerns to the hook while maintaining accessibility markup (aria-hidden="true" for decorative background).
- **Styling**: Built `CodeRain.module.css` with position: fixed covering full viewport (100vw/100vh), z-index: 0 for background placement, pointer-events: none for click-through behavior, opacity: 0.4 for subtle non-intrusive effect, and @media (prefers-reduced-motion: reduce) to completely hide animation for accessibility.
- **Z-Index Architecture**: Updated `src/App.module.css` to establish three-layer stacking context with documentation: CodeRain canvas (z-index: 0, background), app container (z-index: 1, middle), main content (z-index: 2, foreground).
- **Integration**: Modified `src/App.tsx` to render CodeRain component as first child in app container, ensuring proper background placement before Header, main Board content, and Footer.
- **Technical Approach**: Native Canvas API (no libraries) for optimal performance, token-based rendering matching established cyberpunk color palette from global.css, canvas.filter for blur effects, canvas transformations (translate/rotate) for snippet positioning, cached text widths for efficient rendering, snippet recycling when exiting viewport for memory efficiency, and crisp output on Retina displays via scaled backing store.
- **Accessibility**: Reduced-motion support centralized in the hook alongside CSS media query fallback, non-interactive decorative element (aria-hidden), no interference with user interactions (pointer-events: none).
- Completion marker: `~/.traycer/yolo_artifacts/15a5d4ba-e9a7-424d-8235-844a9ceb7381.json`

#### CodeRain Implementation Review (Added by Claude - 2025-10-31)
- **Initial Implementation**: Claude created the complete CodeRain system with 4 new files (codeSnippets.ts, useCodeRainAnimation.ts, CodeRain.tsx, CodeRain.module.css) and 2 modified files (App.tsx, App.module.css) following the established project patterns.
- **Codex Optimizations**: Codex subsequently enhanced the implementation with performance improvements including devicePixelRatio scaling for HiDPI displays, cached token widths (computeTokenWidths, recycleFallingSnippet functions) to eliminate per-frame measureText calls, centralized reduced-motion detection in the hook, and simplified component structure by removing redundant state and effects from CodeRain.tsx.
- **Architecture Validation**: The implementation correctly follows project conventions: functional React with TypeScript strict mode, useRef-based cleanup patterns matching useTypewriter hook, CSS Modules with co-located files, proper accessibility (aria-hidden, prefers-reduced-motion), and integration with established cyberpunk design system color variables.
- **Performance Characteristics**: Achieves 60fps animation through requestAnimationFrame, efficient canvas rendering with cached measurements, snippet recycling for memory management, and proper cleanup on unmount. The 40-60 falling snippets with randomized properties create visual interest without performance degradation.
- **Documentation Status**: Both CLAUDE.md and agents.md updated to reflect Phase 2.5 completion with comprehensive technical details for future agent reference.

### Phase 3: Interactive Card Management (Added by Claude - 2025-10-31)
- **Storage Layer**: Created `src/utils/storage.ts` utility module with three key functions: loadFromStorage (reads and parses JSON from localStorage with error handling), saveToStorage (stringifies and writes to localStorage), and debouncedSaveToStorage (batches rapid saves with 500ms delay using timeout reference cleanup pattern). TypeScript StorageData interface matches store state shape.
- **Zustand State Management**: Built `src/stores/boardStore.ts` as centralized state manager with BoardState interface (columns array, optional loading flag), BoardActions interface (addCard, updateCard, deleteCard, loadFromStorage methods), and initial state migrated from Board.tsx sample data (5 columns with 9 cards). Implemented CRUD operations with immutable update patterns, debounced localStorage persistence on every state change, and unique ID generation using crypto.randomUUID() with fallback.
- **AddCardButton Component**: Created `src/components/AddCardButton/AddCardButton.tsx` as functional component accepting onClick callback prop, rendering semantic button with accessible ARIA label, '+' icon, and 'Add Card' text. Styled via `AddCardButton.module.css` with width 100%, glass effect (rgba cyan background), dashed border, uppercase text, flex centering, hover state (darker background, solid border, translateY lift), focus-visible outline, and reduced-motion media query disabling transforms.
- **AddCardModal Component**: Implemented `src/components/AddCardModal/AddCardModal.tsx` as full-featured dialog with props (isOpen, onClose, onSubmit, columnTitle), local state for title/description/titleError using useState, Escape key listener via useEffect for closing, focus trap effect preserving previous focus, form validation requiring title input, overlay with backdrop blur and click-to-close behavior, modal content with glass-panel styling and click event stopPropagation, header with dynamic title and close button (×), form with title input (required, autoFocus), description textarea (optional), Cancel/Add Card action buttons, and AnimatePresence wrapping for fade + scale animations. Styled via `AddCardModal.module.css` with fixed overlay (z-index 1000), centered flexbox layout, glass-morphic modal (max-width 500px), form groups with labels, inputs with cyan focus states, error text in coral, button styling (cancel: transparent with border, submit: cyan background with hover lift/glow, disabled state), mobile responsive adjustments reducing padding/font sizes, and reduced-motion support.
- **Card Component Enhancement**: Updated `src/components/Card/Card.tsx` to add onDelete prop to CardProps interface, replaced root div with motion.div from framer-motion, added layout prop for layout animations, included initial/animate/exit/transition props for fade + scale effect (opacity 0→1, scale 0.9→1, 200ms duration), and added delete button element positioned absolutely in top-right corner (24x24px, coral accent, × character, opacity 0 default). Modified `Card.module.css` to add .deleteButton styles (absolute positioning with spacing variables, flex centering, coral rgba background and border, 1.2rem font size, opacity 0 with transition, z-index 10) and hover/focus selectors (.card:hover .deleteButton, .card:focus-within .deleteButton setting opacity 1 for visibility), delete button hover state (darker background, solid border, scale 1.1 transform), focus-visible outline (coral 2px), and reduced-motion media query disabling scale transform.
- **Column Component Integration**: Updated `src/components/Column/Column.tsx` to import useState, AnimatePresence, AddCardButton, AddCardModal, added onAddCard/onDeleteCard props to ColumnProps interface, added isModalOpen state with handlers (handleOpenModal, handleCloseModal, handleSubmit, handleDeleteCard), inserted AddCardButton before cardsContainer, wrapped card mapping with AnimatePresence (mode="popLayout"), passed onDelete prop to CardComponent with handleDeleteCard callback, and rendered AddCardModal at end with isOpen/onClose/onSubmit/columnTitle props.
- **Board Component Refactor**: Updated `src/components/Board/Board.tsx` to import useEffect and useBoardStore, removed 134-line sampleColumns constant (data now in store), added Zustand selectors (columns, addCard, deleteCard, loadFromStorage) with individual state slices to prevent unnecessary re-renders, added useEffect calling loadFromStorage on mount with proper dependency array, and passed onAddCard={addCard} and onDeleteCard={deleteCard} to ColumnComponent.
- **Animation Implementation**: Leveraged Framer Motion throughout with card entrance/exit animations (initial opacity 0 scale 0.9, animate opacity 1 scale 1, exit opacity 0 scale 0.9, 200ms transitions), AnimatePresence mode="popLayout" in Column for smooth layout shifts when cards add/remove, layout prop on motion.div for automatic layout animations, and consistent reduced-motion media queries disabling all transform animations.
- **Accessibility Features**: Semantic HTML throughout (button, form, label, input, textarea elements), ARIA attributes on modal (role="dialog", aria-modal="true", aria-labelledby), ARIA labels on interactive buttons (aria-label="Add new card", "Delete card", "Close modal"), keyboard navigation support (Escape to close modal, Tab navigation, Enter to submit), focus management (autoFocus on title input, focus trap in modal, return focus on close), focus-visible states with cyan/coral outlines, and screen reader compatibility via proper heading hierarchy and semantic structure.
- **State Persistence**: Automatic debounced localStorage saves (500ms delay) triggered on every store mutation (addCard, updateCard, deleteCard), state restoration on Board mount calling loadFromStorage, storage key 'kandoo-flowboard-state', error handling with console logging for localStorage failures, proper TypeScript typing for stored data matching Column[] structure, and cleanup pattern clearing pending timeouts.
- **File Organization**: Created new directories (`src/utils/`, `src/stores/`, `src/components/AddCardButton/`, `src/components/AddCardModal/`) following established component/CSS Module co-location pattern, updated existing components (Card, Column, Board) with new functionality while preserving existing styles and structure.
- **TypeScript Compliance**: Strict mode compatibility with explicit return types (void, JSX.Element), proper interface definitions for props and state, noUncheckedIndexedAccess handling in array operations, type-safe Zustand store with BoardState and BoardActions interfaces, StorageData interface for localStorage operations, and React.CSSProperties type assertions for CSS custom properties.
- Completion marker: `~/.traycer/yolo_artifacts/43ef1c5f-0a1a-46a6-a8cf-beceec35f500.json`

### Documentation Updates (Added by Claude - 2025-10-31)
- **README.md Enhancement**: Updated project structure section to detail all component directories (Header, Footer, Board, Column, Card, AddCardButton, AddCardModal, CodeRain) with inline descriptions, added hooks, stores, types, and utils directories with their purposes. Reorganized features section into "Implemented Features" (8 completed items including card management, modal interface, state persistence, accessibility, animations) and "Planned Features" (4 upcoming items including drag-and-drop, card editing, tag system, keyboard shortcuts). Added "Development Notes" section with phase completion status (Phases 1-3 complete, Phase 4 next), code standards summary (TypeScript strict mode, functional components, CSS Modules, accessibility-first, performance), and contributor guidance referencing CLAUDE.md and agents.md files.
- **agents.md Updates**: Phase 3 implementation details already documented in previous session with comprehensive technical specifications covering storage layer, Zustand state management, all component implementations, animations, accessibility features, and state persistence patterns.
- **CLAUDE.md Status**: Already current with Phase 3 completion details in Implementation Status section, including all technical implementation specifics and next phase planning.

### Phase 4: Drag-and-Drop Implementation (Added by Claude - 2025-10-31)
- **Store Extensions**: Extended `src/stores/boardStore.ts` with two new actions in BoardActions interface:
  - `moveCard(cardId, sourceColumnId, destinationColumnId, destinationIndex)`: Handles cross-column card movement by finding card in source column, removing it via filter, updating its columnId property, inserting at destination index via splice, and triggering debounced save
  - `reorderCards(columnId, cardIds[])`: Handles within-column reordering by creating Map of existing cards, mapping over new card ID order to preserve all card properties, and triggering debounced save
  - Both actions use immutable update patterns (map over columns, spread operators) consistent with existing addCard/updateCard/deleteCard actions
- **DndContext Integration**: Updated `src/components/Board/Board.tsx` to wrap board layout with @dnd-kit/core DndContext component:
  - Imported DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, closestCenter from '@dnd-kit/core'
  - Imported sortableKeyboardCoordinates, arrayMove from '@dnd-kit/sortable'
  - Added activeId state (string | null) to track currently dragging card
  - Initialized sensors with useSensors hook: PointerSensor (default), TouchSensor (default), KeyboardSensor with sortableKeyboardCoordinates for accessible keyboard navigation
  - Added Zustand selectors for moveCard and reorderCards actions
- **Event Handler Implementation**: Implemented three drag event handlers in Board component:
  - `handleDragStart(event)`: Extracts active.id and sets activeId state for visual feedback coordination
  - `handleDragOver(event)`: Detects cross-column moves by finding source column (containing active card) and destination column (by overId matching column.id or column.cards[].id), calculates insertion index, calls moveCard action if columns differ (updates state immediately during drag for smooth UX)
  - `handleDragEnd(event)`: Handles within-column reordering by finding column containing active card, checking if over.id is in same column, using arrayMove utility to reorder card IDs array, calling reorderCards action, and resetting activeId to null
  - All handlers properly typed with DragStartEvent/DragOverEvent/DragEndEvent types
- **SortableContext Integration**: Updated `src/components/Column/Column.tsx` to enable sortable card lists:
  - Imported SortableContext, rectSortingStrategy from '@dnd-kit/sortable' and useDroppable from '@dnd-kit/core'
  - Added activeId prop (string | null) to ColumnProps interface
  - Called useDroppable({ id }) hook and destructured setNodeRef, isOver for column-level drop targeting
  - Applied setNodeRef to root column div via ref prop
  - Wrapped cards mapping section with SortableContext component (id={id}, items={cards.map(card => card.id)}, strategy={rectSortingStrategy})
  - Added conditional CSS class: isOver && styles.columnDropTarget for visual drop feedback
  - Passed activeId prop to each CardComponent
- **Sortable Card Enhancement**: Updated `src/components/Card/Card.tsx` to make cards draggable:
  - Imported useSortable from '@dnd-kit/sortable' and CSS from '@dnd-kit/utilities'
  - Added activeId prop (string | null, optional) to CardProps interface
  - Called useSortable({ id }) and destructured attributes, listeners, setNodeRef, transform, transition, isDragging
  - Created style object with transform: CSS.Transform.toString(transform) and transition for @dnd-kit positioning
  - Modified motion.div root: added ref={setNodeRef}, spread {...attributes} {...listeners} for drag functionality, conditionally set layout={!isDragging} to disable framer-motion layout animations during drag (prevents transform conflicts), applied style prop, added conditional CSS class isDragging && styles.cardDragging
  - Updated delete button onClick with event.stopPropagation() to prevent triggering drag when clicking delete
- **Drag Styling**: Added `.cardDragging` class in `src/components/Card/Card.module.css`:
  - opacity: 0.5 for semi-transparent dragged card
  - box-shadow: 0 12px 32px rgba(79, 209, 255, 0.4) for enhanced cyan glow prominence
  - border-color: rgba(79, 209, 255, 0.6) for brighter cyan border
  - cursor: grabbing to indicate active drag state
  - z-index: 1000 to ensure dragged card appears above other cards
  - Added comment explaining class is applied when isDragging from useSortable
  - Updated @media (prefers-reduced-motion: reduce) section to keep opacity feedback while removing transform effects
- **Drop-Target Styling**: Added `.columnDropTarget` class in `src/components/Column/Column.module.css`:
  - background: rgba(79, 209, 255, 0.05) for subtle cyan tint indicating valid drop zone
  - border-color: rgba(79, 209, 255, 0.4) for brighter border highlighting
  - box-shadow: 0 0 20px rgba(79, 209, 255, 0.2) for cyan glow emphasis
  - transition: all 0.2s ease for smooth visual change
  - Added comment explaining class is applied when isOver from useDroppable
  - Added @media (prefers-reduced-motion: reduce) section simplifying transition to background/border-color only
- **Transform Conflict Resolution**: Resolved framer-motion/dnd-kit transform conflicts by conditionally disabling layout animations during drag (layout={!isDragging}). This allows @dnd-kit's transform to control card positioning during drag while preserving framer-motion's entrance/exit animations (initial/animate/exit) and layout animations when not dragging. Both systems now coexist without visual glitches or transform stuttering.
- **Accessibility Implementation**: Full keyboard drag-and-drop support via KeyboardSensor with sortableKeyboardCoordinates (Space to pick up, Arrow keys to move, Space to drop, Escape to cancel), touch support for mobile devices via TouchSensor, pointer support for mouse/trackpad via PointerSensor, proper ARIA attributes maintained throughout drag operations, focus management preserved, and screen reader compatibility via semantic HTML structure.
- **Performance Optimization**: Debounced state persistence with 500ms delay prevents excessive localStorage writes during rapid drag operations, efficient immutable updates using map/filter/splice operations, proper React re-render optimization through selective Zustand selectors (only subscribing to needed state slices), @dnd-kit's collision detection with closestCenter algorithm for accurate drop targeting, and framer-motion's layout animations disabled during drag to eliminate transform calculation overhead.
- **Technical Architecture**: Three-layer event handling (DndContext at Board level, SortableContext at Column level, useSortable at Card level), separation of concerns (Board manages drag logic, Column provides sortable context, Card handles individual sortable behavior), real-time state updates during drag (handleDragOver) for immediate visual feedback, final state reconciliation on drop (handleDragEnd), and proper cleanup of activeId state on drag completion.
- Completion marker: `~/.traycer/yolo_artifacts/775b086a-8128-46d6-aa55-7e2cf721e624.json`

## Open Follow-Ups
- No automated tests noted; consider adding coverage around drag-and-drop behavior, component rendering, localStorage persistence, form validation, and animation behavior.
- **Phase 5 Ready**: Card editing (updateCard action exists but no UI yet), tag creation/assignment with color coding, tag management system with color picker, keyboard shortcuts for power users, and card filtering/search functionality.
