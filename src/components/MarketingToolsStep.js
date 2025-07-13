/**
 * MarketingToolsStep Component - Упрощенная версия
 * Четвертый шаг формы - выбор используемых маркетинговых инструментов
 * 
 * @class MarketingToolsStep
 * @author Steamphony Digital Agency
 */

import { 
  MARKETING_TOOLS, 
  TOOL_CATEGORIES, 
  COST_TYPES,
  getToolsForIndustry,
  getRecommendedTools,
  calculateToolsCost
} from '../data/marketingTools.js';

class MarketingToolsStep {
  // Подсветка совпадает с выбранными инструментами
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('MarketingToolsStep: container должен быть DOM элементом');
    }

    this.container = container;
    this.selectedTools = new Set();
    this.currentIndustry = null;
    this.currentBusinessSize = null;
    this.isRendered = false;

    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onBack = options.onBack || (() => {});

    this.options = {
      enableValidation: true,
      showOptimizationSuggestions: true,
      trackAnalytics: true,
      requireMinimumSelection: true,
      minimumTools: 1,
      ...options
    };
  }

  init() {
    this.loadPreviousStepData();
    this.render();
    this.attachEventListeners();
    this.isRendered = true;
  }

  loadPreviousStepData() {
    // Загружаем данные из предыдущих шагов
    const appState = window.app?.appState || {};
    this.currentIndustry = appState.getFormData?.()?.industry?.key || 'universal';
    this.currentBusinessSize = appState.getFormData?.()?.businessSize?.key || 'medium';
    
    // Загружаем ранее выбранные инструменты
    const savedTools = appState.getFormData?.()?.marketingTools?.selected || [];
    this.selectedTools = new Set(savedTools);
  }

  render() {
    const availableTools = this.getAvailableTools();
    
    this.container.innerHTML = `
      <div class="calculator-step active">
        <h2 class="step-title">Маркетинговые инструменты</h2>
        <p class="step-description">Выберите инструменты, которые используете или планируете использовать</p>

        <div class="tools-container">
          ${this.renderToolsByCategory(availableTools)}
        </div>

        <div class="selection-summary mt-8 p-4 bg-steamphony-light rounded-lg" id="selection-summary" style="display: none;">
          <h3 class="text-lg font-semibold text-steamphony-primary mb-3">Выбранные инструменты</h3>
          <div class="summary-content flex justify-between items-center">
            <span id="summary-count" class="font-medium text-steamphony-primary">0 инструментов</span>
            <span id="summary-cost" class="cost-info">
              <span class="cost-label text-sm text-gray-600">Стоимость:</span>
              <span class="cost-amount font-medium text-steamphony-primary ml-2">0 ₽/месяц</span>
            </span>
          </div>
        </div>

        <div class="step-navigation">
          <button type="button" class="nav-button secondary" id="back-btn">Назад</button>
          <button type="button" class="nav-button primary" id="next-btn" disabled>Далее</button>
        </div>
      </div>
    `;

    this.cacheElements();
    this.updateSelectionSummary();
  }

  renderToolsByCategory(availableTools) {
    let html = '';
    
    Object.keys(TOOL_CATEGORIES).forEach(categoryId => {
      const category = TOOL_CATEGORIES[categoryId];
      const tools = getToolsForIndustry(this.currentIndustry, categoryId);
      
      if (tools.length > 0) {
        html += `
          <div class="tool-category mb-8" data-category="${categoryId}">
            <div class="category-header mb-4">
              <h3 class="text-lg font-semibold text-steamphony-primary mb-2">${category.icon} ${category.title}</h3>
              <p class="text-gray-600 mb-2">${category.description}</p>
              <div class="category-counter text-sm text-steamphony-secondary" id="counter-${categoryId}">
                Выбрано: <span class="selected-count font-medium">0</span>
              </div>
            </div>
            <div class="multiple-choice">
              ${tools.map(tool => this.renderToolCheckbox(categoryId, tool)).join('')}
            </div>
          </div>
        `;
      }
    });
    
    return html;
  }

  renderToolCheckbox(categoryId, tool) {
    const isSelected = this.selectedTools.has(tool.id);
    const isHighlighted = isSelected; // Подсветка только если выбран
    const costInfo = COST_TYPES[tool.cost];
    return `
      <div class="option-item tool-item ${isSelected ? 'selected highlighted bg-blue-50 border-blue-500' : 'bg-white'} border rounded-lg p-3 mb-2 flex items-center transition-all duration-150" data-tool-id="${tool.id}">
        <label class="option-checkbox-label flex items-center cursor-pointer w-full m-0">
          <input type="checkbox"
                 value="${tool.id}"
                 data-category="${categoryId}"
                 ${isSelected ? 'checked' : ''}
                 class="tool-checkbox mr-3 accent-blue-600 h-5 w-5">
          <span class="flex flex-col">
            <span class="flex items-center">
              <span class="option-title font-semibold mr-2">${tool.name}</span>
              ${isSelected ? '<svg class="inline ml-1 text-blue-600" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#2563eb"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
            </span>
            <span class="option-description block text-sm text-gray-500">${tool.description}</span>
            <span class="cost-badge px-2 py-1 text-xs rounded-full ${costInfo.color === 'green' ? 'bg-green-100 text-green-800' : costInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">${costInfo.label}</span>
            <span class="text-sm text-gray-500 ml-2">${tool.popularity}% используют</span>
          </span>
        </label>
      </div>
    `;
  }

  cacheElements() {
    this.elements = {
      backBtn: this.container.querySelector('#back-btn'),
      nextBtn: this.container.querySelector('#next-btn'),
      selectionSummary: this.container.querySelector('#selection-summary'),
      summaryCount: this.container.querySelector('#summary-count'),
      summaryCost: this.container.querySelector('#summary-cost .cost-amount'),
      toolCheckboxes: this.container.querySelectorAll('input[type="checkbox"]'),
      categoryCounters: this.container.querySelectorAll('.category-counter .selected-count')
    };
  }

  attachEventListeners() {
    // Обработчики чекбоксов и кликов по вариантам
    this.elements.toolCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', this.handleToolToggle.bind(this));
      const toolItem = checkbox.closest('.tool-item');
      if (toolItem) {
        toolItem.addEventListener('click', (e) => {
          // Игнорировать прямой клик по чекбоксу
          if (e.target === checkbox) return;
          const toolId = checkbox.value;
          // Переключаем состояние чекбокса
          checkbox.checked = !checkbox.checked;
          // Вызываем handleToolToggle вручную для корректного обновления состояния и подсветки
          this.handleToolToggle({ target: checkbox });
        });
      }
    });

    // Обработчики кнопок
    this.elements.backBtn.addEventListener('click', this.handleBackClick.bind(this));
    this.elements.nextBtn.addEventListener('click', this.handleNextClick.bind(this));

    // Клавиатурная навигация
    this.container.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleToolToggle(event) {
    const checkbox = event.target;
    const toolId = checkbox.value;
    const toolItem = checkbox.closest('.tool-item');
    
    if (checkbox.checked) {
      this.selectedTools.add(toolId);
      toolItem.classList.add('selected');
    } else {
      this.selectedTools.delete(toolId);
      toolItem.classList.remove('selected');
    }
    
    this.updateSelectionSummary();
    this.updateCategoryCounters();
    this.updateNextButtonState();
    
    // Вызываем колбэк
    this.onSelect({
      selectedTools: Array.from(this.selectedTools),
      totalSelected: this.selectedTools.size
    });
  }

  handleKeydown(event) {
    if (event.key === 'Enter' && event.target.type === 'checkbox') {
      event.target.click();
    }
  }

  updateSelectionSummary() {
    const selectedCount = this.selectedTools.size;
    const costCalculation = calculateToolsCost(
      Array.from(this.selectedTools), 
      this.currentIndustry, 
      this.currentBusinessSize
    );
    
    // Обновляем счетчик
    this.elements.summaryCount.textContent = `${selectedCount} ${this.pluralizeTools(selectedCount)}`;
    
    // Обновляем стоимость
    this.elements.summaryCost.textContent = `${this.formatCurrency(costCalculation.total)}/месяц`;
    
    // Показываем/скрываем сводку
    this.elements.selectionSummary.style.display = selectedCount > 0 ? 'block' : 'none';
  }

  updateCategoryCounters() {
    const categoryCounts = {};
    
    // Подсчитываем выбранные инструменты по категориям
    this.selectedTools.forEach(toolId => {
      const checkbox = this.container.querySelector(`input[value="${toolId}"]`);
      if (checkbox) {
        const category = checkbox.dataset.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
    
    // Обновляем счетчики
    this.elements.categoryCounters.forEach(counter => {
      const categoryId = counter.closest('.category-counter').id.replace('counter-', '');
      counter.textContent = categoryCounts[categoryId] || 0;
    });
  }

  updateNextButtonState() {
    const isValid = this.validateSelection();
    this.elements.nextBtn.disabled = !isValid;
  }

  validateSelection() {
    if (!this.options.requireMinimumSelection) return true;
    return this.selectedTools.size >= this.options.minimumTools;
  }

  handleNextClick(event) {
    event.preventDefault();
    
    if (!this.validateSelection()) {
      this.showValidationError();
      return;
    }
    
    const marketingToolsData = this.prepareMarketingToolsData();
    
    // Сохраняем данные
    this.saveDataToApp(marketingToolsData);
    
    // Вызываем колбэк
    this.onNext(marketingToolsData);
  }

  handleBackClick(event) {
    event.preventDefault();
    
    const marketingToolsData = this.prepareMarketingToolsData();
    this.onBack(marketingToolsData);
  }

  prepareMarketingToolsData() {
    const costCalculation = calculateToolsCost(
      Array.from(this.selectedTools), 
      this.currentIndustry, 
      this.currentBusinessSize
    );
    
    const recommendedTools = getRecommendedTools(this.currentIndustry, this.currentBusinessSize);
    const missingTools = recommendedTools.filter(tool => !this.selectedTools.has(tool));
    
    return {
      marketingTools: {
        selected: Array.from(this.selectedTools),
        totalSelected: this.selectedTools.size,
        estimatedMonthlyCost: costCalculation.total,
        costBreakdown: costCalculation.breakdown,
        optimizationOpportunities: missingTools.map(toolId => ({
          toolId,
          reason: 'Рекомендуется для вашей отрасли',
          potentialSavings: 0 // Можно рассчитать потенциальную экономию
        }))
      },
      industry: this.currentIndustry,
      businessSize: this.currentBusinessSize,
      step: 4,
      nextStep: 5
    };
  }

  saveDataToApp(marketingToolsData) {
    if (window.app?.appState) {
      window.app.appState.updateField('marketingTools', marketingToolsData.marketingTools);
    }
  }

  getAvailableTools() {
    const allTools = [];
    Object.keys(TOOL_CATEGORIES).forEach(categoryId => {
      const tools = getToolsForIndustry(this.currentIndustry, categoryId);
      allTools.push(...tools);
    });
    return allTools;
  }

  pluralizeTools(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'инструмент';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'инструмента';
    return 'инструментов';
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  showValidationError() {
    // Показываем ошибку валидации
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.textContent = `Выберите минимум ${this.options.minimumTools} инструмент`;
    
    this.container.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }

  getSelectedTools() {
    return Array.from(this.selectedTools);
  }

  setSelectedTools(toolIds) {
    this.selectedTools = new Set(toolIds);
    
    // Обновляем чекбоксы
    this.elements.toolCheckboxes.forEach(checkbox => {
      checkbox.checked = this.selectedTools.has(checkbox.value);
      const toolItem = checkbox.closest('.tool-item');
      if (toolItem) {
        toolItem.classList.toggle('selected', checkbox.checked);
      }
    });
    
    this.updateSelectionSummary();
    this.updateCategoryCounters();
    this.updateNextButtonState();
  }

  reset() {
    this.selectedTools.clear();
    this.elements.toolCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    this.container.querySelectorAll('.tool-item').forEach(item => {
      item.classList.remove('selected');
      item.classList.remove('highlighted');
    });
    this.updateSelectionSummary();
    this.updateCategoryCounters();
    this.updateNextButtonState();
  }

  destroy() {
    // Очищаем обработчики событий
    this.elements.toolCheckboxes.forEach(checkbox => {
      checkbox.removeEventListener('change', this.handleToolToggle);
    });
    
    this.elements.backBtn.removeEventListener('click', this.handleBackClick);
    this.elements.nextBtn.removeEventListener('click', this.handleNextClick);
    this.container.removeEventListener('keydown', this.handleKeydown);
    
    // Очищаем контейнер
    this.container.innerHTML = '';
    
    this.isRendered = false;
  }
}

// Экспорт для использования
window.MarketingToolsStep = MarketingToolsStep; 