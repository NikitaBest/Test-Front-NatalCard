import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import Picker from 'react-mobile-picker';
import '../styles/picker.css';

export default function BirthTime() {
  const { setUserData } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  // Список часов и минут
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  // wheel picker value
  const [pickerValue, setPickerValue] = useState({
    hour: hours[12], // по умолчанию 12:00
    minute: minutes[0],
  });

  const getScaleByDistance = (distance) => {
    if (distance === 0) return 'scale-100';
    if (distance === 1) return 'scale-97';
    if (distance === 2) return 'scale-94';
    return 'scale-90';
  };

  const handleContinue = () => {
    if (!pickerValue.hour || !pickerValue.minute) return;
    const time = `${pickerValue.hour}:${pickerValue.minute}`;
    setUserData(prevData => ({ ...prevData, birthTime: time }));
    navigate('/birth-city');
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-normal text-center mt-2 font-mono">{t('birthTime.title')}</h1>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="mb-6 w-full mt-8 flex justify-center">
          <div className="w-full max-w-[350px] h-[360px] bg-white/80 rounded-[28px] shadow-2xl flex items-center justify-center relative overflow-hidden picker-fade-mask">
            {/* Серая полоса по центру */}
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 w-[95%] mx-auto bg-[#E9E9EA] z-10 rounded-[28px] picker-center-bar" />
            <Picker
              value={pickerValue}
              onChange={setPickerValue}
              height={360}
              itemHeight={36}
              wheelMode="natural"
              className="picker-gap relative z-20"
            >
              <Picker.Column name="hour">
                {hours.map((h, idx) => {
                  const centerIndex = hours.indexOf(pickerValue.hour);
                  const distance = Math.abs(idx - centerIndex);
                  return (
                    <Picker.Item key={h} value={h}>
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
                          {h}
                        </div>
                      )}
                    </Picker.Item>
                  );
                })}
              </Picker.Column>
              <Picker.Column name="minute">
                {minutes.map((m, idx) => {
                  const centerIndex = minutes.indexOf(pickerValue.minute);
                  const distance = Math.abs(idx - centerIndex);
                  return (
                    <Picker.Item key={m} value={m}>
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
                          {m}
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
      <Button onClick={handleContinue} disabled={!pickerValue.hour || !pickerValue.minute} className="mx-auto">{t('common.continue')}</Button>
    </StepWrapper>
  );
}