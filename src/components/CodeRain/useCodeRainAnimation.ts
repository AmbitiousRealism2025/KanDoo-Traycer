import { useEffect, useRef, RefObject } from 'react';
import { CODE_SNIPPETS, CodeSnippet } from './codeSnippets';

interface FallingSnippet {
  snippet: CodeSnippet;
  widths: number[];
  x: number;
  y: number;
  speed: number;
  opacity: number;
  rotation: number;
  blur: number;
  fontSize: number;
}

interface ColorMap {
  keyword: string;
  string: string;
  function: string;
  number: string;
  punctuation: string;
  plain: string;
}

const getRandomSnippet = (): CodeSnippet => {
  return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
};

const computeTokenWidths = (
  ctx: CanvasRenderingContext2D,
  tokens: CodeSnippet,
  fontSize: number
): number[] => {
  const previousFont = ctx.font;
  ctx.font = `${fontSize}px monospace`;
  const widths = tokens.map((token) => ctx.measureText(token.text).width);
  ctx.font = previousFont;
  return widths;
};

const createFallingSnippet = (
  ctx: CanvasRenderingContext2D,
  viewportWidth: number,
  viewportHeight: number
): FallingSnippet => {
  const snippetTokens = getRandomSnippet();
  const fontSize = 10 + Math.random() * 4;

  const snippet: FallingSnippet = {
    snippet: snippetTokens,
    widths: [],
    x: Math.random() * viewportWidth,
    y: Math.random() * -viewportHeight,
    speed: 1 + Math.random() * 2,
    opacity: 0.1 + Math.random() * 0.2,
    rotation: -5 + Math.random() * 10,
    blur: Math.random() * 2,
    fontSize,
  };

  snippet.widths = computeTokenWidths(ctx, snippet.snippet, snippet.fontSize);
  return snippet;
};

const recycleFallingSnippet = (
  ctx: CanvasRenderingContext2D,
  snippet: FallingSnippet,
  viewportWidth: number
): void => {
  snippet.snippet = getRandomSnippet();
  snippet.x = Math.random() * viewportWidth;
  snippet.y = -50;
  snippet.speed = 1 + Math.random() * 2;
  snippet.opacity = 0.1 + Math.random() * 0.2;
  snippet.rotation = -5 + Math.random() * 10;
  snippet.blur = Math.random() * 2;
  snippet.fontSize = 10 + Math.random() * 4;
  snippet.widths = computeTokenWidths(ctx, snippet.snippet, snippet.fontSize);
};

export const useCodeRainAnimation = (canvasRef: RefObject<HTMLCanvasElement>): void => {
  const snippetsRef = useRef<FallingSnippet[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const colorsRef = useRef<ColorMap>({
    keyword: '#4fd1ff',
    string: '#f472b6',
    function: '#34d399',
    number: '#fbbf24',
    punctuation: '#c084fc',
    plain: '#94a3b8',
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const resizeCanvas = (): void => {
      const dpr = window.devicePixelRatio || 1;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;

      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      canvas.width = Math.floor(viewportWidth * dpr);
      canvas.height = Math.floor(viewportHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const computedStyle = getComputedStyle(document.documentElement);
    colorsRef.current = {
      keyword: computedStyle.getPropertyValue('--color-cyan').trim() || '#4fd1ff',
      string: computedStyle.getPropertyValue('--color-magenta').trim() || '#f472b6',
      function: computedStyle.getPropertyValue('--color-emerald').trim() || '#34d399',
      number: computedStyle.getPropertyValue('--color-yellow').trim() || '#fbbf24',
      punctuation: computedStyle.getPropertyValue('--color-purple').trim() || '#c084fc',
      plain: computedStyle.getPropertyValue('--color-text-muted').trim() || '#94a3b8',
    };

    const snippetCount = 40 + Math.floor(Math.random() * 21);
    snippetsRef.current = Array.from({ length: snippetCount }, () =>
      createFallingSnippet(ctx, viewportWidth, viewportHeight)
    );

    const animate = (): void => {
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      snippetsRef.current.forEach((snippet) => {
        ctx.save();

        ctx.filter = `blur(${snippet.blur}px)`;
        ctx.translate(snippet.x, snippet.y);
        ctx.rotate((snippet.rotation * Math.PI) / 180);
        ctx.font = `${snippet.fontSize}px monospace`;
        ctx.textBaseline = 'top';
        ctx.globalAlpha = snippet.opacity;

        let xOffset = 0;
        snippet.snippet.forEach((token, index) => {
          const color = colorsRef.current[token.type];
          ctx.fillStyle = color;
          ctx.fillText(token.text, xOffset, 0);
          xOffset += snippet.widths[index] ?? 0;
        });

        ctx.restore();

        snippet.y += snippet.speed;

        if (snippet.y > viewportHeight + 50) {
          recycleFallingSnippet(ctx, snippet, viewportWidth);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);
};
