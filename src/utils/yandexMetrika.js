/**
 * Утилита для работы с Яндекс.Метрикой
 * ID счетчика: 105611942
 */

const METRIKA_ID = 105611942;

/**
 * Проверяет, загружена ли Яндекс.Метрика
 */
export function isMetrikaLoaded() {
  return typeof window !== 'undefined' && typeof window.ym === 'function';
}

/**
 * Отправляет событие в Яндекс.Метрику
 * @param {string} action - Название действия (например, 'click', 'submit', 'view')
 * @param {string} target - Цель действия (например, 'button', 'form', 'page')
 * @param {Object} params - Дополнительные параметры события
 */
export function trackEvent(action, target, params = {}) {
  if (!isMetrikaLoaded()) {
    console.warn('Яндекс.Метрика не загружена');
    return;
  }

  try {
    window.ym(METRIKA_ID, 'reachGoal', `${action}_${target}`, params);
    console.log('Yandex Metrika event:', { action, target, params });
  } catch (error) {
    console.error('Ошибка отправки события в Яндекс.Метрику:', error);
  }
}

/**
 * Отслеживает просмотр страницы
 * @param {string} url - URL страницы
 * @param {string} title - Заголовок страницы
 */
export function trackPageView(url, title) {
  if (!isMetrikaLoaded()) {
    console.warn('Яндекс.Метрика не загружена для trackPageView');
    return;
  }

  try {
    // Для SPA приложений используем метод hit с полным URL
    const fullUrl = window.location.origin + url;
    window.ym(METRIKA_ID, 'hit', fullUrl, {
      title: title || document.title,
      referer: document.referrer || window.location.href
    });
    console.log('✅ Yandex Metrika pageview отправлен:', { url: fullUrl, title });
  } catch (error) {
    console.error('❌ Ошибка отправки просмотра страницы в Яндекс.Метрику:', error);
  }
}

/**
 * Отслеживает клик по элементу
 * @param {string} elementName - Название элемента
 * @param {Object} params - Дополнительные параметры
 */
export function trackClick(elementName, params = {}) {
  trackEvent('click', elementName, params);
}

/**
 * Отслеживает отправку формы
 * @param {string} formName - Название формы
 * @param {Object} params - Дополнительные параметры
 */
export function trackFormSubmit(formName, params = {}) {
  trackEvent('submit', formName, params);
}

/**
 * Отслеживает навигацию между страницами
 * @param {string} pageName - Название страницы
 * @param {Object} params - Дополнительные параметры
 */
export function trackNavigation(pageName, params = {}) {
  trackEvent('navigate', pageName, params);
}

/**
 * Отслеживает действия пользователя в профиле
 * @param {string} action - Действие (например, 'view_chart', 'view_table', 'calculate_chart')
 * @param {Object} params - Дополнительные параметры
 */
export function trackProfileAction(action, params = {}) {
  trackEvent('profile', action, params);
}

/**
 * Отслеживает действия в AI чате
 * @param {string} action - Действие (например, 'send_message', 'select_question', 'view_chat')
 * @param {Object} params - Дополнительные параметры
 */
export function trackAIAction(action, params = {}) {
  trackEvent('ai', action, params);
}

/**
 * Отслеживает действия в гороскопе
 * @param {string} action - Действие (например, 'view_horoscope', 'change_date')
 * @param {Object} params - Дополнительные параметры
 */
export function trackHoroscopeAction(action, params = {}) {
  trackEvent('horoscope', action, params);
}

/**
 * Отслеживает заполнение профиля
 * @param {string} step - Шаг заполнения (например, 'name', 'gender', 'birth_date', 'birth_city')
 * @param {Object} params - Дополнительные параметры
 */
export function trackProfileStep(step, params = {}) {
  trackEvent('profile_step', step, params);
}

