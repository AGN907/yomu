import { useEffect, useState } from 'react'

type MediaQueryString = `(${'min-width' | 'max-width'}: ${string})`

function useMediaQuery(query: MediaQueryString) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener('change', onChange)
    setValue(result.matches)

    return () => result.removeEventListener('change', onChange)
  }, [query])

  return value
}

export { useMediaQuery }
