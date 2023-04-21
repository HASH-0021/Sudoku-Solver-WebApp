import React from "react";
import Cell from "../Cell/Cell";
import "./Box.css";

const Box = ({boxchange, block, darkmodevalue, boxindex}) => {

	// "cells" variable stores all the cell components.
	// "boxClass" variable stores all the border classnames to be included for this box.

	const cells = block.map((cellValue,index) => <Cell 
													key = {`cell${index}`}
													cellchange = {(value,rowNo,colNo) => boxchange(value,rowNo,colNo)}
													cellvalue = {cellValue}
													darkmodevalue = {darkmodevalue}
													boxindex = {boxindex}
													cellindex = {index}
													/>);
	const [boxClassName,setBoxClassName] = React.useState("");
	let boxClass = "";
	if (boxindex%3) {
		boxClass += " box-border-left ";
	}
	if (boxindex%3 !== 2) {
		boxClass += " box-border-right ";
	}
	if (Math.floor(boxindex/3)) {
		boxClass += " box-border-top ";
	}
	if (Math.floor(boxindex/3) !== 2) {
		boxClass += " box-border-bottom ";
	}
	boxClass = boxClass.trim();

	React.useEffect(() => {

		// State variable "boxClassName" is changed whenever "darkmodevalue" prop is changed and this component is re-rendered.

		darkmodevalue ? setBoxClassName(boxClass+" box-border-dark") : setBoxClassName(boxClass+" box-border-light");
	},[boxClass,darkmodevalue]);

	return (
		<div className = {`box ${boxClassName}`}>
			{cells}
		</div>
	);

}

export default Box;