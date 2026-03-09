import { useState } from 'react';

export default function AddPetForm({ onPetAdded }) {

  const [formData, setFormData] = useState({ 
    name: '', 
    species: 'dog', 
    birth_date: '',
    status: 'active' 
  });
  const [photo, setPhoto] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('species', formData.species);
    data.append('birth_date', formData.birth_date);
    data.append('status', formData.status); 
    
    if (photo) {
      data.append('photo', photo); 
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/profile/pets/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) throw new Error('Помилка завантаження');

      const newPet = await response.json();
      alert('Улюбленця додано!');
      

      setFormData({ name: '', species: 'dog', birth_date: '', status: 'active' });
      setPhoto(null);
      onPetAdded(newPet);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card" style={{ marginTop: '20px', borderTop: '4px solid #4f46e5' }}>
      <h4>➕ Додай улюбленця</h4>
      <form onSubmit={handleSubmit}>
        <input 
          className="input" placeholder="Імʼя" required 
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
        />
        
        <select 
          className="input" value={formData.species}
          onChange={e => setFormData({...formData, species: e.target.value})}
        >
          <option value="dog">Песик</option>
          <option value="cat">Котик</option>
          <option value="parrot">Пташка</option>
          <option value="other">Інше</option>
        </select>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Статус тваринки:</label>
          <select 
            className="input" 
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="active">🏠 Я маю сім'ю</option>
            <option value="adoption">🔍 Шукаю сім'ю (Адопція)</option>
          </select>
        </div>

        <input 
          className="input" type="date" required 
          value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} 
        />
        
        <div style={{ margin: '10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Фото улюбленця:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => setPhoto(e.target.files[0])} 
          />
        </div>

        <button className="btn" type="submit">Зберегти</button>
      </form>
    </div>
  );
}
