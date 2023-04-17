import "./Details.css";

const Details = ({timetaken, validgrid}) => {
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
			<div className = "info">
				<div>Info</div>
				<div>:</div>
				<ol>
					<li>Given sudoku input must be valid. No row/column/box contain duplicate digits.</li>
					<li>Solution given will be the first valid iteration of solutions. Solver isn't intelligent enough to tell if there are other solutions. It would be better if the given input has unique solution.</li>
				</ol>
			</div>
		</div>
		)
}

export default Details