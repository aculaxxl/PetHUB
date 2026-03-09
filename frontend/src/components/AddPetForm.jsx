import { useState } from 'react';
import { apiRequest } from '../api';

export default function AddPetForm({ onPetAdded }) {
  const [formData, setFormData] = useState({ name: '', species: 'dog', birth_date: '' });
  const [photo, setPhoto] = useState(null); // Состояние для файла

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ДЛЯ ФОТО НУЖЕН FormData (JSON не умеет передавать файлы)
    const data = new FormData();
    data.append('name', formData.name);
    data.append('species', formData.species);
    data.append('birth_date', formData.birth_date);
    if (photo) {
      data.append('photo', photo); // Ключ 'photo' должен совпадать с именем в Django
    }

    try {
      // ВАЖНО: для FormData заголовок 'Content-Type' в fetch ставить НЕЛЬЗЯ (браузер сделает это сам)
      // Поэтому нам нужно слегка изменить вызов apiRequest или использовать обычный fetch
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/profile/pets/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type тут НЕ ПИШЕМ!
        },
        body: data
      });

      if (!response.ok) throw new Error('Помилка завантаження');

      const newPet = await response.json();
      alert('Улюбленця додано!');
      
      // Очистка
      setFormData({ name: '', species: 'dog', birth_date: '' });
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
          <option value="bird">Пташка</option>
          <option value="other">Інше</option>
        </select>

        <input 
          className="input" type="date" required 
          value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} 
        />

        {/* НОВОЕ ПОЛЕ ДЛЯ ФОТО */}
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
