export class CalculatorWidget {
    constructor() {
        this.element = null;
        this.contentContainer = null;
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'calculator-widget';
        
        this.element.innerHTML = `
            <!-- Widget Header -->
            <div class="widget-header">
                <div class="widget-logo">
                    <div class="widget-logo-icon"></div>
                    <div class="widget-logo-text">
                        <div class="widget-brand-title">Steamphony</div>
                        <div class="widget-brand-subtitle">Digital Marketing Agency</div>
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="progress-container" id="progress-bar">
                <div class="progress-info">
                    <div class="step-indicator">Шаг 1 из 6</div>
                    <div class="progress-percentage">16% завершено</div>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: 16%"></div>
                </div>
                <div class="step-dots">
                    <div class="step-dot active"></div>
                    <div class="step-dot"></div>
                    <div class="step-dot"></div>
                    <div class="step-dot"></div>
                    <div class="step-dot"></div>
                    <div class="step-dot"></div>
                </div>
            </div>

            <!-- Widget Content -->
            <div class="widget-content" id="widget-content">
                <!-- Content will be dynamically inserted here -->
            </div>
        `;

        this.contentContainer = this.element.querySelector('#widget-content');
        return this.element;
    }

    mount(container) {
        if (this.element) {
            container.appendChild(this.element);
        }
    }

    unmount() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    // Метод для обновления прогресса
    updateProgress(currentStep, totalSteps) {
        const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
        
        const stepIndicator = this.element.querySelector('.step-indicator');
        const progressPercentageEl = this.element.querySelector('.progress-percentage');
        const progressFill = this.element.querySelector('.progress-fill');
        const dots = this.element.querySelectorAll('.step-dot');
        
        if (stepIndicator) {
            stepIndicator.textContent = `Шаг ${currentStep + 1} из ${totalSteps}`;
        }
        
        if (progressPercentageEl) {
            progressPercentageEl.textContent = `${Math.round(progressPercentage)}% завершено`;
        }
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index === currentStep) {
                dot.classList.add('active');
            } else if (index < currentStep) {
                dot.classList.add('completed');
            }
        });
    }

    // Метод для показа/скрытия прогресс-бара
    showProgress(show = true) {
        const progressBar = this.element.querySelector('#progress-bar');
        if (progressBar) {
            if (show) {
                progressBar.classList.add('visible');
            } else {
                progressBar.classList.remove('visible');
            }
        }
    }

    // Метод для установки контента
    setContent(content) {
        if (this.contentContainer) {
            this.contentContainer.innerHTML = content;
        }
    }
} 