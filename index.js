square1 = document.getElementById("square-1")
p1 = document.getElementById("player-1")

square2 = document.getElementById("square-2")
p2 = document.getElementById("player-2")

removeButton1 = document.getElementById('remove-point-btn-1')
removeButton2 = document.getElementById('remove-point-btn-2')


serve = document.getElementById('serve')
winner = undefined

function initData() {
    winner = undefined
    for (let p of [p1, p2]) {
        p.score = 0
        p.adv = false
    }
    if (!p1.serving && p2.serving) {
        switchServe()
    }
    p1.serving = true
}



function getOtherPlayer(p) {
    if (p === p1) {
        return p2
    }
    return p1
}


function switchServe() {
    p1.serving = !p1.serving;
    p2.serving = !p2.serving;
    serve.parentNode.removeChild(serve);
    [p1, p2].find(p => p.serving)
        .parentNode
        .appendChild(serve);
}

function switchSides() {
    slot1 = document.getElementById('slot-1')
    slot2 = document.getElementById('slot-2')
    slot1.style.float = slot1.style.float === 'right' ? 'left' : 'right'
    slot2.style.float = slot2.style.float === 'left' ? 'right' : 'left' // invertiti cosi funziona anche in caso di float undefined
}

function updateRemoveButtons() {
    if (winner === p2 || p2.adv || p1.score === 0) {
        removeButton1.disabled = true
    } else {
        removeButton1.disabled = undefined
    }
    if (winner === p1 || p1.adv || p2.score === 0) {
        removeButton2.disabled = true
    } else {
        removeButton2.disabled = undefined
    }
}

function updateView() {
    serve.style.display = 'block'
    if (winner) {
        serve.style.display = 'none'
        winner.innerText = 'W'
        getOtherPlayer(winner).innerText = 'L'
    } else if (p = ([p1, p2].find(pl => pl.adv))) { // Bad style ma comodo...
        p.innerText = 'A'
        getOtherPlayer(p).innerText = '-'
    } else {
        p1.innerText = p1.score
        p2.innerText = p2.score
    }
    updateRemoveButtons()
}


function assignPoint(p) {
    other = getOtherPlayer(p)
    if (winner) {
        return
    }
    if (p.adv === true || (p.score === 20 && getOtherPlayer(p).score < 20)) { // vittoria
        p.score = 21
        winner = p
        p.adv = false
    } else if (p.score === 20) { // vantaggi
        if (other.adv) {
            other.adv = false
        } else {
            p.adv = true
        }
        switchServe()
    } else {
        p.score++
        if ((p1.score + p2.score) % 5 === 0) {
            switchServe()
        }
    }
    updateView()
}

function removePoint(p) {
    other = getOtherPlayer(p)
    if (other.adv || winner === other) { // Questi due casi sono proibiti
        return
    }
    sum = p1.score + p2.score
    if (sum > 0 && sum % 5 === 0) {
        switchServe()
    }
    if (winner === p) {
        p.score = 20
        if (other.score === 20) {
            p.adv = true
        }
        winner = undefined
    } else if (p.adv) {
        p.adv = false
    } else {
        p.score = Math.max(0, p.score - 1)
    }
    updateView()
}

function reset() {
    initData()
    updateView()
}

square1.onclick = () => assignPoint(p1)
square2.onclick = () => assignPoint(p2)

removeButton1.onclick = () => {
    removePoint(p1)
}
removeButton2.onclick = () => {
    removePoint(p2)
}
document.getElementById('swap-sides-btn').onclick = switchSides;
document.getElementById('swap-serve-btn').onclick = switchServe;
document.getElementById('reset-btn').onclick = reset;
for (elem of document.getElementsByClassName('player-name')) {
    elem.onclick = (event) => {
        event.stopImmediatePropagation()
    }
}

window.addEventListener("keydown", function (event) {
    if (event.key === 'ArrowLeft') {
        assignPoint(p1)
    } else if (event.key === 'ArrowRight') {
        assignPoint(p2)
    }
}, true);

initData()
updateView()