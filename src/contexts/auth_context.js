import * as React from 'react';

const AuthContext = React.createContext({});

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
