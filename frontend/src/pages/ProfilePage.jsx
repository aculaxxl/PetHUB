import { useEffect, useState } from 'react'; 
import { apiRequest } from '../api';
import { Link } from 'react-router-dom';
import AddPetForm from '../components/AddPetForm';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const loadProfile = () => {
    apiRequest('/profile/me/')
      .then(data => {
        setProfile(data);
        setNewName(data.name || "");
        setNewLocation(data.location || "");
      })
      .catch(err => {
         console.error("Profile load error:", err);
         alert("Помилка завантаження. Спробуйте оновити сторінку.");
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const data = await apiRequest('/profile/me/update/', 'PATCH', { 
        name: newName,
        location: newLocation 
      });
      setProfile(prev => ({ ...prev, name: data.name, location: data.location }));
      setIsEditing(false);
      alert("Дані оновлено!");
    } catch (err) {
      alert("Не вдалося оновити профіль.");
    }
  };

  if (!profile) return <div className="container">Завантаження...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1, marginRight: '15px' }}>
              <input value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #4f46e5' }} />
              <input value={newLocation} onChange={e => setNewLocation(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #4f46e5' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleUpdateProfile} className="btn" style={{ background: '#10b981', padding: '8px' }}>Зберегти</button>
                <button onClick={() => setIsEditing(false)} className="btn" style={{ background: '#666', padding: '8px' }}>Скасувати</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ margin: 0 }}>👤 {profile.name || "Профіль"} <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✎</button></h2>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>📍 {profile.location || "Земля"} • 🆔 {profile.id}</div>
            </div>
          )}
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="btn logout-btn" style={{ width: 'auto' }}>Вийти</button>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />


        <h3 style={{ marginTop: '20px', color: '#333' }}>🐾 Мої улюбленці ({profile.pets?.length || 0})</h3>
        <div style={{ marginTop: '15px' }}>
          {profile.pets && profile.pets.length > 0 ? (
            profile.pets.map((pet) => (
              <Link key={pet.id} to={`/pets/${pet.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '12px', marginBottom: '10px', border: pet.status === 'adoption' ? '2px solid #f59e0b' : '1px solid #f0f0f0' }}>
                <img src={pet.photo} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px', border: '2px solid #4f46e5' }} />
                <div style={{ textAlign: 'left', flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#111' }}>{pet.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{pet.species_display}</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: pet.status === 'adoption' ? '#f59e0b' : '#10b981' }}>
                  {pet.status === 'adoption' ? '🔍 АДОПЦІЯ' : '🏠 ВДОМА'}
                </div>
              </Link>
            ))
          ) : <p style={{ color: '#999', fontStyle: 'italic' }}>Ви ще не додали тваринок.</p>}
        </div>

        {profile.past_pets?.length > 0 && (
          <div style={{ marginTop: '30px', borderTop: '2px dashed #f0f0f0', paddingTop: '20px' }}>
            <h3 style={{ color: '#666', fontSize: '18px' }}>✨ Знайшли нову родину</h3>
            {profile.past_pets.map((pet) => (
              <div key={pet.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', opacity: 0.7 }}>
                <img src={pet.photo} style={{ width: '40px', height: '40px', borderRadius: '50%', filter: 'grayscale(50%)', marginRight: '12px' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{pet.name}</div>
                  <div style={{ fontSize: '11px', color: '#10b981' }}>🎉 У новій сім'ї</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '25px' }}>
        <AddPetForm onPetAdded={loadProfile} />
      </div>
    </div>
  );
}