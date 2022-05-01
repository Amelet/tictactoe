let boardSize = 3;
let gameBoard = new Array(boardSize**2).fill('');
let cellID = 0;
let ID;
let cells;
let whoPlays;
let players;
let winningDiag = [0, 1, 2];
let winMainDiag = [0, 4, 8];
let winSecDiag = [2, 4, 6]
let diagWin;



/* CHECK if player wins */
function checkForWin (movesList) {
    let cols = [];
    let rows = [];
    let move;
    let isWinner;
    
    console.log('\tCheckForWin: recorded moves in func: '+movesList)
    for (var i = 0; i < movesList.length; i++) {
        move = Number(movesList[i])
        rc = checkRowColumn(move)
        cols.push(rc[1])
        rows.push(rc[0])
    }
    /* check winner in rows */
    diagWin = winOnDiag (movesList)

    if (diagWin == true) {
        return diagWin
    } else {
        /* check winner in columns*/
        isWinner = [rows, cols].map((arr) => {
        counts = countUnique(arr)
        flag = crossedAll(counts)
        return flag
    })
    return isWinner.some( (element) => {return element === true} )
    }
}

/* Helper functions: */
/* : marker position in [row, col] coordinates */
function checkRowColumn (ID) {
    let col;
    let row;
    col = ID % boardSize;
    row = Math.floor(ID / boardSize);
    return [row, col]
}


/* : Find unique rows or cols in List of Moves for a player */
function countUnique(arr) {
    const counts = {};
    for (var i = 0; i < arr.length; i++) {
       counts[arr[i]] = 1 + (counts[arr[i]] || 0);
    };
    return counts;
};


/* : Crossed one columns or row? */
function crossedAll(counts) {
    let counter;
    let isWinner = false;
    for (var i = 0; i <= boardSize; i++) {
        counter = counts[i]
        if (counter == 3) {isWinner = true}
    }
    return isWinner
}

/* : Diagonal wins? */

function winOnDiag (movesList) {    
    let isWinner = [winMainDiag, winSecDiag].map( (arrDiag) => {
        return containsAll(arrDiag, movesList)
        })
    diagWin = isWinner.some( (element) => {return element === true} )
    return diagWin
}

/* : Diag wins if moves contain winMainDiag, winSecDiag moves */
function containsAll (arrDiag, movesList) {
    let flags = [];
    let arr = [...movesList]
    for (let i=0; i < movesList.length; i++) {
        move = movesList[i]
        if (move == arrDiag[0] || move == arrDiag[1] || move == arrDiag[2]) {
            flags.push(true)}
    }

    if (flags.length >= 3) {
        return flags.every ( (element) => {return element == true})
    } else {return false}
}


/* AI MOVES functions */
function playAI (players, whoPlays) {
    whoPlays = gameMaster(players, whoPlays)
    console.log('??did we switch to comp? '+players[whoPlays].name)
    
    let futureStepAI = compAI(players, whoPlays)
    document.getElementById(futureStepAI).removeEventListener('click', nextMove)
    
    console.log('!!AI step: -->'+futureStepAI)
    mark = players[whoPlays].mark
    /* bb */
    console.log(futureStepAI)
    players[whoPlays].moves(futureStepAI)
    console.log(players[whoPlays].movesList)
    let div = document.createElement('div')
    div.innerHTML = mark
    document.getElementById(futureStepAI).appendChild(div);
    isItTie (players, whoPlays)
    isWinner = checkForWin (players[whoPlays].movesList)
    console.log('\tisWinner: '+isWinner)
    return [isWinner, whoPlays]
}

/* Helper functions for AI to move: */
/* : Analyze moves AI can make */
function compAI(players, whoPlays) {
    let AI = players[1]
    let User = players[0]
    let board = [...Array(boardSize**2).keys()]
    let allMoves = User.movesList.concat(AI.movesList)
    let difference = board.filter(x => !allMoves.includes(String(x)));

    /* check left moves */

    let winnerInOneStep = []
    if (players[whoPlays].name == 'AI') {
        console.log('\n--> AI tries its moves: ')
        for (let i=0; i < difference.length; i++)
        {   /* move */
            let imMoves = [];
            for (var x of players[whoPlays].movesList) {
                imMoves.push(x);
            }

            let tryMove = String(difference[i])
            imMoves.push(tryMove)

            /* check win */
            isWinner = checkForWin (imMoves)
            winnerInOneStep.push(isWinner)
        }

        let flag = winnerInOneStep.some( (element) => {return element === true} ) 
        if (flag==true) {
            let bestMoveInd = winnerInOneStep.findIndex((element) => element == true);
            let bestMove = difference[bestMoveInd]
            return String(bestMove)
        } else {
            let blockOpponentMove = futureMoves (players, whoPlays, difference)
            return String(blockOpponentMove)
        }  
    }
}

/* : Moves of opponent are checked */
function futureMoves (players, whoPlays, difference) {
    let winnerInOneStep = []
    for (let i=0; i < difference.length; i++)
    {   /* move */
        let imMoves = [];
        for (var x of players[!whoPlays*1].movesList) {
            imMoves.push(x);
        }

        let tryMove = String(difference[i])
        imMoves.push(tryMove)

        /* check win */
        isWinner = checkForWin (imMoves)
        winnerInOneStep.push(isWinner)
    }

    let flag = winnerInOneStep.some( (element) => {return element === true} ) 
    if (flag==true) {
        let bestMoveInd = winnerInOneStep.findIndex((element) => element == true);
        let bestMove = difference[bestMoveInd]
        return bestMove
    } else {
        let sosoMove = difference[Math.floor(Math.random()*difference.length)];
        return sosoMove
    }
}



