/**
 * Scene Theme Configuration
 * Provides consistent styling patterns for report scenes
 */

export interface SceneTheme {
  // Font settings
  font: {
    family: string;
    className?: string;
  };
  
  // Color palette
  colors: {
    pink: string;
    blue: string;
    fern: string;
    green: string;
    yellow: string;
    purple: string;
  };
  
  // Typography sizes
  typography: {
    title: string;
    subtitle: string;
    body: string;
    highlight: string;
    large: string;
  };
}

/**
 * Default theme configuration
 */
export const defaultSceneTheme: SceneTheme = {
  font: {
    family: 'var(--font-tianwang)',
  },
  colors: {
    pink: '#FF8992',
    blue: '#00ADE9',
    fern: '#00C2A9',
    green: '#00AF22',
    yellow: '#FFAE00',
    purple: '#BC66CD',
  },
  typography: {
    title: 'text-[22px]',
    subtitle: 'text-[18px]',
    body: 'text-[14px]',
    highlight: 'text-[24px]',
    large: 'text-[32px]',
  },
};

/**
 * Get theme configuration
 * Can be extended to support theme variants or per-scene customization
 */
export function getSceneTheme(overrides?: Partial<SceneTheme>): SceneTheme {
  return {
    ...defaultSceneTheme,
    ...overrides,
    font: {
      ...defaultSceneTheme.font,
      ...overrides?.font,
    },
    colors: {
      ...defaultSceneTheme.colors,
      ...overrides?.colors,
    },
    typography: {
      ...defaultSceneTheme.typography,
      ...overrides?.typography,
    },
  };
}

/**
 * Helper function to create color class with size
 */
export function colorClass(color: keyof SceneTheme['colors'], size?: string): string {
  const theme = getSceneTheme();
  const baseColor = theme.colors[color];
  return size ? `${baseColor} ${size}` : baseColor;
}

/**
 * Helper function to create typography class
 */
export function typographyClass(type: keyof SceneTheme['typography']): string {
  const theme = getSceneTheme();
  return theme.typography[type];
}

