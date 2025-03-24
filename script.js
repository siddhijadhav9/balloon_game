document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const pump = document.getElementById('pump');
    const pumpHandle = document.getElementById('pump-handle');
    const scoreDisplay = document.getElementById('score-display');
    const startButton = document.getElementById('start-button');
    
    let score = 0;
    let gameActive = false;
    let currentBalloon = null;
    let inflateInterval = null;
    let balloonSize = 0;
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 
        'Y', 'Z'];

    let colors = [
        '#FFD1DC', '#FFEBB7', '#C4F0C5', '#A7D7C5', '#C3B1E1', '#FFB3BA',
        '#FFDAC1', '#E2F0CB', '#B5EAD7', '#FFCBF2', '#BFD3C1', '#D9E4DD',
        '#EAD7D1', '#E6CCE3', '#C2E0F7', '#F6DFEB', '#E0C3FC', '#F9F3CC',
        '#C7CEEA', '#D5AAFF', '#FFC9DE', '#C8E7F0', '#D7F9F1', '#FEE4CF',
        '#F2C6DE', '#E8DFF5'
      ];
      
    
    // Create clouds
    createClouds();
    
    // Set up event listeners
    startButton.addEventListener('click', startGame);
    pump.addEventListener('mousedown', startInflating);
    pump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startInflating();
    });
    
    // Release events
    pump.addEventListener('mouseup', releasePump);
    pump.addEventListener('touchend', releasePump);
    document.addEventListener('mouseup', releasePump);
    document.addEventListener('touchend', releasePump);
    
    // Make sure game works on mobile
    document.addEventListener('touchmove', (e) => {
        if (gameActive) e.preventDefault();
    }, { passive: false });
    
    // Functions
    function createClouds() {
        for (let i = 0; i < 7; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            
            // Random position
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.top = `${Math.random() * 60}%`;
            
            // Random size
            const size = 50 + Math.random() * 100;
            cloud.style.width = `${size}px`;
            cloud.style.height = `${size / 2}px`;
            
            gameContainer.appendChild(cloud);
        }
    }
    
    function startGame() {
        startButton.style.display = 'none';
        gameActive = true;
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        createNewBalloon();
    }
    
    function createNewBalloon() {
        if (!gameActive) return;
        
        // Create a new balloon
        currentBalloon = document.createElement('div');
        currentBalloon.classList.add('balloon');
        
        // Select random color and letter
        const randomIndex = Math.floor(Math.random() * 27);
        const letter = letters[randomIndex];
        const color = colors[randomIndex];
        
        currentBalloon.textContent = letter;
        currentBalloon.style.backgroundColor = color;
        currentBalloon.style.width = '10px';
        currentBalloon.style.height = '10px';
        balloonSize = 10;
        
        // Add event listener for popping
        currentBalloon.addEventListener('click', popBalloon);
        
        gameContainer.appendChild(currentBalloon);
    }
    
    function startInflating() {
        if (!gameActive) return;
        pumpHandle.style.top = '0px';
        
        if (currentBalloon) {
            inflateInterval = setInterval(inflateBalloon, 100);
        }
    }
    
    function inflateBalloon() {
        if (!currentBalloon || !gameActive) return;
        
        balloonSize += 5;
        currentBalloon.style.width = `${balloonSize}px`;
        currentBalloon.style.height = `${Math.floor(balloonSize * 1.3)}px`;
        
        // If balloon is fully inflated
        if (balloonSize >= 80) {
            clearInterval(inflateInterval);
            
            // Float animation
            currentBalloon.style.animation = 'float 2s infinite ease-in-out, wobble 3s infinite ease-in-out';
            releaseBalloon();
        }
    }
    
    function releaseBalloon() {
        if (!currentBalloon || !gameActive) return;
        
        // Randomize initial position and movement
        let posX = Math.random() * (window.innerWidth - 100);
        let posY = 200;
        let speedX = (Math.random() - 0.5) * 4;
        let speedY = Math.random() * 2 + 5; // Upward movement
        let gravity = 0.1; // Simulating gravity
        
        function animateBalloon() {
            if (!currentBalloon || !gameActive) return;
            
            // Update position
            posX += speedX;
            posY += speedY;
            
            // Apply gravity (slowing down upward movement)
            speedY -= gravity;
            
            // Bounce off walls horizontally
            if (posX <= 0 || posX >= window.innerWidth - 80) {
                speedX = -speedX;
            }
            
            // Check if balloon goes off screen (top or bottom)
            if (posY < -150 || posY > window.innerHeight) {
                gameContainer.removeChild(currentBalloon);
                currentBalloon = null;
                createNewBalloon();
                return;
            }
            
            // Update balloon position
            currentBalloon.style.left = `${posX}px`;
            currentBalloon.style.bottom = `${posY}px`;
            
            requestAnimationFrame(animateBalloon);
        }
        
        requestAnimationFrame(animateBalloon);
    }
    
    function popBalloon(e) {
        if (!currentBalloon || !gameActive) return;
        
        // Only pop if inflated enough
        if (balloonSize < 60) return;
        
        // Create pop effect
        const popEffect = document.createElement('div');
        popEffect.classList.add('pop-effect');
        popEffect.textContent = 'POP!';
        popEffect.style.left = `${e.clientX - 50}px`;
        popEffect.style.top = `${e.clientY - 50}px`;
        gameContainer.appendChild(popEffect);
        
        // Remove pop effect after animation
        setTimeout(() => {
            gameContainer.removeChild(popEffect);
        }, 500);
        
        // Remove balloon
        gameContainer.removeChild(currentBalloon);
        currentBalloon = null;
        
        // Increase score
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        
        // Create new balloon
        setTimeout(createNewBalloon, 500);
    }
    
    function releasePump() {
        pumpHandle.style.top = '-40px';
        clearInterval(inflateInterval);
    }
});