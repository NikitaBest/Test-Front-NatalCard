export async function sendUserData(userData) {
  // Замените URL на реальный адрес вашего бэкенда, когда он будет готов
  const response = await fetch('https://your-backend.com/api/calc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Ошибка сервера');
  return response.json(); // ожидается { natalChart, description, table }
}

export async function loginUser(testUserData) {
  const response = await fetch('https://astro-backend.odonta.burtimaxbot.ru/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
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
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Ошибка обновления профиля');
  return response.json();
}

export async function searchCity(keyword) {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `https://astro-backend.odonta.burtimaxbot.ru/location/search?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error('Ошибка поиска города');
  const data = await response.json();
  return data.value || [];
}

export async function getCityUtc({ date, time, locationId }) {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `https://astro-backend.odonta.burtimaxbot.ru/location/utc?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&locationId=${encodeURIComponent(locationId)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error('Ошибка получения UTC');
  const data = await response.json();
  return data.value;
} 