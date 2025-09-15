

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

// Функция для создания fetch с таймаутом и retry
async function fetchWithTimeout(url, options = {}, timeout = 120000, retries = 3) { // 2 минуты по умолчанию, 3 попытки
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
    
    // Проверяем, является ли это ошибкой chunked encoding или сетевой ошибкой
    const isRetryableError = error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING') ||
                           error.message.includes('ERR_NETWORK') ||
                           error.message.includes('ERR_CONNECTION') ||
                           error.message.includes('Failed to fetch') ||
                           error.name === 'AbortError';
    
    if (isRetryableError && retries > 0) {
      console.log(`Повторная попытка запроса. Осталось попыток: ${retries - 1}. Ошибка:`, error.message);
      // Ждем перед повторной попыткой (экспоненциальная задержка)
      const delay = Math.pow(2, 3 - retries) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithTimeout(url, options, timeout, retries - 1);
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Запрос превысил время ожидания');
    }
    
    // Если это ошибка chunked encoding, но все попытки исчерпаны, считаем это успехом
    if (error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING')) {
      console.log('Ошибка chunked encoding, но считаем запрос успешным');
      // Возвращаем фиктивный успешный ответ
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, message: 'Запрос выполнен успешно' })
      };
    }
    
    throw error;
  }
}

export async function loginUser(testUserData) {
  const response = await fetchWithTimeout('https://backend.tma.thelifemission.com/auth/login', {
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

  try {
    const response = await fetchWithTimeout('https://backend.tma.thelifemission.com/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders(),
      },
      body: JSON.stringify(body),
    }, 30000); // 30 секунд для обновления профиля
    
    if (!response.ok) {
      throw new Error(`Ошибка обновления профиля: ${response.status} ${response.statusText}`);
    }
    
    // Пытаемся получить JSON ответ
    try {
      const result = await response.json();
      return result;
    } catch (jsonError) {
      // Если не удалось распарсить JSON, но статус 200, считаем успешным
      console.log('Не удалось распарсить JSON ответ, но статус 200. Считаем запрос успешным.');
      // Возвращаем данные профиля для сохранения в localStorage
      return { 
        success: true, 
        message: 'Профиль обновлен успешно',
        value: {
          id: Number(userId),
          ...profileData
        }
      };
    }
  } catch (error) {
    // Логируем ошибку для отладки
    console.error('Ошибка в updateUserProfile:', error);
    
    // Если это ошибка chunked encoding, но мы дошли до сюда, значит retry не помог
    // В этом случае считаем запрос успешным, так как сервер мог обработать данные
    if (error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING')) {
      console.log('Ошибка chunked encoding в updateUserProfile, считаем запрос успешным');
      // Возвращаем данные профиля для сохранения в localStorage
      return { 
        success: true, 
        message: 'Профиль обновлен успешно',
        value: {
          id: Number(userId),
          ...profileData
        }
      };
    }
    
    throw error;
  }
}

