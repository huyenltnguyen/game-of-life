import React from 'react';

const Cell = (props) => {
  const handleCellClick = () => { props.handleCellClick(props.row, props.col) }
  return (
    <div
      className={ props.cellClassName }
      key={ props.cellId }
      onClick={ handleCellClick }
    />
  )
}

export default Cell;