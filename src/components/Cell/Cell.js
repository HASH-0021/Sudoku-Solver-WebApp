import React from "react";
import "./Cell.css";

const Cell = ({cellchange, cellvalue, darkmodevalue, boxindex, cellindex, shiftfocus}) => {

	// "rowNo" and "colNo" variables are calculated from "boxindex" and "cellindex" props.

	const rowNo = Math.floor(boxindex/3)*3 + Math.floor(cellindex/3);
	const colNo = (boxindex%3)*3 + cellindex%3;
	const ref = React.useRef(null);
	let cellClass = "";
	if (cellindex%3) {
		cellClass += " cell-border-left ";
	}
	if (cellindex%3 !== 2) {
		cellClass += " cell-border-right ";
	}
	if (Math.floor(cellindex/3)) {
		cellClass += " cell-border-top ";
	}
	if (Math.floor(cellindex/3) !== 2) {
		cellClass += " cell-border-bottom ";
	}
	cellClass = cellClass.trim();

	React.useEffect(() => {

		// input classname is changed whenever "darkmodevalue" prop is changed.

		ref.current.className = darkmodevalue ? ref.current.className.replace("light","dark") : ref.current.className.replace("dark","light");
	},[darkmodevalue]);

	React.useEffect(() => {

		// input classname is changed whenever "cellvalue" prop is changed to '-'.

		if (cellvalue === '-') {
			ref.current.className = ref.current.className.replace("cell-input-bold-","cell-input-");
		}
	},[cellvalue]);

	const updateCell = (event) => {

		// This function calls cellchange function in App.js.
		// "updatedValue" variable stores the value thats entered in input after typecasting it to a number.
		// input classname is changed if "updatedValue" is in between 0 and 10 (exclusive).

		const updatedValue = Number(event.target.value);
		if (updatedValue > 0 && updatedValue < 10) {
			ref.current.className = ref.current.className.replace("cell-input-","cell-input-bold-");
			cellchange(updatedValue,rowNo,colNo);
		}else {
			cellchange('-',rowNo,colNo);
		}
	}

	return (
		<input type = "text"
				ref = {ref}
				className = {`cell ${cellClass} cell-input-dark`}
				id = {`R${rowNo}C${colNo}`}
				maxLength = "1"
				value = {cellvalue === '-' ? '' : cellvalue}
				title = {`R${rowNo+1}C${colNo+1}`}
				onChange = {updateCell}
				onKeyDown = {(event) => shiftfocus(rowNo,colNo,event)}
				onFocus = {(event) => {event.target.select()}}
		/>
	);

}

export default Cell;