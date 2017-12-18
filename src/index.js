import React from 'react';
import ReactDOM from 'react-dom';
import Grid from './components/Grid';
import Buttons from './components/Buttons';
import './index.css';

class Main extends React.Component {
  constructor() {
    super();
    this.rows = 50;
    this.cols = 70;  
    this.interval = 200;
    this.state = {
      intervalId: null,      
      isPlaying: true,      
      generation: 0,
      grid: Array(this.rows).fill(Array(this.cols)),
      gridEmpty: null
    };
  }
  
  handleCellClick = (row, col) => {
    let newGrid = cloneArray(this.state.grid);
    newGrid[row][col] = !newGrid[row][col];
    this.setState({ grid: newGrid });
  }

  updateGridSize = () => {
    // if screen width is smaller than 768px,
    // grid's height is 1.5 the height of window,
    // hence the number of rows = window's height divided by 1.5, then divided by cellSize(10px)
    // grid's width equals window's width - 20px,
    // hence the number of cols = window's width divided by cellSize(10px) minus 2 cols (to add some space) 
    if (window.innerWidth < 768) {
      this.rows = Math.floor(window.innerHeight / 1.5 / 10);
      this.cols = Math.floor(window.innerWidth / 10 - 2);      
    } else if (window.innerWidth < 992) {
      this.rows = 40;
      this.cols = 70;
    }
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

  handleStartButtonClick = () => {
    if (this.state.gridEmpty) {
      this.seed();
      this.setState({ isPlaying: true });
      this.startComputation();
    } else {      
      this.setState({ isPlaying: !this.state.isPlaying }, () => {        
        this.state.isPlaying ? this.startComputation() : this.stopComputation();        
      }); 
    }        
  }

  clearGrid = () => {
    this.stopComputation();
    let newGrid = Array(this.rows).fill(Array(this.cols).fill(0));
    this.setState({ 
      generation: 0,
      isPlaying: false,
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
    this.updateGridSize();
    this.startComputation();
  }  

  render() {    
    return (
      <div>
        <h1>The Game of Life</h1>
        <h2>Generation: { this.state.generation }</h2>
        <Buttons 
          isPlaying={ this.state.isPlaying }
          handleStartButtonClick={ this.handleStartButtonClick }
          clearGrid={ this.clearGrid }       
        />        
        <Grid
          grid={ this.state.grid }
          rows={ this.rows }
          cols={ this.cols }
          handleCellClick={ this.handleCellClick }
        />        
      </div>
    );
  }
}

// ================================
//      HELPER FUNCTIONS
// ================================
const cloneArray = (arr) => {
  return JSON.parse(JSON.stringify(arr));
};

ReactDOM.render(<Main />, document.getElementById('root'));

