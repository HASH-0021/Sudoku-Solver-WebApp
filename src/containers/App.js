import React from "react";
import Grid from "../components/Grid/Grid";
import Options from "../components/Options/Options";
import Details from "../components/Details/Details";
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
      puzzleGrid  : this.emptyGrid.map(arr => [...arr]),
      timeTaken : -2,
      darkMode  : true,
      slider    : false
    };
    this.waitTime = 50;
  }
  onCellChange(value,rowNo,colNo) {
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
  speedAdjust = (event) => {
    const sliderElement = document.getElementById("speed-slider");
    const sliderValue = event.target.value;
    sliderElement.style.background = `linear-gradient(to right, green 0%, green calc(1% * ${sliderValue}), #ddd calc(1% * ${sliderValue}), #ddd 100%)`;
    this.waitTime = 100-sliderValue;
  }
  visualizeSolution = async () => {
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
    const startTime = Date.now();
    let sudoku = this.state.grid.map(arr => [...arr]);
    await this.setState({slider : true});
    await solve(sudoku);
    this.waitTime ? this.setState({grid : sudoku}) : this.solveSudoku();
    this.setState({slider : false});
    const endTime = Date.now();
    console.log((endTime-startTime)/1000);
    this.waitTime = 50;
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
        grid : this.state.puzzleGrid.map(arr => [...arr]),
        timeTaken: -2
      }
    );
  }
  clearGrid = (event) => {
    this.setState(
      {
        grid : this.emptyGrid.map(arr => [...arr]),
        puzzleGrid : this.emptyGrid.map(arr => [...arr]),
        timeTaken : -2
      }
    );
  }
  setDarkMode = (value) => {
    this.setState({darkMode : value})
  }
  render() {
    let blockifiedGrid = this.blockify(this.state.grid);
    let hasDigits = JSON.stringify(this.state.grid) !== JSON.stringify(this.emptyGrid);
    let completeGrid = JSON.stringify(this.state.grid).indexOf('-') === -1;
    let notSolved = JSON.stringify(this.state.grid) === JSON.stringify(this.state.puzzleGrid);
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
        />
        <section>
          <Details timetaken = {this.state.timeTaken} validgrid = {validGrid}/>
        </section>
        <DarkMode setdarkmode = {this.setDarkMode} darkmodevalue = {this.state.darkMode} sliderstate = {this.state.slider}/>
      </div>
    );
  }
}

export default App;