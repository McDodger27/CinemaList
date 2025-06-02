import { useContext, useState } from "react";
import { ColorContext } from "../context/colorContext";
import { login } from "../util/auth";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function LoginScreen() {
    const colorCtx = useContext(ColorContext);
    const authCtx = useContext(AuthContext);

    const navigate = useNavigate();

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');

    function handleEmail(event) {
        setEnteredEmail(event.target.value);
    }

    function handlePassword(event) {
        setEnteredPassword(event.target.value);
    }

    async function submitHandler(email, password) {       
        email = email.trim();
        password = password.trim();
    
        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 6;
    
        if (
            !emailIsValid ||
            !passwordIsValid
        ) {
            alert('Invalid input, email must contian an (@) symbol and user password must be at least 7 characters long');            
            return;
        }
        try {
            const response = await login(email, password);
            const token = response[0];
            const userID = response[1];
            authCtx.authenticate(token, userID, email);
            navigate("/");
        }
        catch (error) {
            alert('Authentication failed', 'Could not create user. Please check your credentials or try again later.');
            console.log(error);
        }
    }

    function navSignup() {
        navigate("/signup");
    }

    const inputStyle={
        backgroundColor: '#444',
        color: '#ccc',
        borderStyle: 'solid',
        borderColor: '#333',
        margin: '2px',
        padding: '2px',
        borderRadius: '4px'
    }

    return(
        <form action={() => submitHandler(enteredEmail, enteredPassword)}>
            <h2 style={{ color: colorCtx.primary }}>Login</h2>
            <input style={inputStyle} type="email" onChange={handleEmail} value={enteredEmail} placeholder="Email" />
                <br />
            <input style={inputStyle} type="password" onChange={handlePassword} value={enteredPassword} placeholder="Password" />
                <br />
            <input value="Submit" type="submit" style={inputStyle} />
            <p>Don't have an acount? <span style={{ color: colorCtx.primary, cursor: 'pointer' }} onClick={navSignup}>Sign Up</span></p>
        </form>
    );
}

export default LoginScreen;