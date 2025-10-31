/**
 * Zustand store for board state management
 * Single source of truth for columns, cards, and board actions
 */

import { create } from 'zustand';
import type { Column, Card } from '../types';
import { loadFromStorage, debouncedSaveToStorage } from '../utils/storage';

// Board state interface
interface BoardState {
  columns: Column[];
  loading?: boolean; // Optional for future use
}

// Board actions interface
interface BoardActions {
  /**
   * Adds a new card to a specific column
   * @param columnId - Target column ID
   * @param title - Card title (required)
   * @param description - Card description (optional)
   */
  addCard: (columnId: string, title: string, description?: string) => void;

  /**
   * Updates an existing card's properties
   * @param cardId - Target card ID
   * @param updates - Partial card properties to update
   */
  updateCard: (
    cardId: string,
    updates: Partial<Pick<Card, 'title' | 'description'>>
  ) => void;

  /**
   * Deletes a card from its column
   * @param cardId - Target card ID to delete
   */
  deleteCard: (cardId: string) => void;

  /**
   * Moves a card from one column to another
   * @param cardId - Card ID to move
   * @param sourceColumnId - Source column ID
   * @param destinationColumnId - Destination column ID
   * @param destinationIndex - Index in destination column
   */
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ) => void;

  /**
   * Reorders cards within a single column
   * @param columnId - Target column ID
   * @param cardIds - New ordered array of card IDs
   */
  reorderCards: (columnId: string, cardIds: string[]) => void;

  /**
   * Loads board state from localStorage
   */
  loadFromStorage: () => void;
}

// Combined store type
type BoardStore = BoardState & BoardActions;

// Initial sample data migrated from Board.tsx
const initialColumns: Column[] = [
  {
    id: 'ideas',
    title: 'Ideas',
    subtitle: 'Raw sparks and moonshots waiting for definition',
    accentColor: 'var(--color-cyan)',
    cards: [
      {
        id: 'card-1',
        title: 'AI-powered task prioritization',
        description: 'Explore machine learning models for automatic task priority suggestions',
        tags: [
          { id: 'tag-1', label: 'React', color: 'var(--color-cyan)' },
          { id: 'tag-2', label: 'Critical', color: 'var(--color-coral)' }
        ],
        columnId: 'ideas'
      },
      {
        id: 'card-2',
        title: 'Dark mode toggle',
        tags: [
          { id: 'tag-3', label: 'UI/UX', color: 'var(--color-magenta)' },
          { id: 'tag-4', label: 'Medium', color: 'var(--color-gold)' }
        ],
        columnId: 'ideas'
      }
    ]
  },
  {
    id: 'planning',
    title: 'Planning',
    subtitle: 'Shaping narratives, estimations, and architecture maps',
    accentColor: 'var(--color-purple)',
    cards: [
      {
        id: 'card-3',
        title: 'Design tag system architecture',
        description: 'Define data structures and API endpoints for tag CRUD operations',
        tags: [
          { id: 'tag-5', label: 'API', color: 'var(--color-purple)' },
          { id: 'tag-6', label: 'Database', color: 'var(--color-gold)' }
        ],
        columnId: 'planning'
      },
      {
        id: 'card-4',
        title: 'Accessibility audit checklist',
        tags: [
          { id: 'tag-7', label: 'UI/UX', color: 'var(--color-magenta)' },
          { id: 'tag-8', label: 'High', color: 'var(--color-magenta)' }
        ],
        columnId: 'planning'
      }
    ]
  },
  {
    id: 'coding',
    title: 'Coding',
    subtitle: 'Deep work, flow state, and commits with intent',
    accentColor: 'var(--color-emerald)',
    cards: [
      {
        id: 'card-5',
        title: 'Implement drag-and-drop with @dnd-kit',
        description: 'Integrate accessible drag-and-drop for card movement between columns',
        tags: [
          { id: 'tag-9', label: 'React', color: 'var(--color-cyan)' },
          { id: 'tag-10', label: 'High', color: 'var(--color-magenta)' }
        ],
        columnId: 'coding'
      },
      {
        id: 'card-6',
        title: 'LocalStorage persistence layer',
        tags: [
          { id: 'tag-11', label: 'API', color: 'var(--color-purple)' },
          { id: 'tag-12', label: 'Medium', color: 'var(--color-gold)' }
        ],
        columnId: 'coding'
      }
    ]
  },
  {
    id: 'testing',
    title: 'Testing',
    subtitle: 'Validation passes, QA scripts, and stress harnesses',
    accentColor: 'var(--color-gold)',
    cards: [
      {
        id: 'card-7',
        title: 'Keyboard navigation testing',
        description: 'Verify all interactive elements are accessible via keyboard shortcuts',
        tags: [
          { id: 'tag-13', label: 'UI/UX', color: 'var(--color-magenta)' },
          { id: 'tag-14', label: 'Critical', color: 'var(--color-coral)' }
        ],
        columnId: 'testing'
      }
    ]
  },
  {
    id: 'deployed',
    title: 'Deployed',
    subtitle: 'Shipped to production and celebrated with the squad',
    accentColor: 'var(--color-magenta)',
    cards: [
      {
        id: 'card-8',
        title: 'Cyberpunk design system',
        description: 'Glass-morphism utilities and neon color palette established',
        tags: [
          { id: 'tag-15', label: 'UI/UX', color: 'var(--color-magenta)' },
          { id: 'tag-16', label: 'React', color: 'var(--color-cyan)' }
        ],
        columnId: 'deployed'
      },
      {
        id: 'card-9',
        title: 'Typewriter animation hook',
        tags: [
          { id: 'tag-17', label: 'React', color: 'var(--color-cyan)' },
          { id: 'tag-18', label: 'Low', color: 'var(--color-cyan)' }
        ],
        columnId: 'deployed'
      }
    ]
  }
];

