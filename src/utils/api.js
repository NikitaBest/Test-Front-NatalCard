

function getHeaders() {
  const token = localStorage.getItem('token');
  const language = localStorage.getItem('language') || 'ru';
  
  const headers = {
    'accept': 'application/json',
    'Accept-Language': language,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function loginUser(testUserData) {
  const response = await fetch('https://astro-backend.odonta.burtimaxbot.ru/auth/login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'accept': 'application/json',
      'Accept-Language': localStorage.getItem('language') || 'ru'
    },
    body: JSON.stringify(testUserData),
  });
  if (!response.ok) throw new Error('Ошибка авторизации');
  return response.json(); // ожидается { user, token }
}

export async function updateUserProfile(profileData) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  if (!token || !userId) throw new Error('Нет токена или id пользователя');

  // Формируем объект для запроса
  const body = {
    id: Number(userId),
    ...profileData,
  };

  const response = await fetch('https://astro-backend.odonta.burtimaxbot.ru/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Ошибка обновления профиля');
  return response.json();
}

export async function searchCity(keyword) {
  const response = await fetch(
    `https://astro-backend.odonta.burtimaxbot.ru/location/search?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) throw new Error('Ошибка поиска города');
  const data = await response.json();
  return data.value || [];
}

export async function getCityUtc({ date, time, locationId }) {
  const response = await fetch(
    `https://astro-backend.odonta.burtimaxbot.ru/location/utc?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&locationId=${encodeURIComponent(locationId)}`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) throw new Error('Ошибка получения UTC');
  const data = await response.json();
  return data.value;
}

export async function getUserChart() {
  const response = await fetch('https://astro-backend.odonta.burtimaxbot.ru/user/chart', {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Ошибка получения данных натальной карты');
  return response.json();
} 