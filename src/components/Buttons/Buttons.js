import React from "react";
import "./Buttons.css";

const Buttons = ({solvesudoku, clearsolution, cleargrid, previousgrid, gridhasdigits, completegrid, validgrid, darkmodevalue}) => {
	const [grid, setGrid] = React.useState(previousgrid);
	const [hasDigits, setHasDigits] = React.useState(gridhasdigits);
	const [buttonClassName,setButtonClassName] = React.useState("");
	React.useEffect(() => {
		setGrid(previousgrid);
	},[previousgrid]);
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
	let clearGridButton = null;
	if (hasDigits) {
		clearGridButton = <button className = {buttonClassName} onClick={cleargrid}>Clear Grid</button>;
	}
	let solveButton = null;
	if (!completegrid && validgrid) {
		solveButton = <button className = {buttonClassName} onClick={solvesudoku}>Solve</button>;
	}
	return !grid.length ? 
		<div>
			{solveButton}
			{clearGridButton}
	    </div> :
		<div>
			<button className = {buttonClassName} onClick={clearsolution}>Clear Solution</button>
			{clearGridButton}
	    </div>
}

export default Buttons