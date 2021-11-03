import React, { useState, useEffect } from 'react';
import { BrowserRouter, HashRouter, Switch, Route, Link } from "react-router-dom";


// Global
import config from '../config.json';

const Page = () => {

    const [face, setFace] = useState({current: 0, collection: ['ಥ_ಥ', 'ಥ‿ಥ', 'ಥ﹏ಥ', 'щ（ﾟДﾟщ）', '(⩾﹏⩽)']});
    const [count, setCount] = useState(20);

    useEffect(() => { 
        setInterval(() => {
            let newFace = Object.assign({}, face);
            newFace.current = Math.floor(Math.random() * newFace.collection.length);
            setFace(newFace);
        }, 5000);

        const timer = setInterval(() => {
            setCount(count - 1);
        }, 1000);
    
        
        if (count < 0) { 
            BrowserRouter.push('/'); clearInterval(); 
            return () => clearInterval(timer);
        } 

    }, []);

    // Render
    return (
        <div id="crash">
            <p className='ahhh'>{face.collection[face.current]}</p>
            <p className='ahh'>I broke the fabric of reality <b>again,</b> and i'm sorry!</p>
            <p className='ah'>I'm not really sure what happened, my creator might have an idea.</p>
            <p className='ah'>Attempting self repair in {count} seconds</p>
        </div>
      );

}

export default Page;