/* SET PLAYERS and GAME MASTER */
let Player = function (name, mark) {
    let player = {}
    player.name = name
    player.mark = mark
    player.movesList = []
    player.moves = function (lastMove) {
        player.movesList.push(lastMove)
    }
    return player
}

/* Game master defines who moves next */
function gameMaster(players, whoPlays) {
    if (players[0].movesList.length == players[1].movesList.length & players[0].movesList.length == 0) {
        if (players[0].mark == 'X') {
            whoPlays = 0
        } else {
            whoPlays = 1;
            console.log('Plays: '+whoPlays)
        }
    } else { whoPlays = !whoPlays*1}
    return whoPlays;
}

/* if a player wins -> announce it */
function announceWinner (whoPlays, players) {
    let winnerAnn = document.querySelector("#winner");
    winnerAnn.textContent = '';
    let div = document.createElement('div');
    let playerName = players[whoPlays].name
    div.innerHTML = playerName+' WON!'
    document.getElementById('winner').appendChild(div); 

}

/* if there are no moves left -> announce tie */
function isItTie (players, whoPlays) {
    let AI = players[1]
    let User = players[0]
    let board = [...Array(boardSize**2).keys()]
    let allMoves = User.movesList.concat(AI.movesList)
    let difference = board.filter(x => !allMoves.includes(String(x)));
    if (difference.length == 0) {
        let div = document.createElement('div');
        let playerName = players[whoPlays].name
        div.innerHTML = 'tie!'
        document.getElementById('winner').appendChild(div);
        finishGame() 
    }
}

/* if a tie or win -> finish round -> offer next round */
function finishGame () {
    let cells = document.querySelectorAll('.cell');
    cells.forEach(element => {
    element.removeEventListener('click', nextMove)
    });
    let btn = document.createElement("button");
    btn.innerHTML = "Start New Game";
    btn.setAttribute('onclick', 'newGameStarts()')
    document.getElementById('winner').appendChild(btn);
}

/* SET UP a new round */
function newGameStarts () {
    let winnerAnn = document.querySelector("#winner");
    winnerAnn.textContent = 'Choose:';
    let div=document.createElement('div')
    div.setAttribute('class',"playersChoice")
    div.innerHTML =  '<button id="X">X</button> <button id="O">O</button>'
    document.getElementById('winner').appendChild(div);

    let cells = document.querySelector(".board");
    cells.textContent = '';
    cellID = 0
    setNewRound() 
}


/* MAIN FUNCTION that registers moves -> checks for win -> finishes game */
function nextMove (e) {
    let ID = e.target.id
    let div = document.createElement('div')
    document.getElementById(ID).removeEventListener('click', nextMove)
    
    /* find who playes */
    whoPlays = gameMaster(players, whoPlays)

    if (players[whoPlays].name == 'User') {
        /* save the move */
        mark = players[whoPlays].mark
        players[whoPlays].moves(ID)
        /* place the mark on the board*/
        div.innerHTML = mark
        document.getElementById(ID).appendChild(div);
        isItTie (players, whoPlays)
        /* check for win */
        isWinner = checkForWin (players[whoPlays].movesList)
        if (isWinner == true)
            {announceWinner (whoPlays, players)
            finishGame()}
        
        
        else {/* switch to AI */
        let roundResult = playAI(players, whoPlays)
        let aiWins = roundResult[0]
        whoPlays = roundResult[1]
        if (aiWins == true)
        {announceWinner (whoPlays, players)
        finishGame()}
        }
    } 

}


/* change game board on request: */
function addBoardCell (element, cellID) {
    let div = document.createElement('div');
    div.setAttribute('class', 'cell');
    div.setAttribute('id', cellID)
    document.querySelector('.board').appendChild(div);
}

function markCell (e) {
    let ID = e.target.id
    let div = document.createElement('div')
    mark = 'X' /*find player */
    div.innerHTML = mark
    document.getElementById(ID).appendChild(div);
}



/* INITIATE NEW GAME */
/* : initiates users, builds board, adds eventListeners */
function startNewGame (markUser, markComp) {
    /*initiate players */
    players = initUsers (markUser, markComp)

    /* build board */
    gameBoard.forEach(element => {  
    console.log(element)  
    addBoardCell(element, cellID)
    cellID += 1
    });

    /* add X or O by click */
    cells = document.querySelectorAll('.cell');
    cells.forEach(element => {
    element.addEventListener('click', nextMove)
    });

    return players
}

/* : initiate Users */
function initUsers (markUser, markComp) {
    let nameUser = 'User'
    let nameComp = 'AI'
    let userOne = Player(nameUser, markUser)
    let userTwo = Player(nameComp, markComp)
    let players = [userOne, userTwo]
    return players
}

/* START new round after choosing 'X' or 'O' for User */
function setNewRound () {
    document.getElementById("X").onclick = function(){
    
        let markUser = 'X'
        let markComp = 'O'
        let players = startNewGame(markUser, markComp)
        let element = document.querySelector('.playersChoice');
        element.parentNode.removeChild(element);
        let winnerAnn = document.querySelector("#winner");
        winnerAnn.textContent = '';
        return players
    };
    
    document.getElementById("O").onclick = function(){
        let markUser = 'O'
        let markComp = 'X'
        let players = startNewGame(markUser, markComp)
        let element = document.querySelector('.playersChoice');
        element.parentNode.removeChild(element);
        let roundResult = playAI(players, whoPlays)
        let aiWins = roundResult[0]
        whoPlays = roundResult[1]
        let winnerAnn = document.querySelector("#winner");
        winnerAnn.textContent = '';
        return players
    };
}

setNewRound()




