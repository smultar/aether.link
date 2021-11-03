import React, { useState, useEffect } from 'react';
import { BrowserRouter, HashRouter, Switch, Route, Link} from "react-router-dom";

// Global
import config from '../config.json';

const Page = ({location, history}) => {

    const [face, setFace] = useState({current: 0, collection: ['ಥ_ಥ', 'ಥ‿ಥ', 'ಥ﹏ಥ', 'щ（ﾟДﾟщ）', '(⩾﹏⩽)']});
    const [countdown, setCountdown] = useState(60);

    useEffect(() => { 
        setInterval(() => {
            let newFace = Object.assign({}, face);
            newFace.current = Math.floor(Math.random() * newFace.collection.length);
            setFace(newFace);
        }, 5000);
    }, []);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setCountdown(prevCount => prevCount - 1)
            if (countdown <= 0) { 
                console.log('countdown expired')
                history.push('/main');
                
                clearInterval(); 
            } 
        }, 1000);
        
        return () => {
          clearTimeout(timer);
        };
    }, [countdown]);

    // Render
    return (
        <div id="crash">
            <p className='ahhh'>{face.collection[face.current]}</p>
            <p className='ahh'>I broke the fabric of reality <b>again,</b> and i'm sorry!</p>
            <p className='ah'>I didn't mean to do that, please tell <b>Smultar</b> what happened.</p>
            {(!location.state?.error) && <p className='ah'>I'm not really sure what happened, my creator might have an idea.</p>}
            {(location.state?.error) && <div className='errorBox'>
                <p className='error'>{location.state?.error}</p>
            </div>}
            <p className='ah'>Attempting self repair in {countdown} seconds</p>
            <div className='float'>
                <p className='button red' onClick={() => {window.link.api.openExternal('https://github.com/smultar/aether.link/issues')}}>report an issue</p>
                <Link to='/main'><p className='button' onFocus={() =>{console.log('ahh')}}>restart</p></Link> 
            </div>
        </div>
      );

}

export default Page;