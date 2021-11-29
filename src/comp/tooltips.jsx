import React from 'react';

function Component({ icon, title, description, margin }) {

  return (
    <div id="tooltip" style={{marginLeft: margin}}>
        <div className="tooltip-upper">
            {icon && <img src={icon}></img>}
            <p className="tooltip-title">{title}</p>
        </div>

        <div className="tooltip-lower">
            <p>{description}</p>
        </div>
    </div>
  );
};

export default Component;