import { createContext } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => "",
    saveUser: (userData) => {},
    getRefreshToken: () => {},
});

export default AuthContext;