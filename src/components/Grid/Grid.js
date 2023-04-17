import React from "react";
import Box from "../Box/Box";
import "./Grid.css";

const Grid = ({gridchange, blockifiedgrid, darkmodevalue}) => {
	const boxes = blockifiedgrid.map((block,index) => <Box 
															boxchange = {(value,rowNo,colNo) => gridchange(value,rowNo,colNo)}
															block = {block}
															darkmodevalue = {darkmodevalue}
															boxindex = {index}
															/>);
	const [gridClassName,setGridClassName] = React.useState("");
	React.useEffect(() => {
		if (darkmodevalue) {
			setGridClassName("grid-dark");
		}else {
			setGridClassName("grid-light");
		}
	},[darkmodevalue]);
	return (
		<div className={gridClassName}>
			{boxes}
		</div>
		)
}

export default Grid