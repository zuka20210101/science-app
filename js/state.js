// State Change Simulation Module

class StateSimulation {
    constructor() {
        this.temperature = 25;
        this.currentState = 'liquid';
        this.showParticles = false;
        this.particles = [];
        this.canvas = null;
        this.quizData = this.initQuizData();
        this.currentQuizIndex = 0;
        this.quizAnswers = [];
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupTemperatureControl();
        this.setupQuiz();
        this.updateStateDisplay();
        
        // Setup dark mode toggle (inherit from main.js)
        if (window.scienceApp) {
            const toggle = document.getElementById('darkModeToggle');
            toggle.addEventListener('click', () => {
                window.scienceApp.toggleDarkMode();
            });
        }
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Initialize particle canvas if simulation tab is selected
                if (targetTab === 'simulation' && !this.canvas) {
                    this.initParticleAnimation();
                }
            });
        });

        // Check URL hash for direct navigation
        const hash = window.location.hash.slice(1);
        if (hash && ['lesson', 'simulation', 'quiz'].includes(hash)) {
            const targetButton = document.querySelector(`[data-tab="${hash}"]`);
            if (targetButton) {
                targetButton.click();
            }
        }
    }

    setupTemperatureControl() {
        const slider = document.getElementById('temperatureSlider');
        const valueDisplay = document.getElementById('temperatureValue');
        const resetBtn = document.getElementById('resetBtn');
        const particleToggle = document.getElementById('particleToggle');

        slider.addEventListener('input', (e) => {
            this.temperature = parseInt(e.target.value);
            valueDisplay.textContent = this.temperature;
            this.updateStateDisplay();
            this.updateParticles();
        });

        resetBtn.addEventListener('click', () => {
            this.temperature = 25;
            slider.value = 25;
            valueDisplay.textContent = 25;
            this.updateStateDisplay();
            this.updateParticles();
        });

        particleToggle.addEventListener('click', () => {
            this.toggleParticleView();
        });
    }

    updateStateDisplay() {
        const stateElement = document.getElementById('currentState');
        const descriptionElement = document.getElementById('stateDescription');
        const imageElement = document.getElementById('stateImage');
        const visualizationElement = document.getElementById('stateVisualization');

        let state, description, emoji, bgClass;

        if (this.temperature <= 0) {
            state = '固体（氷）';
            description = '粒子が規則正しく並び、わずかに振動しています';
            emoji = '🧊';
            bgClass = 'from-blue-200 to-blue-300';
            this.currentState = 'solid';
        } else if (this.temperature < 100) {
            state = '液体（水）';
            description = '粒子が自由に動き回り、形を変えます';
            emoji = '💧';
            bgClass = 'from-blue-100 to-blue-200';
            this.currentState = 'liquid';
        } else {
            state = '気体（水蒸気）';
            description = '粒子が激しく運動し、空間中を自由に飛び回ります';
            emoji = '💨';
            bgClass = 'from-gray-100 to-gray-200';
            this.currentState = 'gas';
        }

        stateElement.textContent = state;
        descriptionElement.textContent = description;
        imageElement.textContent = emoji;
        
        // Update background gradient
        visualizationElement.className = `w-full h-80 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-b ${bgClass} dark:from-gray-700 dark:to-gray-800 flex items-center justify-center transition-all duration-500`;
    }

    toggleParticleView() {
        this.showParticles = !this.showParticles;
        const canvas = document.getElementById('particleCanvas');
        const visualization = document.getElementById('stateVisualization');
        const toggle = document.getElementById('particleToggle');

        if (this.showParticles) {
            canvas.classList.remove('hidden');
            visualization.style.opacity = '0.3';
            toggle.textContent = '通常表示';
            this.initParticleAnimation();
        } else {
            canvas.classList.add('hidden');
            visualization.style.opacity = '1';
            toggle.textContent = '粒子モデル表示';
        }
    }

    initParticleAnimation() {
        const canvas = document.getElementById('particleCanvas');
        const container = document.getElementById('simulationContainer');
        
        // Set canvas size
        canvas.width = container.offsetWidth - 12; // Account for padding
        canvas.height = 320; // Match visualization height
        
        this.canvas = canvas.getContext('2d');
        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        this.particles = [];
        const numParticles = this.currentState === 'gas' ? 20 : this.currentState === 'liquid' ? 30 : 40;
        const canvas = document.getElementById('particleCanvas');
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * (canvas.width - 20) + 10,
                y: Math.random() * (canvas.height - 20) + 10,
                vx: this.getParticleVelocity(),
                vy: this.getParticleVelocity(),
                radius: this.currentState === 'gas' ? 3 : this.currentState === 'liquid' ? 4 : 5,
                color: this.getParticleColor()
            });
        }
    }

    getParticleVelocity() {
        switch (this.currentState) {
            case 'solid': return (Math.random() - 0.5) * 0.5;
            case 'liquid': return (Math.random() - 0.5) * 2;
            case 'gas': return (Math.random() - 0.5) * 4;
            default: return 0;
        }
    }

    getParticleColor() {
        switch (this.currentState) {
            case 'solid': return '#3b82f6'; // Blue
            case 'liquid': return '#06b6d4'; // Cyan
            case 'gas': return '#9ca3af'; // Gray
            default: return '#6b7280';
        }
    }

    updateParticles() {
        if (this.showParticles && this.particles.length > 0) {
            this.createParticles();
        }
    }

    animateParticles() {
        if (!this.showParticles || !this.canvas) return;

        const canvas = document.getElementById('particleCanvas');
        this.canvas.clearRect(0, 0, canvas.width, canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary collision for solid (stay in grid)
            if (this.currentState === 'solid') {
                if (particle.x < 10 || particle.x > canvas.width - 10) particle.vx *= -1;
                if (particle.y < 10 || particle.y > canvas.height - 10) particle.vy *= -1;
            } else {
                // Normal boundary collision
                if (particle.x < particle.radius || particle.x > canvas.width - particle.radius) {
                    particle.vx *= -1;
                }
                if (particle.y < particle.radius || particle.y > canvas.height - particle.radius) {
                    particle.vy *= -1;
                }
            }

            // Draw particle
            this.canvas.beginPath();
            this.canvas.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.canvas.fillStyle = particle.color;
            this.canvas.fill();
            this.canvas.strokeStyle = '#fff';
            this.canvas.lineWidth = 1;
            this.canvas.stroke();
        });

        requestAnimationFrame(() => this.animateParticles());
    }

    initQuizData() {
        return [
            {
                question: '水が氷になる変化を何といいますか？',
                options: ['融解', '凝固', '蒸発', '凝縮'],
                correct: 1,
                explanation: '液体から固体への変化は「凝固」といいます。'
            },
            {
                question: '氷の融点は何度ですか？',
                options: ['0℃', '100℃', '-10℃', '50℃'],
                correct: 0,
                explanation: '氷の融点（固体から液体になる温度）は0℃です。'
            },
            {
                question: '水の沸点は何度ですか？',
                options: ['50℃', '80℃', '100℃', '120℃'],
                correct: 2,
                explanation: '水の沸点（液体から気体になる温度）は100℃です。'
            },
            {
                question: '気体から液体への変化を何といいますか？',
                options: ['蒸発', '凝縮', '融解', '昇華'],
                correct: 1,
                explanation: '気体から液体への変化は「凝縮」といいます。'
            },
            {
                question: '状態変化で変わらないものはどれですか？',
                options: ['形', '体積', '質量', '密度'],
                correct: 2,
                explanation: '状態変化では物質の量（質量）は変わりません。'
            }
        ];
    }

    setupQuiz() {
        const nextBtn = document.getElementById('nextQuestion');
        const prevBtn = document.getElementById('prevQuestion');

        nextBtn.addEventListener('click', () => this.nextQuestion());
        prevBtn.addEventListener('click', () => this.prevQuestion());

        this.displayQuestion();
    }

    displayQuestion() {
        const container = document.getElementById('quizQuestion');
        const quiz = this.quizData[this.currentQuizIndex];
        
        container.innerHTML = `
            <h3 class="text-lg font-semibold mb-4">問題 ${this.currentQuizIndex + 1} / ${this.quizData.length}</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4">${quiz.question}</p>
            <div class="space-y-2">
                ${quiz.options.map((option, index) => `
                    <label class="flex items-center p-3 border dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="quiz${this.currentQuizIndex}" value="${index}" class="mr-3">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
        `;

        // Update navigation buttons
        document.getElementById('prevQuestion').disabled = this.currentQuizIndex === 0;
        document.getElementById('nextQuestion').textContent = 
            this.currentQuizIndex === this.quizData.length - 1 ? '結果を見る' : '次の問題';
    }

    nextQuestion() {
        const selected = document.querySelector(`input[name="quiz${this.currentQuizIndex}"]:checked`);
        
        if (selected) {
            this.quizAnswers[this.currentQuizIndex] = parseInt(selected.value);
            
            if (this.currentQuizIndex < this.quizData.length - 1) {
                this.currentQuizIndex++;
                this.displayQuestion();
            } else {
                this.showQuizResults();
            }
        } else {
            alert('選択肢を選んでください。');
        }
    }

    prevQuestion() {
        if (this.currentQuizIndex > 0) {
            this.currentQuizIndex--;
            this.displayQuestion();
            
            // Restore previous answer if exists
            if (this.quizAnswers[this.currentQuizIndex] !== undefined) {
                const radio = document.querySelector(`input[name="quiz${this.currentQuizIndex}"][value="${this.quizAnswers[this.currentQuizIndex]}"]`);
                if (radio) radio.checked = true;
            }
        }
    }

    showQuizResults() {
        let correct = 0;
        const results = this.quizData.map((quiz, index) => {
            const isCorrect = this.quizAnswers[index] === quiz.correct;
            if (isCorrect) correct++;
            
            return {
                question: quiz.question,
                userAnswer: quiz.options[this.quizAnswers[index]],
                correctAnswer: quiz.options[quiz.correct],
                isCorrect,
                explanation: quiz.explanation
            };
        });

        const percentage = Math.round((correct / this.quizData.length) * 100);
        
        const resultContainer = document.getElementById('quizResult');
        resultContainer.className = 'mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700';
        resultContainer.innerHTML = `
            <h3 class="text-xl font-bold mb-4 text-center">クイズ結果</h3>
            <div class="text-center mb-6">
                <div class="text-3xl font-bold ${percentage >= 60 ? 'text-green-600' : 'text-red-600'}">
                    ${correct} / ${this.quizData.length} 正解
                </div>
                <div class="text-lg">${percentage}%</div>
                <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    ${percentage >= 80 ? '素晴らしい！' : percentage >= 60 ? '良く理解できています' : 'もう一度復習しましょう'}
                </div>
            </div>
            
            <div class="space-y-4">
                ${results.map((result, index) => `
                    <div class="border dark:border-gray-600 p-4 rounded ${result.isCorrect ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}">
                        <div class="font-medium mb-2">問題${index + 1}: ${result.question}</div>
                        <div class="text-sm space-y-1">
                            <div>あなたの答え: <span class="${result.isCorrect ? 'text-green-600' : 'text-red-600'}">${result.userAnswer}</span></div>
                            ${!result.isCorrect ? `<div>正解: <span class="text-green-600">${result.correctAnswer}</span></div>` : ''}
                            <div class="text-gray-600 dark:text-gray-400">${result.explanation}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="text-center mt-6">
                <button onclick="location.reload()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors">
                    もう一度挑戦
                </button>
            </div>
        `;
        
        resultContainer.classList.remove('hidden');
        document.getElementById('quizQuestion').style.display = 'none';
        document.querySelector('.flex.justify-between').style.display = 'none';

        // Record result
        if (window.scienceApp) {
            window.scienceApp.recordQuizResult('state', correct, this.quizData.length);
            window.scienceApp.updateProgress('state', percentage);
        }
    }
}

// Add CSS for tab styling
const style = document.createElement('style');
style.textContent = `
.tab-button {
    padding: 12px 24px;
    border-bottom: 2px solid transparent;
    color: #6b7280;
    font-weight: 500;
    transition: all 0.3s ease;
}

.tab-button:hover {
    color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
}

.tab-button.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
}

.dark .tab-button {
    color: #9ca3af;
}

.dark .tab-button:hover {
    color: #60a5fa;
    background-color: rgba(96, 165, 250, 0.05);
}

.dark .tab-button.active {
    color: #60a5fa;
    border-bottom-color: #60a5fa;
    background-color: rgba(96, 165, 250, 0.05);
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
    animation: fadeIn 0.3s ease-in;
}

.slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
}

.slider::-webkit-slider-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
}

.dark .slider::-webkit-slider-thumb {
    background: #60a5fa;
}
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stateSimulation = new StateSimulation();
});