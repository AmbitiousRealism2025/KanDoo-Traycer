import React from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';
import clsx from 'clsx';
import styles from './Header.module.css';

interface HeaderProps {
  onComplete?: () => void;
}

export default function Header({ onComplete }: HeaderProps) {
  const subtitleText = "a kanban for your vibeflow;";

  const { displayText } = useTypewriter({
    text: subtitleText,
    speed: 60,
    onComplete
  });

  // Token definitions for syntax highlighting
  const tokens = [
    { text: 'a', className: styles.tokenKeyword },
    { text: ' ', className: '' },
    { text: 'kanban', className: styles.tokenString },
    { text: ' ', className: '' },
    { text: 'for', className: styles.tokenKeyword },
    { text: ' ', className: '' },
    { text: 'your', className: styles.tokenKeyword },
    { text: ' ', className: '' },
    { text: 'vibeflow', className: styles.tokenFunction },
    { text: ';', className: styles.tokenPunctuation }
  ];

  // Calculate which characters to show based on displayText length
  let charCount = 0;
  const renderedTokens = tokens.map((token, index) => {
    const tokenStart = charCount;
    const tokenEnd = charCount + token.text.length;
    charCount = tokenEnd;

    // Determine how much of this token to display
    const visibleLength = Math.max(
      0,
      Math.min(token.text.length, displayText.length - tokenStart)
    );
    const visibleText = token.text.slice(0, visibleLength);

    return (
      <span key={index} className={token.className}>
        {visibleText}
      </span>
    );
  });

  return (
    <header className={clsx('glass-panel', styles.header)}>
      <div className={styles.container}>
        <h1 className={clsx(styles.title, 'neon-glow-cyan')}>
          KANDOO FLOWBOARD
        </h1>
        <div className={clsx(styles.subtitle, 'monospace')}>
          {renderedTokens}
          <span className={clsx(styles.cursor, 'monospace')}>|</span>
        </div>
      </div>
    </header>
  );
}
