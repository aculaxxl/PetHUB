import { useState, useEffect } from 'react';
import { apiRequest } from '../api';

export default function NewsCreatePage({ onPostCreated }) { // Додали пропс
    const [myPets, setMyPets] = useState([]);
    const [formData, setFormData] = useState({
        author_pet: '',
        title: '',
        anons: '',
        full_text: ''
    });

    useEffect(() => {
        // Отримуємо тваринок юзера для списку
        apiRequest('/profile/me/').then(data => {
            if (data.pets && data.pets.length > 0) {
                setMyPets(data.pets);
                // Встановлюємо першу тваринку за замовчуванням
                setFormData(prev => ({ ...prev, author_pet: data.pets[0].id }));
            }
        }).catch(err => console.error("Не вдалося завантажити тваринок:", err));
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Передаємо шлях, метод 'POST' та об'єкт formData
        await apiRequest('/news/', 'POST', formData);
        
        alert("Новину опубліковано! 🐾");
        onPostCreated(); // Оновлює стрічку
    } catch (err) {
        console.error("Деталі помилки:", err);
        alert("Помилка при створенні. Перевірте консоль.");
    }
};

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>➕ Нова публікація від улюбленця</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold' }}>Хто розповідає?</label>
                    <select 
                        value={formData.author_pet} 
                        onChange={e => setFormData({...formData, author_pet: e.target.value})}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        required
                    >
                        {myPets.map(pet => (
                            <option key={pet.id} value={pet.id}>{pet.name}</option>
                        ))}
                    </select>
                </div>

                <input 
                    placeholder="Заголовок (наприклад: Сьогоднішні пригоди)" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                />

                <input 
                    placeholder="Короткий анонс" 
                    value={formData.anons}
                    onChange={e => setFormData({...formData, anons: e.target.value})}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                />

                <textarea 
                    placeholder="Текст новини... Про що думає ваш хвостик?" 
                    value={formData.full_text}
                    style={{ height: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                    onChange={e => setFormData({...formData, full_text: e.target.value})} 
                    required
                />
                
                <button type="submit" className="btn" style={{ padding: '12px', fontWeight: 'bold' }}>
                    Опублікувати 🚀
                </button>
            </form>
        </div>
    );
}
