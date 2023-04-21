import React from "react";
import Grid from "../components/Grid/Grid";
import Options from "../components/Options/Options";
import Details from "../components/Details/Details";
import DarkMode from "../components/DarkMode/DarkMode";
import './App.css';

class App extends React.Component {

  constructor() {

    // Initializing some variables. State variables helps to re-render the app whenever there is a change with them.
    // "emptyGrid" variable stores the empty state of the grid.
    // State variable "grid" stores the current state of the sudoku grid.
    // State variable "puzzleGrid" stores the question/grid that needs to be solved.
    // State variable "timeTaken" stores time taken to solve the sudoku / stores a value which represents current state of sudoku grid.
    // State variable "darkMode" stores the current state of dark mode.
    // State variable "slider" stores the current state of speed slider whether it should be visible or not.
    // "waitTime" variable stores the delay time between each new operation of visualization.

    super();
    this.emptyGrid = [
                        ['-','-','-','-','-','-','-','-','-'],
                        ['-','-','-','-','-','-','-','-','-'],
                        ['-','-','-','-','-','-','-','-','-'],
                        ['-','-','-','-','-','-','-','-','-'],
                        ['-','-','-','-','-','-','-','-','-'],
                        ['-','-','-','-','-','-','-','-','-'],
                        ['-','-','-','-','-','-','-','-','-'],
                        ['-','-','-','-','-','-','-','-','-'],
                        ['-','-','-','-','-','-','-','-','-']
                      ];
    this.state = {
                    grid  : this.emptyGrid.map(arr => [...arr]),
                    puzzleGrid  : this.emptyGrid.map(arr => [...arr]),
                    timeTaken : -2,
                    darkMode  : true,
                    slider    : false
                  };
    this.waitTime = 50;
  }

  onCellChange(value,rowNo,colNo) {

    // This function updates the sudoku grid with value at particular row and column.

    let updatedGrid = this.state.grid.map(arr => [...arr]);
    let updatedPuzzleGrid = this.state.puzzleGrid.map(arr => [...arr]);
    updatedGrid[rowNo][colNo] = value;
    updatedPuzzleGrid[rowNo][colNo] = value;
    this.setState(
      {
        grid : updatedGrid,
        puzzleGrid : updatedPuzzleGrid,
        timeTaken : -2
      }
    );
  }

  isValid = (sudoku) => {

    // This function checks whether the given sudoku is valid or not (i.e. whether it obeys the rules of sudoku.).
    // This returns true if given sudoku is valid otherwise false.

    for (let i = 0; i < 9; i++) {
      let row = sudoku[i];
      for (let j = 0; j < 9; j++) {
        if (row[j] !== '-' && row.indexOf(row[j]) !== row.lastIndexOf(row[j])) {
          return false;
        };
      };
    };
    for (let j = 0; j < 9; j++) {
      let col = [];
      for (let i = 0; i < 9; i++) {
        col.push(sudoku[i][j]);
      };
      for (let i = 0; i < 9; i++) {
        if (col[i] !== '-' && col.indexOf(col[i]) !== col.lastIndexOf(col[i])) {
          return false;
        };
      };
    };
    for (let rowStart = 0; rowStart < 9; rowStart += 3) {
      for (let colStart = 0; colStart < 9; colStart += 3) {
        let box = [];
        for (let i = rowStart; i < rowStart+3; i++) {
          for (let j = colStart; j < colStart+3; j++) {
            box.push(sudoku[i][j]);
          };
        };
        for (let i = 0; i < 9; i++) {
          if (box[i] !== '-' && box.indexOf(box[i]) !== box.lastIndexOf(box[i])) {
            return false;
          };
        };
      };
    };
    return true;
  }

