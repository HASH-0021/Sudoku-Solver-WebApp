import React from "react";
import DialogBox from "../DialogBox/DialogBox";
import "./Options.css";

const Options = (
		{
			solvesudoku, visualizesolution, clearsolution, cleargrid,
			notsolved, gridhasdigits, completegrid, validgrid,
			darkmodevalue, sliderstate, speedadjust, updatesudokugrid
		}
	) => {

	const [sliderValue,setSliderValue] = React.useState(50);
	const [buttonClassName,setButtonClassName] = React.useState("");
	const [showInfo, setShowInfo] = React.useState(false);
	const [showAlert, setShowAlert] = React.useState(false);

	React.useEffect(() => {

		// State variable "buttonClassName" is changed whenever the "darkmodevalue" prop is changed.

		(darkmodevalue) ? setButtonClassName("buttons-dark") : setButtonClassName("buttons-light");
	},[darkmodevalue]);

	const sliderUpdate = (value) => {

		// This function changes the state variable "sliderValue" to input value. This also calls back "speedadjust" function to App.js.
		// Minus button styling is changed based on "value" variable value.

		const minusButton = document.getElementById("minus-button");
		minusButton.className = value ? buttonClassName : "blocked-button";
		setSliderValue(value);
		speedadjust(value);
	}

	React.useEffect(() => {

		// State variable "sliderValue" is set to '50' whenever the "sliderstate" prop is changed.

		setSliderValue(50);
	},[sliderstate]);

	const displayAlert = (text) => {

		// This function sets the state variables "showInfo" to 'false' and "showAlert" to "text" variable value.

		setShowInfo(false);
		setShowAlert(text);
	}

	const checkSudokuFormat = (contents) => {

		// This function checks whether the contents in the file satisfy the rules of sudoku format.
		// If not satisfied, then "displayAlert" function is called with alert text.
		// If satisfied, then "updatesudokugrid" function with "grid" variable value as argument is called back to App.js. 

		let grid = [];
		contents = contents.replace(/\r?\n/g, '\n');
		const lines = contents.split('\n');
		if (lines.length !== 9) {
			displayAlert("Sudoku format in the file is not valid.");
		}else {
			for (let i = 0; i < 9; i++) {
				let line = lines[i].split(',');
				if (line.length !== 9) {
					displayAlert("Sudoku format in the file is not valid.");
					grid = [];
					break;
				}else {
					let valid = true;
					let row = [];
					for (let j = 0; j < 9; j++) {
						let val = line[j];
						if (val.length !== 1 || (val !== '-' && (isNaN(val) || val === '0'))) {
							displayAlert("Sudoku format in the file is not valid.");
							valid = false;
							break;
						}else {
							row.push(val === '-' ? val : Number(val));
						}
					}
					if (!valid) {
						grid = [];
						break;
					}else {grid.push([...row]);}
				}
			}
		}
		if (grid.length) {
			updatesudokugrid(grid);
		}
	}

	const handleFileUpload = (event) => {

		// This function reads the file and sends the content to "checkSudokuFormat" function.
		// This function calls "displayAlert" function with alert text if file type is not '.txt'.
		// Both event listener for the file input and the input file are removed at the end.

		const file = event.target.files[0];
		if (file.type === "text/plain") {
			const reader = new FileReader();
			reader.addEventListener('load', (event) => {
				checkSudokuFormat(event.target.result);
			});
			reader.readAsText(file);
		}else {
			displayAlert(`File format should be '.txt'.`);
		}
		const fileInput = document.getElementById("fileInput");
		fileInput.removeEventListener('change', handleFileUpload);
		event.target.value = null;
	}

	const fileRead = () => {

		// This function sets state variable "showAlert" to 'false'.
		// Event listener for the file input is added and "click" method is called on file input.

		setShowAlert(false);
		const fileInput = document.getElementById("fileInput");
		fileInput.addEventListener('change', handleFileUpload);
		fileInput.click();
	}

	// Info button is visible at all the time.
	// If the "sliderstate" prop is 'true', then the solve, visualize, clear grid and file upload buttons are hidden, only speed slider is visible.
	// If the "sliderstate" prop is 'false', then all buttons that were hidden (when it is 'true') can be visible and speed slider will hidden.
	// Clear grid button will visible only when "gridhasdigits" prop is 'true'.
	// Solve and visualize buttons will be visible only when both sudoku grid is not complete and is valid.

	let clearGridButton = null;
	let solveButton = null;
	let visualizeButton = null;
	let speedSlider = null;
	let fileUploadButton = null;
	const infoButton =	<span>
							<button className = {`${buttonClassName} info-button`} title = "Info about the app" onClick = {() => setShowInfo(true)}>i</button>
							{showInfo && <DialogBox dialog = "info" setshowinfo = {(isVisible) => {setShowInfo(isVisible)}} />}
					    </span>;
	if (sliderstate) {
		speedSlider =	<div className = "speed-section">
							<div>Speed</div>
							<div>:</div>
							<div className = "speed-options">
								<button className = {buttonClassName} id = "minus-button" title = "Decrease speed" onClick = {() => sliderValue ? sliderUpdate(sliderValue-1) : null}>-</button>
								<input type = "range" min = "0" max = "100" value = {sliderValue} id = "speed-slider" title = {`Current speed level is ${sliderValue}`} onChange = {(event) => sliderUpdate(Number(event.target.value))} />
								<button className = {buttonClassName} id = "plus-button" title = "Increase speed" onClick = {() => sliderValue !== 100 ? sliderUpdate(sliderValue+1) : null}>+</button>
							</div>
						</div>;
	}else {
		fileUploadButton =	<span>
								<input type = "file"  id = "fileInput" accept = "text/plain" />
								<button className = {buttonClassName} title = "Upload text file containing sudoku input" onClick = {fileRead}>Upload File</button>
								{showAlert && <DialogBox dialog = {showAlert} setshowinfo = {(isVisible) => {setShowInfo(isVisible)}} setshowalert = {(isVisible) => {setShowAlert(isVisible)}} />}
							</span>;
		if (gridhasdigits) {
			clearGridButton = <button className = {buttonClassName} title = "Click to empty the sudoku grid" onClick = {cleargrid}>Clear Grid</button>;
		}
		if (!completegrid && validgrid) {
			solveButton = <button className = {buttonClassName} title = "Click to solve using recursive backtracking" onClick = {solvesudoku}>Solve</button>;
			visualizeButton = <button className = {buttonClassName} title = "Click to visualize the approach for solution" onClick = {visualizesolution}>Visualize</button>;
		}
	}

	return notsolved ? 
		<div className = "options">
			{solveButton}
			{visualizeButton}
			{clearGridButton}
			{fileUploadButton}
			{infoButton}
			{speedSlider}
	    </div> :
		<div className = "options">
			<button className = {buttonClassName} title = "Click to clear the solved part of sudoku grid" onClick = {clearsolution}>Clear Solution</button>
			{clearGridButton}
			{fileUploadButton}
			{infoButton}
	    </div>

}

export default Options;