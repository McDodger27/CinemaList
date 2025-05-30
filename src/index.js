import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MovieContextProvider from './context/movieContext';
import { BrowserRouter } from 'react-router-dom';
import ColorContextProvider from './context/colorContext';
import AuthContextProvider from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const repoName = '/CinemaList';

root.render(
  <AuthContextProvider>
    <MovieContextProvider>
      <ColorContextProvider>        
      <BrowserRouter basename={repoName}>
          <App />
        </BrowserRouter>
      </ColorContextProvider>
    </MovieContextProvider>
  </AuthContextProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
