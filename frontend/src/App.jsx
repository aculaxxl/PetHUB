import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import NewsEditPage from './components/NewsEditPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import PetDetailPage from './pages/PetDetailPage'; 


import NewsDetailPage from './components/NewsDetailPage'; 

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh'); 
    setToken(null);
  };

  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">Pet-Hub 🐾</div>
          <nav>
            <Link to="/">🏠 Головна</Link>
            <Link to="/news">📰 Новини</Link>
            <Link to="/profile">👤 Мій профіль</Link>
          </nav>
          
          <div className="sidebar-footer">
            {token ? (
              <button className="logout-btn" onClick={handleLogout}>Вийти</button>
            ) : (
              <Link to="/login" className="login-link">🔑 Увійти</Link>
            )}
          </div>
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/news/:id/edit" element={<NewsEditPage />} /> 
            
            <Route 
              path="/profile" 
              element={token ? <ProfilePage /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/login" 
              element={<LoginPage setToken={setToken} />} 
            />
            
            <Route 
              path="/pets/:id" 
              element={<PetDetailPage />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
