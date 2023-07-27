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
    // State variable "showAllOptions" stores the current state of whether all options should be visible or not.
    // State variable "showVisualizationOptions" stores the current state of visualization options whether they should be visible or not.
    // "waitTime" variable stores the delay time between each new operation of visualization.
    // "clickedShowSolution" variable stores the state of whether show solution option is clicked or not.

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
                    timeTaken : -4,
                    darkMode  : true,
                    showAllOptions    : true,
                    showVisualizationOptions : false
                  };
    this.waitTime = 50;
    this.clickedShowSolution = false;
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
        timeTaken : -4
      }
    );
  }

  isValid = (sudoku) => {

    // This function checks whether the given sudoku is valid or not (i.e. whether it obeys the rules of sudoku.).
    // This function returns true if given sudoku is valid otherwise false.

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

  solveSudoku = async () => {

    // This function solves the sudoku grid, updates the grid with solution and changes the status using time taken to solve.
    // "validate" function checks whether the sudoku given is valid or not regarding a particular cell.
    // "solve" function is a recursive backtracking function. It puts a number in empty position ('-') of "sudoku" variable at each of its function call.
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
    await this.setState({timeTaken : -3});
    await new Promise(resolve => setTimeout(resolve, 0));
    let sudoku = this.state.grid.map(arr => [...arr]);
      const startTime = Date.now();
      solve(sudoku);
      const endTime = Date.now();
      if (JSON.stringify(this.state.puzzleGrid) === JSON.stringify(sudoku)) {
        this.setState({timeTaken : -5});
      }else {
        this.setState(
          {
            grid : sudoku,
            timeTaken : (endTime-startTime)/1000
          }
        );
      }
  }

  speedAdjust = (sliderValue) => {

    // This function adjusts speed slider element and wait time according to slider value during visualization.
    // Wait time is inverse of visualization speed.

    const sliderElement = document.getElementById("speed-slider");
    sliderElement.style.background = `linear-gradient(to right, green 0%, green calc(1% * ${sliderValue}), #ddd calc(1% * ${sliderValue}), #ddd 100%)`;
    this.waitTime = 100-sliderValue;
  }

  showSolution = () => {

    //This function sets "clickedShowSolution" to true.

    this.clickedShowSolution = true;
  }

  visualizeSolution = async () => {

    // This function visualizes the solution in the sudoku grid.
    // "wait" function returns a Promise with setTimeout. This will return only after "waitTime" milliseconds are completed.
    // "validate" function checks whether the sudoku given is valid or not regarding a particular cell.
    // "sudokuGrid1" and "sudokuGrid2" variables store the given sudoku grid.
    // "solve" function solves the sudoku grid present in "sudokuGrid1" variable.
    // "solveWithVisualization" function is a recursive backtracking function. It puts a number in empty position ('-') of both "sudoku" variable and actual sudoku grid at each of its function call.
    // During visualization, all the cells are made uneditable,the state variable "showAllOptions" is set to false and the state variable "showVisualizationOptions" is set to true.
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
    const solveWithVisualization = async (sudoku) => {
      for (let rowNo = 0; rowNo < 9; rowNo++) {
        let colNo = sudoku[rowNo].indexOf('-');
        if (colNo !== -1) {
          for (let num = 1; num < 10; num++) {
            if (sudoku[rowNo].indexOf(num) === -1) {
              sudoku[rowNo][colNo] = num;
              if (!this.clickedShowSolution) {
                document.getElementById(`R${rowNo}C${colNo}`).value = num;
                await wait();
              }else {
                return false;
              }
              if (validate(rowNo,colNo,sudoku) && await solveWithVisualization(sudoku)) {
                return true;
              };
            };
          };
          sudoku[rowNo][colNo] = '-';
          if (!this.clickedShowSolution) {
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
    let sudokuGrid1 = this.state.grid.map(arr => [...arr]);
    await this.setState(
      {
        showAllOptions : false,
        timeTaken : -3
      }
    );
    await new Promise(resolve => setTimeout(resolve, 0));
    solve(sudokuGrid1);
    let sudokuGrid2 = this.state.grid.map(arr => [...arr]);
    await this.setState(
      {
        showVisualizationOptions : true,
        timeTaken : -2
      }
    );
    await new Promise(resolve => setTimeout(resolve, 0));
    await solveWithVisualization(sudokuGrid2);
    let sudoku = this.clickedShowSolution ? sudokuGrid1 : sudokuGrid2;
    this.setState(
      {
        grid : sudoku,
        showAllOptions : true,
        showVisualizationOptions : false,
        timeTaken : JSON.stringify(this.state.puzzleGrid) === JSON.stringify(sudoku) ? -5 : -1
      }
    );
    this.waitTime = 50;
    this.clickedShowSolution = false
    for (let cell of cells) {
      cell.readOnly = false;
    }
  }

  blockify = (grid) => {

    // This function returns a blockified grid from normal grid.
    // At the end, "blockifiedGrid" variable contains blocks, each in the form of an array. Each block array contains cells of that block.

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
        timeTaken: -4
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
        timeTaken : -4
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
        timeTaken : -4
        }
    );
  }

  setDarkMode = (value) => {

    // This function updates state variable "darkMode" with "value".

    this.setState({darkMode : value});
  }

  shiftFocus = (rowNo,colNo,event) => {

    // This function shifts the focus in the grid according to "Tab", "Shift+Tab" and arrow keys.
    // This will remove the default behaviour of above mentioned keys inside the grid.

    const preventAndShift = (newRow,newCol) => {
      event.preventDefault();
      document.getElementById(`R${newRow}C${newCol}`).focus();
    }

    if ((event.shiftKey && event.keyCode === 9) || event.keyCode === 37) {
      if (colNo) {
        preventAndShift(rowNo,colNo-1);
      }else if (rowNo) {
        preventAndShift(rowNo-1,8);
      }
    }else if (event.keyCode === 38 && rowNo) {
      preventAndShift(rowNo-1,colNo);
    }else if (event.keyCode === 9 || event.keyCode === 39) {
      if (colNo !== 8) {
        preventAndShift(rowNo,colNo+1);
      }else if (rowNo !== 8) {
        preventAndShift(rowNo+1,0);
      }
    }else if (event.keyCode === 40 && rowNo !== 8) {
      preventAndShift(rowNo+1,colNo);
    }
  }

  render() {

    // "blockifiedGrid" variable contains blocks, each in the form of an array. Each block array contains cells of that block.
    // "hasDigits" variable stores boolean value depending upon whether the sudoku grid has digits or not.
    // "completeGrid" variable stores boolean value depending upon whether the sudoku grid is full or not.
    // "notSolved" variable stores boolean value depending upon whether the sudoku grid is solved or not.
    // "validGrid" variable stores boolean value depending upon whether the sudoku grid is valid or not.
    // "noPuzzleDigits" variable stores boolean value depending upon whether the sudoku grid contains puzzle digits (question) or not.
    // "appClassName" variable changes the classname for div depending upon state variable "darkMode".

    let blockifiedGrid = this.blockify(this.state.grid);
    let hasDigits = JSON.stringify(this.state.grid) !== JSON.stringify(this.emptyGrid);
    let completeGrid = JSON.stringify(this.state.grid).indexOf('-') === -1;
    let notSolved = JSON.stringify(this.state.grid) === JSON.stringify(this.state.puzzleGrid);
    let validGrid = this.isValid(this.state.grid.map(arr => [...arr]));
    let noPuzzleDigits = JSON.stringify(this.state.puzzleGrid) === JSON.stringify(this.emptyGrid);
    let appClassName = this.state.darkMode ? "app-dark" : "app-light";
    return (
      <div className = {appClassName}>
        <h1>Sudoku Solver WebApp</h1>
        <Grid 
          gridchange = {(value,rowNo,colNo) => this.onCellChange(value,rowNo,colNo)}
          blockifiedgrid = {blockifiedGrid}
          darkmodevalue = {this.state.darkMode}
          shiftfocus = {(rowNo,colNo,event) => this.shiftFocus(rowNo,colNo,event)}
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
          nopuzzledigits = {noPuzzleDigits}
          darkmodevalue = {this.state.darkMode}
          showalloptions = {this.state.showAllOptions}
          showvisualizationoptions = {this.state.showVisualizationOptions}
          speedadjust = {this.speedAdjust}
          showsolution = {this.showSolution}
          updatesudokugrid = {this.updateSudokuGrid}
        />
        <Details timetaken = {this.state.timeTaken} validgrid = {validGrid} />
        <DarkMode setdarkmode = {this.setDarkMode} darkmodevalue = {this.state.darkMode} showvisualizationoptions = {this.state.showVisualizationOptions} />
      </div>
    );
  }

}

export default App;