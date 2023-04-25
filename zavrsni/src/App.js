import React, { useState } from 'react';
import './Maze.css';

function Cell(props) {
	return <div id={`${props.row},${props.column}`} className={`cell ${props.visited ? 'visited' : ''}`}></div>;
}

function Maze() {
	const [maze, setMaze] = useState([]);
	const [visited, setVisited] = useState([]);
	const [endRow, setEndRow] = useState();
	const [endCol, setEndCol] = useState();

	// Create a new maze grid
	const generateMaze = () => {
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

		const startRow = 0; //Math.floor(Math.random() * 4);
		const startCol = 0; //Math.floor(Math.random() * 4);
		visited[startRow][startCol] = true;
		maze[startRow][startCol].visited = true;
		setVisited([...visited]);
		dfs(startRow, startCol);
	};

	return (
		<div className='maze'>
			<button onClick={generateMaze}>Generate Maze</button>
			{maze.map((row, i) => (
				<div className='row' key={i}>
					{row.map((cell, j) => (
						<Cell key={i - j} row={i} column={j} visited={visited[i][j]} />
					))}
				</div>
			))}
			{console.log('row col end ', endRow, endCol)}
		</div>
	);
}

export default Maze;
