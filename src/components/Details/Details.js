import "./Details.css";

const Details = ({timetaken, validgrid}) => {

	// "timetaken" prop is changed if "validgrid" prop is false.
	// "output" variable is changed depending on "timetaken" prop.

	let output = null;
	if (!validgrid) {
		timetaken = -1;
	}
	if (timetaken === -2) {
		output = <div className = "status"><div>Status</div><div>:</div><div className = "valid status-output">Sudoku grid is valid.</div></div>;
	}else if (timetaken === -1) {
		output = <div className = "status"><div>Status</div><div>:</div><div className = "invalid status-output">Sudoku grid is invalid.</div></div>;
	}else {
		output = <div className = "status"><div>Status</div><div>:</div><div className = "solved status-output">Solved in {timetaken} seconds.</div></div>;
	}

	return (
		<div className = "details">
			{output}
		</div>
	);

}

export default Details;