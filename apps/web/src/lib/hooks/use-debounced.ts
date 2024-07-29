function useDebounced<T>(func: (...args: T[]) => void, delay = 500) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: T[]) {
    clearTimeout(timeoutId || undefined)

    timeoutId = setTimeout(() => {
      timeoutId = null
      func.apply(this, args)
    }, delay)
  }
}

export { useDebounced }
