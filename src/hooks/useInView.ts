import { useEffect, useState, useCallback } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  /** Only trigger once (default: true) */
  once?: boolean
}

/**
 * Hook that detects when an element enters the viewport.
 * Useful for scroll-triggered animations.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  const [node, setNode] = useState<T | null>(null)
  const [inView, setInView] = useState(false)

  const ref = useCallback((node: T | null) => {
    setNode(node)
  }, [])

  useEffect(() => {
    if (!node) return


    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(node)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [node, threshold, rootMargin, once])

  return { ref, inView }
}
