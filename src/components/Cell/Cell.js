import React from "react";
import "./Cell.css";

const Cell = ({cellchange, cellvalue, darkmodevalue}) => {
	const ref = React.useRef(null);
	const [cellInput,setCellInput] = React.useState("cell-input-dark");
	const [cellInputBold,setCellInputBold] = React.useState("cell-input-bold-dark");
	React.useEffect(() => {
		if (darkmodevalue) {
			setCellInput("cell-input-dark");
			setCellInputBold("cell-input-bold-dark");
		}else {
			setCellInput("cell-input-light");
			setCellInputBold("cell-input-bold-light");
		}
		if (ref.current.className === "cell-input-light" || ref.current.className === "cell-input-dark") {
			if (darkmodevalue) {
				setCellClassName("cell-input-dark");
			}else {
				setCellClassName("cell-input-light");
			}
		}else {
			if (darkmodevalue) {
				setCellClassName("cell-input-bold-dark");
			}else {
				setCellClassName("cell-input-bold-light");
			}
		}
	},[darkmodevalue]);
	const [cellClassName, setCellClassName] = React.useState(cellInput);
	const [value, setValue] = React.useState(cellvalue);
	React.useEffect(() => {
		if (cellvalue === '-') {
			setValue(null)
			setCellClassName(cellInput);
		}else{
			setValue(cellvalue);
		}
	}, [cellvalue]);
	const handleKeyPress = (event) => {
		const charCode = event.which || event.keyCode;
		if (charCode < 49 || charCode > 57) {
			event.preventDefault();
		}
	}
	const updateCell = (event) => {
		const updatedValue = Number(event.target.value);
		if (updatedValue > 0 && updatedValue < 10) {
			setCellClassName(cellInputBold);
			setValue(updatedValue);
			cellchange(updatedValue);
		}else {
			setCellClassName(cellInput);
			setValue(null);
			cellchange('-');
		}
	}
	return (
		<input type = "text"
				ref = {ref}
				className = {cellClassName}
				maxLength="1"
				value={value || ''}
				onKeyPress={handleKeyPress}
				onChange={updateCell}
		/>
	);
}

export default Cell