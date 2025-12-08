import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import ProjectsPage from './components/ProjectsPage'
import CoachingPage from './components/CoachingPage'
import BlogPage from './components/BlogPage'
import BookingPage from './components/BookingPage'
import BooksPage from './components/BooksPage'
import LandingLivreGratuit from './components/LandingLivreGratuit'
import AdminPage from './components/AdminPage'

function App() {
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
        <Route path="/landing/livre-gratuit" element={<LandingLivreGratuit />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
