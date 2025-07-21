// Solubility and Concentration Module

class SolubilitySimulation {
    constructor() {
        this.temperature = 60;
        this.soluteAmount = 50;
        this.currentSubstance = 'nacl';
        this.chart = null;
        this.concentrationStats = {
            correct: 0,
            total: 0
        };
        this.currentProblem = null;
        this.quizData = this.initQuizData();
        this.currentQuizIndex = 0;
        this.quizAnswers = [];
        
        this.solubilityData = {
            nacl: {
                name: '塩化ナトリウム (NaCl)',
                color: '#3b82f6',
                data: [
                    {temp: 0, solubility: 35.7},
                    {temp: 10, solubility: 35.8},
                    {temp: 20, solubility: 36.0},
                    {temp: 30, solubility: 36.3},
                    {temp: 40, solubility: 36.4},
                    {temp: 50, solubility: 37.0},
                    {temp: 60, solubility: 37.1},
                    {temp: 70, solubility: 37.8},
                    {temp: 80, solubility: 38.0},
                    {temp: 90, solubility: 38.9},
                    {temp: 100, solubility: 39.2}
                ]
            },
            kno3: {
                name: '硝酸カリウム (KNO₃)',
                color: '#ef4444',
                data: [
                    {temp: 0, solubility: 13.9},
                    {temp: 10, solubility: 20.9},
                    {temp: 20, solubility: 31.6},
                    {temp: 30, solubility: 45.3},
                    {temp: 40, solubility: 61.3},
                    {temp: 50, solubility: 83.5},
                    {temp: 60, solubility: 105.8},
                    {temp: 70, solubility: 134.0},
                    {temp: 80, solubility: 165.0},
                    {temp: 90, solubility: 202.0},
                    {temp: 100, solubility: 245.0}
                ]
            },
            alum: {
                name: 'ミョウバン',
                color: '#10b981',
                data: [
                    {temp: 0, solubility: 2.45},
                    {temp: 10, solubility: 6.4},
                    {temp: 20, solubility: 11.4},
                    {temp: 30, solubility: 18.6},
                    {temp: 40, solubility: 27.0},
                    {temp: 50, solubility: 38.5},
                    {temp: 60, solubility: 51.0},
                    {temp: 70, solubility: 65.0},
                    {temp: 80, solubility: 82.0},
                    {temp: 90, solubility: 100.0},
                    {temp: 100, solubility: 120.0}
                ]
            }
        };
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupSimulationControls();
        this.initSolubilityChart();
        this.setupConcentrationDrill();
        this.setupQuiz();
        this.updateSimulation();
        this.loadConcentrationStats();
        
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
                
                if (targetTab === 'simulation' && !this.chart) {
                    setTimeout(() => this.initSolubilityChart(), 100);
                }
                
                if (targetTab === 'concentration' && !this.currentProblem) {
                    this.generateConcentrationProblem();
                }
            });
        });

        // Check URL hash
        const hash = window.location.hash.slice(1);
        if (hash && ['lesson', 'simulation', 'concentration', 'quiz'].includes(hash)) {
            const targetButton = document.querySelector(`[data-tab="${hash}"]`);
            if (targetButton) {
                targetButton.click();
            }
        }
    }

    setupSimulationControls() {
        const substanceSelect = document.getElementById('substanceSelect');
        const tempSlider = document.getElementById('tempSlider');
        const tempValue = document.getElementById('tempValue');
        const soluteSlider = document.getElementById('soluteSlider');
        const soluteValue = document.getElementById('soluteValue');

        substanceSelect.addEventListener('change', (e) => {
            this.currentSubstance = e.target.value;
            this.updateSimulation();
            this.updateChart();
        });

        tempSlider.addEventListener('input', (e) => {
            this.temperature = parseInt(e.target.value);
            tempValue.textContent = this.temperature;
            this.updateSimulation();
            this.updateChart();
        });

        soluteSlider.addEventListener('input', (e) => {
            this.soluteAmount = parseInt(e.target.value);
            soluteValue.textContent = this.soluteAmount;
            this.updateSimulation();
            this.updateChart();
        });
    }

    getSolubilityAtTemp(substance, temp) {
        const data = this.solubilityData[substance].data;
        
        // Find the two closest temperature points
        for (let i = 0; i < data.length - 1; i++) {
            if (temp >= data[i].temp && temp <= data[i + 1].temp) {
                // Linear interpolation
                const ratio = (temp - data[i].temp) / (data[i + 1].temp - data[i].temp);
                return data[i].solubility + ratio * (data[i + 1].solubility - data[i].solubility);
            }
        }
        
        // Extrapolation for out-of-range temperatures
        if (temp < data[0].temp) return data[0].solubility;
        return data[data.length - 1].solubility;
    }

    updateSimulation() {
        const currentSolubility = this.getSolubilityAtTemp(this.currentSubstance, this.temperature);
        const dissolvedAmount = Math.min(this.soluteAmount, currentSolubility);
        const precipitatedAmount = Math.max(0, this.soluteAmount - currentSolubility);
        const saturationLevel = Math.round((this.soluteAmount / currentSolubility) * 100);

        document.getElementById('currentSolubility').textContent = currentSolubility.toFixed(1) + 'g';
        document.getElementById('dissolvedAmount').textContent = dissolvedAmount.toFixed(1) + 'g';
        document.getElementById('precipitatedAmount').textContent = precipitatedAmount.toFixed(1) + 'g';
        document.getElementById('saturationLevel').textContent = saturationLevel + '%';

        const statusMessage = document.getElementById('statusMessage');
        if (saturationLevel < 100) {
            statusMessage.textContent = 'まだ溶ける（未飽和）';
            statusMessage.className = 'text-sm text-blue-600 dark:text-blue-400 mt-1';
        } else if (saturationLevel === 100) {
            statusMessage.textContent = '飽和状態です';
            statusMessage.className = 'text-sm text-green-600 dark:text-green-400 mt-1';
        } else {
            statusMessage.textContent = '過飽和 - 結晶が析出';
            statusMessage.className = 'text-sm text-red-600 dark:text-red-400 mt-1';
        }
    }

    initSolubilityChart() {
        const ctx = document.getElementById('solubilityChart');
        if (!ctx) return;

        const data = this.solubilityData[this.currentSubstance];
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: data.name,
                    data: data.data.map(point => ({x: point.temp, y: point.solubility})),
                    borderColor: data.color,
                    backgroundColor: data.color + '20',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }, {
                    label: '現在のポイント',
                    data: [{x: this.temperature, y: this.soluteAmount}],
                    borderColor: '#ef4444',
                    backgroundColor: '#ef4444',
                    borderWidth: 0,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: '温度 (℃)',
                            color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
                        },
                        grid: {
                            color: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '溶解度 (g)',
                            color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
                        },
                        grid: {
                            color: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb'
                        }
                    }
                }
            }
        });
    }

    updateChart() {
        if (!this.chart) return;

        const data = this.solubilityData[this.currentSubstance];
        this.chart.data.datasets[0].data = data.data.map(point => ({x: point.temp, y: point.solubility}));
        this.chart.data.datasets[0].borderColor = data.color;
        this.chart.data.datasets[0].backgroundColor = data.color + '20';
        this.chart.data.datasets[0].label = data.name;
        
        this.chart.data.datasets[1].data = [{x: this.temperature, y: this.soluteAmount}];
        
        this.chart.update();
    }

    setupConcentrationDrill() {
        document.getElementById('checkAnswer').addEventListener('click', () => {
            this.checkConcentrationAnswer();
        });

        document.getElementById('newProblem').addEventListener('click', () => {
            this.generateConcentrationProblem();
        });
    }

    generateConcentrationProblem() {
        const problemTypes = [
            'concentration', 'solute', 'solution'
        ];
        const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        
        let solute, solution, concentration;
        
        switch (type) {
            case 'concentration':
                solute = Math.floor(Math.random() * 50) + 10;
                solution = Math.floor(Math.random() * 400) + 100;
                concentration = (solute / solution * 100).toFixed(1);
                this.currentProblem = {
                    type: 'concentration',
                    question: `${solute}gの食塩を${solution}gの水に溶かしました。この食塩水の質量パーセント濃度は何%ですか？`,
                    answer: parseFloat(concentration),
                    unit: '%',
                    given: {solute, solvent: solution}
                };
                break;
                
            case 'solute':
                concentration = Math.floor(Math.random() * 20) + 5;
                solution = Math.floor(Math.random() * 300) + 200;
                solute = (solution * concentration / 100).toFixed(1);
                this.currentProblem = {
                    type: 'solute',
                    question: `${concentration}%の食塩水${solution}gに含まれる食塩は何gですか？`,
                    answer: parseFloat(solute),
                    unit: 'g',
                    given: {concentration, solution}
                };
                break;
                
            case 'solution':
                concentration = Math.floor(Math.random() * 15) + 5;
                solute = Math.floor(Math.random() * 40) + 10;
                solution = (solute * 100 / concentration).toFixed(1);
                this.currentProblem = {
                    type: 'solution',
                    question: `${solute}gの食塩を使って${concentration}%の食塩水を作るには、何gの食塩水が必要ですか？`,
                    answer: parseFloat(solution),
                    unit: 'g',
                    given: {solute, concentration}
                };
                break;
        }
        
        this.displayConcentrationProblem();
    }

    displayConcentrationProblem() {
        const container = document.getElementById('concentrationProblem');
        container.innerHTML = `
            <div class="border dark:border-gray-600 p-4 rounded-lg bg-blue-50 dark:bg-blue-900">
                <p class="text-lg mb-4">${this.currentProblem.question}</p>
                <div class="flex items-center space-x-2">
                    <input type="number" id="userAnswer" step="0.1" class="border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="答えを入力">
                    <span class="text-gray-700 dark:text-gray-300">${this.currentProblem.unit}</span>
                </div>
            </div>
        `;
        
        document.getElementById('answerResult').classList.add('hidden');
        document.getElementById('userAnswer').focus();
    }

    checkConcentrationAnswer() {
        const userAnswer = parseFloat(document.getElementById('userAnswer').value);
        const resultContainer = document.getElementById('answerResult');
        
        if (isNaN(userAnswer)) {
            alert('数値を入力してください。');
            return;
        }
        
        const tolerance = 0.1;
        const isCorrect = Math.abs(userAnswer - this.currentProblem.answer) <= tolerance;
        
        this.concentrationStats.total++;
        if (isCorrect) {
            this.concentrationStats.correct++;
        }
        
        this.saveConcentrationStats();
        this.updateConcentrationStats();
        
        resultContainer.className = `mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`;
        resultContainer.innerHTML = `
            <div class="flex items-center mb-2">
                <span class="text-lg mr-2">${isCorrect ? '✅' : '❌'}</span>
                <span class="font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}">
                    ${isCorrect ? '正解！' : '不正解'}
                </span>
            </div>
            <div class="text-sm space-y-1">
                <div>あなたの答え: ${userAnswer}${this.currentProblem.unit}</div>
                <div>正解: ${this.currentProblem.answer}${this.currentProblem.unit}</div>
                <div class="mt-2 text-gray-600 dark:text-gray-400">
                    ${this.getConcentrationExplanation()}
                </div>
            </div>
        `;
        resultContainer.classList.remove('hidden');
    }

    getConcentrationExplanation() {
        const p = this.currentProblem;
        switch (p.type) {
            case 'concentration':
                return `計算: ${p.given.solute}g ÷ (${p.given.solute}g + ${p.given.solvent}g) × 100 = ${p.answer}%`;
            case 'solute':
                return `計算: ${p.given.solution}g × ${p.given.concentration}% ÷ 100 = ${p.answer}g`;
            case 'solution':
                return `計算: ${p.given.solute}g × 100 ÷ ${p.given.concentration}% = ${p.answer}g`;
            default:
                return '';
        }
    }

    saveConcentrationStats() {
        localStorage.setItem('concentrationStats', JSON.stringify(this.concentrationStats));
    }

    loadConcentrationStats() {
        const saved = localStorage.getItem('concentrationStats');
        if (saved) {
            this.concentrationStats = JSON.parse(saved);
        }
        this.updateConcentrationStats();
    }

    updateConcentrationStats() {
        document.getElementById('correctCount').textContent = this.concentrationStats.correct;
        document.getElementById('totalCount').textContent = this.concentrationStats.total;
        const accuracy = this.concentrationStats.total > 0 ? 
            Math.round((this.concentrationStats.correct / this.concentrationStats.total) * 100) : 0;
        document.getElementById('accuracyRate').textContent = accuracy + '%';
    }

    initQuizData() {
        return [
            {
                question: '20℃で塩化ナトリウムの溶解度は約何gですか？',
                options: ['30g', '36g', '45g', '50g'],
                correct: 1,
                explanation: '20℃での塩化ナトリウムの溶解度は約36gです。'
            },
            {
                question: '10gの食塩を90gの水に溶かした食塩水の濃度は？',
                options: ['10%', '11%', '9%', '12%'],
                correct: 0,
                explanation: '濃度 = 10g ÷ (10g + 90g) × 100 = 10%'
            },
            {
                question: '温度が上がると一般的に溶解度はどうなりますか？',
                options: ['変わらない', '下がる', '上がる', '物質による'],
                correct: 2,
                explanation: '一般的に温度が上がると溶解度は大きくなります。'
            },
            {
                question: '飽和溶液に溶質を加えるとどうなりますか？',
                options: ['全て溶ける', '結晶が析出', '濃度が下がる', '温度が上がる'],
                correct: 1,
                explanation: '飽和溶液にさらに溶質を加えると、溶けきれずに結晶として析出します。'
            },
            {
                question: '20%の食塩水200gに含まれる食塩の量は？',
                options: ['20g', '40g', '50g', '60g'],
                correct: 1,
                explanation: '食塩の量 = 200g × 20% ÷ 100 = 40g'
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
                <button onclick="location.reload()" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded transition-colors">
                    もう一度挑戦
                </button>
            </div>
        `;
        
        resultContainer.classList.remove('hidden');
        document.getElementById('quizQuestion').style.display = 'none';
        document.querySelector('.flex.justify-between').style.display = 'none';

        // Record result
        if (window.scienceApp) {
            window.scienceApp.recordQuizResult('solubility', correct, this.quizData.length);
            window.scienceApp.updateProgress('solubility', percentage);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.solubilitySimulation = new SolubilitySimulation();
});