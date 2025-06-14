import { createContext } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => "",
    saveToken: (token, user) => {},
    getRefreshToken: () => {},
    getUser: () => {},
    signout: () => {},
});

export default AuthContext;