// Create Zustand store
export const useBoardStore = create<BoardStore>((set, get) => ({
  // Initial state
  columns: initialColumns,
  loading: false,

  // Add a new card to a column
  addCard: (columnId: string, title: string, description?: string) => {
    // Generate unique ID using crypto API or fallback
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `card-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const newCard: Card = {
      id: newId,
      title,
      description,
      tags: [],
      columnId
    };

    set((state) => {
      const updatedColumns = state.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: [...column.cards, newCard]
          };
        }
        return column;
      });

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns });

      return { columns: updatedColumns };
    });
  },

  // Update an existing card
  updateCard: (
    cardId: string,
    updates: Partial<Pick<Card, 'title' | 'description'>>
  ) => {
    set((state) => {
      const updatedColumns = state.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === cardId ? { ...card, ...updates } : card
        )
      }));

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns });

      return { columns: updatedColumns };
    });
  },

  // Delete a card from its column
  deleteCard: (cardId: string) => {
    set((state) => {
      const updatedColumns = state.columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId)
      }));

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns });

      return { columns: updatedColumns };
    });
  },

  // Move a card from one column to another
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ): void => {
    set((state) => {
      // Find the card in the source column
      let cardToMove: Card | undefined;
      const sourceColumn = state.columns.find((col) => col.id === sourceColumnId);
      if (sourceColumn) {
        cardToMove = sourceColumn.cards.find((card) => card.id === cardId);
      }

      if (!cardToMove) {
        return state; // Card not found, no changes
      }

      // Create updated columns
      const updatedColumns = state.columns.map((column) => {
        // Remove card from source column
        if (column.id === sourceColumnId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId)
          };
        }

        // Add card to destination column at specified index
        if (column.id === destinationColumnId) {
          const newCards = [...column.cards];
          const updatedCard = { ...cardToMove, columnId: destinationColumnId };
          newCards.splice(destinationIndex, 0, updatedCard);
          return {
            ...column,
            cards: newCards
          };
        }

        return column;
      });

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns });

      return { columns: updatedColumns };
    });
  },

  // Reorder cards within a single column
  reorderCards: (columnId: string, cardIds: string[]): void => {
    set((state) => {
      const updatedColumns = state.columns.map((column) => {
        if (column.id === columnId) {
          // Create a map of card IDs to card objects for efficient lookup
          const cardMap = new Map(column.cards.map((card) => [card.id, card]));

          // Reorder cards based on the new card IDs array
          const reorderedCards: Card[] = [];
          for (const cardId of cardIds) {
            const card = cardMap.get(cardId);
            if (card) {
              reorderedCards.push(card);
            }
          }

          return {
            ...column,
            cards: reorderedCards
          };
        }
        return column;
      });

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns });

      return { columns: updatedColumns };
    });
  },

  // Load state from localStorage
  loadFromStorage: () => {
    const stored = loadFromStorage();
    if (stored && stored.columns) {
      set({ columns: stored.columns });
    }
  }
}));
