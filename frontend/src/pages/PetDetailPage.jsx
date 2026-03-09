import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { apiRequest } from '../api';

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [pet, setPet] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', species: '', birth_date: '', status: '' });
  const [newPhoto, setNewPhoto] = useState(null);

  const [showTransfer, setShowTransfer] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState('');

  const loadPet = () => {
    apiRequest(`/profile/pets/${id}/`).then(data => {
      setPet(data);
      setEditData({
        name: data.name,
        species: data.species,
        birth_date: data.birth_date,
        status: data.status
      });
    }).catch(console.error);
  };

  useEffect(() => {
    loadPet();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Ви впевнені, що хочете видалити ${pet.name} назавжди?`)) {
      try {
        await apiRequest(`/profile/pets/${id}/`, 'DELETE');
        alert("Тваринку видалено 🐾");
        navigate('/profile');
      } catch (err) {
        alert("Помилка при видаленні");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', editData.name);
    data.append('species', editData.species);
    data.append('birth_date', editData.birth_date);
    data.append('status', editData.status);
    if (newPhoto) data.append('photo', newPhoto);

    try {
      const response = await fetch(`http://localhost:8000/api/profile/pets/${id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: data
      });
      if (!response.ok) throw new Error();
      alert("Дані оновлено! ✨");
      setIsEditing(false);
      loadPet();
    } catch (err) {
      alert("Помилка при оновленні");
    }
  };


  const handleTransfer = async () => {
    if (!newOwnerId) return alert("Введіть ID нового власника");
    try {
      await apiRequest(`/profile/pets/${id}/transfer_ownership/`, 'POST', { 
        new_owner_id: parseInt(newOwnerId) 
      });
      alert(`Тваринку успішно передано!`);
      navigate('/profile'); 
    } catch (err) {
      alert("Помилка: перевірте ID власника");
    }
  };

  if (!pet) return <div className="card">Завантаження...</div>;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '20px auto', padding: '25px' }}>
      <Link to="/profile" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Назад до профілю
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h1 style={{ margin: 0 }}>🐾 {pet.name}</h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="btn" 
            style={{ background: isEditing ? '#666' : '#4f46e5', width: 'auto', padding: '8px 15px' }}
          >
            {isEditing ? 'Скасувати' : '✎ Редагувати'}
          </button>
          
          {!isEditing && (
            <button 
              onClick={handleDelete} 
              className="btn" 
              style={{ background: '#ef4444', width: 'auto', padding: '8px 15px' }}
            >
              🗑 Видалити
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>
        
        <div style={{ textAlign: 'center' }}>
          <img 
            src={pet.photo.startsWith('http') ? pet.photo : `http://localhost:8000${pet.photo}`} 
            alt={pet.name} 
            style={{ width: '250px', height: '250px', borderRadius: '15px', objectFit: 'cover', border: '3px solid #eee' }} 
          />
          {isEditing && (
            <div style={{ marginTop: '10px' }}>
              <input type="file" onChange={e => setNewPhoto(e.target.files[0])} style={{ fontSize: '12px' }} />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {isEditing ? (
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{fontWeight: 'bold', fontSize: '14px'}}>Ім'я:</label>
              <input className="input" value={editData.name} onChange={e => setFormData({...editData, name: e.target.value})} />
              
              <label style={{fontWeight: 'bold', fontSize: '14px'}}>Вид:</label>
              <select className="input" value={editData.species} onChange={e => setEditData({...editData, species: e.target.value})}>
                <option value="dog">Собака</option>
                <option value="cat">Кіт</option>
                <option value="parrot">Пташка</option>
                <option value="other">Інше</option>
              </select>

              <label style={{fontWeight: 'bold', fontSize: '14px'}}>Статус:</label>
              <select className="input" value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})}>
                <option value="active">🏠 Я маю сім'ю</option>
                <option value="adoption">🔍 Шукаю сім'ю (Адопція)</option>
              </select>

              <label style={{fontWeight: 'bold', fontSize: '14px'}}>Дата народження:</label>
              <input type="date" className="input" value={editData.birth_date} onChange={e => setEditData({...editData, birth_date: e.target.value})} />
              
              <button type="submit" className="btn" style={{ background: '#10b981', marginTop: '10px' }}>Зберегти зміни</button>
            </form>
          ) : (
            <>
              <p><strong>Вид:</strong> {pet.species_display}</p>
              <p><strong>Дата народження:</strong> {new Date(pet.birth_date).toLocaleDateString()}</p>
              <p><strong>Статус:</strong> {pet.status === 'active' ? '🏠 Вдома' : '🔍 Шукає дім'}</p>
              
              <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />


              {pet.status === 'adoption' && (
                <div style={{ padding: '15px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>🤝 Передати в добрі руки</h4>
                  {!showTransfer ? (
                    <button onClick={() => setShowTransfer(true)} className="btn" style={{ background: '#f59e0b', color: 'white', fontWeight: 'bold' }}>
                      Оформити передачу
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <input 
                        type="number" placeholder="ID нового власника" 
                        value={newOwnerId} onChange={(e) => setNewOwnerId(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
                      />
                      <button onClick={handleTransfer} className="btn" style={{ background: '#10b981', width: 'auto' }}>ОК</button>
                      <button onClick={() => setShowTransfer(false)} className="btn" style={{ background: '#666', width: 'auto' }}>✖</button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
