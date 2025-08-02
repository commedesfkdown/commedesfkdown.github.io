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
    
    // Переменная для таймера скрытия оповещения
    let volumeAlertTimeout = null;
    
    // Установка громкости по умолчанию (5%)
    audio.volume = 0.05;
    
    // Функция для отображения оповещения о громкости
    function showVolumeAlert(volume) {
        // Очищаем предыдущий таймер
        if (volumeAlertTimeout) {
            clearTimeout(volumeAlertTimeout);
        }
        
        // Обновляем текст оповещения
        volumeAlert.textContent = `Громкость: ${Math.round(volume * 100)}%`;
        
        // Показываем оповещение с анимацией
        volumeAlert.classList.remove('show');
        void volumeAlert.offsetWidth; // Сбрасываем анимацию
        volumeAlert.classList.add('show');
        
        // Устанавливаем таймер для скрытия через 3 секунды
        volumeAlertTimeout = setTimeout(() => {
            volumeAlert.classList.remove('show');
        }, 3000);
    }
    
    // Регулировка громкости
    volumeSlider.addEventListener('input', function() {
        const volumeValue = parseFloat(this.value);
        audio.volume = volumeValue;
        
        // Показываем оповещение о новой громкости
        showVolumeAlert(volumeValue);
    });
    
    // Обработчик клика по заставке
    splashScreen.addEventListener('click', async function() {
        try {
            // Добавляем анимацию исчезновения заставки
            splashScreen.style.animation = 'fadeOut 0.8s ease forwards';
            
            // Показать затемнение
            overlay.style.display = 'block';
            
            // Запуск видео (с muted для обхода ограничений)
            video.muted = true;
            video.style.display = 'block';
            
            // Попытка воспроизведения видео
            try {
                await video.play();
            } catch (e) {
                console.warn("Не удалось воспроизвести видео:", e);
            }
            
            // Удаление заставки после анимации
            setTimeout(() => {
                splashScreen.style.display = 'none';
                
                // Анимация появления карточки и контрола громкости
                glassCard.classList.add('animate-in');
                volumeControl.classList.add('animate-in');
                
                // Анимация внутренних элементов карточки
                setTimeout(() => {
                    avatar.classList.add('animate-in');
                    username.classList.add('animate-in');
                    tagline.classList.add('animate-in');
                    socials.classList.add('animate-in');
                }, 300);
                
                // Попытка воспроизведения аудио после клика
                audio.play().then(() => {
                    // Показываем оповещение с текущей громкостью
                    showVolumeAlert(audio.volume);
                }).catch(audioError => {
                    console.error("Ошибка воспроизведения аудио:", audioError);
                    
                    // Показываем инструкцию для пользователя
                    errorMessage.textContent = "Нажмите здесь, чтобы включить звук";
                    errorMessage.style.display = "block";
                    
                    // Разрешаем звук при клике на сообщение
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
    
    // Предзагрузка медиафайлов
    window.addEventListener('load', function() {
        video.load();
        audio.load();
    });
});