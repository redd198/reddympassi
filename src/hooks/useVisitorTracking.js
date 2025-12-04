import { useEffect } from 'react'

export const useVisitorTracking = () => {
  useEffect(() => {
    // Tracker la visite une seule fois au chargement
    const trackVisit = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/track-visitor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageUrl: window.location.pathname
          })
        })
      } catch (error) {
        // Ignorer les erreurs de tracking
        console.log('Tracking ignoré')
      }
    }

    trackVisit()
  }, [])
}
