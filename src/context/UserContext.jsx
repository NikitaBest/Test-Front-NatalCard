import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : {
      name: '',
      gender: '',
      birthDate: '',
      birthTime: '',
      birthCity: ''
    };
  });

  // Слушаем изменения localStorage (например, если другой вкладкой обновили)
  useEffect(() => {
    function syncUserData(e) {
      if (e.key === 'user') {
        setUserData(e.newValue ? JSON.parse(e.newValue) : {});
      }
    }
    window.addEventListener('storage', syncUserData);
    return () => window.removeEventListener('storage', syncUserData);
  }, []);

  const value = { userData, setUserData };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
