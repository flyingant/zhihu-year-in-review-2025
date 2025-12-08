import { useMemo } from 'react';
import { getSceneTheme, SceneTheme, colorClass, typographyClass } from '@/lib/scene-theme';

/**
 * Hook to get scene theme configuration
 * Can be extended to support theme variants based on context
 */
export function useSceneTheme(overrides?: Partial<SceneTheme>): SceneTheme {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => getSceneTheme(overrides), [JSON.stringify(overrides)]);
}

/**
 * Hook to get scene theme styles object for inline styles
 */
export function useSceneThemeStyles() {
  const theme = useSceneTheme();
  
  return useMemo(() => ({
    fontFamily: theme.font.family,
  }), [theme.font.family]);
}

// Re-export utility functions for convenience
export { colorClass, typographyClass };

