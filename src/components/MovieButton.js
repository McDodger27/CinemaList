import { useContext } from 'react';
import '../App.css'
import { ColorContext } from '../context/colorContext';


export function MovieButton({ onPress, movie }){  
  const colorCtx = useContext(ColorContext);
    return (      
        <div className="movieOptionContainer">
          <div style={{ backgroundImage: `linear-gradient(#111, #111, #ccc, #ccc, #ccc, ${colorCtx.primary}, #111, #111)` }} onClick={onPress} className="movieButton">
            { movie.poster ? <img className="rankImg" src={movie.poster[Math.floor(Math.random() * movie.poster.length)]} /> : <div style={{ color: '#111'} }>No movie poster in database for this movie</div> }
            
          </div> 
          <p className="movieButtonText">
            {movie.title} <br /> ({movie.releaseYear})
          </p>
        </div>
    );
}