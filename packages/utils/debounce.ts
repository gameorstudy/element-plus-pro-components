export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number = 150
): T & { cancel: () => void } => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  const debounced = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
  
  // Add cancel method
  debounced.cancel = function() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  
  return debounced as T & { cancel: () => void }
}