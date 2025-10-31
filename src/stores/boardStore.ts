/**
 * Zustand store for board state management
 * Single source of truth for columns, cards, and board actions
 */

import { create } from 'zustand';
import type { Column, Card, Tag } from '../types';
import { loadFromStorage, debouncedSaveToStorage } from '../utils/storage';

// Board state interface
interface BoardState {
  columns: Column[];
  tags: Tag[];
  loading?: boolean; // Optional for future use
}

// Board actions interface
interface BoardActions {
  /**
   * Adds a new card to a specific column
   * @param columnId - Target column ID
   * @param title - Card title (required)
   * @param description - Card description (optional)
   * @param tagIds - Array of tag IDs to associate with card (optional)
   */
  addCard: (columnId: string, title: string, description?: string, tagIds?: string[]) => void;

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
    destinationIndex: number,
    persist?: boolean
  ) => void;

  /**
   * Reorders cards within a single column
   * @param columnId - Target column ID
   * @param cardIds - New ordered array of card IDs
   */
  reorderCards: (columnId: string, cardIds: string[], persist?: boolean) => void;

  /**
   * Adds a new custom tag to the global tags array
   * @param label - Tag label text
   * @param color - Tag color (hex or CSS variable)
   */
  addTag: (label: string, color: string) => void;

  /**
   * Updates an existing tag's properties
   * @param tagId - Target tag ID
   * @param updates - Partial tag properties to update
   */
  updateTag: (tagId: string, updates: Partial<Pick<Tag, 'label' | 'color'>>) => void;

  /**
   * Deletes a tag and removes it from all cards (cascade delete)
   * @param tagId - Target tag ID to delete
   */
  deleteTag: (tagId: string) => void;

  /**
   * Adds a tag to a specific card
   * @param cardId - Target card ID
   * @param tagId - Tag ID to add
   */
  addTagToCard: (cardId: string, tagId: string) => void;

  /**
   * Removes a tag from a specific card
   * @param cardId - Target card ID
   * @param tagId - Tag ID to remove
   */
  removeTagFromCard: (cardId: string, tagId: string) => void;

  /**
   * Loads board state from localStorage
   */
  loadFromStorage: () => void;
}

// Combined store type
type BoardStore = BoardState & BoardActions;

