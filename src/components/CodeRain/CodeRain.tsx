import React, { useRef } from 'react';
import { useCodeRainAnimation } from './useCodeRainAnimation';
import styles from './CodeRain.module.css';

const CodeRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCodeRainAnimation(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  );
};

export default CodeRain;
