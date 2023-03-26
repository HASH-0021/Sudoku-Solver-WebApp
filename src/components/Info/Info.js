import "./Info.css";

const Info = ({timetaken, validgrid}) => {
	let output = null;
	if (!validgrid) {
		timetaken = -1;
	}
	if (timetaken === -2) {
		output = <p className = "valid">Sudoku grid is valid.</p>;
	}else if (timetaken === -1) {
		output = <p className = "invalid">Sudoku grid is invalid.</p>;
	}else {
		output = <p className = "solved">Solved in {timetaken} seconds.</p>;
	}
	return (
		<div className = "info">
			{output}
			<div className = "notes">
				<p>Notes:</p>
				<ol>
					<li>Given sudoku input must be valid. No row/column/box contain duplicate digits.</li>
					<li>Solution given will be the first valid iteration of solutions. Solver isn't intelligent enough to tell if there are other solutions. It would be better if the given input has unique solution.</li>
				</ol>
			</div>
		</div>
		)
}

export default Info