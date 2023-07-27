import React from "react";
import DialogBox from "../DialogBox/DialogBox";
import "./Options.css";

const Options = (
		{
			solvesudoku, visualizesolution, clearsolution, cleargrid,
			notsolved, gridhasdigits, completegrid, validgrid,
			nopuzzledigits, darkmodevalue, showalloptions, showvisualizationoptions,
			speedadjust, showsolution, updatesudokugrid
		}
	) => {

	const [sliderValue,setSliderValue] = React.useState(50);
	const [buttonClassName,setButtonClassName] = React.useState("");
	const [showInfo, setShowInfo] = React.useState(false);
	const [showAlert, setShowAlert] = React.useState(false);
	const [speedValue,setSpeedValue] = React.useState(50);

	React.useEffect(() => {

		// State variable "buttonClassName" is changed whenever the "darkmodevalue" prop is changed.

		(darkmodevalue) ? setButtonClassName("buttons-dark") : setButtonClassName("buttons-light");
	},[darkmodevalue]);

	const sliderUpdate = (value) => {

		// This function changes the state variables "sliderValue" and "speedValue" to equal "value" variable value. This also calls back "speedadjust" function to App.js.
		// Styling for "Minus" and "Plus" buttons is changed based on "value" variable value.

		const minusButton = document.getElementById("minus-button");
		const plusButton = document.getElementById("plus-button");
		minusButton.className = value ? buttonClassName : "blocked-button";
		plusButton.className = value !== 100 ? buttonClassName : "blocked-button"
		setSliderValue(value);
		setSpeedValue(value);
		speedadjust(value);
	}

	React.useEffect(() => {

		// State variable "sliderValue" is set to '50' whenever the "showvisualizationoptions" prop is changed.

		setSliderValue(50);
		setSpeedValue(50);
	},[showvisualizationoptions]);

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
		// Both, event listener for the file input and the input file, are removed at the end.

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

	const updateSpeedField = (event) => {

		// Text box containing speed value updates the speed slider and the speed of the visualization.

		const updatedValue = Number(event.target.value);
		if (updatedValue >= 0 && updatedValue <=100) {
			setSpeedValue(updatedValue);
			sliderUpdate(updatedValue);
		}
	}

	// Info button is visible at all the time.
	// If the "showvisualizationoptions" prop is 'true', then the solve, visualize, clear grid and file upload buttons are hidden. Show solution and visualization options are visible.
	// If the "showalloptions" prop is 'true', then all buttons that were hidden (when showvisualtionoptions is 'true') can be visible and visualization options will hidden.
	// Clear grid button will be visible only when "gridhasdigits" prop is 'true'.
	// Clear solution button will be visible only when "nopuzzledigits" prop is 'false'
	// Solve and visualize buttons will be visible only when both sudoku grid is not complete and is valid.

	let clearGridButton = null;
	let solveButton = null;
	let visualizeButton = null;
	let speedSlider = null;
	let fileUploadButton = null;
	let clearSolutionButton = null;
	let showSolutionButton = null;
	const infoButton =	<span>
							<button className = {`${buttonClassName} info-button`} title = "Info about the app" onClick = {() => setShowInfo(true)}>i</button>
							{showInfo && <DialogBox dialog = "info" setshowinfo = {(isVisible) => {setShowInfo(isVisible)}} />}
					    </span>;
	if (!showalloptions) {
		if (showvisualizationoptions) {
			showSolutionButton = <button className = {buttonClassName} title = "Stops visualization and shows solution immediately" onClick = {showsolution}>Show Solution</button>;
			speedSlider =	<div className = "speed-section">
								<div>Speed (0-100)</div>
								<div>:</div>
								<div className = "speed-options">
									<button className = {buttonClassName} id = "minus-button" title = "Decrease speed" onClick = {() => sliderValue ? sliderUpdate(sliderValue-1) : null}>-</button>
									<input type = "range" min = "0" max = "100" value = {sliderValue} id = "speed-slider" title = "Adjust speed slider to change the speed of visualization" onChange = {(event) => sliderUpdate(Number(event.target.value))} />
									<button className = {buttonClassName} id = "plus-button" title = "Increase speed" onClick = {() => sliderValue !== 100 ? sliderUpdate(sliderValue+1) : null}>+</button>
									<input type = "text" id = "speed-textbox" title = "Enter the speed value to adjust speed of visualization. Value should be between 0 and 100 inclusively." value = {speedValue} onChange = {updateSpeedField}/>
								</div>
							</div>;
		}
	}else {
		fileUploadButton =	<span>
								<input type = "file"  id = "fileInput" accept = "text/plain" />
								<button className = {buttonClassName} title = "Upload text file containing sudoku input" onClick = {fileRead}>Upload File</button>
								{showAlert && <DialogBox dialog = {showAlert} setshowinfo = {(isVisible) => {setShowInfo(isVisible)}} setshowalert = {(isVisible) => {setShowAlert(isVisible)}} />}
							</span>;
		if (gridhasdigits) {
			clearGridButton = <button className = {buttonClassName} title = "Click to empty the sudoku grid" onClick = {cleargrid}>Clear Grid</button>;
		}
		if (!nopuzzledigits) {
			clearSolutionButton = <button className = {buttonClassName} title = "Click to clear the solved part of sudoku grid" onClick = {clearsolution}>Clear Solution</button>
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
			{showSolutionButton}
			{infoButton}
			{speedSlider}
	    </div> :
		<div className = "options">
			{clearSolutionButton}
			{clearGridButton}
			{fileUploadButton}
			{infoButton}
	    </div>

}

export default Options;