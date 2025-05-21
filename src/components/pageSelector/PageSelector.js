import { useNavigate } from "react-router-dom";
import "./PageSelector.css"
import { useContext } from "react";
import { ColorContext } from "../../context/colorContext";

function PageSelector({ currentPage, navLink, pages}) {
    const colorCtx = useContext(ColorContext);
    const textStyle = {
        color: colorCtx.primary
    }
    const activeText = {
        color: colorCtx.secdondary
    }
    const navigate = useNavigate();
    if (pages > 1) {
        return (
            <div className="pageSelector">
    
                    { currentPage > 1 &&                     
                        <p style={textStyle} className="pageLink navText" onClick={() => navigate(`${navLink}/:${currentPage - 1}`)}>Previous</p>
                    }
                    { currentPage > 1 &&
                        <p style={textStyle} className="pageLink navText" onClick={() => navigate(`${navLink}/:1`)}>1</p>
                    }                
                    <p style={activeText} className="active pageLink navText" onClick={() => navigate(`${navLink}/:${currentPage}`)}>{currentPage}</p>                              
                        
                    { currentPage < pages &&                     
                        <p style={textStyle} className="pageLink navText" onClick={() => navigate(`${navLink}/:${pages}`)}>{pages}</p>
                    }
                    { currentPage < pages && 
                        <p style={textStyle} className="pageLink navText" onClick={() => navigate(`${navLink}/:${currentPage + 1}`)}>Next</p>
                    }
            </div>
        );
    }
    else {
        return;
    }
}

export default PageSelector;