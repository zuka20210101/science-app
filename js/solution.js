// Solution Properties Module

class SolutionSimulation {
    constructor() {
        this.selectedSolution = null;
        this.solutionData = {
            lemon: { name: 'レモン汁', ph: 2, type: 'acidic' },
            vinegar: { name: '酢', ph: 3, type: 'acidic' },
            water: { name: '純水', ph: 7, type: 'neutral' },
            salt: { name: '食塩水', ph: 7, type: 'neutral' },
            soap: { name: '石けん水', ph: 10, type: 'alkaline' },
            ammonia: { name: 'アンモニア水', ph: 11, type: 'alkaline' }
        };
        this.quizData = this.initQuizData();
        this.currentQuizIndex = 0;
        this.quizAnswers = [];
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupSolutionButtons();
        this.setupQuiz();
        
        // Setup dark mode toggle
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
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Check URL hash
        const hash = window.location.hash.slice(1);
        if (hash && ['lesson', 'simulation', 'quiz'].includes(hash)) {
            const targetButton = document.querySelector(`[data-tab="${hash}"]`);
            if (targetButton) {
                targetButton.click();
            }
        }
    }

    setupSolutionButtons() {
        const buttons = document.querySelectorAll('.solution-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Test the selected solution
                const solution = button.dataset.solution;
                this.testSolution(solution);
            });
        });
    }

    testSolution(solutionKey) {
        this.selectedSolution = solutionKey;
        const solution = this.solutionData[solutionKey];
        
        // Update solution display
        document.getElementById('selectedSolution').textContent = solution.name;
        document.getElementById('solutionPH').textContent = `pH ${solution.ph}`;
        
        // Update pH display
        this.updatePHDisplay(solution.ph, solution.type);
        
        // Update litmus tests
        this.updateLitmusTest(solution.type);
        
        // Update BTB test
        this.updateBTBTest(solution.type);
        
        // Update classification
        this.updateClassification(solution.type);
        
        // Add visual effects
        this.addTestAnimations();
    }

    updatePHDisplay(ph, type) {
        const phValue = document.getElementById('phValue');
        const phBar = document.getElementById('phBar');
        
        phValue.textContent = ph;
        
        // Update bar position (0-14 scale)
        const percentage = (ph / 14) * 100;
        phBar.style.width = percentage + '%';
        
        // Update colors
        if (type === 'acidic') {
            phValue.className = 'text-2xl font-bold text-red-600';
            phBar.className = 'h-full transition-all duration-500 bg-red-500';
        } else if (type === 'neutral') {
            phValue.className = 'text-2xl font-bold text-green-600';
            phBar.className = 'h-full transition-all duration-500 bg-green-500';
        } else {
            phValue.className = 'text-2xl font-bold text-blue-600';
            phBar.className = 'h-full transition-all duration-500 bg-blue-500';
        }
    }

    updateLitmusTest(type) {
        const blueLitmus = document.getElementById('blueLitmus').firstElementChild;
        const redLitmus = document.getElementById('redLitmus').firstElementChild;
        
        if (type === 'acidic') {
            // Blue litmus turns red in acid
            blueLitmus.className = 'h-full bg-red-400 rounded transition-colors duration-500';
            redLitmus.className = 'h-full bg-red-400 rounded transition-colors duration-500';
        } else if (type === 'neutral') {
            // No change in neutral
            blueLitmus.className = 'h-full bg-blue-400 rounded transition-colors duration-500';
            redLitmus.className = 'h-full bg-red-400 rounded transition-colors duration-500';
        } else {
            // Red litmus turns blue in alkali
            blueLitmus.className = 'h-full bg-blue-400 rounded transition-colors duration-500';
            redLitmus.className = 'h-full bg-blue-400 rounded transition-colors duration-500';
        }
    }

    updateBTBTest(type) {
        const btbTest = document.getElementById('btbTest').firstElementChild;
        const btbColor = document.getElementById('btbColor');
        
        if (type === 'acidic') {
            btbTest.className = 'h-full bg-yellow-400 rounded-full transition-colors duration-500';
            btbColor.textContent = '黄色';
        } else if (type === 'neutral') {
            btbTest.className = 'h-full bg-green-400 rounded-full transition-colors duration-500';
            btbColor.textContent = '緑色';
        } else {
            btbTest.className = 'h-full bg-blue-400 rounded-full transition-colors duration-500';
            btbColor.textContent = '青色';
        }
    }

    updateClassification(type) {
        const classification = document.getElementById('classification');
        const properties = document.getElementById('properties');
        
        if (type === 'acidic') {
            classification.textContent = '酸性';
            classification.className = 'text-lg font-bold text-red-600';
            properties.textContent = '酸っぱい味、青リトマス紙を赤に変える';
        } else if (type === 'neutral') {
            classification.textContent = '中性';
            classification.className = 'text-lg font-bold text-green-600';
            properties.textContent = 'リトマス紙の色を変えない';
        } else {
            classification.textContent = 'アルカリ性';
            classification.className = 'text-lg font-bold text-blue-600';
            properties.textContent = 'ぬるぬるする、赤リトマス紙を青に変える';
        }
    }

    addTestAnimations() {
        // Add a simple animation effect
        const containers = [
            document.getElementById('phValue').parentElement,
            document.getElementById('blueLitmus').parentElement.parentElement,
            document.getElementById('btbTest').parentElement,
            document.getElementById('classification').parentElement
        ];
        
        containers.forEach((container, index) => {
            setTimeout(() => {
                container.classList.add('scale-in');
                setTimeout(() => {
                    container.classList.remove('scale-in');
                }, 300);
            }, index * 200);
        });
    }

    initQuizData() {
        return [
            {
                question: 'レモン汁をリトマス紙につけるとどうなりますか？',
                options: ['青リトマス紙が赤になる', '赤リトマス紙が青になる', '色は変わらない', '両方とも緑になる'],
                correct: 0,
                explanation: 'レモン汁は酸性なので、青リトマス紙を赤に変えます。'
            },
            {
                question: 'pH7の水溶液の性質は？',
                options: ['酸性', '中性', 'アルカリ性', '不明'],
                correct: 1,
                explanation: 'pH7はちょうど中性を示します。'
            },
            {
                question: '石けん水の性質は？',
                options: ['酸性', '中性', 'アルカリ性', '物によって異なる'],
                correct: 2,
                explanation: '石けん水はアルカリ性で、ぬるぬるする性質があります。'
            },
            {
                question: 'BTB溶液が黄色になる水溶液は？',
                options: ['酸性', '中性', 'アルカリ性', '無色'],
                correct: 0,
                explanation: 'BTB溶液は酸性で黄色、中性で緑色、アルカリ性で青色になります。'
            },
            {
                question: 'アンモニア水にフェノールフタレイン溶液を加えると？',
                options: ['無色のまま', '黄色になる', '青色になる', '赤色になる'],
                correct: 3,
                explanation: 'フェノールフタレイン溶液はアルカリ性で赤色になります。'
            },
            {
                question: 'pH3の水溶液は？',
                options: ['弱酸性', '強酸性', '中性', 'アルカリ性'],
                correct: 1,
                explanation: 'pH3は強酸性の範囲です（pH0-3が強酸性）。'
            }
        ];
    }

    setupQuiz() {
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevQuestion').addEventListener('click', () => this.prevQuestion());
        this.displayQuizQuestion();
    }

    displayQuizQuestion() {
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
                this.displayQuizQuestion();
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
            this.displayQuizQuestion();
            
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
                <button onclick="location.reload()" class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors">
                    もう一度挑戦
                </button>
            </div>
        `;
        
        resultContainer.classList.remove('hidden');
        document.getElementById('quizQuestion').style.display = 'none';
        document.querySelector('.flex.justify-between').style.display = 'none';

        // Record result
        if (window.scienceApp) {
            window.scienceApp.recordQuizResult('solution', correct, this.quizData.length);
            window.scienceApp.updateProgress('solution', percentage);
        }
    }
}

// Add CSS for solution buttons
const style = document.createElement('style');
style.textContent = `
.solution-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 100px;
}

.dark .solution-btn {
    background: #374151;
    border-color: #4b5563;
    color: #e5e7eb;
}

.solution-btn:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: translateY(-2px);
}

.dark .solution-btn:hover {
    border-color: #60a5fa;
    background: #1e3a8a;
}

.solution-btn.active {
    border-color: #3b82f6;
    background: #dbeafe;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.dark .solution-btn.active {
    border-color: #60a5fa;
    background: #1e40af;
}

.solution-btn div {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
}
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.solutionSimulation = new SolutionSimulation();
});