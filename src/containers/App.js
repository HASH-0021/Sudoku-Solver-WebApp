import React from "react";
import Grid from "../components/Grid/Grid";
import Buttons from "../components/Buttons/Buttons";
import Info from "../components/Info/Info";
import DarkMode from "../components/DarkMode/DarkMode";
import './App.css';

class App extends React.Component {
  constructor() {
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
      previousGrid  : [],
      timeTaken : -2,
      darkMode  : true
    };
  }
  onCellChange(value,boxIndex,cellIndex) {
    let updatedGrid = this.state.grid.map(arr => [...arr]);
    let rowOffset = 0, colOffset = 0, rowNo = 0, colNo = 0;
    if (cellIndex === 0 || cellIndex === 1 || cellIndex === 2) {
      rowOffset = 0;
    }else if (cellIndex === 3 || cellIndex === 4 || cellIndex === 5) {
      rowOffset = 1;
    }else if (cellIndex === 6 || cellIndex === 7 || cellIndex === 8) {
      rowOffset = 2;
    }
    if (boxIndex === 0 || boxIndex === 1 || boxIndex === 2) {
      rowNo = rowOffset;
    }else if (boxIndex === 3 || boxIndex === 4 || boxIndex === 5) {
      rowNo = 3+rowOffset;
    }else if (boxIndex === 6 || boxIndex === 7 || boxIndex === 8) {
      rowNo = 6+rowOffset;
    }
    if (cellIndex === 0 || cellIndex === 3 || cellIndex === 6) {
      colOffset = 0;
    }else if (cellIndex === 1 || cellIndex === 4 || cellIndex === 7) {
      colOffset = 1;
    }else if (cellIndex === 2 || cellIndex === 5 || cellIndex === 8) {
      colOffset = 2;
    }
    if (boxIndex === 0 || boxIndex === 3 || boxIndex === 6) {
      colNo = colOffset;
    }else if (boxIndex === 1 || boxIndex === 4 || boxIndex === 7) {
      colNo = 3+colOffset;
    }else if (boxIndex === 2 || boxIndex === 5 || boxIndex === 8) {
      colNo = 6+colOffset;
    }
    updatedGrid[rowNo][colNo] = value;
    this.setState(
      {
        grid : updatedGrid,
        previousGrid : [],
        timeTaken : -2
      }
    );
  }
  isValid = (sudoku) => {
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
  solveSudoku = (event) => {
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
    this.setState({previousGrid : sudoku.map(arr => [...arr])});
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
  blockify = (grid) => {
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
  clearSolution = (event) => {
    this.setState(
      {
        grid : this.state.previousGrid.map(arr => [...arr]),
        previousGrid : [],
        timeTaken: -2
      }
    );
  }
  clearGrid = (event) => {
    this.setState(
      {
        grid : this.emptyGrid.map(arr => [...arr]),
        previousGrid : [],
        timeTaken : -2
      }
    );
  }
  setDarkMode = (value) => {
    this.setState({darkMode : value})
  }
  render() {
    let blockifiedGrid = this.blockify(this.state.grid);
    let hasDigits = JSON.stringify(this.state.grid) === JSON.stringify(this.emptyGrid) ? false : true;
    let completeGrid = JSON.stringify(this.state.grid).indexOf('-') === -1 ? true : false;
    let validGrid = this.isValid(this.state.grid.map(arr => [...arr]));
    let appClassName = "";
    if (this.state.darkMode) {
      appClassName = "app-dark";
    }else {
      appClassName = "app-light";
    }
    return (
      <div className={appClassName}>
        <h1>Sudoku Solver WebApp</h1>
        <Grid 
          gridchange = {(value,boxIndex,cellIndex) => this.onCellChange(value,boxIndex,cellIndex)} 
          blockifiedgrid = {blockifiedGrid}
          darkmodevalue = {this.state.darkMode}
        />
        <Buttons 
          solvesudoku = {this.solveSudoku} 
          clearsolution = {this.clearSolution} 
          cleargrid = {this.clearGrid} 
          previousgrid = {this.state.previousGrid} 
          gridhasdigits = {hasDigits}
          completegrid = {completeGrid}
          validgrid = {validGrid}
          darkmodevalue = {this.state.darkMode}
        />
        <section>
          <Info timetaken = {this.state.timeTaken} validgrid = {validGrid}/>
        </section>
        <DarkMode setdarkmode = {this.setDarkMode} darkmodevalue = {this.state.darkMode}/>
      </div>
    );
  }
}

export default App;