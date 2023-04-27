import React, { useState } from 'react';
import './Maze.css';

function Cell(props) {
	return (
		<div
			id={`${props.row},${props.column}`}
			className={`cell ${props.visited ? 'visited' : ''} ${props.row === 0 ? 'top' : ''} ${
				props.column === 0 ? 'left' : ''
			} ${props.column === 0 && props.row === 0 ? 'start' : ''} ${
				props.row === props.endRow && props.column === props.endCol ? 'end' : ''
			} ${props.search?'search':''}`}></div>
	);
}

function Maze() {
	const [maze, setMaze] = useState([]);
	const [visited, setVisited] = useState([]);
	const [endRow, setEndRow] = useState();
	const [endCol, setEndCol] = useState();
	const [generated, setGenerated] = useState(false);
	const [visited2,setVisited2]= useState([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);

	// Create a new maze grid
	const generateMaze = () => {
		setGenerated(true);
		setVisited2([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
		if (maze.length === 0) {
			for (let i = 0; i < 4; i++) {
				const row = [];
				const visitedRow = [];
				for (let j = 0; j < 4; j++) {
					row.push({ row: i, column: j, visited: false });
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
			if (neighbors.length === 0 || (row === 3 && col === 3)) {
				setEndRow(row);
				setEndCol(col);
				return;
			}
			const [nextRow, nextCol] = neighbors[Math.floor(Math.random() * neighbors.length)];
			visited[nextRow][nextCol] = true;
			maze[nextRow][nextCol].visited = true;
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
	const solveDFS = (row,col) =>{
		
		const stack = [];		
		if (row > 0 && !visited2[row - 1][col] && visited[row-1][col]) {		
			stack.push([row - 1, col]);
		}
		if (col > 0 && !visited2[row][col - 1] && visited[row][col-1]) {
			stack.push([row, col - 1]);
		}
		if (row < 3 && !visited2[row + 1][col] && visited[row+1][col]) {
			stack.push([row + 1, col]);
		}
		if (col < 3 && !visited2[row][col + 1] && visited[row][col+1]) {
			stack.push([row, col + 1]);
		}
		if (stack.length === 0 || (row === endRow && col === endCol)) {
			
			setTimeout(function(){
				visited2[row][col]=true;
				setVisited2([...visited2]);				
				
			}, 1000);
			return;
		}
		
		setTimeout(function(){
			visited2[row][col]=true;
			const [nextRow, nextCol] = stack.pop();
			setVisited2([...visited2]);
			setMaze([...maze]);
			solveDFS(nextRow, nextCol);	
		}, 1000);
			
	};

	return (
		<div className='app'>
			<div className='maze'>
				<button className='generateBtn' onClick={generateMaze}>
					Generate Maze
				</button>
				{maze.map((row, i) => (
					<div className='row' key={i}>
						{row.map((cell, j) => (
							<Cell key={i - j} row={i} column={j} visited={visited[i][j]} endRow={endRow} endCol={endCol} search={visited2[i][j]}/>
						))}
					</div>
				))}

				{generated ? (
					<div className='buttons'>
						<button className='solve' onClick={event => solveDFS(0,0)}>Solve DFS</button>
						<button className='solve' onclick={solveBFS}>Solve BFS</button>
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
}

export default Maze;
