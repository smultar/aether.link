import React from 'react';

function Component({ prompt, onSubmit, onCancel }) {

  return (
    <div id="overlay">

        <p>{prompt}</p>
        <div className="button-container">
            {onSubmit && <div className="button" onClick={() => {onSubmit()}}>Yes</div>}
            {onCancel && <div className="button red" onClick={() => {onCancel()}}>No</div>}
        </div>

    </div>
  );
};

export default Component;