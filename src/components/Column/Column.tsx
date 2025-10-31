import React, { useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Card } from '../../types';
import CardComponent from '../Card/Card';
import AddCardButton from '../AddCardButton/AddCardButton';
import AddCardModal from '../AddCardModal/AddCardModal';
import styles from './Column.module.css';

interface ColumnProps {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  cards: Card[];
  onAddCard: (columnId: string, title: string, description?: string, tagIds?: string[]) => void;
  onDeleteCard: (cardId: string) => void;
  activeId: string | null;
}

const Column: React.FC<ColumnProps> = ({
  id,
  title,
  subtitle,
  accentColor,
  cards,
  onAddCard,
  onDeleteCard,
  activeId
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Make column droppable for empty column drops
  const { setNodeRef, isOver } = useDroppable({
    id
  });

  const cardCount = cards.length;
  const cardCountText = cardCount === 1 ? '1 card' : `${cardCount} cards`;

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleSubmit = (cardTitle: string, cardDescription?: string, tagIds?: string[]): void => {
    onAddCard(id, cardTitle, cardDescription, tagIds);
  };

  const handleDeleteCard = (cardId: string): void => {
    onDeleteCard(cardId);
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx('glass-panel', styles.column, isOver && styles.columnDropTarget)}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
      aria-label={`${title} column with ${cardCount} ${cardCount === 1 ? 'card' : 'cards'}`}
    >
      <div className={styles.accentBar} />

      <div className={styles.header}>
        <h2 className={styles.columnTitle}>{title}</h2>
        <p className={styles.columnSubtitle}>{subtitle}</p>
        <span className={styles.cardCount}>{cardCountText}</span>
      </div>

      <AddCardButton onClick={handleOpenModal} />

      <div className={styles.cardsContainer}>
        {cards.length === 0 ? (
          <p className={styles.emptyState}>No cards yet</p>
        ) : (
          <SortableContext
            id={id}
            items={cards.map((card) => card.id)}
            strategy={rectSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {cards.map((card) => (
                <CardComponent
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  tags={card.tags}
                  onDelete={() => handleDeleteCard(card.id)}
                  activeId={activeId}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        )}
      </div>

      <AddCardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        columnTitle={title}
      />
    </div>
  );
};

export default Column;
