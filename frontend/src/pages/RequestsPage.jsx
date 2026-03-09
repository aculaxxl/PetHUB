import { useEffect, useState } from 'react';
import { apiRequest } from '../api';

export default function RequestsPage() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const profile = await apiRequest('/profile/me/');
      setIncoming(profile.incoming_requests || []);
      setOutgoing(profile.my_sent_requests || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleAction = async (id, status) => {
    try {
      await apiRequest(`/adoption/adoption-requests/${id}/`, 'PATCH', { status });
      loadData();
    } catch (err) { alert("Помилка оновлення"); }
  };

  if (loading) return <div className="container">Синхронізація запитів...</div>;

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>📩 Центр запитів</h1>

      {/* --- СЕКЦІЯ 1: ВХІДНІ ЗАПИТИ (Хто хоче моїх тваринок) --- */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#4f46e5', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📥 Вхідні запити</h2>
        {incoming.length > 0 ? incoming.map(req => (
          <div key={req.id} className="card" style={{ padding: '20px', marginBottom: '15px', background: '#fff', borderLeft: req.status === 'pending' ? '5px solid #f59e0b' : '5px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>{req.requester_name}</b> хоче <b>{req.pet_name}</b>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                   {req.status === 'approved' ? `✅ Ви схвалили. Тел: ${req.requester_phone}` : req.status === 'rejected' ? '❌ Ви відхилили' : '⏳ Очікує вашої відповіді'}
                </div>
              </div>
              {req.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleAction(req.id, 'approved')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>✅ Схвалити</button>
                  <button onClick={() => handleAction(req.id, 'rejected')} style={{ background: '#666', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>✖ Відхилити</button>
                </div>
              )}
            </div>
          </div>
        )) : <p style={{ color: '#999' }}>У вас поки немає запитів від інших користувачів.</p>}
      </section>

      {/* --- СЕКЦІЯ 2: МОЇ ЗАЯВКИ (Кого хочу забрати я) --- */}
      <section>
        <h2 style={{ color: '#10b981', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📤 Мої заявки</h2>
        {outgoing.length > 0 ? outgoing.map(req => (
            <div key={req.id} className="card" style={{ padding: '20px', marginBottom: '15px', background: '#f9fafb', borderRadius: '12px' }}>
                <div style={{ textAlign: 'left' }}>
                    Заявка на тваринку <b>{req.pet_name}</b>
        
                    {req.status === 'pending' && (
                        <div style={{ color: '#f59e0b', marginTop: '10px' }}>⏳ Очікує на розгляд власником</div>
                     )}

                    {req.status === 'approved' && (
                        <div style={{ marginTop: '10px', padding: '15px', background: '#fff', border: '1px solid #10b981', borderRadius: '10px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>🎉 Власник схвалив вашу заявку!</span>
                            <div style={{ marginTop: '10px', fontSize: '16px' }}>
                            📞 Зв'яжіться з власником: <b style={{ color: '#4f46e5' }}>{req.owner_phone}</b>
                            </div>
                        </div>
                    )}

                    {req.status === 'rejected' && (
                    <div style={{ color: '#ef4444', marginTop: '10px' }}>❌ На жаль, власник відхилив запит.</div>
                    )}
                </div>
             </div>
            )) : <p>Ви ще не подавали заявок.</p>}
    </section>
    </div> 
  );
}