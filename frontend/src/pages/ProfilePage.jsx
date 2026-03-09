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
         console.error(err);
         alert("Не вдалося завантажити профіль. Спробуйте увійти знову.");
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const updatedData = await apiRequest('/profile/me/update/', 'PATCH', { 
        name: newName,
        location: newLocation 
      });
      
      setProfile(prev => ({ 
        ...prev, 
        name: updatedData.name, 
        location: updatedData.location 
      }));
      setIsEditing(false);
      alert("Дані оновлено! ✨");
    } catch (error) {
      console.error("Помилка при оновленні:", error);
      alert("Не вдалося оновити профіль.");
    }
  };

  const handlePetAdded = (newPet) => {
    setProfile(prev => ({ ...prev, pets: [...(prev.pets || []), newPet] }));
  };

  if (!profile) return <div className="card">Завантаження...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1, marginRight: '15px' }}>
              <input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Твоє ім'я"
                style={{ padding: '8px', fontSize: '18px', borderRadius: '8px', border: '2px solid #4f46e5' }}
              />
              <input 
                value={newLocation} 
                onChange={(e) => setNewLocation(e.target.value)} 
                placeholder="Твоя локація"
                style={{ padding: '8px', fontSize: '14px', borderRadius: '8px', border: '2px solid #4f46e5' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleUpdateProfile} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>Зберегти</button>
                <button onClick={() => setIsEditing(false)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>✖</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ margin: 0, color: '#1c1e21' }}>👤 {profile.name || "Мій профіль"}</h2>
                <button 
                  onClick={() => setIsEditing(true)} 
                  style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✎
                </button>
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                <span>📍 {profile.location || "Локація не вказана"}</span> • <span>🆔 {profile.id}</span>
              </div>
            </div>
          )}
          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('refresh'); window.location.reload(); }} className="btn logout-btn" style={{ width: 'auto', padding: '8px 15px' }}>Вийти</button>
        </div>
        
        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

        <h3 style={{ marginTop: '20px', color: '#333' }}>🐾 Мої улюбленці ({profile.pets?.length || 0})</h3>
        <div style={{ marginTop: '15px' }}>
          {profile.pets && profile.pets.length > 0 ? (
            profile.pets.map((pet) => (
              <Link key={pet.id} to={`/pets/${pet.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '12px', marginBottom: '10px', border: pet.status === 'adoption' ? '2px solid #f59e0b' : '1px solid #f0f0f0' }}>
                <div style={{ marginRight: '15px' }}>
                  <img src={pet.photo} alt={pet.name} style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4f46e5' }} />
                </div>
                <div style={{ textAlign: 'left', flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '17px' }}>{pet.name}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{pet.species_display}</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: pet.status === 'adoption' ? '#f59e0b' : '#10b981' }}>
                  {pet.status === 'adoption' ? '🔍 Шукає дім' : '🏠 Вдома'}
                </div>
              </Link>
            ))
          ) : (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Ви ще не додали жодного улюбленця.</p>
          )}
        </div>

        {profile.past_pets && profile.past_pets.length > 0 && (
          <div style={{ marginTop: '30px', borderTop: '2px dashed #f0f0f0', paddingTop: '20px' }}>
            <h3 style={{ color: '#666', fontSize: '18px' }}>✨ Знайшли нову родину ({profile.past_pets.length})</h3>
            <div style={{ marginTop: '15px', opacity: 0.8 }}>
              {profile.past_pets.map((pet) => (
                <div key={pet.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', background: '#fcfcfc', borderRadius: '12px', marginBottom: '10px', border: '1px solid #eee' }}>
                  <div style={{ marginRight: '15px' }}>
                    <img src={pet.photo} alt={pet.name} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(30%)' }} />
                  </div>
                  <div style={{ textAlign: 'left', flexGrow: 1 }}>
                    <div style={{ fontWeight: 'bold', color: '#4b5563' }}>{pet.name}</div>
                    <div style={{ fontSize: '12px', color: '#10b981' }}>🎉 Щасливо адоптований!</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '25px' }}>
        <AddPetForm onPetAdded={handlePetAdded} />
      </div>
    </div>
  );
}
