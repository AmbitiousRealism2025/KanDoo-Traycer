import React, { useEffect, useState } from 'react';
import {
  DndContext,
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
import styles from './Board.module.css';

const Board: React.FC = () => {
  const columns = useBoardStore((state) => state.columns);
  const addCard = useBoardStore((state) => state.addCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const moveCard = useBoardStore((state) => state.moveCard);
  const reorderCards = useBoardStore((state) => state.reorderCards);
  const loadFromStorage = useBoardStore((state) => state.loadFromStorage);

  const [activeId, setActiveId] = useState<string | null>(null);

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

  // Handle drag start
  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id as string);
  };

  // Handle drag over for cross-column moves
  const handleDragOver = (event: DragOverEvent): void => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source column (column containing the active card)
    const sourceColumn = columns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );

    if (!sourceColumn) return;

    // Determine if overId is a column or a card
    const destinationColumn =
      columns.find((col) => col.id === overId) ||
      columns.find((col) => col.cards.some((card) => card.id === overId));

    if (!destinationColumn || sourceColumn.id === destinationColumn.id) {
      return; // Same column or invalid destination
    }

    // Calculate insertion index
    const overIndex = destinationColumn.cards.findIndex(
      (card) => card.id === overId
    );
    const destinationIndex = overIndex >= 0 ? overIndex : destinationColumn.cards.length;

    // Move card to new column
    moveCard(activeId, sourceColumn.id, destinationColumn.id, destinationIndex);
  };

  // Handle drag end for within-column reordering
  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the column containing the active card
    const column = columns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );

    if (!column) return;

    // Check if both cards are in the same column
    const isInSameColumn = column.cards.some((card) => card.id === overId);

    if (isInSameColumn) {
      const oldIndex = column.cards.findIndex((card) => card.id === activeId);
      const newIndex = column.cards.findIndex((card) => card.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const cardIds = column.cards.map((card) => card.id);
        const reorderedCardIds = arrayMove(cardIds, oldIndex, newIndex);
        reorderCards(column.id, reorderedCardIds);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
  );
};

export default Board;
