// Breakpoint configuration
const BREAKPOINTS = {
  xs: 0,     // < 768px
  sm: 768,   // ≥ 768px
  md: 992,   // ≥ 992px  
  lg: 1200,  // ≥ 1200px
  xl: 1920   // ≥ 1920px
} as const

// Breakpoint type
export type Breakpoint = keyof typeof BREAKPOINTS

// Grid columns total
export const GRID_COLUMNS = 24

// Default column span configuration per breakpoint
// Override priority: default (span) < xs < sm < md < lg < xl
// Special case: if no default (span) is specified, it shows 24 columns
export const defaultColConfig: Record<Breakpoint, number> = {
  xs: 24, // <768px
  sm: 24, // >=768px
  md: 12, // >=992px
  lg: 8,  // >=1200px
  xl: 6,  // >=1920px
}

// Breakpoint priority (from highest to lowest)
export const BREAKPOINT_ORDER: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs']

// Column configuration interface
export interface ColConfig {
  offset?: number
  span?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

/**
 * Get the current breakpoint based on the given width
 * @param width - Current viewport width
 * @returns The breakpoint name
 */
const getCurrentBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * Calculate the current column span based on viewport width
 * @param config - Configuration object {span, xs, sm, md, lg, xl}
 * @returns The column span to use
 */
export const calculateCurrentSpan = (config: ColConfig): number => {
  const breakpoint = getCurrentBreakpoint(window.innerWidth)
  
  // Find the value by breakpoint priority
  const currentIndex = BREAKPOINT_ORDER.indexOf(breakpoint)
  
  // Search from current breakpoint to the smallest one
  for (let i = currentIndex; i < BREAKPOINT_ORDER.length; i++) {
    const bp = BREAKPOINT_ORDER[i]
    if (config[bp]) {
      return config[bp]
    }
  }

  return config.span ?? GRID_COLUMNS
}