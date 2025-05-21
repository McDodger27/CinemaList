import { createContext, useEffect, useState } from "react";
import { fetchUserData } from "../util/http";

export const AuthContext = createContext({
    token: '',
    email: '',
    userLevel: 0,
    getEmail: () => {},
    isAuthenticated: false,
    authenticate: () => {},
    logout: () => {},
    refreshData: () => {},
    refreshToken: 0
});

function AuthContextProvider({ children }) {
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('token'));  
    const [email, setEmail] = useState(sessionStorage.getItem('email'));  
    const [refreshToken, setRefreshToken] = useState(0);
    const [userLevel, setUserLevel] = useState();

    useEffect(() => {
        async function getUserData() {
            const response = await fetchUserData();      
            if (response?.level) {
                setUserLevel(response.level);
            }
        } 
        getUserData();
    }, [refreshToken]);

    function refreshData() {
        setRefreshToken(refreshToken + 1);
    }

    function authenticate(token, email) {
        try {        
            console.log("authenticate was called in auth context");
            setAuthToken(token);
            setEmail(email);
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('email', email);
            refreshData();
        }
        catch (error) {
            console.log(error);
        }
    }

    async function getEmail() {
        const storedEmail = sessionStorage.getItem('email')
        return storedEmail;
    }

    function logout() {
        setAuthToken(null);
        setEmail(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('email');
    }

    const value = {
        token: authToken,
        email: email,
        userLevel: userLevel,
        getEmail: getEmail,
        isAuthenticated: !!authToken,
        authenticate: authenticate,
        logout: logout,
        refreshData: refreshData,
        refreshToken: refreshToken
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export default AuthContextProvider;