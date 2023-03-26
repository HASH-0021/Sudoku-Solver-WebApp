import React from "react";
import Cell from "../Cell/Cell";
import "./Box.css";

const Box = ({boxchange, block, darkmodevalue}) => {
	const cells = block.map((cellValue,index) => <Cell 
													cellchange = {(value) => boxchange(value,index)}
													cellvalue = {cellValue}
													darkmodevalue = {darkmodevalue}
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