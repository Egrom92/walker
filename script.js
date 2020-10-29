const collection = new Map;
const rows = document.querySelectorAll('tr');
const cells = document.querySelectorAll('td');

const btns = document.querySelectorAll('button');

rows.forEach((tr, y) => {
    const cells = tr.querySelectorAll('td');

    cells.forEach((td, x) => {
        if (td.classList.contains('cell')) {
            collection.set(`${y} - ${x}`, {
                y,
                x,
                player: false,
                field: true,
                td
            })
        }
        if (td.classList.contains('wall')) {
            collection.get(`${y} - ${x}`).field = false;
        }
        if (td.classList.contains('player')) {
            collection.get(`${y} - ${x}`).player = true;
        }
    })
});


btns.forEach( btn => {
    btn.addEventListener('click', () =>{
        const btnInner = btn.textContent;
        playerDirection('Up', null, -1, btnInner);
        playerDirection('Down', null, 1, btnInner);
        playerDirection('Left', -1, null, btnInner);
        playerDirection('Right', 1, null, btnInner);
    })
});

document.addEventListener('keydown', function(event) {
    const activeKey = event.code.replace('Arrow', '');
    keyboardArrowsControl(activeKey, 'Up', null, -1);
    keyboardArrowsControl(activeKey, 'Down', null, 1);
    keyboardArrowsControl(activeKey, 'Left', -1, null);
    keyboardArrowsControl(activeKey, 'Right', 1, null)
});

function keyboardArrowsControl(activeKey, direction, ox, oy) {
    btns.forEach(btn => {
        if (activeKey === direction && !btn.disabled && btn.textContent === direction) {
            playerDirection(direction, ox, oy, direction)
        }
    })
}

function playerDirection(direction, ox, oy, btnInner){
    if (btnInner !== direction) {
        return;
    }

    let cellWithPlayerX = getActiveCell().x + ox;
    let cellWithPlayerY = getActiveCell().y + oy;

    getActiveCell().player = false;
    let whereGoingPlayer = cellChange(cellWithPlayerX, cellWithPlayerY);
    btns.forEach(btn =>{btn.disabled = false;});
    btnState();
    playerMove(whereGoingPlayer);
}

function getActiveCell() {
    let activeValue = null;
    collection.forEach(value => {
        if (value.player) {
            activeValue = value;
        }
    });
    return activeValue;
}

function btnState() {
    checkForWall('Up', null, -1);
    checkForWall('Down', null, 1);
    checkForWall('Left', -1, null);
    checkForWall('Right', 1, null);
}
btnState();

function checkForWall(direction, ox, oy) {
    let playerDirectionX = getActiveCell().x + ox;
    let playerDirectionY = getActiveCell().y + oy;
    collection.forEach(value => {
        if (!value.field && playerDirectionX === value.x && playerDirectionY === value.y) {
            doBtnDisabled(direction)
        }
        if (!collection.get(`${playerDirectionY} - ${playerDirectionX}`)) {
            doBtnDisabled(direction)
        }

    })
}

function doBtnDisabled(direction) {
    btns.forEach(btn =>{
        if (btn.textContent === direction) {
            btn.disabled = true;
        }
    })
}

function cellChange(ox, oy) {
    let newCell = null;
    collection.forEach(newValue => {
        if (newValue.x === ox && newValue.y === oy) {
            newValue.player = true;
            newCell = newValue.td;
        }
    });
    return newCell;
}

function playerMove(cell) {
    cells.forEach(cell => {
        cell.classList.remove('player')
    });
    cell.classList.add('player')
}


