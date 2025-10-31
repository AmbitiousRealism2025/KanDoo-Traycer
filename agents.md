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
- Drag preview adjustments: deferred localStorage persistence during hover moves, restored cards on cancelled drags, and ensured column background drops append to the end of the stack for consistent ordering.

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
- **Post-review Adjustments (Codex - 2025-11-02)**: Added drag origin tracking with cancel restoration, delayed persistence until drop to avoid mid-drag localStorage writes, and implemented column-background drops that position cards at the stack end while still persisting the final order.
- Completion marker: `~/.traycer/yolo_artifacts/775b086a-8128-46d6-aa55-7e2cf721e624.json`

### Phase 5: Tag Management System (Added by Claude - 2025-10-31)
- **Store Extensions**: Extended `src/stores/boardStore.ts` with comprehensive tag management state and actions:
  - Added `tags: Tag[]` to BoardState, initialized with 9 preset tags using actual hex color values from global.css (Tech Stack tags: tag-react/#4fd1ff, tag-python/#34d399, tag-api/#c084fc, tag-database/#fbbf24, tag-uiux/#f472b6; Priority tags: tag-critical/#f87171, tag-high/#fb7185, tag-medium/#facc15, tag-low/#4fd1ff)
  - Updated `addCard` action signature to accept optional `tagIds?: string[]` parameter, implemented mapping from tag IDs to full Tag objects via get() state access and filter to remove invalid IDs
  - Implemented 5 new BoardActions: `addTag(label, color)` generates unique ID via crypto.randomUUID with fallback and appends to tags array; `updateTag(tagId, updates)` maps over tags and applies Partial<Pick<Tag, 'label' | 'color'>> updates; `deleteTag(tagId)` filters tag from tags array AND cascades through all columns/cards to remove tag references; `addTagToCard(cardId, tagId)` finds tag and card, checks for duplicates, appends tag to card.tags; `removeTagFromCard(cardId, tagId)` filters tag from card.tags array
  - Updated all persistence calls throughout store to pass both `{ columns, tags }` to debouncedSaveToStorage for complete state preservation
- **Storage Schema Updates**: Modified `src/utils/storage.ts` for backward-compatible tag persistence:
  - Extended `StorageData` interface: `{ columns: Column[]; tags: Tag[] }` with Tag import from types
  - Enhanced `loadFromStorage` with backward compatibility logic: parses stored JSON, returns `{ columns: parsed.columns || [], tags: parsed.tags || [] }` to handle older saves without tags property
  - Added JSDoc comment explaining backward compatibility handling for older localStorage data
- **TagSelector Component**: Created `src/components/TagSelector/TagSelector.tsx` as reusable tag selection UI:
  - TypeScript interface TagSelectorProps: availableTags (Tag[]), selectedTagIds (string[]), onTagToggle (callback), optional maxTags (number) for selection limit
  - Renders label "Tags" with uppercase styling, scrollable tag list (max-height 150px with custom scrollbar), maps availableTags to button chips
  - Each chip: type="button", clsx conditional className (styles.tagChip + tagChipSelected when selected), onClick triggers onTagToggle(tag.id), disabled when maxTags reached and not already selected, aria-pressed={isSelected} for accessibility, inline style sets --tag-color CSS custom property
  - Chip contents: colored dot span (styles.tagDot) + tag.label text
  - Empty state: "No tags selected" hint with italic styling when selectedTagIds.length === 0
  - Styled via `TagSelector.module.css`: selectorContainer with flex column layout, label with uppercase text-transform and letter-spacing, tagsList with flex wrap, scrollable area with rgba background and border, tagChip matching Card component tag styling (inline-flex, gap 0.25rem, color-mix backgrounds/borders, tag color from custom property), hover state (25% background opacity, 60% border opacity), tagChipSelected with 30% background and 2px solid border, disabled state with 0.4 opacity, tagDot with 6px circle, emptyHint with muted color, custom webkit scrollbar (6px width, cyan thumb), reduced-motion media query
- **TagManager Component**: Created `src/components/TagManager/TagManager.tsx` as comprehensive tag CRUD modal:
  - TypeScript interface TagManagerProps: isOpen (boolean), onClose (callback)
  - Preset color palette constant: 8 objects with name/hex (Cyan #4fd1ff, Purple #c084fc, Magenta #f472b6, Emerald #34d399, Gold #fbbf24, Yellow #facc15, Coral #f87171, Pink #fb7185)
  - Preset tag IDs constant: array of 9 hardcoded IDs (tag-react through tag-low) for read-only enforcement
  - Local state management: editingTagId (string | null) for edit mode tracking, newTagLabel/newTagColor (form inputs defaulting to '' and '#4fd1ff'), labelError (string) for validation messaging
  - Zustand selectors: tags array, addTag/updateTag/deleteTag actions pulled individually for re-render optimization
  - Three useEffect hooks: Escape key listener with cleanup, focus trap implementation (querySelectorAll focusable elements, Tab key handler for circular navigation), form reset when modal closes
  - Event handlers: handleCreateTag validates trimmed label, calls addTag action, resets form; handleUpdateTag validates and calls updateTag with editingTagId; handleDeleteTag shows window.confirm with cascade warning, calls deleteTag action; handleStartEdit populates form with tag data and sets editingTagId; handleCancelEdit resets form and editing state; handleOverlayClick closes on click outside
  - Utility function isPresetTag checks if tagId exists in PRESET_TAG_IDS array for UI restrictions
  - Modal structure: AnimatePresence wrapping overlay motion.div (fade animation), nested modal motion.div (fade + scale), header with title and close button (×), content section with create/edit form (label input, color picker with preset swatches grid + native input type="color", Create/Update + Cancel actions), tags list rendering all tags with preview chips and edit/delete icon buttons (disabled for preset tags)
  - Styled via `TagManager.module.css`: overlay with fixed positioning, backdrop-filter blur, z-index 1000; modal with glass-bg, max-width 600px, max-height 80vh scrollable; header/title/closeButton matching AddCardModal patterns; formSection with rgba background and border; label/input/error matching form styling with cyan focus states; colorPicker with grid layout (repeat(auto-fill, minmax(40px, 1fr))), colorSwatch 40x40 circular buttons with border transitions, colorSwatchSelected with cyan border and glow; tagsList with flex column, tagItem with space-between layout, tagPreview matching Card tag styling, tagActions with iconButton (32x32, edit ✎ and delete × characters), iconButtonDanger with coral hover, readOnly class with 0.6 opacity; mobile responsive adjustments (100% width, reduced padding, 36px swatches); reduced-motion support
- **AddCardModal Integration**: Updated `src/components/AddCardModal/AddCardModal.tsx` to include inline tag selection:
  - Imported TagSelector component and useBoardStore for accessing global tags state
  - Added local state: `selectedTagIds` using useState<string[]>([]) for tracking multi-select
  - Updated AddCardModalProps interface: onSubmit signature changed to `(title: string, description?: string, tagIds?: string[]) => void`
  - Added Zustand selector: `const availableTags = useBoardStore((state) => state.tags)`
  - Implemented handleTagToggle function: checks if tagId in selectedTagIds, filters out if present, appends if absent using setSelectedTagIds functional update
  - Updated handleSubmit to pass `selectedTagIds.length > 0 ? selectedTagIds : undefined` as third argument to onSubmit
  - Added selectedTagIds reset to empty array in form cleanup useEffect when isOpen becomes false
  - Rendered TagSelector component in form between description textarea and actions div with props: availableTags, selectedTagIds, onTagToggle={handleTagToggle}
- **Column Component Pass-Through**: Updated `src/components/Column/Column.tsx` to thread tag IDs through component chain:
  - Updated ColumnProps interface: onAddCard signature changed to `(columnId: string, title: string, description?: string, tagIds?: string[]) => void`
  - Updated handleSubmit function signature and implementation: accepts `tagIds?: string[]` parameter, passes through to onAddCard(id, cardTitle, cardDescription, tagIds)
- **Board Component UI Integration**: Updated `src/components/Board/Board.tsx` to provide TagManager access point:
  - Imported TagManager component
  - Added local state: isTagManagerOpen (boolean) with useState(false)
  - Implemented handlers: handleOpenTagManager sets true, handleCloseTagManager sets false
  - Rendered floating action button after DndContext closing tag: type="button", className={styles.manageTagsButton}, onClick={handleOpenTagManager}, aria-label="Manage tags", content 🏷 emoji
  - Rendered TagManager component with isOpen={isTagManagerOpen} and onClose={handleCloseTagManager}
  - Wrapped both board and floating button in React Fragment (<>...</>) since multiple root elements
  - Note: addCard action from store already has correct signature after store modifications, no changes needed to Column onAddCard prop binding
- **Board Button Styling**: Extended `src/components/Board/Board.module.css` with floating action button:
  - `.manageTagsButton`: position fixed, bottom calc(var(--spacing-xl) + 60px) positioned above footer, right var(--spacing-xl), 56px width/height, border-radius 50% for circle, flex centering, 1.5rem font-size for emoji, cursor pointer, z-index 100, transition all 0.3s ease, background var(--glass-bg), backdrop-filter blur(var(--glass-blur)), 2px solid var(--color-cyan) border, box-shadow 0 4px 16px rgba(79, 209, 255, 0.3) cyan glow
  - Hover state: transform translateY(-2px) scale(1.05) lift and grow, box-shadow 0 8px 24px rgba(79, 209, 255, 0.5) enhanced glow, background color-mix(in srgb, var(--color-cyan) 10%, var(--glass-bg)) subtle tint
  - Focus-visible: outline 2px solid var(--color-cyan), outline-offset 4px
  - Mobile responsive (@media max-width 768px): 48px width/height, 1.25rem font-size, adjusted bottom/right positioning with var(--spacing-lg)
  - Reduced-motion (@media prefers-reduced-motion): transition none, hover transform none to disable animations
- **Technical Architecture**: Global tag library in Zustand store prevents duplication and ensures consistency, tag IDs passed through component chain (Board → Column → AddCardModal) preserving React unidirectional data flow, tag ID to Tag object mapping happens at addCard action level using store.get() for current tags state, cascade delete implemented by filtering tag from tags array AND mapping through all columns/cards to remove references, preset vs custom tag distinction enforced via hardcoded ID array in TagManager for UI-level restrictions (could be enhanced with tag.preset boolean flag), debounced persistence (500ms) batches all tag operations for performance, backward-compatible storage schema allows seamless migration from tag-less state
- **Color System Integration**: 8 preset colors from established cyberpunk palette (cyan, purple, magenta, emerald, gold, yellow, coral, pink) as swatches in TagManager, native HTML color picker input for unlimited custom colors beyond presets, all tag colors stored as hex strings (not CSS variables) for portability and color picker compatibility, CSS custom property --tag-color propagated to tag chips for color-mix() backgrounds and borders maintaining consistent visual treatment across components
- **Accessibility Implementation**: TagManager modal with full focus trap (Tab cycling through focusable elements), Escape key handler for closing, ARIA dialog attributes (role="dialog", aria-modal="true", aria-labelledby), TagSelector chips with aria-pressed state indicating selection, all interactive elements (buttons, inputs, color swatches) keyboard navigable, semantic HTML (button, form, label, input), focus-visible outlines in cyan for keyboard navigation visibility, reduced-motion media query support in all animations (transitions, transforms), screen reader compatibility via descriptive ARIA labels on icon buttons
- **User Experience Flow**: Floating 🏷 button always accessible in bottom-right corner (z-index 100 above board but below modals), clicking opens TagManager modal for global tag management (create custom tags, edit labels/colors, delete with cascade confirmation), inline TagSelector in AddCardModal allows tag assignment without context switching, visual feedback: selected chips have solid borders and higher opacity, hover states on all interactive elements, empty state hints when no tags selected, form validation with error messaging, cascade delete confirmation prevents accidental tag removal
- **File Organization**: Created two new component directories following established pattern (TagSelector/, TagManager/) with co-located CSS Modules and TypeScript interfaces, updated existing components preserving structure and adding new functionality (AddCardModal gains TagSelector child, Column gains tagIds parameter pass-through, Board gains TagManager modal and floating button), extended core infrastructure (boardStore with tag state/actions, storage with tags persistence), all following TypeScript strict mode, functional React, CSS Modules conventions
- Completion marker: `~/.traycer/yolo_artifacts/f1b9995e-0196-44a1-92b1-ccfb73f1b04e.json`

## Open Follow-Ups
- No automated tests noted; consider adding coverage around tag management (CRUD operations, cascade delete, preset vs custom tags), drag-and-drop behavior, component rendering, localStorage persistence (including backward compatibility), form validation, and animation behavior.
- **Next Features**: Card editing modal (updateCard action exists but no UI), keyboard shortcuts for power users, card filtering/search by tags or text, and card archiving/completion workflows.
