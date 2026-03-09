import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    apiRequest('/profile/me/')
      .then(data => setCurrentUserId(data.id))
      .catch(() => console.log("Пользователь не залогинен"));


    apiRequest(`/news/${id}/`)
      .then(setPost)
      .catch(err => {
        console.error(err);
        alert("Новина не знайдена");
        navigate('/news');
      });
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Видалити цю новину?")) {
      try {
        await apiRequest(`/news/${id}/`, 'DELETE');
        navigate('/news');
      } catch (err) {
        alert("Не вдалося видалити");
      }
    }
  };

  if (!post) return <div className="container">Завантаження...</div>;

  const isOwner = post.owner_id === currentUserId;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <Link to="/news" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 'bold' }}>
        ← Назад до новин
      </Link>
      
      <div className="card" style={{ marginTop: '20px', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>{post.title}</h1>
          
          {isOwner && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => navigate(`/news/${id}/edit`)} className="btn" style={{background: '#4f46e5'}}>✎ Редагувати</button>
              <button onClick={handleDelete} className="btn" style={{background: '#ef4444'}}>🗑 Видалити</button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '15px' }}>
          <img 
            src={post.author_photo?.startsWith('http') ? post.author_photo : `http://localhost:8000${post.author_photo}`} 
            alt="pet" 
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4f46e5' }} 
          />
          <div>
            <div style={{fontWeight: 'bold', fontSize: '18px'}}>{post.author_name}</div>
            <small style={{color: '#999'}}>{new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        </div>

        <div style={{ lineHeight: '1.7', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
          {post.full_text}
        </div>
      </div>
    </div>
  );
}
