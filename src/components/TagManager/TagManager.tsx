/**
 * TagManager component for managing global tags
 * Allows creating, editing, and deleting tags with cascade operations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { Tag } from '../../types';
import { useBoardStore } from '../../stores/boardStore';
import styles from './TagManager.module.css';

export interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset color palette
const PRESET_COLORS = [
  { name: 'Cyan', hex: '#4fd1ff' },
  { name: 'Purple', hex: '#c084fc' },
  { name: 'Magenta', hex: '#f472b6' },
  { name: 'Emerald', hex: '#34d399' },
  { name: 'Gold', hex: '#fbbf24' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'Coral', hex: '#f87171' },
  { name: 'Pink', hex: '#fb7185' }
];

// IDs of preset tags that should be read-only
const PRESET_TAG_IDS = [
  'tag-react',
  'tag-python',
  'tag-api',
  'tag-database',
  'tag-uiux',
  'tag-critical',
  'tag-high',
  'tag-medium',
  'tag-low'
];

export default function TagManager({
  isOpen,
  onClose
}: TagManagerProps): JSX.Element {
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4fd1ff');
  const [labelError, setLabelError] = useState('');

  const tags = useBoardStore((state) => state.tags);
  const addTag = useBoardStore((state) => state.addTag);
  const updateTag = useBoardStore((state) => state.updateTag);
  const deleteTag = useBoardStore((state) => state.deleteTag);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = document.querySelector('[role="dialog"]');
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTab = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalElement.addEventListener('keydown', handleTab as EventListener);
    firstElement?.focus();

    return () => {
      modalElement.removeEventListener('keydown', handleTab as EventListener);
    };
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEditingTagId(null);
      setNewTagLabel('');
      setNewTagColor('#4fd1ff');
      setLabelError('');
    }
  }, [isOpen]);

  const handleCreateTag = (): void => {
    const trimmedLabel = newTagLabel.trim();

    if (!trimmedLabel) {
      setLabelError('Label is required');
      return;
    }

    addTag(trimmedLabel, newTagColor);
    setNewTagLabel('');
    setNewTagColor('#4fd1ff');
    setLabelError('');
  };

  const handleUpdateTag = (): void => {
    if (!editingTagId) return;

    const trimmedLabel = newTagLabel.trim();

    if (!trimmedLabel) {
      setLabelError('Label is required');
      return;
    }

    updateTag(editingTagId, { label: trimmedLabel, color: newTagColor });
    setEditingTagId(null);
    setNewTagLabel('');
    setNewTagColor('#4fd1ff');
    setLabelError('');
  };

  const handleDeleteTag = (tagId: string): void => {
    const confirmDelete = window.confirm(
      'Delete this tag? It will be removed from all cards.'
    );

    if (confirmDelete) {
      deleteTag(tagId);
    }
  };

  const handleStartEdit = (tag: Tag): void => {
    setEditingTagId(tag.id);
    setNewTagLabel(tag.label);
    setNewTagColor(tag.color);
    setLabelError('');
  };

  const handleCancelEdit = (): void => {
    setEditingTagId(null);
    setNewTagLabel('');
    setNewTagColor('#4fd1ff');
    setLabelError('');
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const isPresetTag = (tagId: string): boolean => {
    return PRESET_TAG_IDS.includes(tagId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tag-manager-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.header}>
              <h2 id="tag-manager-title" className={styles.title}>
                Manage Tags
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close tag manager"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className={styles.content}>
              {/* Create/Edit Form */}
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="tag-label" className={styles.label}>
                    {editingTagId ? 'Edit Tag' : 'Create Tag'}
                  </label>
                  <input
                    id="tag-label"
                    type="text"
                    className={styles.input}
                    placeholder="Tag label"
                    value={newTagLabel}
                    onChange={(e) => {
                      setNewTagLabel(e.target.value);
                      setLabelError('');
                    }}
                    aria-invalid={!!labelError}
                    aria-describedby={labelError ? 'label-error' : undefined}
                  />
                  {labelError && (
                    <span id="label-error" className={styles.error}>
                      {labelError}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Color</label>
                  <div className={styles.colorPicker}>
                    <div className={styles.colorSwatches}>
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.hex}
                          type="button"
                          className={clsx(
                            styles.colorSwatch,
                            newTagColor === color.hex &&
                              styles.colorSwatchSelected
                          )}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setNewTagColor(color.hex)}
                          aria-label={`Select ${color.name} color`}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      className={styles.customColorInput}
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      aria-label="Custom color picker"
                    />
                  </div>
                </div>

                <div className={styles.actions}>
                  {editingTagId ? (
                    <>
                      <button
                        type="button"
                        className={styles.buttonSecondary}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.buttonPrimary}
                        onClick={handleUpdateTag}
                      >
                        Update Tag
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={styles.buttonPrimary}
                      onClick={handleCreateTag}
                    >
                      Create Tag
                    </button>
                  )}
                </div>
              </div>

              {/* Tags List */}
              <div className={styles.tagsList}>
                {tags.map((tag) => {
                  const isPreset = isPresetTag(tag.id);
                  return (
                    <div
                      key={tag.id}
                      className={clsx(
                        styles.tagItem,
                        isPreset && styles.readOnly
                      )}
                    >
                      <div className={styles.tagInfo}>
                        <div
                          className={styles.tagPreview}
                          style={
                            { '--tag-color': tag.color } as React.CSSProperties
                          }
                        >
                          <span className={styles.tagDot} />
                          {tag.label}
                        </div>
                      </div>
                      <div className={styles.tagActions}>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => handleStartEdit(tag)}
                          disabled={isPreset}
                          aria-label={`Edit ${tag.label} tag`}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className={clsx(
                            styles.iconButton,
                            styles.iconButtonDanger
                          )}
                          onClick={() => handleDeleteTag(tag.id)}
                          disabled={isPreset}
                          aria-label={`Delete ${tag.label} tag`}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
