const gameDisplay = document.querySelector('.gameDisplay')
const gameMenu = document.querySelector('.gameMenu')
const play = document.querySelector('#play')
const players = document.querySelector('#player')
const highScore = document.querySelector('#highScore')
const scoreBord = document.querySelector('.scoreBord')

const gameArea = document.querySelector('.gameArea')

const soundBtn = document.querySelector('.soundBtn')

let player = {
    ready: false,
    speed: 2,
    gravity: 3,
    fly: 60,
    wallGap: 200,
    score: 0
}

play.addEventListener("click", startGame)

document.addEventListener('keydown', birdFly)
document.addEventListener('touchstart', birdFly)

function random_Num(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function startGame() {

    player.ready = true

    gameMenu.classList.add('hide')
    gameArea.classList.remove('hide')

    const bird = document.createElement('div')
    bird.classList.add('bird')
    gameArea.appendChild(bird)
    player.y = bird.offsetTop



    // down wall 
    createDownWall()

    // cloud
    createCloud()

    requestAnimationFrame(gamePlay)
}

function birdFly(e) {

    let bird = document.querySelector('.bird')

    if ((e.keyCode === 32 || e.keyCode === 38 || e.bubbles) && player.ready && player.y >= 0) {
        player.y -= player.fly

        bird.style.top = player.y + 'px'
        bird.style.transform = 'rotate(-20deg)'
    }
}

const gravity = function () {

    let bird = document.querySelector('.bird')
    let floor = gameDisplay.getBoundingClientRect()

    if (player.y <= 545) {
        player.y += player.gravity
        bird.style.top = player.y + 'px'

        if(player.y >= 300) bird.style.transform = 'rotate(20deg)'
        
    }else gameOver()

}

function createCloud() {

    for (x = 0; x < 7; x++) {

        const cloud = document.createElement('div')
        cloud.setAttribute('class', 'cloud')

        cloud.x = random_Num(200, 1000) * -1
        cloud.y = random_Num(20, 150)

        cloud.style.top = cloud.y + 'px'
        cloud.style.right = cloud.x + 'px'

        gameArea.appendChild(cloud)
    }
}

function moveCloud() {

    const allCloud = document.querySelectorAll('.cloud')
    let cloud_y = random_Num(20, 150)

    allCloud.forEach(function (item) {

        item.x += (player.speed - 1.5)
        item.style.right = item.x + 'px'

        if (item.x >= 800) {

            item.x = random_Num(200, 1000) * -1

            item.style.top = cloud_y + 'px'

        }
    })
}

function createDownWall() {


    for (x = 0; x < 4; x++) {
        const downWall = document.createElement('div')
        const upWall = document.createElement('div')

        downWall.setAttribute('class', 'downWall')
        upWall.setAttribute('class', 'upWall')


        let down_Wall_Y = random_Num(300, 500)
        let up_wall_Y = ((600 - down_Wall_Y) + player.wallGap) * -1

        downWall.x = ((x + 1) * 300) * -1
        upWall.x = ((x + 1) * 300) * -1

        downWall.style.top = down_Wall_Y + 'px'
        upWall.style.top = up_wall_Y + 'px'
        downWall.style.right = downWall.x + 'px'
        upWall.style.right = upWall.x + 'px'

        gameArea.appendChild(downWall)
        gameArea.appendChild(upWall)

    }
}

function moveWall(bird) {
    const allDownWall = document.querySelectorAll('.downWall')
    let down_Wall_Y = random_Num(300, 500)

    allDownWall.forEach(function (item) {

        if( hitDownWall(bird,item) ) {

            gameOver()
        }

        item.x += player.speed
        item.style.right = item.x + 'px'

        if (item.x >= 800) {

            item.x = -400

            item.style.top = down_Wall_Y + 'px'

        }

        if (item.x == 400 ) {
            ++player.score
        }
    })

    const allUpWall = document.querySelectorAll('.upWall')

    allUpWall.forEach(function (item) {

        if( hitUpWall(bird, item) ) {

            gameOver()
        }

        item.x += player.speed
        item.style.right = item.x + 'px'

        if (item.x >= 800) {
            item.x = -400

            let up_wall_Y = ((600 - down_Wall_Y) + player.wallGap) * -1
            item.style.top = up_wall_Y + 'px'

        }
    })
}

function hitDownWall(bird, downWall) {

    let hero = bird.getBoundingClientRect()
    let enemy = downWall.getBoundingClientRect()

    return !(
        (hero.bottom-10 <= enemy.top) || (hero.right-10 <= enemy.left) || (hero.left+10 >= enemy.right)
    )

}

function hitUpWall(bird, upWall) {

    let hero = bird.getBoundingClientRect()
    let enemy = upWall.getBoundingClientRect()

    return !(
        (hero.top+10 >= enemy.bottom) || (hero.right-10 <= enemy.left) || (hero.left+10 >= enemy.right)
    )

}

function gamePlay() {

    let bird = document.querySelector('.bird')
    
    if (player.ready) {

        gravity()
        moveWall(bird)
        moveCloud()

        requestAnimationFrame(gamePlay)
    }
    
}


function gameOver() {

    player.ready = false

    console.log("GAME OVER");
 
    setTimeout(()=> {
        gameArea.innerHTML = ''
    gameMenu.classList.remove('hide')
    gameArea.classList.add('hide')
    player.score = 0
    }, 3000)
    
}