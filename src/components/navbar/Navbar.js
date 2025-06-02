import { useNavigate } from 'react-router-dom';
import './Navbar.css'
import { useContext } from 'react';
import { ColorContext } from '../../context/colorContext';
import { AuthContext } from '../../context/authContext';
import { updateColor } from '../../util/http';

export function Navbar() {
    const colorCtx = useContext(ColorContext);
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    function navHome() {
        navigate("/");
    }
    function navUserList() {
        navigate("/userlist/:1");
    }
    function navGlobalList() {
        navigate("/globallist/:1");
    }
    function navSignup() {
        navigate("/signup");
    }
    function navPostMovie() {
        navigate("/postmovie");
    }

    function changeColor(event) {
        const userID = sessionStorage.getItem('userID');
        const newColor = event.target.value;
        colorCtx.setColor(newColor);
        updateColor(userID, newColor);
    }

    function userLogout() {
        authCtx.logout();
        navigate("/login");
    }

    const textStyle = {
        color: '#ccc',
        backgroundColor: '#111',
        border: 'none',
        textAlign: 'center'
    }
    return (
        <nav>
            <div className="navLink" onClick={navHome}><p style={textStyle} className="navText">Home</p></div>
            { authCtx.isAuthenticated && <div className="navLink" onClick={navUserList}><p style={textStyle} className="navText">Your List</p></div> }
            <div className="navLink" onClick={navGlobalList}><p style={textStyle} className="navText">Global List</p></div>
            { !authCtx.isAuthenticated && <div className="navLink" onClick={navSignup}><p style={textStyle} className="navText">Sign Up</p></div> }
            { authCtx.isAuthenticated && authCtx.userLevel > 1 && <div className="navLink" onClick={navPostMovie}><p style={textStyle} className="navText">Add Movie</p></div> }
            { authCtx.isAuthenticated && <div className="navLink" onClick={userLogout}><p style={textStyle} className="navText">Logout</p></div> }
            
            { authCtx.isAuthenticated && <div className="navLink">
                <select className="colorSelector" style={textStyle} onChange={changeColor} name="theme" id="theme-select">
                    <option value="">Theme</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="pink">Pink</option>
                    <option value="teal">Teal</option>
                    <option value="sky">Sky</option>
                </select>
            </div> }
        </nav>
    );
}