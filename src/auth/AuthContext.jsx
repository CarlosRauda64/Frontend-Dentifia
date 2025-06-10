import { createContext } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => "",
    saveToken: (userData) => {},
    getRefreshToken: () => {},
    getUser: () => {},
    signout: () => {},
});

export default AuthContext;