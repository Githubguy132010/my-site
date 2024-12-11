document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.querySelector('.main');
    
    const MINIMUM_LOAD_TIME = 1000; // 1 second in milliseconds
    const startTime = Date.now();
    
    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(MINIMUM_LOAD_TIME - elapsedTime, 0);
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mainContent.classList.add('visible');
        }, remainingTime);
    });
});