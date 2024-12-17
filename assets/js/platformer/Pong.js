export default class PongMinigame {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.paddleWidth = 10;
        this.paddleHeight = 100;
        this.ballRadius = 10;

        this.playerPaddleY = (this.canvas.height - this.paddleHeight) / 2;
        this.aiPaddleY = (this.canvas.height - this.paddleHeight) / 2;
        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height / 2;
        this.ballSpeedX = 5;
        this.ballSpeedY = 5;

        this.isRunning = false;

        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const root = document.documentElement;
            const mouseY = event.clientY - rect.top - root.scrollTop;
            this.playerPaddleY = mouseY - this.paddleHeight / 2;
        });

        this.start();
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.moveEverything();
        this.drawEverything();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    moveEverything() {
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;

        if (this.ballY < 0 || this.ballY > this.canvas.height) {
            this.ballSpeedY = -this.ballSpeedY;
        }

        if (this.ballX < 0) {
            if (this.ballY > this.playerPaddleY && this.ballY < this.playerPaddleY + this.paddleHeight) {
                this.ballSpeedX = -this.ballSpeedX;
            } else {
                this.resetBall();
            }
        }

        if (this.ballX > this.canvas.width) {
            if (this.ballY > this.aiPaddleY && this.ballY < this.aiPaddleY + this.paddleHeight) {
                this.ballSpeedX = -this.ballSpeedX;
            } else {
                this.resetBall();
            }
        }

        this.aiPaddleY += (this.ballY - (this.aiPaddleY + this.paddleHeight / 2)) * 0.1;
    }

    resetBall() {
        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height / 2;
        this.ballSpeedX = -this.ballSpeedX;
    }

    drawEverything() {
        console.log("Drawing");
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = 'white';
        this.context.fillRect(0, this.playerPaddleY, this.paddleWidth, this.paddleHeight);
        this.context.fillRect(this.canvas.width - this.paddleWidth, this.aiPaddleY, this.paddleWidth, this.paddleHeight);

        this.context.beginPath();
        this.context.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2, true);
        this.context.fill();
    }
}