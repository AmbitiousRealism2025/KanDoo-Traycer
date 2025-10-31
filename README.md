# Kandoo Flowboard

A cyberpunk glass-morphic kanban board application for managing your workflow with style.

## Tech Stack

- **React 18** - Modern UI library with concurrent features
- **TypeScript** - Type-safe development with strict mode enabled
- **Vite** - Fast build tool and development server
- **Zustand** - Lightweight state management
- **@dnd-kit** - Accessible drag-and-drop functionality
- **Framer Motion** - Physics-based animations
- **clsx** - Conditional CSS class utility

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # React components
│   ├── Header/         # Animated header with typewriter effect
│   ├── Footer/         # Coordinated footer animation
│   ├── Board/          # Main kanban board container
│   ├── Column/         # Individual workflow columns
│   ├── Card/           # Task cards with delete functionality
│   ├── AddCardButton/  # Card creation trigger button
│   ├── AddCardModal/   # Modal dialog for card creation
│   └── CodeRain/       # Background code animation
├── hooks/          # Custom React hooks (useTypewriter, useCodeRainAnimation)
├── stores/         # Zustand state management (boardStore)
├── types/          # TypeScript type definitions (Card, Column, Tag)
├── styles/         # CSS modules and global cyberpunk design system
└── utils/          # Utility functions (localStorage persistence)
```

## Features

### Workflow Columns

1. **Ideas** - Concepts and feature pitches awaiting prioritization
2. **Planning** - Tasks being refined and sequenced for delivery
3. **Coding** - Active development work underway
4. **Testing** - Validation and QA before release
5. **Deployed** - Shipped work available to end users

### ✅ Implemented Features

- **Card Management** - Create and delete cards with smooth animations
- **Modal Interface** - Professional dialog for card creation with form validation
- **State Persistence** - Automatic localStorage saving with 500ms debouncing
- **Accessibility** - Full keyboard navigation, ARIA attributes, focus management
- **Cyberpunk Aesthetic** - Glass-morphism design with neon accents and code rain background
- **Responsive Design** - Mobile-first layout adapting to all screen sizes
- **Animations** - Framer Motion entrance/exit effects with reduced-motion support
- **Type Safety** - TypeScript strict mode throughout the entire codebase

### 🔄 Planned Features

- **Drag-and-Drop** - Card movement between columns using @dnd-kit
- **Card Editing** - Update existing card titles and descriptions
- **Tag System** - Color-coded labels with creation and assignment UI
- **Keyboard Shortcuts** - Power user commands for efficient workflow

## Development Notes

### Phase Completion Status

- ✅ **Phase 1**: Layout & Animation Foundation (Header, Footer, CodeRain)
- ✅ **Phase 2**: Board Component Implementation (Board, Column, Card)
- ✅ **Phase 2.5**: CodeRain Background Animation
- ✅ **Phase 3**: Interactive Card Management (Add/Delete with persistence)
- 🔄 **Phase 4**: Drag-and-Drop & Advanced Features (Next)

### Code Standards

- **TypeScript Strict Mode**: All code follows strict type checking
- **Functional Components**: React hooks-based architecture
- **CSS Modules**: Component-scoped styling with cyberpunk design system
- **Accessibility First**: ARIA labels, keyboard navigation, reduced-motion support
- **Performance**: Debounced saves, optimized re-renders, 60fps animations

### For Contributors

See `.claude/CLAUDE.md` for detailed project instructions and `agents.md` for implementation history.
