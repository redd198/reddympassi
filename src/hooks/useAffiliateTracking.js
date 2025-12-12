import { useEffect } from 'react'

const useAffiliateTracking = () => {
  useEffect(() => {
    // Fonction pour extraire le code d'affiliation de l'URL
    const getAffiliateCode = () => {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('ref')
    }

    // Fonction pour stocker le code d'affiliation
    const storeAffiliateCode = (code) => {
      // Stocker dans localStorage pour 30 jours
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 30)
      
      const affiliateData = {
        code: code,
        expiration: expirationDate.toISOString(),
        firstVisit: new Date().toISOString()
      }
      
      localStorage.setItem('affiliate_ref', JSON.stringify(affiliateData))
    }

    // Fonction pour récupérer le code d'affiliation stocké
    const getStoredAffiliateCode = () => {
      try {
        const stored = localStorage.getItem('affiliate_ref')
        if (!stored) return null
        
        const affiliateData = JSON.parse(stored)
        const now = new Date()
        const expiration = new Date(affiliateData.expiration)
        
        // Vérifier si le code n'a pas expiré
        if (now > expiration) {
          localStorage.removeItem('affiliate_ref')
          return null
        }
        
        return affiliateData.code
      } catch (error) {
        console.error('Erreur lors de la récupération du code d\'affiliation:', error)
        return null
      }
    }

    // Fonction pour tracker le référral
    const trackReferral = async (code) => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/affiliation/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code_affiliation: code,
            page_visitee: window.location.pathname,
            user_agent: navigator.userAgent
          })
        })
      } catch (error) {
        console.error('Erreur lors du tracking du référral:', error)
      }
    }

    // Logique principale
    const handleAffiliateTracking = async () => {
      // Vérifier s'il y a un code dans l'URL
      const urlCode = getAffiliateCode()
      
      if (urlCode) {
        // Nouveau référral - stocker le code et tracker
        storeAffiliateCode(urlCode)
        await trackReferral(urlCode)
        
        // Nettoyer l'URL sans recharger la page
        const url = new URL(window.location)
        url.searchParams.delete('ref')
        window.history.replaceState({}, document.title, url.toString())
      } else {
        // Vérifier s'il y a un code stocké pour les pages suivantes
        const storedCode = getStoredAffiliateCode()
        if (storedCode) {
          // Tracker la navigation sur d'autres pages
          await trackReferral(storedCode)
        }
      }
    }

    handleAffiliateTracking()
  }, [])

  // Fonction pour tracker une conversion
  const trackConversion = async (type, conversionId, montant = 0) => {
    try {
      const stored = localStorage.getItem('affiliate_ref')
      if (!stored) return false
      
      const affiliateData = JSON.parse(stored)
      const now = new Date()
      const expiration = new Date(affiliateData.expiration)
      
      // Vérifier si le code n'a pas expiré
      if (now > expiration) {
        localStorage.removeItem('affiliate_ref')
        return false
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/affiliation/conversion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code_affiliation: affiliateData.code,
          type_conversion: type,
          conversion_id: conversionId,
          montant: montant
        })
      })

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Erreur lors du tracking de la conversion:', error)
      return false
    }
  }

  return { trackConversion }
}

export default useAffiliateTracking