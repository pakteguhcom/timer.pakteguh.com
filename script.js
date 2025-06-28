document.addEventListener('DOMContentLoaded', () => {
    // Referensi ke elemen DOM
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const timerDisplay = document.querySelector('.timer-display');

    const hourInput = document.getElementById('hour-input');
    const minuteInput = document.getElementById('minute-input');
    const secondInput = document.getElementById('second-input');

    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    const alarmSound = document.getElementById('alarm-sound');
    const originalTitle = document.title;

    // Variabel state
    let countdownInterval;
    let totalSeconds = 0;
    let isPaused = false;
    let titleBlinkInterval;

    // --- FUNGSI UTAMA ---

    function startTimer() {
        if (isPaused) {
            resumeTimer();
            return;
        }

        const hours = parseInt(hourInput.value) || 0;
        const minutes = parseInt(minuteInput.value) || 0;
        const seconds = parseInt(secondInput.value) || 0;

        totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        if (totalSeconds <= 0) {
            alert("Please set a time greater than zero.");
            return;
        }

        startCountdown();
    }
    
    function startCountdown() {
        isPaused = false;
        toggleInputs(false); // Nonaktifkan input
        toggleControls(true); // Tampilkan tombol pause, sembunyikan start

        countdownInterval = setInterval(updateTimer, 1000);
    }

    function pauseTimer() {
        isPaused = true;
        clearInterval(countdownInterval);
        toggleControls(false); // Tampilkan tombol resume, sembunyikan pause
        startBtn.textContent = 'RESUME';
    }
    
    function resumeTimer() {
        startCountdown();
    }

    function resetTimer() {
        clearInterval(countdownInterval);
        clearInterval(titleBlinkInterval);
        
        isPaused = false;
        totalSeconds = 0;
        
        updateDisplay(0, 0, 0);
        toggleInputs(true); // Aktifkan kembali input
        clearInputs();
        
        toggleControls(false); // Kembali ke state awal
        startBtn.textContent = 'START';
        
        document.title = originalTitle;
        timerDisplay.classList.remove('times-up');
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    function updateTimer() {
        if (totalSeconds <= 0) {
            timerFinished();
            return;
        }

        totalSeconds--;
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        updateDisplay(hours, minutes, seconds);
    }
    
    function timerFinished() {
        clearInterval(countdownInterval);
        alarmSound.play();
        timerDisplay.classList.add('times-up');
        startBlinkingTitle();
    }

    // --- FUNGSI PEMBANTU (HELPERS) ---

    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    function updateDisplay(h, m, s) {
        hoursDisplay.textContent = formatTime(h);
        minutesDisplay.textContent = formatTime(m);
        secondsDisplay.textContent = formatTime(s);
    }

    function toggleInputs(enabled) {
        hourInput.disabled = !enabled;
        minuteInput.disabled = !enabled;
        secondInput.disabled = !enabled;
    }
    
    function clearInputs() {
        hourInput.value = '';
        minuteInput.value = '';
        secondInput.value = '';
    }

    function toggleControls(isRunning) {
        startBtn.classList.toggle('hidden', isRunning);
        pauseBtn.classList.toggle('hidden', !isRunning);
    }
    
    function startBlinkingTitle() {
        let isBlinking = false;
        titleBlinkInterval = setInterval(() => {
            document.title = isBlinking ? originalTitle : "Time's Up!";
            isBlinking = !isBlinking;
        }, 1000);
    }

    // Fungsi untuk membatasi nilai input
    function enforceMinMax(input, max) {
        if (parseInt(input.value) > max) {
            input.value = max;
        }
        if (parseInt(input.value) < 0) {
            input.value = 0;
        }
    }


    // --- EVENT LISTENERS ---

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Event listener untuk batasan input
    hourInput.addEventListener('input', () => enforceMinMax(hourInput, 99));
    minuteInput.addEventListener('input', () => enforceMinMax(minuteInput, 59));
    secondInput.addEventListener('input', () => enforceMinMax(secondInput, 59));
});
