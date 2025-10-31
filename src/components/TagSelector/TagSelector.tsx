/**
 * TagSelector component for selecting tags to associate with cards
 * Displays available tags as clickable chips with visual feedback
 */

import React from 'react';
import clsx from 'clsx';
import type { Tag } from '../../types';
import styles from './TagSelector.module.css';

export interface TagSelectorProps {
  availableTags: Tag[];
  selectedTagIds: string[];
  onTagToggle: (tagId: string) => void;
  maxTags?: number;
}

export default function TagSelector({
  availableTags,
  selectedTagIds,
  onTagToggle,
  maxTags
}: TagSelectorProps): JSX.Element {
  return (
    <div className={styles.selectorContainer}>
      <label className={styles.label}>Tags</label>
      <div className={styles.tagsList}>
        {availableTags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          const isDisabled =
            maxTags !== undefined &&
            selectedTagIds.length >= maxTags &&
            !isSelected;

          return (
            <button
              key={tag.id}
              type="button"
              className={clsx(
                styles.tagChip,
                isSelected && styles.tagChipSelected
              )}
              onClick={() => onTagToggle(tag.id)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              style={{ '--tag-color': tag.color } as React.CSSProperties}
            >
              <span className={styles.tagDot} />
              {tag.label}
            </button>
          );
        })}
      </div>
      {selectedTagIds.length === 0 && (
        <p className={styles.emptyHint}>No tags selected</p>
      )}
    </div>
  );
}
