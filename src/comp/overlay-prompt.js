import React from 'react';

function Component({ onSubmit, onCancel }) {

  return (
    <div id="overlay">
    <script type="text/javascript" src="icons/animated-alert.json"></script>

        <p>Are you sure you want to discard changes?</p>
        <div className="button-container">
            <div className="button" onClick={() => {onSubmit()}}>Yes</div>
            <div className="button red" onClick={() => {onCancel()}}>No</div>
        </div>

    </div>
  );
};

export default Component;