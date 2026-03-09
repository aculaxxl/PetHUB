const BASE_URL = 'http://localhost:8000/api';

export const apiRequest = async (endpoint, method = 'GET', data = null) => {
    let token = localStorage.getItem('token');

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        ...(data ? { body: JSON.stringify(data) } : {})
    };

    try {
        let response = await fetch(`${BASE_URL}${endpoint}`, config);

        // Якщо токен протух (401)
        if (response.status === 401) {
            const refreshToken = localStorage.getItem('refresh');
            
            if (refreshToken) {
                // Спроба оновити токен
                const refreshResponse = await fetch(`${BASE_URL}/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken })
                });

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    localStorage.setItem('token', refreshData.access);
                    
                    // Повтор запиту з новим токеном
                    config.headers['Authorization'] = `Bearer ${refreshData.access}`;
                    response = await fetch(`${BASE_URL}${endpoint}`, config);
                } else {
                    // Якщо рефреш теж не підійшов
                    localStorage.clear();
                    window.location.href = '/login';
                    return;
                }
            } else {
                window.location.href = '/login';
                return;
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Помилка ${response.status}: ${errorText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Публічний запит для логіну/реєстрації
export const publicRequest = async (endpoint, method = 'POST', data = null) => {
    const config = {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(data ? { body: JSON.stringify(data) } : {})
    };
    
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
    }
    return response.json();
};
