import { createContext, useState, useEffect, useContext } from "react";
import { fetchUserData } from "../util/http";
import { AuthContext } from "./authContext";

export const ColorContext = createContext({
    primary: '',
    secdondary: '',
    setColor: (color) => {}
})

function ColorContextProvider({ children }) {
    const [primary, setPrimary] = useState('#f09');
    const [secdondary, setSecondary] = useState('#0aa');

    const authCtx = useContext(AuthContext);

    // get color from user data in  database

    useEffect(() => {
        async function getColor() {
            const userID = sessionStorage.getItem('userID');
            const response = await fetchUserData(userID);
            if (response?.color) {
                const color = response.color;
                setColor(color);
            }            
        }
        getColor();
    }, [authCtx.isAuthenticated]);

    // function to change color
    function setColor(color) {
        if (color === 'pink') {
            setPrimary('#f09');
            setSecondary('#0aa');
        } else if (color === 'teal') {
            setPrimary('#0aa');
            setSecondary('#9cf');
        } else if (color === 'blue') {
            setPrimary('#34a');
            setSecondary('#fc0');
        } else if (color === 'yellow') {
            setPrimary('#fc0');
            setSecondary('#9cf');
        } else if (color === 'red') {
            setPrimary('#a03')
            setSecondary('#9cf');
        } else if (color === 'green') {
            setPrimary('#0f0');
            setSecondary('#f09');         
        } else if (color === 'sky') {
            setPrimary('#9cf');
            setSecondary('#aaa');
        }
    }

    const value = {
        primary: primary,
        secdondary: secdondary,
        setColor: setColor
    }

    return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
}

export default ColorContextProvider;