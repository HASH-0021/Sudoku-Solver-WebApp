import React from "react";
import "./Options.css";

const Options = (
		{
			solvesudoku, visualizesolution, clearsolution, cleargrid,
			notsolved, gridhasdigits, completegrid, validgrid,
			darkmodevalue, sliderstate, speedadjust
		}
	) => {
	const [solveState, setSolveState] = React.useState(notsolved);
	const [hasDigits, setHasDigits] = React.useState(gridhasdigits);
	const [sliderValue,setSliderValue] = React.useState(50);
	const [buttonClassName,setButtonClassName] = React.useState("");
	React.useEffect(() => {
		setSolveState(notsolved);
	},[notsolved]);
	React.useEffect(() => {
		setHasDigits(gridhasdigits);
	},[gridhasdigits]);
	React.useEffect(() => {
		if (darkmodevalue) {
			setButtonClassName("buttons-dark");
		}else {
			setButtonClassName("buttons-light");
		}
	},[darkmodevalue]);
	const sliderUpdate = (event) => {
		setSliderValue(event.target.value);
		speedadjust(event);
	}
	React.useEffect(() => {
		setSliderValue(50);
	},[sliderstate]);
	let clearGridButton = null;
	let solveButton = null;
	let visualizeButton = null;
	let speedSlider = null;
	if (sliderstate) {
		speedSlider = <div className = "speed-section"><div>Speed</div><div>:</div><input type="range" min="0" max="100" value={sliderValue} id="speed-slider" onChange={sliderUpdate}/></div>;
	}else {
		if (hasDigits) {
			clearGridButton = <button className = {buttonClassName} onClick={cleargrid}>Clear Grid</button>;
		}
		if (!completegrid && validgrid) {
			solveButton = <button className = {buttonClassName} onClick={solvesudoku}>Solve</button>;
			visualizeButton = <button className = {buttonClassName} onClick = {visualizesolution}>Visualize</button>;
		}
	}
	return solveState ? 
		<div className = "options">
			{speedSlider}
			{solveButton}
			{visualizeButton}
			{clearGridButton}
	    </div> :
		<div className = "options">
			<button className = {buttonClassName} onClick={clearsolution}>Clear Solution</button>
			{clearGridButton}
	    </div>
}

export default Options