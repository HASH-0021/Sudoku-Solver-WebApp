import React from "react";
import './DarkMode.css';

const DarkMode = ({setdarkmode, darkmodevalue, sliderstate}) => {
	const [isChecked,setIsChecked] = React.useState(darkmodevalue);
	let toggleText = "";
	let textClassName = "";
	let toggleTextClassName = "";
	const handleToggle = (event) => {
		setIsChecked(event.target.checked);
		setdarkmode(event.target.checked);
	}
	if (isChecked) {
		toggleText = "ON";
		textClassName = "text-dark";
		toggleTextClassName = "toggle-text-left";
	}else {
		toggleText = "OFF";
		textClassName = "text-light";
		toggleTextClassName = "toggle-text-right";
	}
	return sliderstate ?
		<div className="dark-mode-section"></div> : 
		<div className="dark-mode-section">
			<div className={textClassName}>Dark mode</div>
			<div className={textClassName}>:</div>
			<label className="toggle">
			  <input type="checkbox" checked={isChecked} onChange={handleToggle}/>
			  <span className="slider"><div className={toggleTextClassName}>{toggleText}</div></span>
			</label>
		</div>
}

export default DarkMode