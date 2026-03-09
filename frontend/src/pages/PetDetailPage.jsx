import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api';

export default function PetDetailPage() {
  const { id } = useParams(); // Достаем ID из ссылки /pets/:id
  const [pet, setPet] = useState(null);

  useEffect(() => {
    apiRequest(`/profile/pets/${id}/`).then(setPet).catch(console.error);
  }, [id]);

  if (!pet) return <div className="card">Завантаження...</div>;

  return (
    <div className="card">
      <Link to="/profile" style={{ color: '#4f46e5', textDecoration: 'none' }}>← Назад до профілю</Link>
      <h1 style={{ marginTop: '20px' }}>🐾 {pet.name}</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {pet.photo && (
            <img 
                src={pet.photo.startsWith('http') ? pet.photo : `http://localhost:8000${pet.photo}`} 
                alt={pet.name} 
                style={{ width: '250px', borderRadius: '12px', objectFit: 'cover' }} 
            />
        )}
        <div>
          <p><strong>Вид:</strong> {pet.species_display}</p>
          <p><strong>Дата народження:</strong> {new Date(pet.birth_date).toLocaleDateString()}</p>
          {/* Тут позже добавим кнопку "Редагувати" или "Видалити" */}
        </div>
      </div>
    </div>
  );
}