  solveSudoku = () => {

    // This function solves the sudoku grid, updates the grid with solution and changes the status using time taken to solve.
    // "validate" function checks whether the sudoku given is valid or not regarding a particular cell.
    // "solve" function is recursive backtracking function. It puts a number in empty position ('-') of "sudoku" variable at each of its function call.
    // "startTime" and "endTime" variables helps to track the time taken to solve the sudoku grid.

    const validate = (rowNo,colNo,sudoku) => {
      for (let i = 0; i < 9; i++) {
        if (rowNo !== i && sudoku[rowNo][colNo] === sudoku[i][colNo]) {
          return false;
        };
      };
      const rowStart = Math.floor(rowNo/3)*3;
      const colStart = Math.floor(colNo/3)*3;
      for (let i = rowStart; i < rowStart+3; i++) {
        for (let j = colStart; j < colStart+3; j++) {
          if (rowNo !== i && colNo !== j && sudoku[rowNo][colNo] === sudoku[i][j]) {
            return false;
          };
        };
      };
      return true;
    }
    const solve = (sudoku) => {
      for (let rowNo = 0; rowNo < 9; rowNo++) {
        let colNo = sudoku[rowNo].indexOf('-');
        if (colNo !== -1) {
          for (let num = 1; num < 10; num++) {
            if (sudoku[rowNo].indexOf(num) === -1) {
              sudoku[rowNo][colNo] = num;
              if (validate(rowNo,colNo,sudoku) && solve(sudoku)) {
                return true;
              };
            };
          };
          sudoku[rowNo][colNo] = '-';
          return false;
        };
      };
      return true;
    }
    let sudoku = this.state.grid.map(arr => [...arr]);
    const startTime = Date.now();
    solve(sudoku);
    const endTime = Date.now();
    this.setState(
      {
        grid : sudoku,
        timeTaken : (endTime-startTime)/1000
      }
    );
  }

  speedAdjust = (sliderValue) => {

    // This function adjusts speed slider element and wait time according to slider value during visualization.
    // Wait time is inverse of visualization speed.

    const sliderElement = document.getElementById("speed-slider");
    sliderElement.style.background = `linear-gradient(to right, green 0%, green calc(1% * ${sliderValue}), #ddd calc(1% * ${sliderValue}), #ddd 100%)`;
    this.waitTime = 100-sliderValue;
  }

