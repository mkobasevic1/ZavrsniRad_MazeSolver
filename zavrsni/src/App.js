import React, { useState } from 'react';
import './Maze.css';
//import './proba.css';

function Cell(props) {
	return (
		<td
			id={`${props.row},${props.column}`}
			className={`cell ${props.visited ? 'visited' : ''} ${props.row === 0 ? 'top' : ''} ${
				props.column === 0 ? 'left' : ''
			} ${props.column === props.startCol && props.row === props.startRow ? 'start' : ''} ${
				props.row === props.endRow && props.column === props.endCol ? 'end' : ''
			} ${props.search?'search':''} ${props.top?'':'notop'} ${props.bottom?'':'nobottom'} ${props.left?'':'noleft'} ${props.right?'':'noright'}
			${props.path?'path':''} `}></td>
	);
}

function Maze() {
	const [maze, setMaze] = useState([]);
	const [visited, setVisited] = useState([]);
	const [endRow, setEndRow] = useState();
	const [endCol, setEndCol] = useState();
	const [startRow, setStartRow] = useState();
	const [startCol, setStartCol] = useState();
	const [generated, setGenerated] = useState(false);
	const [visited2,setVisited2]= useState([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
	const [path,setPath]= useState([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
	var [finished,setFinished]= useState(false);
	const [isDisabled,setIsDisabled] = useState(false);

	// Create a new maze grid
	const generateMaze = () => {
		setGenerated(true);
		setVisited2([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
		if (maze.length === 0) {
			for (let i = 0; i < 4; i++) {
				const row = [];
				const visitedRow = [];
				for (let j = 0; j < 4; j++) {
					row.push({ row: i, column: j, visited: false, top:true, bottom:true, right:true, left:true });
					visitedRow.push(false);
				}
				maze.push(row);
				visited.push(visitedRow);
			}
			setMaze(maze);
			setVisited(visited);
		} else {
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					maze[i][j].visited = false;
					visited[i][j] = false;
					maze[i][j].top=true;
					maze[i][j].bottom=true;
					maze[i][j].right=true;
					maze[i][j].left=true;
				}
			}
			setMaze(maze);
			setVisited(visited);
		}

		// Start DFS algorithm to generate maze
		const dfs = (row, col) => {
			const neighbors = [];
			if (row > 0 && !visited[row - 1][col]) {
				neighbors.push([row - 1, col]);
			}
			if (col > 0 && !visited[row][col - 1]) {
				neighbors.push([row, col - 1]);
			}
			if (row < 3 && !visited[row + 1][col]) {
				neighbors.push([row + 1, col]);
			}
			if (col < 3 && !visited[row][col + 1]) {
				neighbors.push([row, col + 1]);
			}

			if(neighbors.length === 0){
				var start = maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
				var end = maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
				while(start.visited==false){
					start = maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
				}
				while(end.visited==false || (end.row==start.row && end.column==start.column)){
					end= maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
				}
				console.log("start ",start.row,start.column);
				console.log("end ",end.row,end.column);
				setStartRow(start.row);
				setStartCol(start.column);
				setEndRow(end.row);
				setEndCol(end.column);
				return;
			}
			/*if () {
				var next = maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
				console.log("next ",next.row,next.column);
				visited[next.row][next.column] = true;
				maze[next.row][next.column].visited = true;
				if(next.row>0 && maze[next.row-1][next.column].visited==true){
					maze[next.row][next.column].top=false;
					maze[next.row-1][next.column].bottom=false;
				}
				if(next.row<3 && maze[next.row+1][next.column].visited==true){
					maze[next.row][next.column].bottom=false;
					maze[next.row+1][next.column].top=false;
				}
				if(next.column>0 && maze[next.row][next.column-1].visited==true){
					maze[next.row][next.column].right=false;
					maze[next.row][next.column-1].left=false;
				}
				if(next.column<3 && maze[next.row][next.column+1].visited==true){
					maze[next.row][next.column].left=false;
					maze[next.row][next.column+1].right=false;
				}
				setVisited([...visited]);
				dfs(next.row, next.column);
			}*/

			const [nextRow, nextCol] = neighbors[Math.floor(Math.random() * neighbors.length)];
			visited[nextRow][nextCol] = true;
			maze[nextRow][nextCol].visited = true;
			if(nextRow<row){
				maze[row][col].top=false;
				maze[nextRow][nextCol].bottom=false;
			}
			else if(nextRow>row){
				maze[row][col].bottom=false;
				maze[nextRow][nextCol].top=false;
			}
			else if(nextCol>col){
				maze[row][col].right=false;
				maze[nextRow][nextCol].left=false;
			}
			else if(nextCol<col){
				maze[row][col].left=false;
				maze[nextRow][nextCol].right=false;
			}
			setVisited([...visited]);
			dfs(nextRow, nextCol);
		};

		const startRow = 0; 
		const startCol = 0; 
		visited[startRow][startCol] = true;
		maze[startRow][startCol].visited = true;
		setVisited([...visited]);
		dfs(startRow, startCol);
	};

	const solveBFS = () => {};
	const solveDFS = async (row,col) =>{
		setIsDisabled(true);
		if(finished) return;
		const stack = [];		
		if (row > 0 && !visited2[row - 1][col] && visited[row-1][col] && maze[row][col].top==false) {		
			stack.push([row - 1, col]);
		}
		if (col > 0 && !visited2[row][col - 1] && visited[row][col-1] && maze[row][col].left==false) {
			stack.push([row, col - 1]);
		}
		if (row < 3 && !visited2[row + 1][col] && visited[row+1][col] && maze[row][col].bottom==false) {
			stack.push([row + 1, col]);
		}
		if (col < 3 && !visited2[row][col + 1] && visited[row][col+1] && maze[row][col].right==false) {
			stack.push([row, col + 1]);
		}
		console.log("row col neighb",row,col,stack);
		if (stack.length === 0 || (row === endRow && col === endCol)) {
			

			visited2[row][col]=true;
			setVisited2([...visited2]);				
			setMaze([...maze]);
			await new Promise(resolve => setTimeout(resolve, 1000));
			if(row===endRow && col===endCol) 
				{
					finished=true;
					setFinished(true);
					definePath(endRow,endCol);
				}
			return;
		}
		

			visited2[row][col]=true;
			setVisited2([...visited2]);
			setMaze([...maze]);
			await new Promise(resolve => setTimeout(resolve, 1000));
			while(stack.length>0){
				const [nextRow, nextCol] = stack.pop();
				await solveDFS(nextRow, nextCol);	
			}
					
	};

	const definePath = async (row,col)=>{
		path[row][col]=true;
		setPath([...path]);
		await new Promise(resolve => setTimeout(resolve, 500));
		if(row===startRow && col===startCol){
			setIsDisabled(false);
			return;
		}
			if (row > 0 && visited2[row - 1][col] && maze[row][col].top==false && !path[row-1][col]) {		
				await definePath(row - 1, col);
			}
			else if (col > 0 && visited2[row][col - 1] && maze[row][col].left==false && !path[row][col - 1]) {
				await definePath(row, col - 1);
			}
			else if (row < 3 && visited2[row + 1][col] && maze[row][col].bottom==false && !path[row + 1][col]) {
				await definePath(row + 1, col);
			}
			else if (col < 3 && visited2[row][col + 1] && maze[row][col].right==false && !path[row][col + 1]) {
				await definePath(row, col + 1);
			}
			return;
	};

	return (
		<div className='app'>
			{/*<table>
					<tr>
						<td className="noright"></td>
						<td className="noleft"></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="nobottom"></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="notop"></td>
						<td className="noright"></td>
						<td className="noright"></td>
						<td></td>
					</tr>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
			</table>*/}
			<div className='maze'>
				<button disabled={isDisabled} className='generateBtn' onClick={generateMaze}>
					Generate Maze
				</button>
				<table>
					{maze.map((row, i) => (
						<tr>
							{row.map((cell, j) => (
								<Cell key={i - j} row={i} column={j} visited={visited[i][j]} startRow={startRow} startCol={startCol} endRow={endRow} endCol={endCol} search={visited2[i][j]}
									top={maze[i][j].top} bottom={maze[i][j].bottom} right={maze[i][j].right} left={maze[i][j].left} path={path[i][j]}/>
							))}
						</tr>
					))}
				</table>
				{generated ? (
					<div className='buttons'>
						<button disabled={isDisabled} className='solve' onClick={event => solveDFS(startRow,startCol)}>Solve DFS</button>
						<button disabled={isDisabled} className='solve' onclick={solveBFS}>Solve BFS</button>
					</div>
				) : (
					''
				)}
				</div>
		</div>
	);
}

export default Maze;
