import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { apiRequest } from '../api';

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [pet, setPet] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', species: '', birth_date: '', status: '' });
  const [newPhoto, setNewPhoto] = useState(null);

  const [showTransfer, setShowTransfer] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState('');

  const loadData = async () => {
    try {

      const petData = await apiRequest(`/profile/pets/${id}/`);
      setPet(petData);
      setEditData({
        name: petData.name,
        species: petData.species,
        birth_date: petData.birth_date,
        status: petData.status
      });

  
      const userData = await apiRequest('/profile/me/');
      setCurrentUserId(userData.id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const isOwner = pet && currentUserId === pet.owner;

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
      loadData();
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
  
  const handleSendRequest = async () => {
    try {
        await apiRequest('/profile/adoption-requests/', 'POST', { pet: id });
        alert("Заявку відправлено! ✨");
    } catch (err) {
        console.error(err);
        alert("Сталася помилка при відправці запиту.");
    }
};
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '20px auto', padding: '25px', fontFamily: 'sans-serif' }}>
      <Link to="/profile" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Назад до профілю
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h1 style={{ margin: 0 }}>🐾 {pet.name}</h1>

        {isOwner && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="btn" 
              style={{ background: isEditing ? '#666' : '#4f46e5', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}
            >
              {isEditing ? 'Скасувати' : '✎ Редагувати'}
            </button>
            {!isEditing && (
              <button 
                onClick={handleDelete} 
                className="btn" 
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}
              >
                🗑 Видалити
              </button>
            )}
          </div>
        )}
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
              <input style={{padding: '8px'}} value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
              <label style={{fontWeight: 'bold', fontSize: '14px'}}>Вид:</label>
              <select style={{padding: '8px'}} value={editData.species} onChange={e => setEditData({...editData, species: e.target.value})}>
                <option value="dog">Собака</option>
                <option value="cat">Кіт</option>
                <option value="parrot">Пташка</option>
                <option value="other">Інше</option>
              </select>
              <label style={{fontWeight: 'bold', fontSize: '14px'}}>Статус:</label>
              <select style={{padding: '8px'}} value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})}>
                <option value="active">🏠 Я маю сім'ю</option>
                <option value="adoption">🔍 Шукаю сім'ю (Адопція)</option>
              </select>
              <label style={{fontWeight: 'bold', fontSize: '14px'}}>Дата народження:</label>
              <input type="date" style={{padding: '8px'}} value={editData.birth_date} onChange={e => setEditData({...editData, birth_date: e.target.value})} />
              <button type="submit" className="btn" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>Зберегти зміни</button>
            </form>
          ) : (
            <>
              <p><strong>Вид:</strong> {pet.species_display}</p>
              <p><strong>Дата народження:</strong> {new Date(pet.birth_date).toLocaleDateString()}</p>
              <p><strong>Локація:</strong> {pet.owner_location || "Не вказано"}</p>
              <p><strong>Статус:</strong> {pet.status === 'active' ? '🏠 Вдома' : '🔍 Шукає дім'}</p>
              
              <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />


              {isOwner && pet.status === 'adoption' && (
                <div style={{ padding: '15px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>🤝 Ви власник. Оформити передачу?</h4>
                  {!showTransfer ? (
                    <button onClick={() => setShowTransfer(true)} className="btn" style={{ background: '#f59e0b', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                      Знайти нову сім'ю
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <input 
                        type="number" placeholder="ID нового власника" 
                        value={newOwnerId} onChange={(e) => setNewOwnerId(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
                      />
                      <button onClick={handleTransfer} className="btn" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px' }}>ОК</button>
                      <button onClick={() => setShowTransfer(false)} className="btn" style={{ background: '#666', color: 'white', border: 'none', padding: '10px', borderRadius: '8px' }}>✖</button>
                    </div>
                  )}
                </div>
              )}


              {!isOwner && pet.status === 'adoption' && (
                <button 
                    onClick={handleSendRequest}
                    className="btn" 
                    style={{ background: '#10b981', color: 'white', padding: '15px', borderRadius: '12px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}
            >
                🐾 Хочу дати тваринці дім
                </button>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
