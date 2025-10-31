/**
 * AddCardButton Component
 * Simple button component for triggering card creation modal
 */

import React from 'react';
import styles from './AddCardButton.module.css';

interface AddCardButtonProps {
  onClick: () => void;
}

const AddCardButton: React.FC<AddCardButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      className={styles.addButton}
      onClick={onClick}
      aria-label="Add new card"
    >
      <span aria-hidden="true">+</span>
      <span>Add Card</span>
    </button>
  );
};

export default AddCardButton;
