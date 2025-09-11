// Juego de letras escondidas - PREMIO
class LetterGame {
    constructor() {
        this.targetWord = 'PREMIO';
        this.letters = ['P', 'R', 'E', 'M', 'I', 'O'];
        this.foundLetters = this.loadFoundLetters();
        this.pageLetters = {
            'index.html': 'R',
            'sorteo.html': 'E', 
            'hackathon.html': 'M',
            'ExpoUnlu.html': 'I',
            'gruposswpp.html': 'O',
            'verificar-chances.html': 'P'
        };
        
        this.init();
    }

    init() {
        this.createLetterCircle();
        this.createGameInterface();
        this.updateGameInterface();
    }

    createLetterCircle() {
        const currentPage = this.getCurrentPage();
        const letter = this.pageLetters[currentPage];
        
        if (!letter) return;

        // Verificar si ya se encontró esta letra
        if (this.foundLetters.includes(letter)) return;

        // Crear el círculo con la letra
        const circle = document.createElement('div');
        circle.className = 'letter-circle';
        circle.innerHTML = `
            <div class="letter-content">
                <span class="letter">${letter}</span>
                <div class="letter-hint">¡Encontrada!</div>
            </div>
        `;

        // Posicionar aleatoriamente en la página
        this.positionCircle(circle);

        // Agregar evento de click
        circle.addEventListener('click', () => {
            this.collectLetter(letter);
            circle.style.opacity = '0.7';
            circle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                circle.remove();
            }, 1000);
        });

        // Agregar hover effect
        circle.addEventListener('mouseenter', () => {
            circle.style.transform = 'scale(1.1)';
        });

        circle.addEventListener('mouseleave', () => {
            circle.style.transform = 'scale(1)';
        });

        document.body.appendChild(circle);
        
        // Reposicionar con throttling para mejor rendimiento
        let scrollTimeout;
        const repositionOnScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const currentPage = this.getCurrentPage();
                if (currentPage === 'index.html') {
                    this.positionInIndex(circle);
                } else if (currentPage === 'hackathon.html') {
                    this.positionInHackathon(circle);
                } else if (currentPage === 'sorteo.html') {
                    this.positionInSorteo(circle);
                } else if (currentPage === 'ExpoUnlu.html') {
                    this.positionInExpo(circle);
                } else if (currentPage === 'gruposswpp.html') {
                    this.positionInGrupos(circle);
                } else if (currentPage === 'verificar-chances.html') {
                    this.positionInVerificar(circle);
                }
            }, 100); // Throttle de 100ms
        };
        
        window.addEventListener('scroll', repositionOnScroll, { passive: true });
        window.addEventListener('resize', repositionOnScroll, { passive: true });
    }

    positionCircle(circle) {
        const currentPage = this.getCurrentPage();
        
        // Posicionar según la página específica
        if (currentPage === 'index.html') {
            this.positionInIndex(circle);
        } else if (currentPage === 'hackathon.html') {
            this.positionInHackathon(circle);
        } else if (currentPage === 'sorteo.html') {
            this.positionInSorteo(circle);
        } else if (currentPage === 'ExpoUnlu.html') {
            this.positionInExpo(circle);
        } else if (currentPage === 'gruposswpp.html') {
            this.positionInGrupos(circle);
        } else if (currentPage === 'verificar-chances.html') {
            this.positionInVerificar(circle);
        } else {
            // Posición por defecto
            circle.style.position = 'fixed';
            circle.style.top = '200px';
            circle.style.left = '50px';
        }
    }

    positionInIndex(circle) {
        // Cache de elementos para evitar consultas repetidas
        if (!this.indexTarget) {
            this.indexTarget = document.querySelector('#activities, .activities, [class*="activity"], [id*="activity"]') || 
                              document.querySelectorAll('section, .container, .row')[2];
        }
        if (this.indexTarget) {
            this.positionRelativeToElement(circle, this.indexTarget);
        }
    }

    positionInHackathon(circle) {
        if (!this.hackathonTarget) {
            this.hackathonTarget = document.querySelector('[class*="criterio"], [id*="criterio"], [class*="evaluacion"], [id*="evaluacion"]') ||
                                  document.querySelectorAll('section, .container, .row')[1];
        }
        if (this.hackathonTarget) {
            this.positionRelativeToElement(circle, this.hackathonTarget);
        }
    }

    positionInSorteo(circle) {
        if (!this.sorteoTarget) {
            this.sorteoTarget = document.querySelector('.card, .container, section');
        }
        if (this.sorteoTarget) {
            this.positionRelativeToElement(circle, this.sorteoTarget);
        }
    }

    positionInExpo(circle) {
        if (!this.expoTarget) {
            this.expoTarget = document.querySelector('.container, section, .row');
        }
        if (this.expoTarget) {
            this.positionRelativeToElement(circle, this.expoTarget);
        }
    }

    positionInGrupos(circle) {
        if (!this.gruposTarget) {
            this.gruposTarget = document.querySelector('.list-group, .container, section');
        }
        if (this.gruposTarget) {
            this.positionRelativeToElement(circle, this.gruposTarget);
        }
    }

    positionInVerificar(circle) {
        if (!this.verificarTarget) {
            this.verificarTarget = document.querySelector('.card, .container, form');
        }
        if (this.verificarTarget) {
            this.positionRelativeToElement(circle, this.verificarTarget);
        }
    }

    positionRelativeToElement(circle, targetElement) {
        // Cache del navbar para evitar consultas repetidas
        if (!this.navbarHeight) {
            const navbar = document.querySelector('nav, .navbar, #header, header');
            this.navbarHeight = navbar ? navbar.offsetHeight : 80;
        }
        
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Calcular posición dentro del elemento
        let topPosition = rect.top + scrollTop + rect.height - 100;
        let leftPosition = rect.left + scrollLeft + rect.width - 100;
        
        // SIEMPRE asegurar que esté debajo del navbar
        const minTopPosition = scrollTop + this.navbarHeight + 20;
        if (topPosition < minTopPosition) {
            topPosition = minTopPosition;
        }
        
        // Asegurar que esté dentro de los límites de la pantalla
        if (leftPosition < 20) {
            leftPosition = 20;
        }
        if (leftPosition > window.innerWidth - 70) {
            leftPosition = window.innerWidth - 70;
        }
        
        // Posicionar directamente con top y left
        circle.style.position = 'absolute';
        circle.style.top = topPosition + 'px';
        circle.style.left = leftPosition + 'px';
        circle.style.zIndex = '1000';
        circle.style.transform = 'none'; // Resetear transform
        
        // Debug temporal
        console.log('Posicionando letra:', {
            targetElement: targetElement.tagName,
            rect: { top: rect.top, left: rect.left, height: rect.height, width: rect.width },
            finalPosition: { top: topPosition, left: leftPosition },
            navbarHeight: this.navbarHeight
        });
    }

    collectLetter(letter) {
        if (!this.foundLetters.includes(letter)) {
            // Registrar timestamp de cuando se encontró la letra
            const timestamp = Date.now();
            const letterData = {
                letter: letter,
                timestamp: timestamp,
                page: this.getCurrentPage(),
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`,
                timeOnPage: this.calculateTimeOnPage()
            };
            
            this.foundLetters.push(letter);
            this.saveFoundLetters();
            this.saveLetterData(letterData);
            this.updateGameInterface();
            this.showLetterFoundNotification(letter);
            
            // Si completó las 6 letras, generar código de verificación
            if (this.foundLetters.length === 6) {
                this.generateVerificationCode();
            }
        }
    }

    showLetterFoundNotification(letter) {
        const notification = document.createElement('div');
        notification.className = 'letter-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-star-fill"></i>
                <span>¡Letra "${letter}" encontrada!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    createGameInterface() {
        // Crear el botón flotante del juego
        const gameButton = document.createElement('div');
        gameButton.id = 'gameButton';
        gameButton.innerHTML = `
            <i class="bi bi-puzzle"></i>
            <span class="game-text">Juego</span>
        `;
        document.body.appendChild(gameButton);

        // Crear el modal del juego
        const gameModal = document.createElement('div');
        gameModal.id = 'gameModal';
        gameModal.innerHTML = `
            <div class="game-modal-content">
                <div class="game-header">
                    <h3><i class="bi bi-puzzle me-2"></i>Juego de Letras</h3>
                    <button class="btn-close" id="closeGameModal">&times;</button>
                </div>
                <div class="game-body">
                    <div class="game-instructions">
                        <p>Encuentra las 6 letras escondidas en las páginas del sitio para formar una palabra misteriosa</p>
                        <p class="text-muted">Letras encontradas: <span id="foundCount">${this.foundLetters.length}</span>/6</p>
                    </div>
                    <div class="letters-container" id="lettersContainer">
                        ${this.createLettersDisplay()}
                    </div>
                    <div class="game-progress">
                        <div class="progress">
                            <div class="progress-bar" id="gameProgress" style="width: ${(this.foundLetters.length / 6) * 100}%"></div>
                        </div>
                    </div>
                    <div class="game-actions" id="gameActions">
                        ${this.createGameActions()}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(gameModal);

        // Event listeners
        gameButton.addEventListener('click', () => {
            gameModal.style.display = 'flex';
        });

        document.getElementById('closeGameModal').addEventListener('click', () => {
            gameModal.style.display = 'none';
        });

        // Cerrar modal al hacer click fuera
        gameModal.addEventListener('click', (e) => {
            if (e.target === gameModal) {
                gameModal.style.display = 'none';
            }
        });

    }

    createLettersDisplay() {
        let html = '<div class="letters-container">';
        
        // Mostrar solo las letras encontradas en el orden que las encontró
        this.foundLetters.forEach((letter, index) => {
            html += `
                <div class="letter-slot found">
                    <span class="letter-display">${letter}</span>
                    <span class="letter-number">${index + 1}</span>
                </div>
            `;
        });
        
        // Mostrar slots vacíos para las letras faltantes
        const remainingSlots = 6 - this.foundLetters.length;
        for (let i = 0; i < remainingSlots; i++) {
            html += `
                <div class="letter-slot missing">
                    <span class="letter-display">?</span>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    createGameActions() {
        if (this.foundLetters.length === 6) {
            return `
                <div class="game-complete">
                    <div class="success-message">
                        <i class="bi bi-trophy-fill"></i>
                        <h4>¡Felicitaciones!</h4>
                        <p>Has encontrado todas las letras</p>
                        <div class="word-discovery">
                            <p class="discovery-text">¡Descubre la palabra secreta!</p>
                        </div>
                        <div class="instagram-instructions">
                            <p><i class="bi bi-puzzle me-2"></i>Arma la palabra con las letras encontradas y envíala por MD de Instagram para ganar <strong>2 chances gratis</strong></p>
                            <div class="verification-note">
                                <small style="color: #2c3e50 !important; font-weight: 600;">
                                    <i class="bi bi-shield-check me-1"></i>Se generará un código de verificación único para confirmar que encontraste todas las letras
                                </small>
                            </div>
                            <a href="https://instagram.com/codes_unlu" target="_blank" class="btn btn-primary">
                                <i class="bi bi-instagram me-2"></i>Ir a Instagram
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="game-incomplete">
                    <p class="text-muted">Sigue explorando las páginas para encontrar más letras</p>
                    <div class="mystery-hint">
                        <small><i class="bi bi-question-circle me-1"></i>¿Qué palabra secreta se forma con estas letras?</small>
                    </div>
                </div>
            `;
        }
    }

    updateGameInterface() {
        const foundCount = document.getElementById('foundCount');
        const lettersContainer = document.getElementById('lettersContainer');
        const gameProgress = document.getElementById('gameProgress');
        const gameActions = document.getElementById('gameActions');

        if (foundCount) foundCount.textContent = this.foundLetters.length;
        if (lettersContainer) lettersContainer.innerHTML = this.createLettersDisplay();
        if (gameProgress) gameProgress.style.width = `${(this.foundLetters.length / 6) * 100}%`;
        if (gameActions) gameActions.innerHTML = this.createGameActions();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    loadFoundLetters() {
        try {
            const saved = sessionStorage.getItem('letterGame_foundLetters');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveFoundLetters() {
        try {
            sessionStorage.setItem('letterGame_foundLetters', JSON.stringify(this.foundLetters));
        } catch (e) {
            console.error('Error saving found letters:', e);
        }
    }

    saveLetterData(letterData) {
        try {
            const existingData = JSON.parse(sessionStorage.getItem('letterGame_data') || '[]');
            existingData.push(letterData);
            sessionStorage.setItem('letterGame_data', JSON.stringify(existingData));
        } catch (e) {
            console.error('Error saving letter data:', e);
        }
    }

    calculateTimeOnPage() {
        const startTime = sessionStorage.getItem('letterGame_startTime');
        if (!startTime) {
            sessionStorage.setItem('letterGame_startTime', Date.now().toString());
            return 0;
        }
        return Date.now() - parseInt(startTime);
    }

    generateVerificationCode() {
        const letterData = JSON.parse(sessionStorage.getItem('letterGame_data') || '[]');
        const verificationData = {
            letters: this.foundLetters,
            data: letterData,
            completionTime: Date.now(),
            totalTime: this.calculateTimeOnPage(),
            verificationCode: this.createVerificationCode(letterData)
        };
        
        sessionStorage.setItem('letterGame_verification', JSON.stringify(verificationData));
        this.showVerificationCode(verificationData.verificationCode);
    }

    createVerificationCode(letterData) {
        // Crear código basado en timestamps y orden de las letras
        const timestamps = letterData.map(d => d.timestamp).sort();
        const timeDiff = timestamps[timestamps.length - 1] - timestamps[0];
        const code = btoa(JSON.stringify({
            letters: this.foundLetters.join(''),
            timeDiff: timeDiff,
            pages: letterData.map(d => d.page),
            hash: this.simpleHash(letterData)
        })).substring(0, 12).toUpperCase();
        
        return code;
    }

    simpleHash(data) {
        let hash = 0;
        const str = JSON.stringify(data);
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    showVerificationCode(code) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <h3 style="color: #39c0c3; margin-bottom: 20px;">
                    <i class="bi bi-shield-check"></i> ¡Código de Verificación!
                </h3>
                <p style="margin-bottom: 20px;">Para verificar que encontraste todas las letras, envía la palabra que forman junto con este código:</p>
                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 24px;
                    font-weight: bold;
                    color: #39c0c3;
                    margin: 20px 0;
                    border: 2px solid #39c0c3;
                    position: relative;
                ">
                    <span id="verificationCode">${code}</span>
                    <button id="copyCodeBtn" style="
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        background: #39c0c3;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 5px 10px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.3s ease;
                    " title="Copiar código">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                    Envía por MD de Instagram: "[PALABRA] ${code}" para ganar 2 chances gratis
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #39c0c3;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Entendido</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Agregar funcionalidad de copia
        const copyBtn = modal.querySelector('#copyCodeBtn');
        const codeElement = modal.querySelector('#verificationCode');
        
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code);
                copyBtn.innerHTML = '<i class="bi bi-check"></i>';
                copyBtn.style.background = '#28a745';
                copyBtn.title = '¡Copiado!';
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                    copyBtn.style.background = '#39c0c3';
                    copyBtn.title = 'Copiar código';
                }, 2000);
            } catch (err) {
                // Fallback para navegadores que no soportan clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = code;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                copyBtn.innerHTML = '<i class="bi bi-check"></i>';
                copyBtn.style.background = '#28a745';
                copyBtn.title = '¡Copiado!';
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                    copyBtn.style.background = '#39c0c3';
                    copyBtn.title = 'Copiar código';
                }, 2000);
            }
        });
    }

}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new LetterGame();
});
