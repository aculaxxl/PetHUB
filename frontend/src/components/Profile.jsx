import { useState } from 'react'; // ОБОВ'ЯЗКОВО
import { Link } from 'react-router-dom';

export default function Profile({ data, onLogout, onUpdateName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(data?.name || "");

  const handleSave = () => {
    onUpdateName(newName); // Викликає функцію з ProfilePage
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* ЛОГІКА ЗАГОЛОВКА: ТЕКСТ АБО ІНПУТ */}
        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              className="input-edit" // Додай стилів пізніше
            />
            <button onClick={handleSave} className="btn-save">Зберегти</button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">Скасувати</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0 }}>👤 {data.name || "Мій профіль"}</h2>
            <button 
              onClick={() => setIsEditing(true)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✎
            </button>
          </div>
        )}

        <button className="btn logout-btn" onClick={onLogout}>Вийти</button>
      </div>
      
      {/* Решта твого коду з ID, локацією та списком тваринок... */}
    </div>
  );
}
