import './App.css';
import { Navbar } from './components/navbar/Navbar';
import { RankScreen } from './screens/RankScreen';
import { UserListScreen } from './screens/UserListScreen';
import { GlobalRankingsScreen } from './screens/GlobalRankingsScreen';
import { Route, Routes, useNavigate } from 'react-router-dom';
import MovieScreen from './screens/MovieScreen';
import AddMovieScreen from './screens/AddMovieScreen';
import { useContext } from 'react';
import { ColorContext } from './context/colorContext';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import PostMovieScreen from './screens/PostMovieScreen';

function App() {  
  const navigate = useNavigate();  

  const colorCtx = useContext(ColorContext);

  function navigateHome() {
    navigate("/");
  }

  const headerStyle = {
    color: colorCtx.primary
  }

  return (
    <div style={{flex: 1}} className="App">      
        <div onClick={navigateHome} className="headerContainer">
          <div style={headerStyle} className="header">Cinema List</div>
        </div>
        <Navbar />        
        <Routes>
          <Route path="/" element={ <RankScreen /> } />
          <Route path="/viewed" element={ <RankScreen mode="viewed" /> } />
          <Route path="/userlist/:page" element={ <UserListScreen /> } />
          <Route path="/globallist/:page" element={ <GlobalRankingsScreen /> } />
          <Route path="/viewmovie/:movieId" element={ <MovieScreen /> } />
          <Route path="/addmovie/:movieId" element={ <AddMovieScreen /> } />
          <Route path="/postmovie" element={ <PostMovieScreen /> } />
          <Route path="/postmovie/:movieId" element={ <PostMovieScreen mode="edit" /> } />
          <Route path="/signup" element={ <SignupScreen /> } />
          <Route path="/login" element={ <LoginScreen /> } />
        </Routes>
        <footer style={{ color: "#ccc"}}>
          <a style={{color: colorCtx.primary}} href='mailto:mckayd8819@gmail.com?Subject=Website Issue'>Contact Support</a>  
          <span> || </span>
          <a style={{color: colorCtx.primary}} href='mailto:mckayd8819@gmail.com?Subject=Application for Cinema List Admin Acount'>Apply for an admin account</a>
        </footer>
    </div>
  );
}

export default App;
