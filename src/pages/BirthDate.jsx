import { useState, useMemo } from 'react';
import StepWrapper from '../components/StepWrapper';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import Picker from 'react-mobile-picker';
import { useNavigate } from 'react-router-dom';
import '../styles/picker.css';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

const getScaleByDistance = (distance) => {
  if (distance === 0) return 'scale-100';
  if (distance === 1) return 'scale-97';
  if (distance === 2) return 'scale-94';
  return 'scale-90';
};

export default function BirthDate() {
  const { setUserData } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Получаем месяцы из переводов
  const months = t('birthDate.months');
  
  const [pickerValue, setPickerValue] = useState({
    month: months[0],
    day: '1',
    year: years[0],
  });

  // days in selected month/year
  const daysInMonth = useMemo(() => {
    const monthIndex = months.indexOf(pickerValue.month);
    const year = Number(pickerValue.year);
    return new Date(year, monthIndex + 1, 0).getDate();
  }, [pickerValue.month, pickerValue.year, months]);

  const optionGroups = {
    month: months,
    day: Array.from({ length: daysInMonth }, (_, i) => String(i + 1)),
    year: years,
  };

  const handleChange = (name, value) => {
    setPickerValue(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (!pickerValue.day || !pickerValue.month || !pickerValue.year) return;
    const monthNum = String(months.indexOf(pickerValue.month) + 1).padStart(2, '0');
    const dayNum = String(pickerValue.day).padStart(2, '0');
    const date = `${pickerValue.year}-${monthNum}-${dayNum}`;
    setUserData(prevData => ({ ...prevData, birthDate: date }));
    navigate('/birth-time');
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-normal text-center mt-2 font-mono">{t('birthDate.title')}</h1>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="mb-6 w-full mt-8 flex justify-center">
          <div className="w-full max-w-[350px] h-[360px] bg-white/80 rounded-[48px] shadow-2xl flex items-center justify-center relative overflow-hidden picker-fade-mask">
            {/* Серая полоса по центру */}
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 w-[95%] mx-auto bg-[#E9E9EA] z-10 rounded-[48px] picker-center-bar" />
            <Picker
              value={pickerValue}
              onChange={setPickerValue}
              height={360}
              itemHeight={36}
              wheelMode="natural"
              className="picker-gap relative z-20"
            >
              <Picker.Column name="month">
                {months.map((m, idx) => {
                  const centerIndex = months.indexOf(pickerValue.month);
                  const distance = Math.abs(idx - centerIndex);
                  return (
                    <Picker.Item key={m} value={m}>
                      {({ selected }) => (
                        <div
                          className={
                            (selected
                              ? 'picker-item-selected font-mono font-semibold text-[#1A1A1A] text-lg flex items-center justify-center h-12 transition-all duration-200 opacity-100 z-20 text-center bg-[#E9E9EA]'
                              : 'picker-item font-mono text-[#B0B0B8] text-base opacity-40 font-normal flex items-center justify-center h-12 transition-all duration-200 z-20 blur-[0.25px] text-center') +
                            ' mr-8 ' + getScaleByDistance(distance)
                          }
                          style={{ minHeight: 36 }}
                        >
                          {m}
                        </div>
                      )}
                    </Picker.Item>
                  );
                })}
              </Picker.Column>
              <Picker.Column name="day">
                {Array.from({ length: daysInMonth }, (_, i) => String(i + 1)).map((d, idx) => {
                  const centerIndex = Number(pickerValue.day) - 1;
                  const distance = Math.abs(idx - centerIndex);
                  return (
                    <Picker.Item key={d} value={d}>
                      {({ selected }) => (
                        <div
                          className={
                            (selected
                              ? 'picker-item-selected font-mono font-semibold text-[#1A1A1A] text-lg flex items-center justify-center h-12 transition-all duration-200 opacity-100 z-20 text-center bg-[#E9E9EA]'
                              : 'picker-item font-mono text-[#B0B0B8] text-base opacity-40 font-normal flex items-center justify-center h-12 transition-all duration-200 z-20 blur-[0.25px] text-center') +
                            ' ml-8 mr-8 ' + getScaleByDistance(distance)
                          }
                          style={{ minHeight: 36 }}
                        >
                          {d}
                        </div>
                      )}
                    </Picker.Item>
                  );
                })}
              </Picker.Column>
              <Picker.Column name="year">
                {years.map((y, idx) => {
                  const centerIndex = years.indexOf(pickerValue.year);
                  const distance = Math.abs(idx - centerIndex);
                  return (
                    <Picker.Item key={y} value={y}>
                      {({ selected }) => (
                        <div
                          className={
                            (selected
                              ? 'picker-item-selected font-mono font-semibold text-[#1A1A1A] text-lg flex items-center justify-center h-12 transition-all duration-200 opacity-100 z-20 text-center bg-[#E9E9EA]'
                              : 'picker-item font-mono text-[#B0B0B8] text-base opacity-40 font-normal flex items-center justify-center h-12 transition-all duration-200 z-20 blur-[0.25px] text-center') +
                            ' ml-8 ' + getScaleByDistance(distance)
                          }
                          style={{ minHeight: 36 }}
                        >
                          {y}
                        </div>
                      )}
                    </Picker.Item>
                  );
                })}
              </Picker.Column>
            </Picker>
          </div>
        </div>
      </div>
      <div className="w-full px-4 pb-4">
        <Button onClick={handleContinue} disabled={!pickerValue.day || !pickerValue.month || !pickerValue.year} className="w-full">{t('common.continue')}</Button>
      </div>
    </StepWrapper>
  );
}