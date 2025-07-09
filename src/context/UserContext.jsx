import { createContext, useContext, useState } from 'react';

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
