import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const savedPositions = new Map<string, number>()

// Nový prechod -> scroll hore. Návrat späť (POP) -> scroll tam, kde si bol.
function ScrollToTop() {
    const { key, pathname } = useLocation()
    const navigationType = useNavigationType()

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            window.scrollTo(0, navigationType === 'POP' ? savedPositions.get(key) ?? 0 : 0)
        })
        return () => {
            cancelAnimationFrame(frame)
            savedPositions.set(key, window.scrollY)
        }
    }, [key, pathname, navigationType])

    return null
}

export default ScrollToTop