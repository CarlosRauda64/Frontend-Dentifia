import { createContext } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => "",
    saveUser: (userData) => {},
    getRefreshToken: () => {},
    getUser: () => {},
    signout: () => {},
});

export default AuthContext;