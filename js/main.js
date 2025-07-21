// Main JavaScript for Science Learning App

class ScienceApp {
    constructor() {
        this.darkMode = false;
        this.progress = {
            state: 0,
            solution: 0,
            solubility: 0
        };
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupDarkMode();
        this.initResultsChart();
        this.updateProgressBars();
    }

    // Dark mode functionality
    setupDarkMode() {
        const toggle = document.getElementById('darkModeToggle');
        const savedTheme = localStorage.getItem('darkMode');
        
        // Check system preference or saved setting
        if (savedTheme === 'true' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            this.enableDarkMode();
        }

        toggle.addEventListener('click', () => {
            this.toggleDarkMode();
        });
    }

    enableDarkMode() {
        document.documentElement.classList.add('dark');
        document.getElementById('darkModeToggle').innerHTML = '<span class="text-lg">☀️</span>';
        this.darkMode = true;
        localStorage.setItem('darkMode', 'true');
    }

    disableDarkMode() {
        document.documentElement.classList.remove('dark');
        document.getElementById('darkModeToggle').innerHTML = '<span class="text-lg">🌙</span>';
        this.darkMode = false;
        localStorage.setItem('darkMode', 'false');
    }

    toggleDarkMode() {
        if (this.darkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    // Progress management
    loadProgress() {
        const saved = localStorage.getItem('scienceAppProgress');
        if (saved) {
            this.progress = JSON.parse(saved);
        }
    }

    saveProgress() {
        localStorage.setItem('scienceAppProgress', JSON.stringify(this.progress));
        this.updateProgressBars();
    }

    updateProgress(unit, value) {
        this.progress[unit] = Math.max(this.progress[unit], value);
        this.saveProgress();
    }

    updateProgressBars() {
        document.getElementById('stateProgress').style.width = this.progress.state + '%';
        document.getElementById('solutionProgress').style.width = this.progress.solution + '%';
        document.getElementById('solubilityProgress').style.width = this.progress.solubility + '%';
    }

    // Results chart
    initResultsChart() {
        const ctx = document.getElementById('resultsChart').getContext('2d');
        const results = this.getRecentResults();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: results.labels,
                datasets: [{
                    label: 'クイズ成績',
                    data: results.scores,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: this.darkMode ? '#e5e7eb' : '#374151'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: this.darkMode ? '#e5e7eb' : '#374151'
                        },
                        grid: {
                            color: this.darkMode ? '#4b5563' : '#e5e7eb'
                        }
                    },
                    x: {
                        ticks: {
                            color: this.darkMode ? '#e5e7eb' : '#374151'
                        },
                        grid: {
                            color: this.darkMode ? '#4b5563' : '#e5e7eb'
                        }
                    }
                }
            }
        });
    }

    getRecentResults() {
        const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
        const recent = results.slice(-7); // Last 7 results
        
        return {
            labels: recent.map((_, i) => `${i + 1}回目`),
            scores: recent.map(r => r.score || 0)
        };
    }

    // Quiz result recording
    recordQuizResult(unit, score, total) {
        const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
        results.push({
            unit,
            score,
            total,
            percentage: Math.round((score / total) * 100),
            date: new Date().toISOString()
        });
        localStorage.setItem('quizResults', JSON.stringify(results));
        
        // Update progress based on quiz performance
        const percentage = Math.round((score / total) * 100);
        this.updateProgress(unit, percentage);
    }
}

// Navigation functions
function openLesson(unit) {
    window.location.href = `lessons/${unit}.html`;
}

function openSimulation(unit) {
    window.location.href = `lessons/${unit}.html#simulation`;
}

function openQuiz(unit) {
    window.location.href = `lessons/${unit}.html#quiz`;
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatNumber(num) {
    return new Intl.NumberFormat('ja-JP').format(num);
}

function validateNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scienceApp = new ScienceApp();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScienceApp };
}