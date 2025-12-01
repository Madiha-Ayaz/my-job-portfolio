import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/page';
import About from './pages/about/page';
import ForgotPassword from './pages/auth/forgot-password/page';
import Login from './pages/auth/login/page';
import Register from './pages/auth/register/page';
import Blog from './pages/blog/page';
import BlogPost from './pages/blog/[slug]/page';
import Contact from './pages/contact/page';
import Projects from './pages/projects/page';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import Chatbot from './components/chatbot/Chatbot';

function App() {
  return (
    <Router>
      <SearchProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/projects" element={<Projects />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </div>
        </AuthProvider>
      </SearchProvider>
    </Router>
  );
}

export default App;
