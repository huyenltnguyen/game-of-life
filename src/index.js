import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Cell = (props) => {
  return (
    <div
      className={ props.cellClassName }
      key={ props.cellId }
    />
  )
}

class Grid extends React.Component {
  render() {
    let fullGrid = [];

    for (let i = 0; i < this.props.rows; i++) {
      for (let j = 0; j < this.props.cols; j++) {
        const cellId = `${i}_${j}`;
        const cellClassName = this.props.grid[i][j] === 1 ? 'cell on' : 'cell off';

        fullGrid.push(
          <Cell 
            cellClassName={ cellClassName }
            key={ cellId }
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
}

class Main extends React.Component {
  constructor() {
    super();
    this.rows = 50;
    this.cols = 50;
    this.interval = 200;
    this.state = {
      intervalId: null,      
      start: true,      
      generation: 0,
      grid: Array(this.rows).fill(Array(this.cols)),
      gridEmpty: null
    };
  }  

  seed = () => {
    let seededGrid = cloneArray(this.state.grid);    
    
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        seededGrid[i][j] = Math.floor(Math.random() * 2);
      }
    }

    this.setState({ grid: seededGrid, gridEmpty: false });        
  }

  switchButton = () => { 
    if (this.state.gridEmpty) {
      this.seed();
      this.startComputation();
    } else {      
      this.setState({ start: !this.state.start }, () => {        
        this.state.start ? this.startComputation() : this.stopComputation();        
      }); 
    }        
  }

  clearGrid = () => {
    this.stopComputation();
    let newGrid = Array(this.rows).fill(Array(this.cols).fill(0));
    this.setState({ 
      generation: 0,
      start: false,
      grid: newGrid,
      gridEmpty: true 
    });
  }

  startComputation = () => {
    let intervalId = setInterval(() => this.computeCellState(this.state.grid), this.interval);
    this.setState({ intervalId: intervalId });
  }

  stopComputation = () => {
    clearInterval(this.state.intervalId);
  }

  computeCellState = (grid) => {
    let newGrid = cloneArray(grid);    

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let neighbors = this.countNeighbors(grid, i, j);
        let currentCellState = grid[i][j];
        
        if (currentCellState === 0 && neighbors === 3) {
          newGrid[i][j] = 1;
        } else if (currentCellState === 1 && (neighbors < 2 || neighbors > 3)) {
          newGrid[i][j] = 0;
        }
      }
    }    

    this.setState({
      grid: newGrid,
      generation: this.state.generation + 1
    });
  }

  countNeighbors = (grid, x, y) => {
    let neighbors = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let row = (x + i + this.rows) % this.rows;
        let col = (y + j + this.cols) % this.cols;
        neighbors += grid[row][col];
      }
    }    
    neighbors = neighbors - grid[x][y];
    return neighbors;
  }
  
  componentDidMount() {
    this.seed();
    this.startComputation();
  }

  render() {    
    return (
      <div>
        <h1>The Game of Life</h1>
        <button onClick={ this.switchButton }>
          { this.state.start ? 'Stop' : 'Start'}
        </button>
        <button onClick={ this.clearGrid }>Clear</button>
        <Grid 
          grid={ this.state.grid }
          rows={ this.rows }
          cols={ this.cols }
        />
        <h2>Generation: { this.state.generation }</h2>
      </div>
    );
  }
}

// ================================
//      HELPER FUNCTIONS
// ================================
const create2DArray = (rows, cols) => {
  let arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}

const cloneArray = (arr) => {
  return JSON.parse(JSON.stringify(arr));
};

ReactDOM.render(<Main />, document.getElementById('root'));

