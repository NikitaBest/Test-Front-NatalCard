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
  const { t } = useLanguage();
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
      // Получаем UTC
      const utcData = await getCityUtc({
        date: userData.birthDate,
        time: userData.birthTime,
        locationId: selectedCity.id,
      });
      // Формируем объект для updateUserProfile
      const profileData = {
        name: userData.name,
        gender: userData.gender === 'male' ? 1 : 2,
        birthDate: userData.birthDate,
        birthTime: userData.birthTime,
        birthLocation: selectedCity.cityName,
        latitude: Number(selectedCity.latitude),
        longitude: Number(selectedCity.longitude),
        utc: utcData.utc || 0,
      };
      const response = await updateUserProfile(profileData);
      if (response && response.value) {
        localStorage.setItem('user', JSON.stringify(response.value));
      }
      navigate('/profile');
    } catch (err) {
      alert(t('birthCity.saveError') + err.message);
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