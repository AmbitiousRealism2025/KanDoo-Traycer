import React, { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useBoardStore } from '../../stores/boardStore';
import ColumnComponent from '../Column/Column';
import TagManager from '../TagManager/TagManager';
import styles from './Board.module.css';

const Board: React.FC = () => {
  const columns = useBoardStore((state) => state.columns);
  const addCard = useBoardStore((state) => state.addCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const moveCard = useBoardStore((state) => state.moveCard);
  const reorderCards = useBoardStore((state) => state.reorderCards);
  const loadFromStorage = useBoardStore((state) => state.loadFromStorage);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const dragOriginRef = useRef<{
    cardId: string;
    columnId: string;
    index: number;
  } | null>(null);

  // Initialize sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Load state from localStorage on component mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleOpenTagManager = (): void => {
    setIsTagManagerOpen(true);
  };

  const handleCloseTagManager = (): void => {
    setIsTagManagerOpen(false);
  };

  const restoreCardToOrigin = (cardId: string): void => {
    const origin = dragOriginRef.current;

    if (!origin || origin.cardId !== cardId) {
      dragOriginRef.current = null;
      return;
    }

    const { columns: latestColumns } = useBoardStore.getState();
    const currentColumn = latestColumns.find((col) =>
      col.cards.some((card) => card.id === cardId)
    );

    if (!currentColumn) {
      dragOriginRef.current = null;
      return;
    }

    const currentColumnId = currentColumn.id;

    if (currentColumnId !== origin.columnId) {
      moveCard(cardId, currentColumnId, origin.columnId, origin.index);
      dragOriginRef.current = null;
      return;
    }

    const currentIndex = currentColumn.cards.findIndex(
      (card) => card.id === cardId
    );

    if (currentIndex !== -1 && currentIndex !== origin.index) {
      const cardIds = currentColumn.cards.map((card) => card.id);
      const reorderedCardIds = arrayMove(cardIds, currentIndex, origin.index);
      reorderCards(currentColumnId, reorderedCardIds);
    }

    dragOriginRef.current = null;
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent): void => {
    const activeCardId = event.active.id as string;
    setActiveId(activeCardId);

    const { columns: latestColumns } = useBoardStore.getState();
    const sourceColumn = latestColumns.find((col) =>
      col.cards.some((card) => card.id === activeCardId)
    );

    if (!sourceColumn) {
      dragOriginRef.current = null;
      return;
    }

    const originalIndex = sourceColumn.cards.findIndex(
      (card) => card.id === activeCardId
    );

    dragOriginRef.current = {
      cardId: activeCardId,
      columnId: sourceColumn.id,
      index: originalIndex
    };
  };

  // Handle drag over for cross-column moves
  const handleDragOver = (event: DragOverEvent): void => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source column (column containing the active card)
    const { columns: latestColumns } = useBoardStore.getState();
    const sourceColumn = latestColumns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );

    if (!sourceColumn) return;

    // Determine if overId is a column or a card
    const destinationColumn =
      latestColumns.find((col) => col.id === overId) ||
      latestColumns.find((col) => col.cards.some((card) => card.id === overId));

    if (!destinationColumn || sourceColumn.id === destinationColumn.id) {
      return; // Same column or invalid destination
    }

    // Calculate insertion index
    const overIndex = destinationColumn.cards.findIndex(
      (card) => card.id === overId
    );
    const destinationIndex = overIndex >= 0 ? overIndex : destinationColumn.cards.length;

    // Move card to new column
    moveCard(activeId, sourceColumn.id, destinationColumn.id, destinationIndex, false);
  };

  // Handle drag cancel to restore original position
  const handleDragCancel = (event: DragCancelEvent): void => {
    const canceledId = event.active.id as string;
    setActiveId(null);
    restoreCardToOrigin(canceledId);
  };

  // Handle drag end for within-column reordering and persistence
  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    const activeCardId = active.id as string;

    setActiveId(null);

    if (!over) {
      restoreCardToOrigin(activeCardId);
      return;
    }

    const overId = over.id as string;

    if (overId === activeCardId) {
      dragOriginRef.current = null;
      return;
    }

    const { columns: latestColumns } = useBoardStore.getState();
    const currentColumn = latestColumns.find((col) =>
      col.cards.some((card) => card.id === activeCardId)
    );

    if (!currentColumn) {
      dragOriginRef.current = null;
      return;
    }

    const origin = dragOriginRef.current;
    const movedAcrossColumns =
      origin?.cardId === activeCardId && origin.columnId !== currentColumn.id;

    const isDroppingOnColumnBackground = overId === currentColumn.id;
    const isInSameColumn = currentColumn.cards.some(
      (card) => card.id === overId
    );

    if (isDroppingOnColumnBackground) {
      const cardIds = currentColumn.cards.map((card) => card.id);
      const currentIndex = cardIds.indexOf(activeCardId);
      const targetIndex = cardIds.length - 1;

      if (currentIndex !== -1 && currentIndex !== targetIndex) {
        const reorderedCardIds = arrayMove(cardIds, currentIndex, targetIndex);
        reorderCards(currentColumn.id, reorderedCardIds);
      } else if (movedAcrossColumns) {
        reorderCards(currentColumn.id, cardIds);
      }

      dragOriginRef.current = null;
      return;
    }

    if (isInSameColumn) {
      const cardIds = currentColumn.cards.map((card) => card.id);
      const oldIndex = cardIds.indexOf(activeCardId);
      const newIndex = cardIds.indexOf(overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedCardIds = arrayMove(cardIds, oldIndex, newIndex);
        reorderCards(currentColumn.id, reorderedCardIds);
      } else if (movedAcrossColumns && oldIndex !== -1) {
        reorderCards(currentColumn.id, cardIds);
      }

      dragOriginRef.current = null;
      return;
    }

    const destinationColumn =
      latestColumns.find((col) => col.id === overId) ||
      latestColumns.find((col) =>
        col.cards.some((card) => card.id === overId)
      );

    if (!destinationColumn) {
      restoreCardToOrigin(activeCardId);
      return;
    }

    const destinationIndex =
      destinationColumn.id === overId
        ? destinationColumn.cards.length
        : destinationColumn.cards.findIndex((card) => card.id === overId);

    const insertionIndex =
      destinationIndex >= 0 ? destinationIndex : destinationColumn.cards.length;

    moveCard(
      activeCardId,
      currentColumn.id,
      destinationColumn.id,
      insertionIndex
    );

    dragOriginRef.current = null;
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {columns.map((column) => (
            <ColumnComponent
              key={column.id}
              id={column.id}
              title={column.title}
              subtitle={column.subtitle}
              accentColor={column.accentColor}
              cards={column.cards}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
              activeId={activeId}
            />
          ))}
        </div>
      </DndContext>

      <button
        type="button"
        className={styles.manageTagsButton}
        onClick={handleOpenTagManager}
        aria-label="Manage tags"
      >
        🏷
      </button>

      <TagManager isOpen={isTagManagerOpen} onClose={handleCloseTagManager} />
    </>
  );
};

export default Board;
