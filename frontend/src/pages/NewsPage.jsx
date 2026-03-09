import { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { Link } from 'react-router-dom'; // 1. ДОДАЛИ ІМПОРТ
import NewsCreatePage from '../components/NewsCreatePage';

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadNews = () => {
    apiRequest('/news/')
      .then(data => setPosts(data))
      .catch(err => console.error("Не вдалося завантажити новини:", err));
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* Шапка стрічки */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', flex: 1, whiteSpace: 'nowrap' }}>
          📰 Стрічка новин
        </h1>
        
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          style={{ 
            background: showCreateForm ? '#ef4444' : '#4f46e5', 
            color: 'white', padding: '8px 16px', borderRadius: '20px', 
            fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', 
            whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {showCreateForm ? '✖ Скасувати' : '➕ Запостити'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ marginBottom: '40px', padding: '25px', background: '#fff', borderRadius: '15px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <NewsCreatePage onPostCreated={() => {
            setShowCreateForm(false);
            loadNews();
          }} />
        </div>
      )}

      <div className="news-feed">
        {posts.length > 0 ? (
          posts.map(post => (
            // 2. ОБГОРНУЛИ ВСЮ КАРТКУ В LINK
            <Link to={`/news/${post.id}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card post-card" style={{ marginBottom: '20px', padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ marginRight: '15px', flexShrink: 0 }}>
                    {post.author_photo ? (
                        <img 
                        src={post.author_photo.startsWith('http') ? post.author_photo : `http://localhost:8000${post.author_photo}`} 
                        alt="avatar" 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4f46e5' }} 
                        />
                    ) : (
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '2px solid #ddd' }}>
                        🐾
                        </div>
                    )}
                    </div>

                    <div>
                    <h3 style={{ margin: 0, color: '#1c1e21', fontSize: '18px' }}>{post.title}</h3>
                    <small style={{ color: '#666' }}>
                        Автор: <b style={{ color: '#4f46e5' }}>{post.author_name}</b>
                    </small>
                    </div>
                </div>

                <div style={{ paddingLeft: '65px' }}>
                    <p style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: '10px', fontSize: '0.9rem' }}>
                    {post.anons}
                    </p>
                    <p style={{ color: '#1a1a1a', whiteSpace: 'pre-wrap', lineHeight: '1.5', fontSize: '1rem' }}>
                    {post.full_text}
                    </p>
                    
                    <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #eee' }} />
                    
                    <small style={{ color: '#999', fontSize: '12px' }}>
                    📅 {new Date(post.created_at).toLocaleString('uk-UA')}
                    </small>
                </div>
                </div>
            </Link>
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p>Новин поки немає. Станьте першим, хто поділиться історією свого улюбленця!</p>
          </div>
        )}
      </div>
    </div>
  );
}
