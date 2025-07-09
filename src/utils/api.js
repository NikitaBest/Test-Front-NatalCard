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