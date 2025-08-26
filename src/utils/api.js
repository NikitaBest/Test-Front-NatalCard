

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

// Функция для создания fetch с таймаутом
async function fetchWithTimeout(url, options = {}, timeout = 120000) { // 2 минуты по умолчанию
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Запрос превысил время ожидания');
    }
    throw error;
  }
}

export async function loginUser(testUserData) {
  const response = await fetchWithTimeout('https://astro-backend.odonta.burtimaxbot.ru/auth/login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'accept': 'application/json',
      'Accept-Language': localStorage.getItem('language') || 'ru'
    },
    body: JSON.stringify(testUserData),
  }, 30000); // 30 секунд для авторизации
  
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

  const response = await fetchWithTimeout('https://astro-backend.odonta.burtimaxbot.ru/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(body),
  }, 30000); // 30 секунд для обновления профиля
  
  if (!response.ok) throw new Error('Ошибка обновления профиля');
  return response.json();
}

export async function searchCity(keyword) {
  const response = await fetchWithTimeout(
    `https://astro-backend.odonta.burtimaxbot.ru/location/search?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: getHeaders(),
    },
    15000 // 15 секунд для поиска города
  );
  
  if (!response.ok) throw new Error('Ошибка поиска города');
  const data = await response.json();
  return data.value || [];
}

export async function getCityUtc({ date, time, locationId }) {
  const response = await fetchWithTimeout(
    `https://astro-backend.odonta.burtimaxbot.ru/location/utc?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&locationId=${encodeURIComponent(locationId)}`,
    {
      headers: getHeaders(),
    },
    15000 // 15 секунд для получения UTC
  );
  
  if (!response.ok) throw new Error('Ошибка получения UTC');
  const data = await response.json();
  return data.value;
}

export async function getUserChart() {
  const response = await fetchWithTimeout('https://astro-backend.odonta.burtimaxbot.ru/user/chart', {
    method: 'GET',
    headers: getHeaders(),
  }, 180000); // 3 минуты для получения натальной карты (может быть долгим)
  
  if (!response.ok) throw new Error('Ошибка получения данных натальной карты');
  return response.json();
}

export async function checkUserChartReady() {
  const response = await fetchWithTimeout('https://astro-backend.odonta.burtimaxbot.ru/user/chart/check', {
    method: 'GET',
    headers: getHeaders(),
  }, 10000); // 10 секунд для проверки готовности
  
  if (!response.ok) throw new Error('Ошибка проверки готовности натальной карты');
  const data = await response.json();
  return data.value; // Возвращаем boolean значение готовности
}

// Новые функции для AI чата с таймаутами
export async function sendAIMessage(dateTime, chatId, content) {
  const response = await fetchWithTimeout('https://astro-backend.odonta.burtimaxbot.ru/ai-chat/send-message', {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateTime,
      chatId,
      content: content.trim(),
    })
  }, 60000); // 60 секунд для отправки сообщения (увеличено с 30)
  
  if (!response.ok) throw new Error('Ошибка отправки сообщения');
  return response.json();
}

export async function getAIAnswer(dateTime, chatId) {
  const response = await fetchWithTimeout(
    `https://astro-backend.odonta.burtimaxbot.ru/ai-chat/answer?dateTime=${encodeURIComponent(dateTime)}&chatId=${chatId}`,
    {
      headers: getHeaders(),
    },
    300000 // 5 минут для получения ответа ИИ (увеличено с 2 минут)
  );
  
  if (!response.ok) throw new Error('Ошибка получения ответа ИИ');
  return response.json();
}

export async function checkAIAnswerReady(chatId) {
  const response = await fetchWithTimeout(
    `https://astro-backend.odonta.burtimaxbot.ru/ai-chat/answer/check?chatId=${chatId}`,
    {
      headers: getHeaders(),
    },
    10000 // 10 секунд для проверки готовности
  );
  
  if (!response.ok) throw new Error('Ошибка проверки готовности ответа ИИ');
  const data = await response.json();
  return data.value; // Возвращаем boolean значение готовности
}

export async function getAIChats() {
  const response = await fetchWithTimeout('https://astro-backend.odonta.burtimaxbot.ru/ai-chat/chats', {
    headers: getHeaders(),
  }, 30000); // 30 секунд для получения списка чатов
  
  if (!response.ok) throw new Error('Ошибка загрузки чатов');
  return response.json();
}

export async function getAIChatHistory(chatId) {
  const response = await fetchWithTimeout(
    `https://astro-backend.odonta.burtimaxbot.ru/ai-chat/history?chatId=${chatId}`,
    {
      headers: getHeaders(),
    },
    30000 // 30 секунд для получения истории чата
  );
  
  if (!response.ok) throw new Error('Ошибка загрузки истории чата');
  return response.json();
}

export async function getDailyHoroscope(date) {
  const response = await fetchWithTimeout(
    `https://astro-backend.odonta.burtimaxbot.ru/user/daily-horoscope?date=${date}`,
    {
      headers: getHeaders(),
    },
    60000 // 1 минута для получения ежедневного гороскопа
  );
  
  if (!response.ok) throw new Error('Ошибка загрузки гороскопа');
  return response.json();
}

export async function checkDailyHoroscopeReady(date) {
  const response = await fetchWithTimeout(
    `https://astro-backend.odonta.burtimaxbot.ru/user/daily-horoscope/check?date=${date}`,
    {
      headers: getHeaders(),
    },
    10000 // 10 секунд для проверки готовности
  );
  
  if (!response.ok) throw new Error('Ошибка проверки готовности гороскопа');
  const data = await response.json();
  return data.value; // Возвращаем boolean значение готовности
} 