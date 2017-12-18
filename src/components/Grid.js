import React from 'react';
import Cell from './Cell';

const Grid = (props) => {
  const gridStyle = {
    height: props.rows * 10,  // grid's height = number of rows * cell's height
    width: props.cols * 10  // grid's width = nubmer of cols * cell's height
  } 
  let fullGrid = [];
  
  for (let i = 0; i < props.rows; i++) {
    for (let j = 0; j < props.cols; j++) {
      const cellId = `${i}_${j}`;
      const cellClassName = props.grid[i][j] === 1 ? 'cell live' : 'cell dead';

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
    <div className="grid" style={ gridStyle }>
      { fullGrid }
    </div>
  );
}

export default Grid;