import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Tag } from '../../types';
import styles from './Card.module.css';

interface CardProps {
  id: string;
  title: string;
  description?: string;
  tags: Tag[];
  onDelete: () => void;
  activeId?: string | null;
}

const Card: React.FC<CardProps> = ({ id, title, description, tags, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  // Create accessible label for screen readers
  const ariaLabel = `Card: ${title}${description ? '. ' + description.substring(0, 50) + (description.length > 50 ? '...' : '') : ''}${tags.length > 0 ? `. Tags: ${tags.map(t => t.label).join(', ')}` : ''}`;

  return (
    <motion.article
      ref={setNodeRef}
      className={clsx('glass-panel', styles.card, isDragging && styles.cardDragging)}
      layout={!isDragging}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={style}
      aria-label={ariaLabel}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete card"
      >
        ×
      </button>

      <h3 className={styles.cardTitle}>{title}</h3>

      {description && (
        <p className={styles.cardDescription}>{description}</p>
      )}

      {tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={styles.tag}
              style={{ '--tag-color': tag.color } as React.CSSProperties}
            >
              <span className={styles.tagDot} />
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
};

export default Card;
