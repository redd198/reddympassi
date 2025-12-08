import { useState, useEffect } from 'react'

export const useLeadMagnet = () => {
  const [shouldShowPopup, setShouldShowPopup] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu le popup
    const hasSeenPopup = localStorage.getItem('leadMagnetSeen')
    const lastShown = localStorage.getItem('leadMagnetLastShown')
    
    if (!hasSeenPopup) {
      // Première visite - afficher après 10 secondes
      const timer = setTimeout(() => {
        setShouldShowPopup(true)
      }, 10000)

      // Ou afficher au scroll
      const handleScroll = () => {
        if (window.scrollY > 300) {
          setShouldShowPopup(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }

      window.addEventListener('scroll', handleScroll)

      return () => {
        clearTimeout(timer)
        window.removeEventListener('scroll', handleScroll)
      }
    } else if (lastShown) {
      // Réafficher après 7 jours pour les visiteurs récurrents
      const lastShownDate = new Date(lastShown)
      const now = new Date()
      const daysDiff = (now - lastShownDate) / (1000 * 60 * 60 * 24)
      
      if (daysDiff > 7) {
        // Réinitialiser et permettre de revoir le popup
        localStorage.removeItem('leadMagnetSeen')
      }
    }
  }, [])

  const hidePopup = () => {
    setShouldShowPopup(false)
    localStorage.setItem('leadMagnetSeen', 'true')
    localStorage.setItem('leadMagnetLastShown', new Date().toISOString())
  }

  const showPopupManually = () => {
    setShouldShowPopup(true)
  }

  return {
    shouldShowPopup,
    hidePopup,
    showPopupManually
  }
}