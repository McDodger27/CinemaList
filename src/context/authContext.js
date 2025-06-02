import { createContext, useEffect, useState } from "react";
import { fetchUserData } from "../util/http";

export const AuthContext = createContext({
    token: '',
    email: '',
    userLevel: 0,
    getUserID: () => {},
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
            const userID = sessionStorage.getItem('userID');
            const response = await fetchUserData(userID);      
            if (response?.level) {
                setUserLevel(response.level);
            }
        } 
        getUserData();
    }, [refreshToken]);

    function refreshData() {
        setRefreshToken(refreshToken + 1);
    }

    function authenticate(token, userID, email) {
        try {        
            console.log("authenticate was called in auth context");
            setAuthToken(token);
            setEmail(email);
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('userID', userID);
            refreshData();
        }
        catch (error) {
            console.log(error);
        }
    }

    async function getUserID() {
        const storedUserID = sessionStorage.getItem('userID');
        return storedUserID;
    }

    function logout() {
        setAuthToken(null);
        setEmail(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('userID');
    }

    const value = {
        token: authToken,
        email: email,
        userLevel: userLevel,
        getUserID: getUserID,
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