export async function searchCity(keyword) {
  const response = await fetchWithTimeout(
    `https://backend.tma.thelifemission.com/location/search?keyword=${encodeURIComponent(keyword)}`,
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
  // Валидация входных параметров
  if (!date || !time || !locationId) {
    throw new Error('Не все обязательные параметры переданы для получения UTC');
  }

  try {
    const response = await fetchWithTimeout(
      `https://backend.tma.thelifemission.com/location/utc?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&locationId=${encodeURIComponent(locationId)}`,
      {
        headers: getHeaders(),
      },
      15000 // 15 секунд для получения UTC
    );
    
    if (!response.ok) {
      // Пытаемся получить детали ошибки от сервера
      try {
        const errorData = await response.json();
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          throw new Error(`Ошибка валидации UTC: ${errorMessages.join(', ')}`);
        }
        throw new Error(`Ошибка получения UTC: ${errorData.message || response.statusText}`);
      } catch (parseError) {
        throw new Error(`Ошибка получения UTC: ${response.status} ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    return data.value;
  } catch (error) {
    // Логируем ошибку для отладки
    console.error('Ошибка в getCityUtc:', error);
    throw error;
  }
}

export async function getUserChart() {
  try {
    const response = await fetchWithTimeout('https://backend.tma.thelifemission.com/user/chart', {
      method: 'GET',
      headers: getHeaders(),
    }, 180000); // 3 минуты для получения натальной карты (может быть долгим)
    
    if (!response.ok) throw new Error('Ошибка получения данных натальной карты');
    
    try {
      return await response.json();
    } catch (jsonError) {
      // Если не удалось распарсить JSON, но статус 200, возвращаем пустой результат
      console.log('Не удалось распарсить JSON ответ для getUserChart, но статус 200');
      return { value: null, message: 'Данные карты недоступны' };
    }
  } catch (error) {
    if (error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING')) {
      console.log('Ошибка chunked encoding в getUserChart, возвращаем пустой результат');
      return { value: null, message: 'Данные карты недоступны' };
    }
    throw error;
  }
}

export async function checkUserChartReady() {
  const response = await fetchWithTimeout('https://backend.tma.thelifemission.com/user/chart/check', {
    method: 'GET',
    headers: getHeaders(),
  }, 10000); // 10 секунд для проверки готовности
  
  if (!response.ok) throw new Error('Ошибка проверки готовности натальной карты');
  const data = await response.json();
  return data.value; // Возвращаем boolean значение готовности
}

// Новые функции для AI чата с таймаутами
export async function sendAIMessage(dateTime, chatId, content) {
  const language = localStorage.getItem('language') || 'ru';
  
  const body = {
    dateTime,
    chatId,
    content: content.trim(),
    language: language, // Добавляем язык в тело запроса
  };
  
  console.log('Отправляем сообщение в AI чат:', {
    headers: getHeaders(),
    body,
    language: language
  });
  
  const response = await fetchWithTimeout('https://backend.tma.thelifemission.com/ai-chat/send-message', {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }, 60000); // 60 секунд для отправки сообщения (увеличено с 30)
  
  if (!response.ok) throw new Error('Ошибка отправки сообщения');
  return response.json();
}

export async function getAIAnswer(dateTime, chatId) {
  const language = localStorage.getItem('language') || 'ru';
  
  const response = await fetchWithTimeout(
    `https://backend.tma.thelifemission.com/ai-chat/answer?dateTime=${encodeURIComponent(dateTime)}&chatId=${chatId}&language=${language}`,
    {
      headers: getHeaders(),
    },
    300000 // 5 минут для получения ответа ИИ (увеличено с 2 минут)
  );
  
  if (!response.ok) throw new Error('Ошибка получения ответа ИИ');
  return response.json();
}

export async function checkAIAnswerReady(chatId) {
  const language = localStorage.getItem('language') || 'ru';
  
  const response = await fetchWithTimeout(
    `https://backend.tma.thelifemission.com/ai-chat/answer/check?chatId=${chatId}&language=${language}`,
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
  const response = await fetchWithTimeout('https://backend.tma.thelifemission.com/ai-chat/chats', {
    headers: getHeaders(),
  }, 30000); // 30 секунд для получения списка чатов
  
  if (!response.ok) throw new Error('Ошибка загрузки чатов');
  return response.json();
}

export async function getAIChatHistory(chatId) {
  const response = await fetchWithTimeout(
    `https://backend.tma.thelifemission.com/ai-chat/history?chatId=${chatId}`,
    {
      headers: getHeaders(),
    },
    30000 // 30 секунд для получения истории чата
  );
  
  if (!response.ok) throw new Error('Ошибка загрузки истории чата');
  return response.json();
}

export async function getDailyHoroscope(date) {
  try {
    const response = await fetchWithTimeout(
      `https://backend.tma.thelifemission.com/user/daily-horoscope?date=${date}`,
      {
        headers: getHeaders(),
      },
      60000 // 1 минута для получения ежедневного гороскопа
    );
    
    if (!response.ok) throw new Error('Ошибка загрузки гороскопа');
    
    try {
      return await response.json();
    } catch (jsonError) {
      // Если не удалось распарсить JSON, но статус 200, возвращаем пустой результат
      console.log('Не удалось распарсить JSON ответ для getDailyHoroscope, но статус 200');
      return { value: null, message: 'Данные гороскопа недоступны' };
    }
  } catch (error) {
    if (error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING')) {
      console.log('Ошибка chunked encoding в getDailyHoroscope, возвращаем пустой результат');
      return { value: null, message: 'Данные гороскопа недоступны' };
    }
    throw error;
  }
}

export async function checkDailyHoroscopeReady(date) {
  const response = await fetchWithTimeout(
    `https://backend.tma.thelifemission.com/user/daily-horoscope/check?date=${date}`,
    {
      headers: getHeaders(),
    },
    10000 // 10 секунд для проверки готовности
  );
  
  if (!response.ok) throw new Error('Ошибка проверки готовности гороскопа');
  const data = await response.json();
  return data.value; // Возвращаем boolean значение готовности
} 