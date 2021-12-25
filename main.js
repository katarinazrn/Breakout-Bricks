let canvas = document.getElementById('canvas');

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

let ctx = canvas.getContext('2d');

let colors = ['pink', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'lightblue'];

const rows = 8;
let cols = 10;

if(canvas.height>canvas.width){
    cols=6;
}

const total = rows * cols;
let score = 0;

let gameStarted = false;

let BB = canvas.getBoundingClientRect();
let offsetX = BB.left;
let offsetY = BB.top;

const brick = {
    w: canvas.width / cols,
    h: 20
}

let bricks = [];
let log;
let ball;

const init = () => {
    gameStarted = false;

    for (let i = 0; i < rows; i++) {
        bricks[i] = new Array(cols);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            bricks[i][j] = {
                finished: false,
                x: j * brick.w,
                y: i * brick.h
            };
        }
    }

    log = {
        color: 'cornflowerblue',
        w: canvas.width / 6,
        h: 10,
        x: canvas.width / 2 - (canvas.width / 6) / 2,
        y: canvas.height - 30
    }

    ball = {
        color: 'white',
        r: 10,
        x: canvas.width / 2,
        y: canvas.height - 40,
        dx: -5,
        dy: -5
    }

}
init();

const draw = () => {
    drawLog();
    drawBricks();
    drawBall();
}

const drawBricks = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!bricks[i][j].finished) {
                ctx.fillStyle = colors[i];
                ctx.fillRect(j * brick.w, i * brick.h, brick.w - 2, brick.h - 2);
            }
        }
    }
}

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
    ctx.fillStyle = 'white';
    ctx.fill();
}

const drawLog = () => {
    ctx.fillStyle = 'cornflowerblue';
    ctx.fillRect(log.x, log.y, log.w, log.h);
}

const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const update = () => {

    clear();

    draw();

    moveBall();

    requestAnimationFrame(update);
}

const moveBall = () => {
    if (!gameStarted) {
        ball.x = log.x + log.w / 2;
    } else {
        ball.y += ball.dx;
        ball.x += ball.dy;
        cB();
        cL();
        cW();
    }
}

const cW = () => {
    if (ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) {
        ball.dy = (-1) * ball.dy;
    }
    if (ball.y - ball.r <= 0) {
        ball.dx = (-1) * ball.dx;
    }
    if (ball.y + ball.r >= canvas.height) {
        init();
    }
}

const cL = () => {
    if ((ball.y + ball.r >= log.y) &&
        (ball.x <= log.x + log.w) &&
        (ball.x >= log.x)) {
        ball.dx = (-1) * ball.dx;
    }
}

const cB = () => {
    /////////////////nezavrseno
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!bricks[i][j].finished) {
                if ((ball.x < bricks[i][j].x + brick.w - 2) && (ball.x > bricks[i][j].x)) {
                    if (ball.y + ball.r <= bricks[i][j].y + brick.h - 2 && ball.y + ball.r >= bricks[i][j].y) {
                        bricks[i][j].finished = true;
                        ball.dx = (-1) * ball.dx;
                        score++;
                    }
                    else if (ball.y - ball.r >= bricks[i][j].y && ball.y - ball.r <= bricks[i][j].y + brick.h - 2) {
                        bricks[i][j].finished = true;
                        ball.dx = (-1) * ball.dx;
                        score++;
                    }
                }
                else if ((ball.y < bricks[i][j].y + brick.h - 2) && (ball.y > bricks[i][j].y)) {
                    if (ball.x + ball.r <= bricks[i][j].x + brick.w - 2 && ball.x + ball.r >= bricks[i][j].x) {
                        bricks[i][j].finished = true;
                        ball.dy = (-1) * ball.dy;
                        score++;
                    }
                    else if (ball.x - ball.r >= bricks[i][j].x && ball.x - ball.r <= bricks[i][j].x + brick.w - 2) {
                        bricks[i][j].finished = true;
                        ball.dy = (-1) * ball.dy;
                        score++;
                    }
                }
                else if ((distance(ball.x, ball.y, bricks[i][j].x, bricks[i][j].y) <= ball.r) ||
                    (distance(ball.x, ball.y, bricks[i][j].x + brick.w - 2, bricks[i][j].y) <= ball.r) ||
                    (distance(ball.x, ball.y, bricks[i][j].x, bricks[i][j].y + brick.h - 2) <= ball.r) ||
                    (distance(ball.x, ball.y, bricks[i][j].x + brick.w - 2, bricks[i][j].y + brick.h - 2) <= ball.r)) {
                    bricks[i][j].finished = true;
                    ball.dx = (-1) * ball.dx;
                    ball.dy = (-1) * ball.dy;
                    score++;
                }
            }
        }
    }

    if (score == total) {
        init();
    }
}

const distance = (x1, y1, x2, y2) => (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));

const detectWalls = () => {
    if (log.x < 0) {
        log.x = 0;
    }
    if (log.x + log.w > canvas.width) {
        log.x = canvas.width - log.w;
    }
}

canvas.addEventListener('mousemove', (e) => {
    log.x = (e.clientX - offsetX) - log.w / 2;
    detectWalls();
});

document.addEventListener('click', () => {
    gameStarted = true;
});

update();
