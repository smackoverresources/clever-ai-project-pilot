import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch {
      textArea.remove();
      return false;
    }
  }
}

// Download file
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Scroll handling
export function scrollToTop(smooth = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

export function scrollToElement(
  element: HTMLElement,
  offset = 0,
  smooth = true
): void {
  const top = element.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({
    top,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

// Media queries
export function getBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const width = window.innerWidth;
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
}

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Event handling
export function preventDefault(e: Event): void {
  e.preventDefault();
}

export function stopPropagation(e: Event): void {
  e.stopPropagation();
}

// Focus management
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);
  firstFocusable.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

// Animation helpers
export function fadeIn(
  element: HTMLElement,
  duration = 300,
  display = 'block'
): void {
  element.style.opacity = '0';
  element.style.display = display;

  let start: number | null = null;
  function animate(timestamp: number) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.min(progress / duration, 1);
    element.style.opacity = opacity.toString();

    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export function fadeOut(element: HTMLElement, duration = 300): Promise<void> {
  return new Promise((resolve) => {
    let start: number | null = null;
    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.max(1 - progress / duration, 0);
      element.style.opacity = opacity.toString();

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

// Error boundary helper
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error }>
): React.ComponentType<P> {
  return class ErrorBoundary extends React.Component<
    P,
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    render() {
      if (this.state.hasError && this.state.error) {
        return <FallbackComponent error={this.state.error} />;
      }

      return <Component {...this.props} />;
    }
  };
} 