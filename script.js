document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const video = document.getElementById('video-bg');
    const overlay = document.querySelector('.overlay');
    const audio = document.getElementById('background-music');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeAlert = document.getElementById('volume-alert');
    const glassCard = document.querySelector('.glass-card');
    const avatar = document.querySelector('.avatar');
    const username = document.querySelector('.username');
    const tagline = document.querySelector('.tagline');
    const socials = document.querySelector('.socials');
    const volumeControl = document.querySelector('.volume-control');
    const errorMessage = document.getElementById('error-message');
    const prodLabel = document.querySelector('.prod-label');
    
    let volumeAlertTimeout = null;
    audio.volume = 0.05;
    
    function showVolumeAlert(volume) {
        if (volumeAlertTimeout) {
            clearTimeout(volumeAlertTimeout);
        }
        
        volumeAlert.textContent = `Громкость: ${Math.round(volume * 100)}%`;
        volumeAlert.classList.remove('show');
        void volumeAlert.offsetWidth;
        volumeAlert.classList.add('show');
        
        volumeAlertTimeout = setTimeout(() => {
            volumeAlert.classList.remove('show');
        }, 3000);
    }
    
    volumeSlider.addEventListener('input', function() {
        const volumeValue = parseFloat(this.value);
        audio.volume = volumeValue;
        showVolumeAlert(volumeValue);
    });
    
    splashScreen.addEventListener('click', async function() {
        try {
            splashScreen.style.animation = 'fadeOut 0.8s ease forwards';
            overlay.style.display = 'block';
            video.muted = true;
            video.style.display = 'block';
            
            try {
                await video.play();
            } catch (e) {
                console.warn("Не удалось воспроизвести видео:", e);
            }
            
            setTimeout(() => {
                splashScreen.style.display = 'none';
                
                // Анимация появления всех элементов
                glassCard.classList.add('animate-in');
                volumeControl.classList.add('animate-in');
                prodLabel.classList.add('animate-in');
                
                setTimeout(() => {
                    avatar.classList.add('animate-in');
                    username.classList.add('animate-in');
                    tagline.classList.add('animate-in');
                    socials.classList.add('animate-in');
                }, 300);
                
                // Через 3 секунды скрываем prod-label с анимацией
                setTimeout(() => {
                    prodLabel.classList.add('fade-out');
                    // После завершения анимации скрываем элемент
                    prodLabel.addEventListener('animationend', () => {
                        prodLabel.style.display = 'none';
                    }, { once: true });
                }, 3000);
                
                audio.play().then(() => {
                    showVolumeAlert(audio.volume);
                }).catch(audioError => {
                    console.error("Ошибка воспроизведения аудио:", audioError);
                    
                    errorMessage.textContent = "Нажмите здесь, чтобы включить звук";
                    errorMessage.style.display = "block";
                    
                    errorMessage.addEventListener('click', async function() {
                        try {
                            await audio.play();
                            errorMessage.style.display = "none";
                        } catch (finalError) {
                            errorMessage.textContent = "Разрешите звук в настройках браузера";
                        }
                    });
                });
            }, 500);
        } catch (error) {
            console.error("Общая ошибка инициализации:", error);
            errorMessage.textContent = "Ошибка загрузки, попробуйте перезагрузить страницу";
            errorMessage.style.display = "block";
        }
    });
    
    window.addEventListener('load', function() {
        video.load();
        audio.load();
    });
});