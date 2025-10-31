import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
  enabled?: boolean;
  restartKey?: number;
}

interface UseTypewriterReturn {
  displayText: string;
  isComplete: boolean;
  reset: () => void;
}

export function useTypewriter({
  text,
  speed = 50,
  startDelay = 0,
  onComplete,
  enabled = true,
  restartKey
}: UseTypewriterOptions): UseTypewriterReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = () => {
    setCurrentIndex(0);
    setIsComplete(false);
  };

  useEffect(() => {
    const clearTimers = () => {
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };

    clearTimers();

    setCurrentIndex(0);
    setIsComplete(false);

    if (!enabled) {
      return () => {
        clearTimers();
      };
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Immediately show full text
      setCurrentIndex(text.length);
      setIsComplete(true);
      onComplete?.();
      return () => {
        clearTimers();
      };
    }

    // Start delay timeout
    startTimeoutRef.current = setTimeout(() => {
      let index = 0;

      const typeNextChar = () => {
        if (index < text.length) {
          setCurrentIndex(index + 1);
          index++;
          typingTimeoutRef.current = setTimeout(typeNextChar, speed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };

      typingTimeoutRef.current = setTimeout(typeNextChar, speed);
    }, startDelay);

    return () => {
      clearTimers();
    };
  }, [text, speed, startDelay, onComplete, enabled, restartKey]);

  const displayText = text.slice(0, currentIndex);

  return {
    displayText,
    isComplete,
    reset
  };
}
