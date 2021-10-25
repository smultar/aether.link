import { useState } from "react";


function Component({ config, window }) {
    
    const [active, setActive] = useState(0);
    const [dock, setDock] = useState([0,1,2,3,4]);
    
    return (
        <div id="dock">
            {dock.map((dockEntry, index) => { 
                if (dockEntry === active) {
                    return (
                    <div key={index} className="module active" onClick={() => { setActive(index)}}>
                        <img src="svg/ttmp.svg" alt="icon" />
                    </div>
                ) } else { 
                    return (
                        <div key={index} className="module" onClick={() => { setActive(index)}}>
                            <img src="svg/ttmp.svg" alt="icon" />
                        </div>
                    )
                }
            })}
        </div>
    );
  };
  
  export default Component;
  