import { Link } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import { useUser } from '../context/UserContext';

export default function Success() {
  const { userData } = useUser();

  return (
    <StepWrapper>
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">🎉</h1>
        <h2 className="text-xl font-semibold mb-2">Все готово!</h2>
        <p className="text-gray-600 mb-8">Собранные данные:</p>
        <div className="text-left bg-gray-100 p-4 rounded-lg">
          <p><strong>Имя:</strong> {userData.name}</p>
          <p><strong>Пол:</strong> {userData.gender === 'male' ? 'Мужской' : 'Женский'}</p>
          <p><strong>Дата рождения:</strong> {userData.birthDate}</p>
          <p><strong>Время рождения:</strong> {userData.birthTime}</p>
          <p><strong>Город рождения:</strong> {userData.birthCity}</p>
        </div>
        <Link to="/" className="block mt-8 text-blue-500 hover:underline">
          Начать заново
        </Link>
      </div>
    </StepWrapper>
  );
}
