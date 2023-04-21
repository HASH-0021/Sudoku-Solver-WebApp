import React from "react";
import Box from "../Box/Box";
import "./Grid.css";

const Grid = ({gridchange, blockifiedgrid, darkmodevalue}) => {

	// "boxes" variable stores all the box components.

	const boxes = blockifiedgrid.map((block,index) => <Box 
															key = {`box${index}`}
															boxchange = {(value,rowNo,colNo) => gridchange(value,rowNo,colNo)}
															block = {block}
															darkmodevalue = {darkmodevalue}
															boxindex = {index}
															/>);
	const [gridClassName,setGridClassName] = React.useState("");

	React.useEffect(() => {

		// State variable "gridClassName" is changed whenever "darkmodevalue" prop is changed and this component is re-rendered.

		darkmodevalue ? setGridClassName("grid-border-dark") : setGridClassName("grid-border-light");
	},[darkmodevalue]);

	return (
		<div className = {`grid ${gridClassName}`}>
			{boxes}
		</div>
	);

}

export default Grid;