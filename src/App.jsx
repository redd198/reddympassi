import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import ProjectsPage from './components/ProjectsPage'
import CoachingPage from './components/CoachingPage'
import BlogPage from './components/BlogPage'
import BookingPage from './components/BookingPage'
import BooksPage from './components/BooksPage'
import LandingLivreGratuit from './components/LandingLivreGratuit'
import ProjectEvaluator from './components/ProjectEvaluator'
import AffiliatePage from './components/AffiliatePage'
import AdminPage from './components/AdminPage'
import DownloadPage from './components/DownloadPage'
import useAffiliateTracking from './hooks/useAffiliateTracking'

function App() {
  // Activer le tracking d'affiliation sur toutes les pages
  useAffiliateTracking()
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projets" element={<ProjectsPage />} />
        <Route path="/coaching" element={<CoachingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/reserver" element={<BookingPage />} />
        <Route path="/livres" element={<BooksPage />} />
        <Route path="/calculateurs" element={<ProjectEvaluator />} />
        <Route path="/affiliation" element={<AffiliatePage />} />
        <Route path="/landing/livre-gratuit" element={<LandingLivreGratuit />} />
        <Route path="/telecharger" element={<DownloadPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
