# Sudoku-Solver-WebApp

Webapp to solve any valid sudoku grid. This webapp is created using **ReactJS**.

## Functionality
- Option to solve the sudoku normally and display the result in the grid.
- Option to visualize the solving process of sudoku in the grid.
  - Options to adjust the speed of visualization.
  - Option to show solution is available during visualization. This ends visualization.
- Option to remove the solved part of the sudoku grid.
- Option to clear the entire grid.
- Option to populate the sudoku grid from a `.txt` file.
- Option to view info about the app.
- Current status of the sudoku grid is available.
- **Dark mode** option is available to toggle between light theme and dark theme. *(Default is set to dark theme)*
- Navigate the grid using 'Tab','Shift+Tab' & 'Arrow' keys.

## Code Insights
- [`App`](src/containers/App.js) component is the root component. It renders contents of the webapp.
- Sudoku grid is rendered in [`Grid`](src/components/Grid/Grid.js) component.
- Each [`Box`](src/components/Box/Box.js) is rendered as child component of the `Grid` component.
- Each [`Cell`](src/components/Cell/Cell.js) is rendered as child component of a `Box` component.
- All the buttons are rendered in [`Options`](src/components/Options/Options.js) component and their functionality is present in this component.
- [`DialogBox`](src/components/DialogBox/DialogBox.js) component renders the dialog box and its text depending upon the requirement. This is child component of `Options` component.
- [`Details`](src/components/Details/Details.js) component renders the status section.
- [`DarkMode`](src/components/DarkMode/DarkMode.js) component renders the dark mode section. Re-render of the theme occurs in `App` component *(root)*.
- Solving of the sudoku grid occurs in [`solveSudoku`](src/containers/App.js#L102) function which uses recursive backtracking technique to solve.
- Visualization of the solution occurs in [`visualizeSolution`](src/containers/App.js#L166) function which uses same recursive bracktracking to solve while updating the value in the cell.
- `fileRead`, `handleFileUpload` and `checkSudokuFormat` functions in [`Options`](src/components/Options/Options.js) component handle the reading of the file, file format checking and sudoku format checking.
- If the sudoku in uploaded text file is valid then grid is updated with the values and re-rendered using [`updateSudokuGrid`](src/containers/App.js#L285) function.
- [`sliderUpdate`](src/components/Options/Options.js#L25) function adjusts the speed of visualization by changing [`waitTime`](src/containers/App.js#L163) variable.
- [`timetaken`](src/components/Details/Details.js) prop is used as flag to display validity of sudoku grid if it doesn't contain solved time.

## Notes
- Given sudoku input must be valid. No row/column/box should contain duplicate digits.
- Solution given will be the first valid iteration. Solver isn't intelligent enough to tell if there are other solutions. It would be better if the given input has unique solution.
- Uploading file constraints :-
  - File should be text file *('.txt' extension)*.
  - File should contain 1 valid sudoku, so it should contain 9 lines. Each line represents a row of sudoku grid.
  - Each character in line represents a cell and is separated by ','. So each line should contain 9 characters.
  - Characters allowed are '-' for empty cell and numbers between 1-9.
  - Ideal sudoku format should look something like below.
    ```
    -,5,-,-,3,-,-,-,-
    -,-,1,-,-,8,-,-,4
    -,6,3,4,-,-,7,-,-
    -,-,-,6,-,-,-,-,-
    6,7,2,-,-,-,4,-,3
    -,-,-,9,2,-,-,1,-
    5,-,-,-,-,9,6,4,-
    -,3,-,5,-,-,1,-,-
    9,-,-,-,1,-,-,-,-
    ```
- Time taken to solve depends on the sudoku input, browser, os, device, etc. Webapp freezes till the calculation is done in `solveSudoku` function.
- When 'Visualize' option is selected, the sudoku is solved normally at first and the solution is stored and then the visualization starts. During visualization, if the 'Show Solution' option is selected, then the visulization stops and the stored solution is displayed in the grid.
- Options are programmatically made available in scenarios that seemed valid. Dark mode section will not be available during visualization.
