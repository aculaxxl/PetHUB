import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

export default function NewsEditPage() {
  const { id } = useParams(); // Получаем ID новости из URL
  const navigate = useNavigate();
  
  // Состояние для полей формы
  const [formData, setFormData] = useState({
    title: '',
    anons: '',
    full_text: ''
  });
  
  const [loading, setLoading] = useState(true);

  // 1. ЗАГРУЖАЕМ СТАРЫЕ ДАННЫЕ ПРИ ОТКРЫТИИ СТРАНИЦЫ
  useEffect(() => {
    apiRequest(`/news/${id}/`)
      .then(data => {
        // Записываем полученные данные в форму
        setFormData({
          title: data.title || '',
          anons: data.anons || '',
          full_text: data.full_text || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки новости:", err);
        alert("Не вдалося завантажити дані новини");
        navigate('/news');
      });
  }, [id, navigate]);

  // 2. ФУНКЦИЯ СОХРАНЕНИЯ ИЗМЕНЕНИЙ
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Отправляем PATCH запрос на сервер с обновленными данными
      await apiRequest(`/news/${id}/`, 'PATCH', formData);
      alert("Новину успішно оновлено! ✨");
      navigate(`/news/${id}`); // Возвращаемся на страницу просмотра новости
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
      alert("Не вдалося зберегти зміни");
    }
  };

  if (loading) return <div className="container">Завантаження даних для редагування...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <div className="card" style={{ padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>✎ Редагувати новину</h2>
        
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold' }}>Заголовок:</label>
            <input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold' }}>Короткий анонс:</label>
            <input 
              value={formData.anons} 
              onChange={e => setFormData({...formData, anons: e.target.value})}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold' }}>Повний текст:</label>
            <textarea 
              value={formData.full_text} 
              onChange={e => setFormData({...formData, full_text: e.target.value})}
              style={{ height: '200px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="btn" style={{ background: '#4f46e5', flex: 1 }}>Зберегти зміни</button>
            <button type="button" onClick={() => navigate(-1)} className="btn" style={{ background: '#666', flex: 1 }}>Скасувати</button>
          </div>
        </form>
      </div>
    </div>
  );
}
