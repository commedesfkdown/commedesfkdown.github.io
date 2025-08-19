document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.querySelector('.particles-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const particles = [];
    const particleCount = 70;
    const connectionDistance = 150;
    const particleSize = 1.5;
    let mouseX = 0;
    let mouseY = 0;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: particleSize,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: 0.1 + Math.random() * 0.2
        });
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                particle.x -= dx * 0.002;
                particle.y -= dy * 0.002;
            }
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();
            
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.05})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    const openBtn = document.getElementById('openSelectionPanel');
    const panelText = document.getElementById('panelToggleText');
    const closeBtn = document.getElementById('closeSelectionPanel');
    const panel = document.getElementById('selectionPanel');
    const list = document.getElementById('selectionList');
    const search = document.getElementById('searchApps');
    const countEl = document.getElementById('selectedCount');
    const clearBtn = document.getElementById('clearSelection');
    const downloadBtn = document.getElementById('downloadSelected');
    
    let selected = JSON.parse(localStorage.getItem('selectedApps')) || [];
    let apps = [];
    let panelOpen = false;
    let searchTerm = '';
    
    function saveSelection() {
        localStorage.setItem('selectedApps', JSON.stringify(selected));
    }
    
    function loadApps() {
        apps = appsData.map(app => ({...app}));
        renderList(apps);
        updateCount();
    }
    
    function renderList(appsList) {
        list.innerHTML = '';
        
        if (appsList.length === 0) {
            list.innerHTML = `
                <div style="text-align: center; padding: 12px 8px; color: #777; font-size: 11px;">
                    <i class="fas fa-search" style="font-size: 18px; margin-bottom: 6px; opacity: 0.5;"></i>
                    <p>Приложения не найдены</p>
                </div>
            `;
            return;
        }
        
        const categories = {};
        appsList.forEach(app => {
            if (!categories[app.category]) {
                categories[app.category] = [];
            }
            categories[app.category].push(app);
        });
        
        const sortedCategories = Object.keys(categories).sort();
        
        sortedCategories.forEach(category => {
            const header = document.createElement('div');
            header.className = 'category-header';
            header.textContent = category;
            list.appendChild(header);
            
            categories[category].forEach(app => {
                const appEl = document.createElement('div');
                appEl.className = 'app-item';
                appEl.setAttribute('data-app', app.id);
                appEl.setAttribute('data-category', app.category);
                
                if (selected.includes(app.id)) {
                    appEl.classList.add('selected');
                }
                
                appEl.innerHTML = `
                    <div class="app-icon">
                        <i class="fas ${app.icon}"></i>
                    </div>
                    <div class="app-details">
                        <div class="app-name">${app.name}</div>
                        <div class="app-size">${app.size}</div>
                    </div>
                    <i class="fas fa-check check-icon"></i>
                `;
                
                list.appendChild(appEl);
            });
        });
        
        document.querySelectorAll('.app-item').forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.getAttribute('data-app');
                
                if (selected.includes(appId)) {
                    selected = selected.filter(id => id !== appId);
                    item.classList.remove('selected');
                } else {
                    selected.push(appId);
                    item.classList.add('selected');
                    
                    item.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 150);
                }
                
                updateCount();
                saveSelection();
            });
        });
    }
    
    function updateCount() {
        countEl.textContent = selected.length;
    }
    
    function filterApps(term) {
        searchTerm = term.toLowerCase().trim();
        
        if (!searchTerm) {
            renderList(apps);
            return;
        }
        
        const filtered = apps.filter(app => 
            app.name.toLowerCase().includes(searchTerm) || 
            app.size.toLowerCase().includes(searchTerm) ||
            app.category.toLowerCase().includes(searchTerm)
        );
        
        renderList(filtered);
    }
    
    function openPanel() {
        if (panelOpen) return;
        
        panelOpen = true;
        panel.classList.add('active');
        panelText.textContent = "Закрыть выбор";
        filterApps(searchTerm);
    }
    
    function closePanel() {
        if (!panelOpen) return;
        
        panelOpen = false;
        panel.classList.remove('active');
        panelText.textContent = "Выбрать приложения";
    }
    
    openBtn.addEventListener('click', () => {
        if (panelOpen) {
            closePanel();
        } else {
            openPanel();
        }
    });
    
    closeBtn.addEventListener('click', closePanel);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panelOpen) {
            closePanel();
        }
    });
    
    search.addEventListener('input', (e) => {
        filterApps(e.target.value);
    });
    
    clearBtn.addEventListener('click', () => {
        selected = [];
        updateCount();
        saveSelection();
        renderList(apps);
    });
    
    downloadBtn.addEventListener('click', () => {
        if (selected.length === 0) {
            downloadBtn.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                downloadBtn.style.animation = '';
            }, 500);
            return;
        }
        
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Скачивание...';
        downloadBtn.disabled = true;
        
        let successCount = 0;
        
        selected.forEach((appId, index) => {
            const app = apps.find(a => a.id === appId);
            if (app && app.downloadUrl) {
                try {
                    const link = document.createElement('a');
                    link.href = app.downloadUrl;
                    const fileName = app.name.replace(/\s+/g, '_') + 
                                    (app.downloadUrl.includes('.apk') ? '.apk' : 
                                     app.downloadUrl.includes('.exe') ? '.exe' : '.zip');
                    link.download = fileName;
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    successCount++;
                } catch (e) {
                    console.error(`Ошибка при скачивании ${app.name}:`, e);
                }
            }
            
            if (index === selected.length - 1) {
                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.disabled = false;
                    
                    downloadBtn.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        downloadBtn.style.animation = '';
                    }, 500);
                    
                    const msg = document.createElement('div');
                    msg.style.position = 'fixed';
                    msg.style.bottom = '20px';
                    msg.style.right = '20px';
                    msg.style.background = 'rgba(25, 25, 25, 0.9)';
                    msg.style.color = '#fff';
                    msg.style.padding = '10px 16px';
                    msg.style.borderRadius = '6px';
                    msg.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
                    msg.style.zIndex = '1000';
                    msg.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 1.7s forwards';
                    msg.style.fontSize = '12px';
                    
                    if (successCount > 0) {
                        msg.innerHTML = `✓ Скачивание ${successCount} прил.`;
                    } else {
                        msg.innerHTML = '⚠ Не удалось скачать';
                        msg.style.background = 'rgba(200, 50, 50, 0.9)';
                    }
                    
                    document.body.appendChild(msg);
                    
                    setTimeout(() => {
                        document.body.removeChild(msg);
                    }, 2000);
                }, 300);
            }
        });
    });
    
    loadApps();
});