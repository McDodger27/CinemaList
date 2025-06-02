import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { createUser } from "../util/auth";
import { ColorContext } from "../context/colorContext";
import { useNavigate } from "react-router-dom";
import { addUser, fetchUsers } from "../util/http";

function SignupScreen() {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const colorCtx = useContext(ColorContext);

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');

    function handleEmail(event) {
        setEnteredEmail(event.target.value);
    }

    function handleConfirmEmail(event) {
        setEnteredConfirmEmail(event.target.value);
    }

    function handlePassword(event) {
        setEnteredPassword(event.target.value);
    }

    function handleConfirmPassword(event) {
        setEnteredConfirmPassword(event.target.value);
    }

    async function submitHandler(email, confirmEmail, password, confirmPassword) {       
        email = email.trim();
        password = password.trim();
    
        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 6;
        const emailsAreEqual = email === confirmEmail;
        const passwordsAreEqual = password === confirmPassword;
    
        if (
            !emailIsValid ||
            !passwordIsValid ||
            (!emailsAreEqual || !passwordsAreEqual)
        ) {
            alert('Invalid input, email must contian an (@) symbol and user password must be at least 7 characters long');            
            return;
        }
        try {
            const response = await createUser(email, password);
            const token = response[0]; 
            const userID = response[1];           
            // const users = await fetchUsers();
            // if (users !== null) {
            //     const emails = [];
            //     users.forEach(user => {
            //         emails.push(user.email);
            //     });
            //     if (!emails.includes(email)) {
            //         addUser({
            //             viewedMovies: [],
            //             email: email,
            //             color: colorCtx.primary,
            //             level: 1
            //         });
            //     }
            // } else {
            //     addUser({
            //         viewedMovies: [],
            //         email: email,
            //         color: colorCtx.primary,
            //         level: 1
            //     });
            // }
            addUser(userID, {
                viewedMovies: [],
                email: email,
                color: colorCtx.primary,
                level: 1
            })
            authCtx.authenticate(token, userID, email);
            navigate("/");
        }
        catch (error) {
            alert('Authentication failed, Could not create user. Please check your credentials or try again later.');
            console.log(error);
        }
    }

    function navLogin() {
        navigate("/login");
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

    return (
        <form action={() => submitHandler(enteredEmail, enteredConfirmEmail, enteredPassword, enteredConfirmPassword)}>           
            <h2 style={{ color: colorCtx.primary }}>Sign up</h2>
            <input style={inputStyle} type="email" onChange={handleEmail} value={enteredEmail} placeholder="Email" />
                <br />
            <input style={inputStyle} type="email" onChange={handleConfirmEmail} value={enteredConfirmEmail} placeholder="Confirm Email" />
                <br />
            <input style={inputStyle} type="password" onChange={handlePassword} value={enteredPassword} placeholder="Password" />
                <br />
            <input style={inputStyle} type="password" onChange={handleConfirmPassword} value={enteredConfirmPassword} placeholder="Confirm Password" />
                <br />
            <input type="submit" value="Submit" style={inputStyle} />
            <p>Already have an acount? <span style={{ color: colorCtx.primary, cursor: 'pointer' }} onClick={navLogin}>Login</span></p>
        </form>
    )
}

export default SignupScreen;
