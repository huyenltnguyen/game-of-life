import React from 'react';

const Buttons = (props) => {
  return (
    <div className="button-row">
      <button onClick={ props.handleStartButtonClick }>
        { props.isPlaying ? 'Stop' : 'Start'}
      </button>
      <button onClick={ props.clearGrid }>Clear</button>
    </div>
  );
};

export default Buttons;