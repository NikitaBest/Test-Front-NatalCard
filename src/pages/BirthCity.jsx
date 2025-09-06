import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { updateUserProfile, searchCity, getCityUtc } from '../utils/api';
import { useEffect } from 'react';

export default function BirthCity() {
  const { userData, setUserData } = useUser();
  const { t, language } = useLanguage();
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  // Поиск города при вводе
  useEffect(() => {
    if (city.trim().length < 2) {
      setSuggestions([]);
      setSelectedCity(null);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(() => {
      searchCity(city.trim())
        .then((res) => setSuggestions(res))
        .catch(() => setSuggestions([]))
        .finally(() => setSearching(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [city]);

  const handleSelect = (cityObj) => {
    setSelectedCity(cityObj);
    setCity(cityObj.cityName + (cityObj.region ? ', ' + cityObj.region : ''));
    setSuggestions([]);
  };

  const handleContinue = async () => {
    if (!selectedCity) return;
    setLoading(true);
    try {
      // Получаем userId из localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Не найден ID пользователя. Пожалуйста, перезайдите в приложение.');
      }

      // Получаем UTC
      const utcData = await getCityUtc({
        date: userData.birthDate,
        time: userData.birthTime,
        locationId: selectedCity.id,
      });

      // Валидация данных перед отправкой
      if (!userData.name || !userData.name.trim()) {
        throw new Error('Имя не может быть пустым');
      }

      if (!userData.birthDate || !userData.birthDate.trim()) {
        throw new Error('Дата рождения не может быть пустой');
      }

      if (!userData.birthTime || !userData.birthTime.trim()) {
        throw new Error('Время рождения не может быть пустым');
      }

      if (!selectedCity.cityName || !selectedCity.cityName.trim()) {
        throw new Error('Название города не может быть пустым');
      }

      // Проверяем формат даты (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(userData.birthDate)) {
        throw new Error('Неверный формат даты. Ожидается YYYY-MM-DD');
      }

      // Проверяем формат времени (HH:MM)
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(userData.birthTime)) {
        throw new Error('Неверный формат времени. Ожидается HH:MM');
      }

      // Проверяем координаты
      if (isNaN(Number(selectedCity.latitude)) || isNaN(Number(selectedCity.longitude))) {
        throw new Error('Неверные координаты города');
      }

      // Формируем объект для updateUserProfile
      const profileData = {
        name: userData.name.trim(),
        gender: userData.gender === 'male' ? 1 : 2,
        birthDate: userData.birthDate.trim(),
        birthTime: userData.birthTime.trim(),
        birthLocation: selectedCity.cityName.trim(),
        latitude: Number(selectedCity.latitude),
        longitude: Number(selectedCity.longitude),
        utc: Number(utcData.utc) || 0,
        languageCode: language, // Добавляем выбранный язык
      };

      // Логирование для отладки
      console.log('Отправляемые данные профиля:', profileData);
      console.log('UTC данные:', utcData);
      console.log('User ID:', userId);

      const response = await updateUserProfile(profileData);
      if (response && (response.value || response.success)) {
        // Если есть value, используем его, иначе используем текущие данные профиля
        const userDataToSave = response.value || {
          ...userData,
          ...profileData,
          id: Number(userId)
        };
        
        localStorage.setItem('user', JSON.stringify(userDataToSave));
        setUserData(userDataToSave); // Обновляем UserContext
        console.log('Профиль успешно сохранен:', userDataToSave);
      } else {
        // Если нет ответа от сервера, но это может быть из-за chunked encoding,
        // все равно сохраняем данные локально
        console.log('Нет ответа от сервера, но сохраняем данные локально');
        const userDataToSave = {
          ...userData,
          ...profileData,
          id: Number(userId)
        };
        
        localStorage.setItem('user', JSON.stringify(userDataToSave));
        setUserData(userDataToSave);
        console.log('Профиль сохранен локально:', userDataToSave);
      }
      navigate('/profile');
    } catch (err) {
      console.error('Ошибка сохранения профиля:', err);
      alert(t('birthCity.saveError') + err.message);
      // НЕ переходим на профиль при ошибке
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-normal text-center mt-2 font-mono">{t('birthCity.title')}</h1>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="w-full max-w-[350px] mt-8 mb-6 flex flex-col justify-center relative">
          <input
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setSelectedCity(null);
            }}
            placeholder={t('birthCity.placeholder')}
            className="w-full text-center text-lg font-mono bg-transparent outline-none border-none border-b border-gray-400 focus:border-black transition placeholder-gray-400 py-3"
            style={{ borderRadius: 0 }}
          />
          <div className="w-full h-px bg-gray-400 absolute left-0 right-0 bottom-0" />
          {/* Показывать подсказки только если есть ввод и есть предложения */}
          {city.trim().length > 1 && suggestions.length > 0 && !selectedCity && (
            <div className="absolute left-0 right-0 top-12 bg-white z-10 border-t border-gray-300 max-h-64 overflow-y-auto">
              {suggestions.map((s, i) => (
                <div
                  key={s.id}
                  className="px-2 py-3 cursor-pointer hover:bg-gray-100 text-center text-base font-mono border-b border-gray-300 last:border-b-0"
                  onClick={() => handleSelect(s)}
                >
                  {s.cityName}{s.region ? `, ${s.region}` : ''}
                </div>
              ))}
            </div>
          )}
          {/* Поиск... */}
          {searching && city.trim().length > 1 && (
            <div className="absolute left-0 right-0 top-12 text-center text-gray-400 bg-white">{t('birthCity.searching')}</div>
          )}
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!selectedCity || loading} className="mx-auto w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis text-lg sm:text-xl text-center">{loading ? t('birthCity.saving') : t('birthCity.calculateButton')}</Button>
    </StepWrapper>
  );
} 