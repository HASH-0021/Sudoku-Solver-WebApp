import React from "react";
import './DarkMode.css';

const DarkMode = ({setdarkmode, darkmodevalue, sliderstate}) => {

	// "toggleText", "textClassName" and "toggleTextClassName" variables are changed depending on state variable "isChecked".

	const [isChecked,setIsChecked] = React.useState(darkmodevalue);
	let toggleText = "";
	let textClassName = "";
	let toggleTextClassName = "";
	if (isChecked) {
		toggleText = "ON";
		textClassName = "text-dark";
		toggleTextClassName = "toggle-text-left";
	}else {
		toggleText = "OFF";
		textClassName = "text-light";
		toggleTextClassName = "toggle-text-right";
	}

	const handleToggle = (event) => {

		// This function calls "setdarkmode" function in App.js.
		// State variable "isChecked" is changed.

		setIsChecked(event.target.checked);
		setdarkmode(event.target.checked);
	}

	return sliderstate ?
		null : 
		<div className = "dark-mode-section">
			<div className = {textClassName}>Dark mode</div>
			<div className = {textClassName}>:</div>
			<div className = "toggle-section">
				<label className = "toggle" title = {`Toggle between dark and light modes. Current state is ${isChecked ? "dark" : "light"} mode.`}>
				  <input type = "checkbox" checked = {isChecked} onChange = {handleToggle}/>
				  <span className = "slider"><div className = {toggleTextClassName}>{toggleText}</div></span>
				</label>
			</div>
		</div>

}

export default DarkMode;