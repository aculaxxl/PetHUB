import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../api';

export default function LoginPage({ setToken }) {
  const [step, setStep] = useState(1); 
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await publicRequest('/auth/request-code/', 'POST', { phone });
      setStep(2);
    } catch (err) {
      setError('Не вдалося відправити код. Перевірте номер.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await publicRequest('/auth/verify-code/', 'POST', { phone, code });
      
      if (data.access) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh); 
        setToken(data.access);
        navigate('/profile');
      }
    } catch (err) {
      setError('Код невірний. Спробуйте ще раз.');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2>{step === 1 ? '📱 Вхід за номером' : '🔢 Підтвердження'}</h2>
      
      <form onSubmit={step === 1 ? handleRequestCode : handleVerifyCode}>
        {step === 1 ? (
          <>
            <p>Введіть номер телефону:</p>
            <input 
              className="input" 
              placeholder="+380..." 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
            <button className="btn" type="submit" style={{width: '100%'}}>Надіслати код</button>
          </>
        ) : (
          <>
            <p>Введіть код з терміналу <b>backend-1</b>:</p>
            <input 
              className="input" 
              placeholder="Код (напр. 1234)" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required 
              autoFocus
            />
            <button className="btn" type="submit" style={{width: '100%'}}>Увійти</button>
            <button 
              className="btn" 
              type="button" 
              onClick={() => setStep(1)} 
              style={{background: '#666', marginTop: '10px', width: '100%'}}
            >
              Назад
            </button>
          </>
        )}
      </form>

      {error && <p style={{color: 'red', marginTop: '10px', textAlign: 'center'}}>{error}</p>}
    </div>
  );
}
