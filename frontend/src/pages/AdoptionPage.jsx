import { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { Link } from 'react-router-dom';

export default function AdoptionPage() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    apiRequest('/profile/pets/adoption_list/').then(setPets).catch(console.error);
  }, []);


  const pageStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1c1e21',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px'
  };

  return (
    <div style={pageStyle}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
          🔍 Шукають нову родину
        </h1>
        <p style={{ color: '#65676b', fontSize: '16px', lineHeight: '1.5' }}>
          Ці хвостики мріють про теплий дім та люблячих господарів.
        </p>
      </div>

      {pets.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '24px' 
        }}>
          {pets.map(pet => (
            <Link key={pet.id} to={`/pets/${pet.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                padding: '24px', 
                textAlign: 'center', 
                background: '#ffffff', 
                borderRadius: '16px',
                border: '1px solid #e4e6eb',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img 
                  src={pet.photo} 
                  alt={pet.name} 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f59e0b', marginBottom: '16px' }} 
                />
                
                <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  {pet.name}
                </h3>
                
                <div style={{ color: '#f59e0b', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  🔍 Шукає дім
                </div>

                <div style={{ fontSize: '14px', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                  <span>📍</span> {pet.owner_location || "Локація не вказана"}
                </div>
                
                <div style={{ fontSize: '13px', color: '#8a8d91' }}>
                  Вид: {pet.species_display}
                </div>
                
                <button style={{ 
                  background: '#f59e0b', 
                  color: '#ffffff', 
                  marginTop: '20px', 
                  width: '100%', 
                  border: 'none', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Дізнатися більше
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '60px', 
          padding: '60px 20px', 
          background: '#f0f2f5', 
          borderRadius: '24px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#65676b', margin: '0 0 8px 0' }}>
            Наразі всі тваринки в теплі та затишку. 😊
          </h2>
          <p style={{ fontSize: '15px', color: '#8a8d91', margin: 0 }}>
            Спробуйте зайти пізніше або додайте тваринку, якій потрібен дім.
          </p>
        </div>
      )}
    </div>
  );
}
