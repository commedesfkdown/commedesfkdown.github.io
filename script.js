document.addEventListener('DOMContentLoaded', () => {
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
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                volumeControl.style.display = 'none';
            }
            function showVolumeAlert(volume) {
                if (isMobile) return; 
                clearTimeout(volumeAlertTimeout);
                volumeAlert.textContent = `Громкость: ${Math.round(volume * 100)}%`;
                volumeAlert.classList.remove('show');
                void volumeAlert.offsetWidth;
                volumeAlert.classList.add('show');
                volumeAlertTimeout = setTimeout(() => volumeAlert.classList.remove('show'), 3000);
            }
            if (!isMobile) {
                volumeSlider.addEventListener('input', () => {
                    const volumeValue = parseFloat(volumeSlider.value);
                    audio.volume = volumeValue;
                    showVolumeAlert(volumeValue);
                });
            }
            splashScreen.addEventListener('click', async () => {
                try {
                    splashScreen.classList.add('fade-out');
                    overlay.style.display = 'block';
                    video.style.display = 'block';
                    try {
                        await video.play();
                    } catch (e) {
                        console.warn("Video playback error:", e);
                    }
                    setTimeout(() => {
                        splashScreen.style.display = 'none';
                        const elementsToAnimate = isMobile 
                            ? [glassCard, prodLabel] 
                            : [glassCard, volumeControl, prodLabel];  
                        elementsToAnimate.forEach(el => el.classList.add('animate-in'));
                        setTimeout(() => {
                            [avatar, username, tagline, socials].forEach(el => el.classList.add('animate-in'));
                        }, 300);
                        audio.play().catch(audioError => {
                            console.error("Audio error:", audioError);
                            errorMessage.textContent = "Нажмите здесь, чтобы включить звук";
                            errorMessage.style.display = "block";
                            errorMessage.addEventListener('click', async () => {
                                try {
                                    await audio.play();
                                    errorMessage.style.display = "none";
                                } catch {
                                    errorMessage.textContent = "Разрешите звук в настройках браузера";
                                }
                            });
                        });
                    }, 500);
                } catch (error) {
                    console.error("Initialization error:", error);
                    errorMessage.textContent = "Ошибка загрузки, попробуйте перезагрузить страницу";
                    errorMessage.style.display = "block";
                }
            });
        });