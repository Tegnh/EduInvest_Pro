document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dropdown menus
    initializeDropdowns();
    
    // Initialize evaluation tabs
    initializeEvaluationTabs();
    
    // Initialize form submission
    initializeFormSubmission();
    
    // Initialize button event listeners
    initializeButtonListeners();
    
    // Load sample data for the comparison tab
    loadSampleComparisonData();
});

// Initialize dropdown functionality
function initializeDropdowns() {
    const calculatorDropdownBtn = document.getElementById('calculator-dropdown-btn');
    const calculatorDropdown = document.getElementById('calculator-dropdown');
    
    const marketsDropdownBtn = document.getElementById('markets-dropdown-btn');
    const marketsDropdown = document.getElementById('markets-dropdown');

    // Initialize calculator dropdown
    if (calculatorDropdownBtn && calculatorDropdown) {
        calculatorDropdownBtn.addEventListener('click', function() {
            calculatorDropdown.classList.toggle('active');
            if (marketsDropdown) marketsDropdown.classList.remove('active');
        });
    }
    
    // Initialize markets dropdown
    if (marketsDropdownBtn && marketsDropdown) {
        marketsDropdownBtn.addEventListener('click', function() {
            marketsDropdown.classList.toggle('active');
            if (calculatorDropdown) calculatorDropdown.classList.remove('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (calculatorDropdownBtn && calculatorDropdown) {
            if (!event.target.closest('#calculator-dropdown-btn') && 
                !event.target.closest('#calculator-dropdown')) {
                calculatorDropdown.classList.remove('active');
            }
        }
        
        if (marketsDropdownBtn && marketsDropdown) {
            if (!event.target.closest('#markets-dropdown-btn') && 
                !event.target.closest('#markets-dropdown')) {
                marketsDropdown.classList.remove('active');
            }
        }
    });
}

// Initialize evaluation tabs
function initializeEvaluationTabs() {
    const tabs = document.querySelectorAll('.evaluation-tab');
    const contents = document.querySelectorAll('.evaluation-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Initialize form submission
function initializeFormSubmission() {
    const companyDataForm = document.getElementById('company-data-form');
    
    if (companyDataForm) {
        companyDataForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const companyName = document.getElementById('company-name').value;
            const stockPrice = parseFloat(document.getElementById('stock-price').value);
            const outstandingShares = parseFloat(document.getElementById('outstanding-shares').value);
            const netIncome = parseFloat(document.getElementById('net-income').value);
            const totalRevenue = parseFloat(document.getElementById('total-revenue').value);
            const totalAssets = parseFloat(document.getElementById('total-assets').value);
            const totalDebt = parseFloat(document.getElementById('total-debt').value);
            const dividend = parseFloat(document.getElementById('dividend').value);
            
            // Validate inputs
            if (!companyName || isNaN(stockPrice) || isNaN(outstandingShares) || 
                isNaN(netIncome) || isNaN(totalRevenue) || isNaN(totalAssets)) {
                alert('يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح');
                return;
            }
            
            // Calculate basic metrics
            const marketCap = stockPrice * outstandingShares;
            const eps = netIncome / outstandingShares;
            const pe = stockPrice / eps;
            const pb = marketCap / (totalAssets - totalDebt);
            const ps = marketCap / totalRevenue;
            const roe = netIncome / (totalAssets - totalDebt) * 100;
            const dividendYield = (dividend / stockPrice) * 100;
            
            // Display company summary
            displayCompanySummary({
                name: companyName,
                stockPrice: stockPrice,
                marketCap: marketCap,
                eps: eps,
                pe: pe,
                pb: pb,
                ps: ps,
                roe: roe,
                dividendYield: dividendYield
            });
            
            // Generate financial charts
            generateMultiplesChart(pe, pb, ps);
            
            // Show the fundamental analysis tab
            document.querySelector('.evaluation-tab[data-tab="fundamental"]').click();
            
            // Generate sample price chart for technical analysis
            generateSamplePriceChart();
        });
    }
}

// Initialize button event listeners
function initializeButtonListeners() {
    // Update multiples chart button
    const updateMultiplesBtn = document.getElementById('update-multiples-btn');
    if (updateMultiplesBtn) {
        updateMultiplesBtn.addEventListener('click', function() {
            const industryPE = parseFloat(document.getElementById('industry-pe').value);
            const industryPB = parseFloat(document.getElementById('industry-pb').value);
            
            // Get current PE and PB from summary
            const currentPE = parseFloat(document.getElementById('company-pe').textContent);
            const currentPB = parseFloat(document.getElementById('company-pb').textContent);
            
            updateMultiplesChart(currentPE, currentPB, industryPE, industryPB);
        });
    }
    
    // Calculate DCF button
    const calculateDCFBtn = document.getElementById('calculate-dcf-btn');
    if (calculateDCFBtn) {
        calculateDCFBtn.addEventListener('click', function() {
            const discountRate = parseFloat(document.getElementById('discount-rate').value) / 100;
            const terminalGrowth = parseFloat(document.getElementById('terminal-growth').value) / 100;
            const netIncome = parseFloat(document.getElementById('net-income').value);
            const expectedGrowth = parseFloat(document.getElementById('expected-growth').value) / 100;
            const outstandingShares = parseFloat(document.getElementById('outstanding-shares').value);
            
            calculateDCFValuation(netIncome, expectedGrowth, discountRate, terminalGrowth, outstandingShares);
        });
    }
    
    // Calculate Gordon Growth Model button
    const calculateGordonBtn = document.getElementById('calculate-gordon-btn');
    if (calculateGordonBtn) {
        calculateGordonBtn.addEventListener('click', function() {
            const dividend = parseFloat(document.getElementById('dividend').value);
            const requiredReturn = parseFloat(document.getElementById('required-return').value) / 100;
            const dividendGrowth = parseFloat(document.getElementById('dividend-growth').value) / 100;
            
            calculateGordonModel(dividend, requiredReturn, dividendGrowth);
        });
    }
    
    // Update chart button
    const updateChartBtn = document.getElementById('update-chart-btn');
    if (updateChartBtn) {
        updateChartBtn.addEventListener('click', function() {
            const timePeriod = document.getElementById('time-period').value;
            const indicator = document.getElementById('indicator').value;
            
            updateTechnicalChart(timePeriod, indicator);
        });
    }
    
    // Load comparison button
    const loadComparisonBtn = document.getElementById('load-comparison-btn');
    if (loadComparisonBtn) {
        loadComparisonBtn.addEventListener('click', function() {
            const sector = document.getElementById('compare-sector').value;
            const metric = document.getElementById('compare-metric').value;
            
            updateComparisonChart(sector, metric);
        });
    }
}

// Display company summary
function displayCompanySummary(data) {
    const companySummary = document.getElementById('company-summary');
    
    if (companySummary) {
        companySummary.style.display = 'block';
        
        let html = `
            <div class="result-row">
                <span class="result-label">اسم الشركة:</span>
                <span class="result-value">${data.name}</span>
            </div>
            <div class="result-row">
                <span class="result-label">سعر السهم الحالي:</span>
                <span class="result-value">${data.stockPrice.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">القيمة السوقية (مليون):</span>
                <span class="result-value">${data.marketCap.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">ربحية السهم:</span>
                <span class="result-value">${data.eps.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">مضاعف الربحية (P/E):</span>
                <span class="result-value" id="company-pe">${data.pe.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">مضاعف القيمة الدفترية (P/B):</span>
                <span class="result-value" id="company-pb">${data.pb.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">مضاعف المبيعات (P/S):</span>
                <span class="result-value">${data.ps.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">العائد على حقوق المساهمين (ROE):</span>
                <span class="result-value">${data.roe.toFixed(2)}%</span>
            </div>
            <div class="result-row">
                <span class="result-label">عائد توزيعات الأرباح:</span>
                <span class="result-value">${data.dividendYield.toFixed(2)}%</span>
            </div>
        `;
        
        companySummary.innerHTML = html;
    }
}

// Generate multiples chart (PE, PB, PS)
function generateMultiplesChart(pe, pb, ps) {
    const ctx = document.getElementById('multiples-chart').getContext('2d');
    
    // Average industry multiples (will be replaced with user input)
    const industryPE = 15;
    const industryPB = 2;
    const industryPS = 3;
    
    const data = {
        labels: ['مضاعف الربحية (P/E)', 'مضاعف القيمة الدفترية (P/B)', 'مضاعف المبيعات (P/S)'],
        datasets: [
            {
                label: 'الشركة',
                data: [pe, pb, ps],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'متوسط القطاع',
                data: [industryPE, industryPB, industryPS],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    
    // Check if chart already exists and destroy it
    if (window.multiplesChart) {
        window.multiplesChart.destroy();
    }
    
    // Create new chart
    window.multiplesChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// Update multiples chart with new industry averages
function updateMultiplesChart(companyPE, companyPB, industryPE, industryPB) {
    if (window.multiplesChart) {
        window.multiplesChart.data.datasets[1].data[0] = industryPE;
        window.multiplesChart.data.datasets[1].data[1] = industryPB;
        window.multiplesChart.update();
    }
}

// Calculate DCF valuation
function calculateDCFValuation(netIncome, growth, discountRate, terminalGrowth, shares) {
    // Simple DCF calculation for demonstration purposes
    const projectionYears = 5;
    let cashFlows = [];
    let currentIncome = netIncome;
    
    // Project cash flows for the next 5 years
    for (let i = 1; i <= projectionYears; i++) {
        currentIncome = currentIncome * (1 + growth);
        const discountFactor = Math.pow(1 + discountRate, i);
        const presentValue = currentIncome / discountFactor;
        cashFlows.push(presentValue);
    }
    
    // Calculate terminal value (Gordon Growth)
    const terminalValue = (currentIncome * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate, projectionYears);
    
    // Sum up all present values
    const totalPresentValue = cashFlows.reduce((sum, flow) => sum + flow, 0) + discountedTerminalValue;
    const valuePerShare = totalPresentValue / shares;
    
    // Display DCF valuation results
    displayValuationResults('dcf', valuePerShare);
    
    // Create DCF chart
    const ctx = document.getElementById('dcf-chart').getContext('2d');
    
    const chartData = {
        labels: ['السنة 1', 'السنة 2', 'السنة 3', 'السنة 4', 'السنة 5', 'القيمة النهائية'],
        datasets: [{
            label: 'القيمة الحالية للتدفقات النقدية',
            data: [...cashFlows, discountedTerminalValue],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    
    // Check if chart already exists and destroy it
    if (window.dcfChart) {
        window.dcfChart.destroy();
    }
    
    // Create new chart
    window.dcfChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
    });
}

// Calculate Gordon Growth Model valuation
function calculateGordonModel(dividend, requiredReturn, dividendGrowth) {
    // Gordon Growth Model formula: P = D1 / (r - g)
    // Where D1 is next year's dividend, r is required return, g is growth rate
    const nextYearDividend = dividend * (1 + dividendGrowth);
    const valuePerShare = nextYearDividend / (requiredReturn - dividendGrowth);
    
    // Display Gordon Model valuation results
    displayValuationResults('gordon', valuePerShare);
}

// Display valuation results
function displayValuationResults(method, valuePerShare) {
    const valuationSummary = document.getElementById('valuation-summary');
    const stockPrice = parseFloat(document.getElementById('stock-price').value);
    
    if (valuationSummary) {
        valuationSummary.style.display = 'block';
        
        if (!window.valuationResults) {
            window.valuationResults = {};
        }
        
        window.valuationResults[method] = valuePerShare;
        
        // Calculate average valuation if multiple methods are available
        let totalValue = 0;
        let methodCount = 0;
        
        for (const key in window.valuationResults) {
            totalValue += window.valuationResults[key];
            methodCount++;
        }
        
        const averageValue = totalValue / methodCount;
        const upside = ((averageValue / stockPrice) - 1) * 100;
        
        let html = `
            <div class="result-row">
                <span class="result-label">سعر السهم الحالي:</span>
                <span class="result-value">${stockPrice.toFixed(2)}</span>
            </div>
        `;
        
        if (window.valuationResults.dcf) {
            html += `
                <div class="result-row">
                    <span class="result-label">القيمة وفق التدفقات المخصومة:</span>
                    <span class="result-value">${window.valuationResults.dcf.toFixed(2)}</span>
                </div>
            `;
        }
        
        if (window.valuationResults.gordon) {
            html += `
                <div class="result-row">
                    <span class="result-label">القيمة وفق نموذج جوردن:</span>
                    <span class="result-value">${window.valuationResults.gordon.toFixed(2)}</span>
                </div>
            `;
        }
        
        html += `
            <div class="result-row">
                <span class="result-label">متوسط القيمة العادلة:</span>
                <span class="result-value">${averageValue.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">نسبة الارتفاع/الانخفاض المحتمل:</span>
                <span class="result-value" style="color: ${upside > 0 ? '#00a854' : '#f5222d'}">
                    ${upside.toFixed(2)}%
                </span>
            </div>
            <div class="result-row">
                <span class="result-label">التوصية:</span>
                <span class="result-value" style="font-weight: bold; color: ${getRecommendationColor(upside)}">
                    ${getRecommendation(upside)}
                </span>
            </div>
        `;
        
        valuationSummary.innerHTML = html;
    }
}

// Get recommendation based on upside percentage
function getRecommendation(upside) {
    if (upside > 20) return "شراء قوي";
    else if (upside > 10) return "شراء";
    else if (upside > 0) return "تجميع";
    else if (upside > -10) return "احتفاظ";
    else return "بيع";
}

// Get color for recommendation
function getRecommendationColor(upside) {
    if (upside > 20) return "#00a854";
    else if (upside > 10) return "#52c41a";
    else if (upside > 0) return "#1890ff";
    else if (upside > -10) return "#faad14";
    else return "#f5222d";
}

// Generate sample price chart for technical analysis
function generateSamplePriceChart() {
    const ctx = document.getElementById('price-chart').getContext('2d');
    
    // Generate sample price data
    const stockPrice = parseFloat(document.getElementById('stock-price').value);
    const dates = generateDateRange(180); // 6 months of data
    const prices = generateSamplePrices(stockPrice, 180);
    
    const data = {
        labels: dates,
        datasets: [
            {
                label: 'سعر السهم',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                borderWidth: 1,
                pointRadius: 0,
                fill: true,
                tension: 0.4
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'تحركات سعر السهم'
            }
        },
        scales: {
            x: {
                ticks: {
                    maxTicksLimit: 10
                }
            }
        }
    };
    
    // Check if chart already exists and destroy it
    if (window.priceChart) {
        window.priceChart.destroy();
    }
    
    // Create new chart
    window.priceChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
    
    // Set default technical analysis results
    const technicalResults = document.getElementById('technical-results');
    if (technicalResults) {
        technicalResults.innerHTML = `
            <div class="grid-container">
                <div class="data-card">
                    <div class="analysis-title">المتوسط المتحرك البسيط (50 يوم)</div>
                    <div class="data-value">${(stockPrice * 0.96).toFixed(2)}</div>
                    <div class="analysis-content">السعر أعلى من المتوسط المتحرك للخمسين يوم، مما يشير إلى اتجاه صعودي على المدى القصير.</div>
                </div>
                <div class="data-card">
                    <div class="analysis-title">المتوسط المتحرك البسيط (200 يوم)</div>
                    <div class="data-value">${(stockPrice * 0.92).toFixed(2)}</div>
                    <div class="analysis-content">السعر أعلى من المتوسط المتحرك لـ 200 يوم، مما يشير إلى اتجاه صعودي على المدى الطويل.</div>
                </div>
                <div class="data-card">
                    <div class="analysis-title">مؤشر القوة النسبية (RSI)</div>
                    <div class="data-value">58</div>
                    <div class="analysis-content">قيمة RSI بين 40 و 60 تشير إلى حالة توازن. لا توجد إشارات ذروة شراء أو بيع واضحة.</div>
                </div>
            </div>
            <div class="grid-container">
                <div class="data-card">
                    <div class="analysis-title">مستويات الدعم</div>
                    <div class="analysis-content">
                        <ul>
                            <li>المستوى الأول: ${(stockPrice * 0.95).toFixed(2)}</li>
                            <li>المستوى الثاني: ${(stockPrice * 0.9).toFixed(2)}</li>
                        </ul>
                    </div>
                </div>
                <div class="data-card">
                    <div class="analysis-title">مستويات المقاومة</div>
                    <div class="analysis-content">
                        <ul>
                            <li>المستوى الأول: ${(stockPrice * 1.05).toFixed(2)}</li>
                            <li>المستوى الثاني: ${(stockPrice * 1.1).toFixed(2)}</li>
                        </ul>
                    </div>
                </div>
                <div class="data-card">
                    <div class="analysis-title">حجم التداول</div>
                    <div class="analysis-content">حجم التداول خلال الأسبوع الماضي كان منخفضًا مقارنة بالمتوسط، مما قد يشير إلى انخفاض في درجة الثقة بالاتجاه الحالي.</div>
                </div>
            </div>
            <div class="grid-container">
                <div class="data-card">
                    <div class="analysis-title">الخلاصة الفنية</div>
                    <div class="analysis-content">
                        الاتجاه العام للسهم صعودي على المديين القصير والمتوسط، مع وجود مقاومة قوية عند ${(stockPrice * 1.05).toFixed(2)}. 
                        مؤشرات الزخم متوازنة، ونوصي بمراقبة السهم عند مستويات الدعم للنظر في فرص الشراء.
                    </div>
                </div>
            </div>
        `;
    }
}

// Update technical chart with new parameters
function updateTechnicalChart(timePeriod, indicator) {
    if (!window.priceChart) return;
    
    // Convert time period to days
    const days = {
        '1m': 30,
        '3m': 90,
        '6m': 180,
        '1y': 365,
        '2y': 730,
        '5y': 1825
    }[timePeriod];
    
    const stockPrice = parseFloat(document.getElementById('stock-price').value);
    const dates = generateDateRange(days);
    const prices = generateSamplePrices(stockPrice, days);
    
    // Update chart data
    window.priceChart.data.labels = dates;
    window.priceChart.data.datasets[0].data = prices;
    
    // Remove any additional datasets (indicators)
    while (window.priceChart.data.datasets.length > 1) {
        window.priceChart.data.datasets.pop();
    }
    
    // Add selected indicator
    if (indicator === 'sma') {
        const sma50 = calculateSMA(prices, 50);
        const sma200 = calculateSMA(prices, 200);
        
        window.priceChart.data.datasets.push({
            label: 'SMA 50',
            data: sma50,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
        });
        
        window.priceChart.data.datasets.push({
            label: 'SMA 200',
            data: sma200,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
        });
    } else if (indicator === 'bollinger') {
        const sma20 = calculateSMA(prices, 20);
        const upperBand = calculateBollingerBand(prices, sma20, 2, 'upper');
        const lowerBand = calculateBollingerBand(prices, sma20, 2, 'lower');
        
        window.priceChart.data.datasets.push({
            label: 'SMA 20',
            data: sma20,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
        });
        
        window.priceChart.data.datasets.push({
            label: 'Upper Band',
            data: upperBand,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
        });
        
        window.priceChart.data.datasets.push({
            label: 'Lower Band',
            data: lowerBand,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1'
        });
    }
    
    window.priceChart.update();
}

// Calculate Simple Moving Average
function calculateSMA(data, window) {
    const result = [];
    
    // Fill with null values until we have enough data points
    for (let i = 0; i < window - 1; i++) {
        result.push(null);
    }
    
    for (let i = window - 1; i < data.length; i++) {
        const windowSlice = data.slice(i - window + 1, i + 1);
        const sum = windowSlice.reduce((total, num) => total + num, 0);
        result.push(sum / window);
    }
    
    return result;
}

// Calculate Bollinger Bands
function calculateBollingerBand(data, sma, multiplier, type) {
    const result = [];
    const window = 20; // Standard window for Bollinger Bands
    
    for (let i = 0; i < sma.length; i++) {
        if (sma[i] === null) {
            result.push(null);
            continue;
        }
        
        const start = i - (window - 1);
        if (start < 0) {
            result.push(null);
            continue;
        }
        
        const windowSlice = data.slice(start, i + 1);
        const mean = sma[i];
        
        // Calculate standard deviation
        const squareDiffs = windowSlice.map(value => {
            const diff = value - mean;
            return diff * diff;
        });
        
        const avgSquareDiff = squareDiffs.reduce((total, num) => total + num, 0) / window;
        const stdDev = Math.sqrt(avgSquareDiff);
        
        if (type === 'upper') {
            result.push(mean + (multiplier * stdDev));
        } else {
            result.push(mean - (multiplier * stdDev));
        }
    }
    
    return result;
}

// Generate date range for charts
function generateDateRange(days) {
    const dates = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }));
    }
    
    return dates;
}

// Generate sample prices for charts
function generateSamplePrices(currentPrice, days) {
    const prices = [];
    let price = currentPrice * 0.8; // Start from 80% of current price
    
    // Generate more realistic price movements with trends
    const trendChangePoints = [
        Math.floor(days * 0.25),
        Math.floor(days * 0.5),
        Math.floor(days * 0.75)
    ];
    
    let trend = 0.001; // Start with a slight uptrend
    
    for (let i = 0; i <= days; i++) {
        // Change trend at specific points
        if (trendChangePoints.includes(i)) {
            trend = (Math.random() - 0.3) / 100; // Bias toward uptrend
        }
        
        // Add random noise + trend
        const change = (Math.random() - 0.5) / 100 + trend;
        price = price * (1 + change);
        prices.push(price);
    }
    
    return prices;
}

// Load sample company comparison data
function loadSampleComparisonData() {
    // Sample data for tech companies
    const techCompanies = [
        { name: 'أبل', pe: 26.8, pb: 35.7, ps: 6.8, roe: 36.1, dividend: 0.85 },
        { name: 'مايكروسوفت', pe: 31.2, pb: 11.5, ps: 10.1, roe: 42.5, dividend: 0.92 },
        { name: 'جوجل', pe: 25.1, pb: 5.2, ps: 5.3, roe: 23.8, dividend: 0.0 },
        { name: 'أمازون', pe: 58.8, pb: 7.8, ps: 2.4, roe: 14.5, dividend: 0.0 },
        { name: 'ميتا', pe: 18.3, pb: 5.1, ps: 5.8, roe: 26.3, dividend: 0.0 }
    ];
    
    // Sample data for finance companies
    const financeCompanies = [
        { name: 'جي بي مورغان', pe: 10.9, pb: 1.5, ps: 3.2, roe: 13.5, dividend: 2.8 },
        { name: 'بنك أوف أمريكا', pe: 11.2, pb: 1.1, ps: 2.7, roe: 10.2, dividend: 2.5 },
        { name: 'ويلز فارغو', pe: 10.1, pb: 1.0, ps: 2.2, roe: 9.8, dividend: 2.7 },
        { name: 'سيتي جروب', pe: 8.6, pb: 0.6, ps: 1.3, roe: 7.3, dividend: 3.1 },
        { name: 'مورغان ستانلي', pe: 15.2, pb: 1.8, ps: 2.4, roe: 11.5, dividend: 3.4 }
    ];
    
    // Update comparison table with tech companies by default
    updateComparisonTable(techCompanies);
    
    // Generate comparison chart
    generateComparisonChart(techCompanies, 'pe');
}

// Update comparison table with company data
function updateComparisonTable(companies) {
    const tableBody = document.getElementById('comparison-table-body');
    
    if (tableBody) {
        let html = '';
        
        companies.forEach(company => {
            html += `
                <tr>
                    <td>${company.name}</td>
                    <td>${company.pe.toFixed(1)}</td>
                    <td>${company.pb.toFixed(1)}</td>
                    <td>${company.ps.toFixed(1)}</td>
                    <td>${company.roe.toFixed(1)}%</td>
                    <td>${company.dividend.toFixed(2)}%</td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
}

// Generate comparison chart
function generateComparisonChart(companies, metric) {
    const ctx = document.getElementById('comparison-chart').getContext('2d');
    
    const metricLabels = {
        'pe': 'مضاعف الربحية (P/E)',
        'pb': 'مضاعف القيمة الدفترية (P/B)',
        'ps': 'مضاعف المبيعات (P/S)',
        'roe': 'العائد على حقوق المساهمين (ROE)',
        'dividend': 'عائد توزيعات الأرباح'
    };
    
    const data = {
        labels: companies.map(company => company.name),
        datasets: [{
            label: metricLabels[metric],
            data: companies.map(company => company[metric]),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `مقارنة ${metricLabels[metric]} بين الشركات`
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    
    // Check if chart already exists and destroy it
    if (window.comparisonChart) {
        window.comparisonChart.destroy();
    }
    
    // Create new chart
    window.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// Update comparison chart with new sector and metric
function updateComparisonChart(sector, metric) {
    // Sample data for different sectors
    const sectorData = {
        'technology': [
            { name: 'أبل', pe: 26.8, pb: 35.7, ps: 6.8, roe: 36.1, dividend: 0.85 },
            { name: 'مايكروسوفت', pe: 31.2, pb: 11.5, ps: 10.1, roe: 42.5, dividend: 0.92 },
            { name: 'جوجل', pe: 25.1, pb: 5.2, ps: 5.3, roe: 23.8, dividend: 0.0 },
            { name: 'أمازون', pe: 58.8, pb: 7.8, ps: 2.4, roe: 14.5, dividend: 0.0 },
            { name: 'ميتا', pe: 18.3, pb: 5.1, ps: 5.8, roe: 26.3, dividend: 0.0 }
        ],
        'finance': [
            { name: 'جي بي مورغان', pe: 10.9, pb: 1.5, ps: 3.2, roe: 13.5, dividend: 2.8 },
            { name: 'بنك أوف أمريكا', pe: 11.2, pb: 1.1, ps: 2.7, roe: 10.2, dividend: 2.5 },
            { name: 'ويلز فارغو', pe: 10.1, pb: 1.0, ps: 2.2, roe: 9.8, dividend: 2.7 },
            { name: 'سيتي جروب', pe: 8.6, pb: 0.6, ps: 1.3, roe: 7.3, dividend: 3.1 },
            { name: 'مورغان ستانلي', pe: 15.2, pb: 1.8, ps: 2.4, roe: 11.5, dividend: 3.4 }
        ],
        'energy': [
            { name: 'إكسون موبيل', pe: 9.8, pb: 1.4, ps: 1.1, roe: 14.3, dividend: 3.6 },
            { name: 'شيفرون', pe: 10.3, pb: 1.6, ps: 1.2, roe: 15.6, dividend: 4.0 },
            { name: 'شل', pe: 6.5, pb: 1.1, ps: 0.5, roe: 18.2, dividend: 3.8 },
            { name: 'توتال', pe: 8.1, pb: 1.3, ps: 0.7, roe: 16.3, dividend: 5.1 },
            { name: 'كونوكو فيليبس', pe: 11.4, pb: 1.9, ps: 1.3, roe: 17.1, dividend: 3.2 }
        ],
        'healthcare': [
            { name: 'جونسون آند جونسون', pe: 16.8, pb: 4.5, ps: 4.2, roe: 26.8, dividend: 3.2 },
            { name: 'فايزر', pe: 12.3, pb: 2.2, ps: 3.5, roe: 18.7, dividend: 4.5 },
            { name: 'ميرك', pe: 13.5, pb: 3.8, ps: 3.9, roe: 28.3, dividend: 3.7 },
            { name: 'إيلي ليلي', pe: 30.2, pb: 7.5, ps: 7.2, roe: 24.5, dividend: 1.8 },
            { name: 'أبوت', pe: 21.5, pb: 5.3, ps: 4.1, roe: 24.6, dividend: 2.1 }
        ],
        'consumer': [
            { name: 'كوكا كولا', pe: 22.8, pb: 8.9, ps: 5.5, roe: 39.4, dividend: 3.3 },
            { name: 'بيبسي', pe: 24.5, pb: 10.3, ps: 2.6, roe: 42.1, dividend: 3.1 },
            { name: 'بروكتر آند جامبل', pe: 24.2, pb: 6.7, ps: 4.3, roe: 27.8, dividend: 2.6 },
            { name: 'والمارت', pe: 23.5, pb: 5.3, ps: 0.6, roe: 22.5, dividend: 1.7 },
            { name: 'نايكي', pe: 27.9, pb: 11.2, ps: 3.5, roe: 40.2, dividend: 1.3 }
        ]
    };
    
    const companies = sectorData[sector] || sectorData.technology;
    
    // Update table
    updateComparisonTable(companies);
    
    // Update chart
    generateComparisonChart(companies, metric);
}