import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaLightbulb, FaUsers, FaChartLine, FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import Navbar from './Navbar'

const ProjectEvaluator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [contactInfo, setContactInfo] = useState({ nom: '', email: '', whatsapp: '', preference: 'email' })
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    {
      id: 'vision',
      title: '🎯 Vision & Objectifs',
      subtitle: 'Clarifiez votre vision',
      questions: [
        {
          id: 'projet_description',
          label: 'Décrivez votre projet en une phrase claire',
          type: 'textarea',
          placeholder: 'Ex: Créer une plateforme e-commerce pour vendre des produits artisanaux africains...',
          required: true
        },
        {
          id: 'objectif_principal',
          label: 'Quel est votre objectif principal ?',
          type: 'select',
          options: [
            'Générer des revenus',
            'Résoudre un problème social',
            'Créer de l\'emploi',
            'Innover dans mon secteur',
            'Autre'
          ],
          required: true
        },
        {
          id: 'motivation',
          label: 'Pourquoi ce projet est-il important pour vous ?',
          type: 'textarea',
          placeholder: 'Exprimez votre passion et votre motivation profonde...',
          required: true
        },
        {
          id: 'vision_3ans',
          label: 'Où voyez-vous votre projet dans 3 ans ?',
          type: 'textarea',
          placeholder: 'Décrivez votre vision à long terme...',
          required: true
        }
      ]
    },
    {
      id: 'contexte',
      title: '🌍 Contexte & Marché',
      subtitle: 'Comprenez votre environnement',
      questions: [
        {
          id: 'probleme_resolu',
          label: 'Quel problème concret résolvez-vous ?',
          type: 'textarea',
          placeholder: 'Décrivez le problème que vos clients rencontrent...',
          required: true
        },
        {
          id: 'public_cible',
          label: 'Qui sont vos clients cibles ?',
          type: 'textarea',
          placeholder: 'Âge, localisation, besoins, comportements...',
          required: true
        },
        {
          id: 'concurrence',
          label: 'Connaissez-vous vos concurrents ?',
          type: 'select',
          options: [
            'Oui, je les ai identifiés',
            'Partiellement',
            'Non, pas encore',
            'Il n\'y a pas de concurrent direct'
          ],
          required: true
        },
        {
          id: 'valeur_ajoutee',
          label: 'Quelle est votre valeur ajoutée unique ?',
          type: 'textarea',
          placeholder: 'Ce qui vous différencie de la concurrence...',
          required: true
        }
      ]
    },
    {
      id: 'planification',
      title: '📋 Planification & Ressources',
      subtitle: 'Structurez votre approche',
      questions: [
        {
          id: 'etapes_definies',
          label: 'Avez-vous défini les étapes de réalisation ?',
          type: 'select',
          options: [
            'Oui, plan détaillé',
            'Grandes lignes seulement',
            'Quelques idées',
            'Pas encore'
          ],
          required: true
        },
        {
          id: 'budget_estime',
          label: 'Avez-vous estimé le budget nécessaire ?',
          type: 'select',
          options: [
            'Oui, budget détaillé',
            'Estimation approximative',
            'Idée générale',
            'Aucune idée'
          ],
          required: true
        },
        {
          id: 'competences',
          label: 'Quelles compétences possédez-vous pour ce projet ?',
          type: 'textarea',
          placeholder: 'Listez vos compétences pertinentes...',
          required: true
        },
        {
          id: 'competences_manquantes',
          label: 'Quelles compétences vous manquent ?',
          type: 'textarea',
          placeholder: 'Identifiez vos besoins en formation ou recrutement...',
          required: true
        },
        {
          id: 'risques_identifies',
          label: 'Avez-vous identifié les risques potentiels ?',
          type: 'select',
          options: [
            'Oui, avec plans de mitigation',
            'Quelques risques identifiés',
            'Pas vraiment',
            'Non'
          ],
          required: true
        }
      ]
    },
    {
      id: 'execution',
      title: '🚀 Exécution & Suivi',
      subtitle: 'Préparez le lancement',
      questions: [
        {
          id: 'indicateurs_succes',
          label: 'Comment mesurerez-vous le succès ?',
          type: 'textarea',
          placeholder: 'KPIs, objectifs chiffrés, jalons...',
          required: true
        },
        {
          id: 'delai_lancement',
          label: 'Dans combien de temps voulez-vous lancer ?',
          type: 'select',
          options: [
            'Moins de 3 mois',
            '3 à 6 mois',
            '6 à 12 mois',
            'Plus d\'un an',
            'Pas encore défini'
          ],
          required: true
        },
        {
          id: 'equipe',
          label: 'Travaillez-vous seul ou en équipe ?',
          type: 'select',
          options: [
            'Seul pour l\'instant',
            'Avec 1-2 personnes',
            'Équipe de 3-5 personnes',
            'Équipe de plus de 5 personnes'
          ],
          required: true
        },
        {
          id: 'engagement',
          label: 'Combien d\'heures par semaine pouvez-vous consacrer au projet ?',
          type: 'select',
          options: [
            'Temps plein (40h+)',
            'Mi-temps (20-40h)',
            'Quelques heures (5-20h)',
            'Très peu (moins de 5h)'
          ],
          required: true
        }
      ]
    },
    {
      id: 'mindset',
      title: '💪 État d\'Esprit & Persévérance',
      subtitle: 'Évaluez votre préparation mentale',
      questions: [
        {
          id: 'obstacles_anticipes',
          label: 'Quels obstacles anticipez-vous ?',
          type: 'textarea',
          placeholder: 'Difficultés financières, techniques, personnelles...',
          required: true
        },
        {
          id: 'gestion_echec',
          label: 'Comment réagiriez-vous face à un échec ?',
          type: 'select',
          options: [
            'J\'analyserais et rebondirais',
            'Je chercherais de l\'aide',
            'Je prendrais du recul',
            'Je ne sais pas'
          ],
          required: true
        },
        {
          id: 'apprentissage',
          label: 'Êtes-vous prêt à apprendre continuellement ?',
          type: 'select',
          options: [
            'Absolument, c\'est essentiel',
            'Oui, si nécessaire',
            'Peut-être',
            'Je préfère déléguer'
          ],
          required: true
        },
        {
          id: 'soutien',
          label: 'Avez-vous un réseau de soutien ?',
          type: 'select',
          options: [
            'Oui, famille et mentors',
            'Quelques personnes',
            'Pas vraiment',
            'Non, je suis seul'
          ],
          required: true
        }
      ]
    }
  ]

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const calculateScore = () => {
    let score = 0
    let maxScore = 0
    const feedback = {
      forces: [],
      faiblesses: [],
      recommandations: []
    }

    // Évaluation Vision (25 points)
    maxScore += 25
    if (answers.projet_description?.length > 50) score += 7
    if (answers.motivation?.length > 100) score += 7
    if (answers.vision_3ans?.length > 50) score += 6
    if (answers.objectif_principal) score += 5

    if (score >= 20) {
      feedback.forces.push('Vision claire et motivante')
    } else {
      feedback.faiblesses.push('Vision à clarifier davantage')
      feedback.recommandations.push('Prenez le temps de définir précisément votre vision à long terme')
    }

    // Évaluation Contexte (25 points)
    if (answers.probleme_resolu?.length > 50) score += 7
    if (answers.public_cible?.length > 50) score += 7
    if (answers.concurrence === 'Oui, je les ai identifiés') score += 6
    else if (answers.concurrence === 'Partiellement') score += 3
    if (answers.valeur_ajoutee?.length > 50) score += 5
    maxScore += 25

    if (answers.concurrence === 'Oui, je les ai identifiés') {
      feedback.forces.push('Bonne connaissance du marché')
    } else {
      feedback.faiblesses.push('Analyse concurrentielle à approfondir')
      feedback.recommandations.push('Étudiez vos concurrents pour mieux vous positionner')
    }

    // Évaluation Planification (25 points)
    if (answers.etapes_definies === 'Oui, plan détaillé') score += 7
    else if (answers.etapes_definies === 'Grandes lignes seulement') score += 4
    if (answers.budget_estime === 'Oui, budget détaillé') score += 6
    else if (answers.budget_estime === 'Estimation approximative') score += 3
    if (answers.competences?.length > 50) score += 6
    if (answers.risques_identifies === 'Oui, avec plans de mitigation') score += 6
    else if (answers.risques_identifies === 'Quelques risques identifiés') score += 3
    maxScore += 25

    if (answers.etapes_definies === 'Oui, plan détaillé') {
      feedback.forces.push('Planification structurée')
    } else {
      feedback.faiblesses.push('Planification à détailler')
      feedback.recommandations.push('Créez un plan d\'action détaillé avec des jalons précis')
    }

    // Évaluation Exécution (15 points)
    if (answers.indicateurs_succes?.length > 50) score += 5
    if (answers.delai_lancement === 'Moins de 3 mois' || answers.delai_lancement === '3 à 6 mois') score += 4
    if (answers.engagement === 'Temps plein (40h+)') score += 6
    else if (answers.engagement === 'Mi-temps (20-40h)') score += 3
    maxScore += 15

    // Évaluation Mindset (10 points)
    if (answers.gestion_echec === 'J\'analyserais et rebondirais') score += 4
    if (answers.apprentissage === 'Absolument, c\'est essentiel') score += 3
    if (answers.soutien === 'Oui, famille et mentors') score += 3
    maxScore += 10

    if (answers.apprentissage === 'Absolument, c\'est essentiel') {
      feedback.forces.push('Excellent état d\'esprit entrepreneurial')
    }

    const percentage = Math.round((score / maxScore) * 100)
    
    let niveau = ''
    let message = ''
    let action = ''

    if (percentage >= 80) {
      niveau = 'Excellent'
      message = 'Votre projet est très bien structuré ! Vous êtes prêt à passer à l\'action.'
      action = 'Réservez une session de coaching pour optimiser votre lancement'
    } else if (percentage >= 60) {
      niveau = 'Bon'
      message = 'Votre projet a un bon potentiel. Quelques ajustements vous permettront d\'exceller.'
      action = 'Un accompagnement personnalisé vous aidera à combler les lacunes'
    } else if (percentage >= 40) {
      niveau = 'Moyen'
      message = 'Votre projet nécessite plus de travail de préparation avant le lancement.'
      action = 'Une formation complète en entrepreneuriat est recommandée'
    } else {
      niveau = 'À retravailler'
      message = 'Votre projet est encore au stade d\'idée. Il faut le structurer davantage.'
      action = 'Commencez par notre formation "De l\'idée au projet viable"'
    }

    return {
      score: percentage,
      niveau,
      message,
      action,
      feedback
    }
  }

  const handleSubmit = async () => {
    const evaluation = calculateScore()
    setResult(evaluation)
    setIsSubmitting(true)

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: contactInfo.nom,
          email: contactInfo.preference === 'email' ? contactInfo.email : '',
          whatsapp: contactInfo.preference === 'whatsapp' ? contactInfo.whatsapp : '',
          preference: contactInfo.preference,
          source: 'evaluateur-projet',
          produit: `Évaluation projet - Score: ${evaluation.score}%`
        })
      })
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const canGoNext = () => {
    return currentStepData.questions.every(q => 
      !q.required || (answers[q.id] && answers[q.id].trim() !== '')
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {!result ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-reddy-blue mb-4">
                Évaluateur de Projet
              </h1>
              <p className="text-lg text-gray-600">
                Clarifiez votre vision et obtenez un diagnostic personnalisé
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Étape {currentStep + 1} sur {steps.length}
                </span>
                <span className="text-sm font-medium text-reddy-blue">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-reddy-blue to-reddy-red h-3 rounded-full"
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Questions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl p-8 mb-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-4xl">{currentStepData.title.split(' ')[0]}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {currentStepData.title.substring(2)}
                    </h2>
                    <p className="text-gray-600">{currentStepData.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {currentStepData.questions.map((question, index) => (
                    <div key={question.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {question.label} {question.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {question.type === 'textarea' ? (
                        <textarea
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          placeholder={question.placeholder}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue resize-none"
                        />
                      ) : question.type === 'select' ? (
                        <select
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
                        >
                          <option value="">Sélectionnez une option</option>
                          {question.options.map((option, i) => (
                            <option key={i} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaArrowLeft /> Précédent
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canGoNext()}
                  className="flex items-center gap-2 px-6 py-3 bg-reddy-blue text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Suivant <FaArrowRight />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canGoNext()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-reddy-blue to-reddy-red text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Voir mon évaluation <FaCheckCircle />
                </button>
              )}
            </div>
          </>
        ) : currentStep === steps.length ? (
          // Contact Form
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              📧 Recevez votre évaluation détaillée
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Laissez vos coordonnées pour recevoir votre score et nos recommandations personnalisées
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom"
                value={contactInfo.nom}
                onChange={(e) => setContactInfo({...contactInfo, nom: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setContactInfo({...contactInfo, preference: 'email'})}
                  className={`flex-1 py-2 rounded-lg ${contactInfo.preference === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                >
                  Email
                </button>
                <button
                  onClick={() => setContactInfo({...contactInfo, preference: 'whatsapp'})}
                  className={`flex-1 py-2 rounded-lg ${contactInfo.preference === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                >
                  WhatsApp
                </button>
              </div>

              <input
                type={contactInfo.preference === 'email' ? 'email' : 'tel'}
                placeholder={contactInfo.preference === 'email' ? 'votre@email.com' : '+242 XX XX XX XX'}
                value={contactInfo.preference === 'email' ? contactInfo.email : contactInfo.whatsapp}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  [contactInfo.preference === 'email' ? 'email' : 'whatsapp']: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
              />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !contactInfo.nom || (!contactInfo.email && !contactInfo.whatsapp)}
                className="w-full py-4 bg-gradient-to-r from-reddy-blue to-reddy-red text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Envoi...' : 'Recevoir mon évaluation 🚀'}
              </button>
            </div>
          </motion.div>
        ) : (
          // Results
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.score / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800">{result.score}%</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Niveau : {result.niveau}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {result.message}
              </p>
            </div>

            {/* Forces */}
            {result.feedback.forces.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg text-green-700 mb-3 flex items-center gap-2">
                  <FaCheckCircle /> Points Forts
                </h3>
                <ul className="space-y-2">
                  {result.feedback.forces.map((force, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      {force}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Faiblesses */}
            {result.feedback.faiblesses.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg text-orange-700 mb-3">
                  ⚠️ Points à Améliorer
                </h3>
                <ul className="space-y-2">
                  {result.feedback.faiblesses.map((faiblesse, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-500 mt-1">→</span>
                      {faiblesse}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommandations */}
            {result.feedback.recommandations.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-lg text-blue-700 mb-3">
                  💡 Recommandations
                </h3>
                <ul className="space-y-2">
                  {result.feedback.recommandations.map((reco, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-500 mt-1">•</span>
                      {reco}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-reddy-blue to-reddy-red p-6 rounded-xl text-white text-center">
              <h3 className="font-bold text-xl mb-3">{result.action}</h3>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/reserver"
                  className="px-6 py-3 bg-white text-reddy-blue font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Réserver un coaching
                </a>
                <a
                  href="/livres"
                  className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
                >
                  Voir nos formations
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProjectEvaluator