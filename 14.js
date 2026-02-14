
document.addEventListener('DOMContentLoaded', () => {

    createFallingHearts();


    setupMemoryLane();



    setupLoveStopwatch();


    setupLoveGame();
});

function createFallingHearts() {
    const container = document.getElementById('background-hearts');
    const heartCount = 50;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-bg');
        heart.innerHTML = '🤍';


        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 5 + 3 + 's';
        heart.style.fontSize = Math.random() * 30 + 20 + 'px';
        heart.style.animationDelay = Math.random() * 5 + 's';


        heart.style.opacity = Math.random() * 0.5 + 0.3;

        container.appendChild(heart);
    }
}

function setupMemoryLane() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const photo = document.getElementById('memory-photo');
    const caption = document.getElementById('photo-caption');
    const emptyState = document.getElementById('empty-state');


    const validMonths = {
        '2023': ['12'],
        '2024': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        '2025': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        '2026': ['01', '02'],
    };

    function updateMonthOptions() {
        const selectedYear = yearSelect.value;
        const selectedMonth = monthSelect.value;
        const options = monthSelect.options;

        if (!selectedYear) {

            monthSelect.disabled = true;
            return;
        }

        monthSelect.disabled = false;
        const allowed = validMonths[selectedYear] || [];

        for (let i = 0; i < options.length; i++) {
            const opt = options[i];
            if (opt.value === "") continue;

            if (allowed.includes(opt.value)) {
                opt.disabled = false;
                opt.hidden = false;
            } else {
                opt.disabled = true;
                opt.hidden = true;
            }
        }


        if (selectedMonth && !allowed.includes(selectedMonth)) {
            monthSelect.value = "";
        }

        updatePhoto();
    }

    function updatePhoto() {
        const month = monthSelect.value;
        const year = yearSelect.value;

        if (!month || !year) {

            emptyState.style.display = 'flex';
            photo.style.display = 'none';
            caption.style.display = 'none';
            return;
        }


        emptyState.style.display = 'none';
        photo.style.display = 'block';
        caption.style.display = 'block';

        const imagePath = `images/${year}-${month}.jpg`;
        const altText = `Foto de ${month}/${year}`;

        photo.src = imagePath;
        photo.alt = altText;
        caption.textContent = `Nuestros recuerdos de ${getMonthName(month)} ${year}`;

        photo.onerror = function () {

            this.src = `https://placehold.co/600x400/pink/white?text=Sube+foto+a+images/${year}-${month}.jpg`;
            caption.textContent = `Aún no has subido la foto para ${getMonthName(month)} ${year} 📸`;
        };
    }


    yearSelect.addEventListener('change', updateMonthOptions);
    monthSelect.addEventListener('change', updatePhoto);


    monthSelect.disabled = true;
    updatePhoto();
}

function getMonthName(monthNumber) {
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[parseInt(monthNumber, 10) - 1];
}

function setupLoveStopwatch() {
    const startDate = new Date('2023-12-01T00:00:00');
    const yearsEl = document.getElementById('years');
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date();

        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        let hours = now.getHours() - startDate.getHours();
        let minutes = now.getMinutes() - startDate.getMinutes();
        let seconds = now.getSeconds() - startDate.getSeconds();


        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {

            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }

        yearsEl.textContent = years;
        monthsEl.textContent = months;
        daysEl.textContent = days;
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}

function setupLoveGame() {
    const gameArea = document.getElementById('game-area');
    const player = document.getElementById('player');
    const scoreEl = document.getElementById('score');
    const loveMeterEl = document.getElementById('love-meter');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreEl = document.getElementById('final-score');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    let score = 0;
    let love = 100;
    let isPlaying = false;
    let animationId;
    let spawnInterval;
    let gameSpeed = 3;
    let spawnRate = 1000;


    function movePlayer(e) {
        if (!isPlaying) return;
        const rect = gameArea.getBoundingClientRect();
        let clientX = e.clientX;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
        }

        let x = clientX - rect.left;

        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;

        player.style.left = `${x}px`;
    }


    function startGame() {
        score = 0;
        love = 100;
        gameSpeed = 3;
        spawnRate = 1000;
        scoreEl.textContent = score;
        updateLoveMeter();


        document.querySelectorAll('.falling-heart').forEach(h => h.remove());

        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        isPlaying = true;

        spawnInterval = setInterval(spawnHeart, spawnRate);
        gameLoop();
    }

    function spawnHeart() {
        if (!isPlaying) return;
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.innerHTML = '🤍';
        heart.style.left = Math.random() * (gameArea.clientWidth - 30) + 'px';
        heart.style.top = '-40px';
        gameArea.appendChild(heart);


    }

    function gameLoop() {
        if (!isPlaying) return;


        love -= 0.05;
        if (love <= 0) {
            gameOver();
            return;
        }
        updateLoveMeter();


        const hearts = document.querySelectorAll('.falling-heart');
        const playerRect = player.getBoundingClientRect();

        hearts.forEach(heart => {
            let top = parseFloat(heart.style.top || -40);
            top += gameSpeed;
            heart.style.top = `${top}px`;

            const heartRect = heart.getBoundingClientRect();

            if (
                heartRect.bottom >= playerRect.top &&
                heartRect.top <= playerRect.bottom &&
                heartRect.right >= playerRect.left &&
                heartRect.left <= playerRect.right
            ) {

                score++;
                love = Math.min(love + 10, 100);
                scoreEl.textContent = score;
                createSparkle(heartRect.left, heartRect.top);
                heart.remove();

                if (score >= 10) {
                    gameWin();
                    return;
                }

                if (score % 5 === 0) {
                    gameSpeed += 0.2;
                }
            }

            else if (top > gameArea.clientHeight) {
                heart.remove();
                love -= 5;
                createSparkle(heartRect.left, heartRect.top, '💔');
            }
        });

        if (isPlaying) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    function updateLoveMeter() {
        loveMeterEl.style.width = `${Math.max(0, love)}%`;
        if (love > 50) loveMeterEl.style.background = 'linear-gradient(90deg, #ff4081, #e91e63)';
        else if (love > 20) loveMeterEl.style.background = 'linear-gradient(90deg, #ffc107, #ff9800)';
        else loveMeterEl.style.background = 'linear-gradient(90deg, #f44336, #d32f2f)';
    }

    function createSparkle(x, y, char = '✨') {
        const sparkle = document.createElement('div');
        sparkle.textContent = char;
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'floatUp 1s ease-out forwards';
        sparkle.style.zIndex = 100;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }

    function gameWin() {
        isPlaying = false;
        clearInterval(spawnInterval);
        cancelAnimationFrame(animationId);
        finalScoreEl.textContent = score;
        gameOverScreen.querySelector('h3').textContent = "¡Ganaste! 🤍";
        gameOverScreen.style.display = 'flex';
    }

    function gameOver() {
        isPlaying = false;
        clearInterval(spawnInterval);
        cancelAnimationFrame(animationId);
        finalScoreEl.textContent = score;
        gameOverScreen.querySelector('h3').textContent = "¡Fin del Juego!";
        gameOverScreen.style.display = 'flex';
    }


    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);


    gameArea.addEventListener('mousemove', movePlayer);
    gameArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
        movePlayer(e);
    }, { passive: false });
}
