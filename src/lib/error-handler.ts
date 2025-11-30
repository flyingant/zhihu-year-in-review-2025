/**
 * Global error handlers for static site
 * These catch errors that might not be caught by React Error Boundaries
 */

interface ErrorInfo {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
  timestamp: string;
}

/**
 * Setup global error handlers for window-level errors
 * This is especially important for static sites where errors might occur
 * before React hydrates or outside of React's error boundary system
 */
export function setupGlobalErrorHandlers() {
  if (typeof window === "undefined") {
    return;
  }

  // Handle synchronous errors
  window.onerror = (
    message: string | Event,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ) => {
    const errorInfo: ErrorInfo = {
      message: typeof message === "string" ? message : message.type,
      source,
      lineno,
      colno,
      error,
      timestamp: new Date().toISOString(),
    };

    console.error("Global error caught:", errorInfo);

    // Don't show error UI for known non-critical errors
    // (e.g., script loading errors from external sources)
    if (
      typeof message === "string" &&
      (message.includes("Script error") ||
        message.includes("Non-Error promise rejection"))
    ) {
      return false; // Let browser handle it
    }

    // For critical errors, we could show a toast or error UI
    // But since we have error boundaries, we'll let them handle it
    return false; // Let default error handling continue
  };

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    const error = event.reason;
    const errorInfo: ErrorInfo = {
      message:
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Unhandled promise rejection",
      error: error instanceof Error ? error : undefined,
      timestamp: new Date().toISOString(),
    };

    console.error("Unhandled promise rejection:", errorInfo);

    // Prevent default browser error handling
    // React Error Boundaries will catch these if they're in React components
    event.preventDefault();
  });

  // Handle resource loading errors (images, scripts, etc.)
  window.addEventListener("error", (event: ErrorEvent) => {
    // Only log, don't show UI for resource loading errors
    // These are usually non-critical (missing images, etc.)
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement;
      console.warn("Resource loading error:", {
        tag: target.tagName,
        src: (target as HTMLImageElement).src || (target as HTMLScriptElement).src,
        timestamp: new Date().toISOString(),
      });
    }
  }, true); // Use capture phase to catch errors early
}

/**
 * Initialize error handlers
 * Call this in the root layout or app initialization
 */
export function initErrorHandling() {
  if (typeof window !== "undefined") {
    setupGlobalErrorHandlers();
  }
}

