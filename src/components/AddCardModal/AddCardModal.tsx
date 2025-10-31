/**
 * AddCardModal Component
 * Modal dialog for creating new cards with title and description
 * Includes form validation, keyboard navigation, and accessibility features
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AddCardModal.module.css';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => void;
  columnTitle: string;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  columnTitle
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus trap within modal
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      const previouslyFocused = document.activeElement as HTMLElement;

      // Return focus when modal closes
      return () => {
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setTitleError('');
    }
  }, [isOpen]);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    // Validate title is not empty
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    // Clear error and submit
    setTitleError('');
    onSubmit(title.trim(), description.trim() || undefined);

    // Reset form
    setTitle('');
    setDescription('');

    // Close modal
    onClose();
  };

  const handleOverlayClick = (): void => {
    onClose();
  };

  const handleContentClick = (event: React.MouseEvent): void => {
    // Prevent closing when clicking inside modal content
    event.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.modal}
            onClick={handleContentClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className={styles.header}>
              <h2 id="modal-title" className={styles.title}>
                Add Card to {columnTitle}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="card-title" className={styles.label}>
                  Title *
                </label>
                <input
                  id="card-title"
                  type="text"
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                  placeholder="Enter card title"
                />
                {titleError && <div className={styles.error}>{titleError}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="card-description" className={styles.label}>
                  Description
                </label>
                <textarea
                  id="card-description"
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details (optional)"
                />
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonCancel}`}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.buttonSubmit}`}
                  disabled={!title.trim()}
                >
                  Add Card
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddCardModal;
