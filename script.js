const board = document.getElementById("board");
const message = document.getElementById("message");
const DIRECTIONS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
let grid, currentPlayer;

function createBoard(){
  board.innerHTML = "";
  grid = Array.from({ length: 8 }, () => Array(8).fill(""));
  for(let y=0;y<8;y++){
    for(let x=0;x<8;x++){
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener("click", () => handleClick(x, y));
      board.appendChild(cell);
    }
  }
  // 初期配置
  setDisc(3,3,"white");
  setDisc(4,4,"white");
  setDisc(3,4,"black");
  setDisc(4,3,"black");
}

function setDisc(x,y,color){
  grid[y][x] = color;
  const cell = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
  cell.innerHTML = `<div class="disc ${color}"></div>`;
}

function handleClick(x,y){
  if(!playMove(x,y, currentPlayer)) return;
  nextTurn();
}

function playMove(x,y,color){
  const flips = getFlips(x,y,color);
  if(flips.length ===0) return false;
  setDisc(x,y,color);
  flips.forEach(([fx,fy])=>setDisc(fx,fy,color));
  return true;
}

function getFlips(x,y,color){
  if(grid[y][x] !== "") return [];
  const opp = color==="black"?"white":"black";
  const flips = [];
  for(const [dx,dy] of DIRECTIONS){
    let cx=x+dx, cy=y+dy, line=[];
    while(cx>=0 && cy>=0 && cx<8 && cy<8 && grid[cy][cx]===opp){
      line.push([cx,cy]);
      cx+=dx; cy+=dy;
    }
    if(line.length>0 && cx>=0 && cy>=0 && cx<8 && cy<8 && grid[cy][cx]===color){
      flips.push(...line);
    }
  }
  return flips;
}

function hasValidMove(color){
  for(let y=0;y<8;y++){
    for(let x=0;x<8;x++){
      if(getFlips(x,y,color).length>0) return true;
    }
  }
  return false;
}

function nextTurn(){
  currentPlayer = currentPlayer==="black"?"white":"black";
  if(hasValidMove(currentPlayer)){
    updateMessage();
  }else if(hasValidMove(opponent(currentPlayer))){
    updateMessage(`${currentPlayer==="black"?"黒":"白"}パス！`);
    currentPlayer = opponent(currentPlayer);
    updateMessage();
  }else{
    endGame();
  }
}

function opponent(color){
  return color==="black"?"white":"black";
}

function updateMessage(extra=""){
  message.textContent = `${currentPlayer==="black"?"黒":"白"}の番です。` + extra;
}

function endGame(){
  const counts = { black:0, white:0 };
  grid.flat().forEach(c=>counts[c] && counts[c]++);
  let result = counts.black === counts.white ? "引き分け！" :
    counts.black > counts.white ? "黒の勝ち！" : "白の勝ち！";
  message.textContent = `ゲーム終了。黒 ${counts.black} – 白 ${counts.white} 。`+result;
}

function resetGame(){
  createBoard();
  currentPlayer="black";
  updateMessage();
}

createBoard();
currentPlayer="black";
updateMessage();