// Initial preset tags (Tech Stack + Priority)
const initialTags: Tag[] = [
  // Tech Stack tags
  { id: 'tag-react', label: 'React', color: '#4fd1ff' },
  { id: 'tag-python', label: 'Python', color: '#34d399' },
  { id: 'tag-api', label: 'API', color: '#c084fc' },
  { id: 'tag-database', label: 'Database', color: '#fbbf24' },
  { id: 'tag-uiux', label: 'UI/UX', color: '#f472b6' },
  // Priority tags
  { id: 'tag-critical', label: 'Critical', color: '#f87171' },
  { id: 'tag-high', label: 'High', color: '#fb7185' },
  { id: 'tag-medium', label: 'Medium', color: '#facc15' },
  { id: 'tag-low', label: 'Low', color: '#4fd1ff' }
];

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
          { id: 'tag-react', label: 'React', color: '#4fd1ff' },
          { id: 'tag-critical', label: 'Critical', color: '#f87171' }
        ],
        columnId: 'ideas'
      },
      {
        id: 'card-2',
        title: 'Dark mode toggle',
        tags: [
          { id: 'tag-uiux', label: 'UI/UX', color: '#f472b6' },
          { id: 'tag-medium', label: 'Medium', color: '#facc15' }
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
          { id: 'tag-api', label: 'API', color: '#c084fc' },
          { id: 'tag-database', label: 'Database', color: '#fbbf24' }
        ],
        columnId: 'planning'
      },
      {
        id: 'card-4',
        title: 'Accessibility audit checklist',
        tags: [
          { id: 'tag-uiux', label: 'UI/UX', color: '#f472b6' },
          { id: 'tag-high', label: 'High', color: '#fb7185' }
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
          { id: 'tag-react', label: 'React', color: '#4fd1ff' },
          { id: 'tag-high', label: 'High', color: '#fb7185' }
        ],
        columnId: 'coding'
      },
      {
        id: 'card-6',
        title: 'LocalStorage persistence layer',
        tags: [
          { id: 'tag-api', label: 'API', color: '#c084fc' },
          { id: 'tag-medium', label: 'Medium', color: '#facc15' }
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
          { id: 'tag-uiux', label: 'UI/UX', color: '#f472b6' },
          { id: 'tag-critical', label: 'Critical', color: '#f87171' }
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
          { id: 'tag-uiux', label: 'UI/UX', color: '#f472b6' },
          { id: 'tag-react', label: 'React', color: '#4fd1ff' }
        ],
        columnId: 'deployed'
      },
      {
        id: 'card-9',
        title: 'Typewriter animation hook',
        tags: [
          { id: 'tag-react', label: 'React', color: '#4fd1ff' },
          { id: 'tag-low', label: 'Low', color: '#4fd1ff' }
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
  tags: initialTags,
  loading: false,

  // Add a new card to a column
  addCard: (columnId: string, title: string, description?: string, tagIds?: string[]) => {
    // Generate unique ID using crypto API or fallback
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `card-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Map tagIds to full Tag objects from store's tags array
    const state = get();
    const cardTags: Tag[] = tagIds
      ? tagIds
          .map((tagId) => state.tags.find((tag) => tag.id === tagId))
          .filter((tag): tag is Tag => tag !== undefined)
      : [];

    const newCard: Card = {
      id: newId,
      title,
      description,
      tags: cardTags,
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
      debouncedSaveToStorage({ columns: updatedColumns, tags: state.tags });

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
      debouncedSaveToStorage({ columns: updatedColumns, tags: state.tags });

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
      debouncedSaveToStorage({ columns: updatedColumns, tags: state.tags });

      return { columns: updatedColumns };
    });
  },

  // Move a card from one column to another
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number,
    persist = true
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

      if (persist) {
        // Debounced save to localStorage
        debouncedSaveToStorage({ columns: updatedColumns, tags: state.tags });
      }

      return { columns: updatedColumns };
    });
  },

  // Reorder cards within a single column
  reorderCards: (columnId: string, cardIds: string[], persist = true): void => {
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

      if (persist) {
        // Debounced save to localStorage
        debouncedSaveToStorage({ columns: updatedColumns, tags: state.tags });
      }

      return { columns: updatedColumns };
    });
  },

  // Add a new custom tag
  addTag: (label: string, color: string) => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `tag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const newTag: Tag = {
      id: newId,
      label,
      color
    };

    set((state) => {
      const updatedTags = [...state.tags, newTag];

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: state.columns, tags: updatedTags });

      return { tags: updatedTags };
    });
  },

  // Update an existing tag
  updateTag: (tagId: string, updates: Partial<Pick<Tag, 'label' | 'color'>>) => {
    set((state) => {
      const updatedTags = state.tags.map((tag) =>
        tag.id === tagId ? { ...tag, ...updates } : tag
      );

      // Find the updated tag object
      const updatedTag = updatedTags.find((tag) => tag.id === tagId);
      if (!updatedTag) {
        return state;
      }

      // Propagate tag updates to all cards that use this tag
      const updatedColumns = state.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => ({
          ...card,
          tags: card.tags.map((tag) =>
            tag.id === tagId ? updatedTag : tag
          )
        }))
      }));

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns, tags: updatedTags });

      return { columns: updatedColumns, tags: updatedTags };
    });
  },

  // Delete a tag and cascade remove from all cards
  deleteTag: (tagId: string) => {
    set((state) => {
      // Remove tag from global tags array
      const updatedTags = state.tags.filter((tag) => tag.id !== tagId);

      // Remove tag from all cards (cascade delete)
      const updatedColumns = state.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => ({
          ...card,
          tags: card.tags.filter((tag) => tag.id !== tagId)
        }))
      }));

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns, tags: updatedTags });

      return { columns: updatedColumns, tags: updatedTags };
    });
  },

  // Add a tag to a specific card
  addTagToCard: (cardId: string, tagId: string) => {
    set((state) => {
      // Find the tag in the tags array
      const tag = state.tags.find((t) => t.id === tagId);
      if (!tag) return state;

      const updatedColumns = state.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => {
          if (card.id === cardId) {
            // Check if tag already exists on card
            const hasTag = card.tags.some((t) => t.id === tagId);
            if (hasTag) return card;

            return {
              ...card,
              tags: [...card.tags, tag]
            };
          }
          return card;
        })
      }));

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns, tags: state.tags });

      return { columns: updatedColumns };
    });
  },

  // Remove a tag from a specific card
  removeTagFromCard: (cardId: string, tagId: string) => {
    set((state) => {
      const updatedColumns = state.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => {
          if (card.id === cardId) {
            return {
              ...card,
              tags: card.tags.filter((tag) => tag.id !== tagId)
            };
          }
          return card;
        })
      }));

      // Debounced save to localStorage
      debouncedSaveToStorage({ columns: updatedColumns, tags: state.tags });

      return { columns: updatedColumns };
    });
  },

  // Load state from localStorage
  loadFromStorage: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({
        columns: stored.columns && stored.columns.length > 0 ? stored.columns : initialColumns,
        tags: stored.tags && stored.tags.length > 0 ? stored.tags : initialTags
      });
    }
  }
}));
