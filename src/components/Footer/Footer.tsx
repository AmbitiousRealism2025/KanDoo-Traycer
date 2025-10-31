import React, { useState, useEffect } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';
import styles from './Footer.module.css';

interface FooterProps {
  startAnimation: boolean;
}

export default function Footer({ startAnimation }: FooterProps) {
  const footerText = "Ambitious Realism Creates 2025";
  const [animationKey, setAnimationKey] = useState(0);

  const { displayText } = useTypewriter({
    text: footerText,
    speed: 50,
    startDelay: 3000,
    enabled: startAnimation,
    restartKey: animationKey,
  });

  useEffect(() => {
    if (!startAnimation) return;

    // Set up 5-minute interval to restart animation
    const intervalId = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 300000); // 5 minutes = 300000ms

    return () => {
      clearInterval(intervalId);
    };
  }, [startAnimation]);

  // animationKey increments every 5 minutes to trigger the typewriter restart
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <span className={styles.text}>{displayText}</span>
        <span className={styles.cursor}>|</span>
      </div>
    </footer>
  );
}
