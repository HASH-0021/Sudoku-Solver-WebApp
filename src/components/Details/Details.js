import "./Details.css";

const Details = ({timetaken, validgrid}) => {

	// "timetaken" prop is changed if "validgrid" prop is false.
	// "output" variable is changed depending on "timetaken" prop.

	let output = null;
	if (!validgrid) {
		timetaken = -6;
	}
	switch (timetaken) {
		case -6 :
			output = <div className = "status"><div>Status</div><div>:</div><div className = "error-status status-output">Sudoku grid is invalid.</div></div>;
			break;
		case -5 :
			output = <div className = "status"><div>Status</div><div>:</div><div className = "error-status status-output">Sudoku grid has no solution.</div></div>;
			break;
		case -4 :
			output = <div className = "status"><div>Status</div><div>:</div><div className = "normal-status status-output">Sudoku grid is valid.</div></div>;
			break;
		case -3 :
			output = <div className = "status"><div>Status</div><div>:</div><div className = "normal-status status-output">Solving...</div></div>;
			break;
		case -2 :
			output = <div className = "status"><div>Status</div><div>:</div><div className = "normal-status status-output">Visualizing...</div></div>;
			break;
		case -1 :
			output = <div className = "status"><div>Status</div><div>:</div><div className = "success-status status-output">Solved.</div></div>;
			break;
		default :
			output = <div className = "status"><div>Status</div><div>:</div><div className = "success-status status-output">Solved in {timetaken} seconds.</div></div>;
			break;
	}

	return (
		<div className = "details">
			{output}
		</div>
	);

}

export default Details;