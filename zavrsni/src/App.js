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
	const [backpath,setBackpath]= useState([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
	var [finished,setFinished]= useState(false);
	const [isDisabled,setIsDisabled] = useState(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const [g,setG] = useState(false);

	// Create a new maze grid
	const generateMaze = () => {
		setIsButtonDisabled(false);
		setGenerated(true);
		setVisited2([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
		setPath([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
		setFinished(false);
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
		const dfs = async(row, col) => {

			visited[row][col]=true;
			maze[row][col].visited = true;
			setVisited([...visited]);
			setMaze([...maze]);

			var neighbors = [];
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
				return;
			}

			

			neighbors = neighbors.sort((a,b)=>{return 0.5 - Math.random()});

			for(var i=0;i<neighbors.length;i++){
				var [nextRow,nextCol] = neighbors[i];
				console.log("row col, nexr, nexc i",row,col,nextRow,nextCol,i);
				if(!visited[nextRow][nextCol]){
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
					
					await dfs(nextRow,nextCol);
				}
				
			}

			if(row===0 && col===0 && visited[0][0]){
					var start = maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
					var end = maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
					while(start.visited==false){
						start = maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
					}
					while(end.visited==false || (end.row==start.row && end.column==start.column)){
						end= maze[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
					}
					setStartRow(start.row);
					setStartCol(start.column);
					setEndRow(end.row);
					setEndCol(end.column);
					setMaze([...maze]);
					setVisited([...visited]);
					return;
			}
			

		};

		const startRow = 0; 
		const startCol = 0; 
		dfs(startRow, startCol);
	};

	const solveBFS = async () => {
		setIsButtonDisabled(true);
		setIsDisabled(true);
		var stack = [];
		setVisited2([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
		visited2[startRow][startCol]=true;
		setVisited2([...visited2]);				
		setMaze([...maze]);
		await new Promise(resolve => setTimeout(resolve, 1000));
		if (startRow > 0 && !visited2[startRow - 1][startCol] && visited[startRow-1][startCol] && maze[startRow][startCol].top==false) {		
			stack.push([startRow - 1, startCol]);
		}
		if (startCol > 0 && !visited2[startRow][startCol - 1] && visited[startRow][startCol-1] && maze[startRow][startCol].left==false) {
			stack.push([startRow, startCol - 1]);
		}
		if (startRow < 3 && !visited2[startRow + 1][startCol] && visited[startRow+1][startCol] && maze[startRow][startCol].bottom==false) {
			stack.push([startRow + 1, startCol]);
		}
		if (startCol < 3 && !visited2[startRow][startCol + 1] && visited[startRow][startCol+1] && maze[startRow][startCol].right==false) {
			stack.push([startRow, startCol + 1]);
		}

		while(stack.length!=0){
			var [row,col] = stack[0];
			visited2[row][col]=true;
			setVisited2([...visited2]);				
			setMaze([...maze]);
			await new Promise(resolve => setTimeout(resolve, 1000));
			if(row===endRow && col===endCol){
				setPath([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
				setBackpath([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
				definePath(endRow,endCol);
				
				return;
			}
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
			stack=stack.slice(1,stack.length);
			console.log("row col stek",row,col,stack);
		}
		
	};

	const solveDFS = async (row,col) =>{
		setIsButtonDisabled(true);
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
			if(row===endRow && col===endCol) {
					finished=true;
					setFinished(true);
					setPath([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
					setBackpath([[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]);
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
			if (row > 0 && visited2[row - 1][col] && maze[row][col].top==false && !path[row-1][col] && !backpath[row-1][col] ){		
				await definePath(row - 1, col);
			}
			else if (col > 0 && visited2[row][col - 1] && maze[row][col].left==false && !path[row][col - 1] && !backpath[row][col-1]) {
				await definePath(row, col - 1);
			}
			else if (row < 3 && visited2[row + 1][col] && maze[row][col].bottom==false && !path[row + 1][col] && !backpath[row+1][col]) {
				await definePath(row + 1, col);
			}
			else if (col < 3 && visited2[row][col + 1] && maze[row][col].right==false && !path[row][col + 1] && !backpath[row][col+1]) {
				await definePath(row, col + 1);
			}
			else if (row > 0 && visited2[row - 1][col] && maze[row][col].top==false && path[row-1][col]) {
				path[row][col]=false;	
				backpath[row][col]=true;
				setBackpath([...backpath]);	
				await definePath(row - 1, col);
			}
			else if (col > 0 && visited2[row][col - 1] && maze[row][col].left==false && path[row][col - 1]) {
				path[row][col]=false;
				backpath[row][col]=true;
				setBackpath([...backpath]);
				await definePath(row, col - 1);
			}
			else if (row < 3 && visited2[row + 1][col] && maze[row][col].bottom==false && path[row + 1][col]) {
				path[row][col]=false;
				backpath[row][col]=true;
				setBackpath([...backpath]);
				await definePath(row + 1, col);
			}
			else if (col < 3 && visited2[row][col + 1] && maze[row][col].right==false && path[row][col + 1]) {
				path[row][col]=false;
				backpath[row][col]=true;
				setBackpath([...backpath]);
				await definePath(row, col + 1);
			}
			return;
	};

	return (
		<div className='app'>
			<div className='maze'>
				<button disabled={isDisabled} className='generateBtn' onClick={generateMaze}>
					Generate Maze
				</button>
				<table>
					<tbody>
						{maze.map((row, i) => (
							<tr key={i}>
								{row.map((cell, j) => (
									<Cell key={i - j} row={i} column={j} visited={visited[i][j]} startRow={startRow} startCol={startCol} endRow={endRow} endCol={endCol} search={visited2[i][j]}
										top={maze[i][j].top} bottom={maze[i][j].bottom} right={maze[i][j].right} left={maze[i][j].left} path={path[i][j]}/>
								))}
							</tr>
						))}
					</tbody>
				</table>
				{generated ? (
					<div className='buttons'>
						<button disabled={isDisabled || isButtonDisabled} className='solve' onClick={event => solveDFS(startRow,startCol)}>Solve DFS</button>
						<button disabled={isDisabled || isButtonDisabled} className='solve' onClick={solveBFS}>Solve BFS</button>
					</div>
				) : (
					''
				)}
				</div>
		</div>
	);
}

export default Maze;
