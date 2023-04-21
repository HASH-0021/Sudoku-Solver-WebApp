import React from "react";
import "./DialogBox.css";

const DialogBox = ({dialog, setshowinfo, setshowalert}) => {

	const infoDialogBox = 	<div className = "info-dialog">
								<div className = "close-button"><button title = "Close" onClick = {() => setshowinfo(false)}>X</button></div>
								<h3>Information!</h3>
								<ol>
									<li>Given sudoku input must be valid. No row/column/box should contain duplicate digits.</li>
									<li>Solution given will be the first valid iteration. Solver isn't intelligent enough to tell if there are other solutions. It would be better if the given input has unique solution.</li>
									<li>"Solve" option solves the sudoku and directly displays the result in the grid.</li>
									<li>"Visualize" option shows the solving process in the grid. A new option becomes available during the process which allows to control the speed of visualization. At full speed, the visualization switches to direct solution.</li>
									<li>
										"Upload File" option allows to upload text file ('.txt') containing sudoku. The sudoku grid will be auto populated with sudoku present in the uploaded file. 
										File should contain 1 valid sudoku, so it should contain 9 lines. Each line represents the row of sudoku grid. 
										Each character in line represents a cell and is separated by ','. So each line should contain 9 characters. Characters allowed are '-' for empty cell and numbers between 1-9. 
										Ideal sudoku format should look something like below.
										<ol className = "sample-grid">
											<li>-,5,-,-,3,-,-,-,-</li>
											<li>-,-,1,-,-,8,-,-,4</li>
											<li>-,6,3,4,-,-,7,-,-</li>
											<li>-,-,-,6,-,-,-,-,-</li>
											<li>6,7,2,-,-,-,4,-,3</li>
											<li>-,-,-,9,2,-,-,1,-</li>
											<li>5,-,-,-,-,9,6,4,-</li>
											<li>-,3,-,5,-,-,1,-,-</li>
											<li>9,-,-,-,1,-,-,-,-</li>
										</ol>
										Uploading invalid sudoku file format displays an alert dialog box.
									</li>
									<li>"Clear Solution" option removes the solved part of the sudoku grid.</li>
									<li>"Clear Grid" option completely removes the sudoku grid.</li>
									<li>"Info" button displays the information dialog box (which is current dialog box).</li>
									<li>"Status" section shows the current status of the sudoku grid.</li>
									<li>"Dark mode" section helps in toggling between light mode and dark mode. This section is unavailable during visualization.</li>
								</ol>
							</div>;
	const alertDialogBox =	<div className = "alert-dialog">
								<div className = "close-button"><button title = "Close" onClick = {() => setshowalert(false)}>X</button></div>
								<h3>Alert!!</h3>
								<p>{dialog} Check more details about sudoku file format in the <button className = "info-link" title = "Info about the app" onClick = {() => setshowinfo(true)}>info</button>.</p>
							</div>;

	return dialog === "info" ? infoDialogBox : alertDialogBox;

}

export default DialogBox;