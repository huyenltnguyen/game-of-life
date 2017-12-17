import React from 'react';
import Cell from './Cell';

const Grid = (props) => {
  let fullGrid = [];
  
  for (let i = 0; i < props.rows; i++) {
    for (let j = 0; j < props.cols; j++) {
      const cellId = `${i}_${j}`;
      const cellClassName = props.grid[i][j] === 1 ? 'cell on' : 'cell off';

      fullGrid.push(
        <Cell
          row={ i }
          col={ j } 
          cellClassName={ cellClassName }
          key={ cellId }
          handleCellClick={ props.handleCellClick }
        />
      )
    }
  }

  return (
    <div className="grid">
      { fullGrid }
    </div>
  );
}

export default Grid;