  visualizeSolution = async () => {

    // This function visualizes the solution in the sudoku grid.
    // "wait" function returns a Promise with setTimeout. This will return only after "waitTime" milliseconds are completed.
    // "validate" function checks whether the sudoku given is valid or not regarding a particular cell.
    // "solve" function is recursive backtracking function. It puts a number in empty position ('-') of both "sudoku" variable and actual sudoku grid at each of its function call.
    // During visualization, all the cells are made uneditable and the state variable "slider" is set to true.
    // When the speed is changed to '100' the function switches to "solveSudoku" function to give the solution as fast as possible.
    // "waitTime" variable is changed back to '50' after visualization.

    const wait = () => {
      return new Promise(resolve => setTimeout(resolve,this.waitTime));
    }
    const validate = (rowNo,colNo,sudoku) => {
      for (let i = 0; i < 9; i++) {
        if (rowNo !== i && sudoku[rowNo][colNo] === sudoku[i][colNo]) {
          return false;
        };
      };
      const rowStart = Math.floor(rowNo/3)*3;
      const colStart = Math.floor(colNo/3)*3;
      for (let i = rowStart; i < rowStart+3; i++) {
        for (let j = colStart; j < colStart+3; j++) {
          if (rowNo !== i && colNo !== j && sudoku[rowNo][colNo] === sudoku[i][j]) {
            return false;
          };
        };
      };
      return true;
    }
    const solve = async (sudoku) => {
      for (let rowNo = 0; rowNo < 9; rowNo++) {
        let colNo = sudoku[rowNo].indexOf('-');
        if (colNo !== -1) {
          for (let num = 1; num < 10; num++) {
            if (sudoku[rowNo].indexOf(num) === -1) {
              sudoku[rowNo][colNo] = num;
              if (this.waitTime) {
                document.getElementById(`R${rowNo}C${colNo}`).value = num;
                await wait();
              }else {
                return false;
              }
              if (validate(rowNo,colNo,sudoku) && await solve(sudoku)) {
                return true;
              };
            };
          };
          sudoku[rowNo][colNo] = '-';
          if (this.waitTime) {
            document.getElementById(`R${rowNo}C${colNo}`).value = '';
            await wait();
          }          
          return false;
        };
      };
      return true;
    }
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
      cell.readOnly = true;
    }
    let sudoku = this.state.grid.map(arr => [...arr]);
    await this.setState({slider : true});
    await solve(sudoku);
    this.waitTime ? this.setState({grid : sudoku}) : this.solveSudoku();
    this.setState({slider : false});
    this.waitTime = 50;
    for (let cell of cells) {
      cell.readOnly = false;
    }
  }

  blockify = (grid) => {

    // This function returns a blockified grid from normal grid.
    // At the end, "blockifiedGrid" variable contains blocks, each in the form of an array. Each block array contains cells.

    let blockifiedGrid = [];
    for (let rowStart = 0; rowStart < 9; rowStart += 3) {
      for (let colStart = 0; colStart < 9; colStart += 3) {
        let block = [];
        for (let i = rowStart; i < rowStart+3; i++) {
          for (let j = colStart; j < colStart+3; j++) {
            block.push(grid[i][j]);
          }
        }
        blockifiedGrid.push([...block]);
      }
    }
    return blockifiedGrid.map(arr => [...arr]);
  }

  clearSolution = () => {

    // This function makes the current sudoku grid contain only puzzle grid. This removes solved part of the sudoku grid.

    this.setState(
      {
        grid : this.state.puzzleGrid.map(arr => [...arr]),
        timeTaken: -2
      }
    );
  }

  clearGrid = () => {

    // This function completely removes the sudoku grid.
    // This also resets "puzzleGrid" variable to empty grid.

    this.setState(
      {
        grid : this.emptyGrid.map(arr => [...arr]),
        puzzleGrid : this.emptyGrid.map(arr => [...arr]),
        timeTaken : -2
      }
    );
  }

  updateSudokuGrid = (uploadedGrid) => {

    // This function updates the sudoku grid with grid in "uploadedGrid" variable.
    // This will assign the grid in "uploadedGrid" variable to "puzzleGrid" variable.
    // This will change the styling for updated cells in grid.

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (uploadedGrid[i][j] !== '-') {
          let inputCell = document.getElementById(`R${i}C${j}`);
          if (!inputCell.className.includes("bold")) {
            inputCell.className = inputCell.className.replace("cell-input-","cell-input-bold-");
          }
        }
      }
    }
    this.setState(
      {
        grid : uploadedGrid.map(arr => [...arr]),
        puzzleGrid : uploadedGrid.map(arr => [...arr]),
        timeTaken : -2
        }
    );
  }

  setDarkMode = (value) => {

    // This function updates state variable "darkMode" with "value".

    this.setState({darkMode : value});
  }

  render() {

    // "blockifiedGrid" variable contains blocks, each in the form of an array. Each block array contains cells.
    // "hasDigits" variable stores boolean value depending upon whether the sudoku grid has digits or not.
    // "completeGrid" variable stores boolean value depending upon whether the sudoku grid is full or not.
    // "notSolved" variable stores boolean value depending upon whether the sudoku grid is solved or not.
    // "validGrid" variable stores boolean value depending upon whether the sudoku grid is valid or not.
    // "appClassName" variable changes the classname for div depending upon state variable "darkMode".

    let blockifiedGrid = this.blockify(this.state.grid);
    let hasDigits = JSON.stringify(this.state.grid) !== JSON.stringify(this.emptyGrid);
    let completeGrid = JSON.stringify(this.state.grid).indexOf('-') === -1;
    let notSolved = JSON.stringify(this.state.grid) === JSON.stringify(this.state.puzzleGrid);
    let validGrid = this.isValid(this.state.grid.map(arr => [...arr]));
    let appClassName = this.state.darkMode ? "app-dark" : "app-light";
    return (
      <div className = {appClassName}>
        <h1>Sudoku Solver WebApp</h1>
        <Grid 
          gridchange = {(value,rowNo,colNo) => this.onCellChange(value,rowNo,colNo)}
          blockifiedgrid = {blockifiedGrid}
          darkmodevalue = {this.state.darkMode}
        />
        <Options 
          solvesudoku = {this.solveSudoku}
          visualizesolution = {this.visualizeSolution}
          clearsolution = {this.clearSolution}
          cleargrid = {this.clearGrid}
          notsolved = {notSolved}
          gridhasdigits = {hasDigits}
          completegrid = {completeGrid}
          validgrid = {validGrid}
          darkmodevalue = {this.state.darkMode}
          sliderstate = {this.state.slider}
          speedadjust = {this.speedAdjust}
          updatesudokugrid = {this.updateSudokuGrid}
        />
        <Details timetaken = {this.state.timeTaken} validgrid = {validGrid} />
        <DarkMode setdarkmode = {this.setDarkMode} darkmodevalue = {this.state.darkMode} sliderstate = {this.state.slider} />
      </div>
    );
  }

}

export default App;