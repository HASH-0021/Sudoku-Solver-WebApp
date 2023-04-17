import React from "react";
import Cell from "../Cell/Cell";
import "./Box.css";

const Box = ({boxchange, block, darkmodevalue, boxindex}) => {
	const cells = block.map((cellValue,index) => <Cell 
													cellchange = {(value,rowNo,colNo) => boxchange(value,rowNo,colNo)}
													cellvalue = {cellValue}
													darkmodevalue = {darkmodevalue}
													boxindex = {boxindex}
													cellindex = {index}
													/>);
	const [boxClassName,setBoxClassName] = React.useState("");
	React.useEffect(() => {
		if (darkmodevalue) {
			setBoxClassName("box-dark");
		}else {
			setBoxClassName("box-light");
		}
	},[darkmodevalue]);
	return (
		<div className={boxClassName}>
			{cells}
		</div>
		)
}

export default Box