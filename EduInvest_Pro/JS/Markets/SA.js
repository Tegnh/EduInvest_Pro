document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dropdown menus
    initializeDropdowns();
    
    // Load data and create charts
    fetchEconomicData();
    renderMarketChart();
    renderGDPCompositionChart();
    renderExportCompositionChart();
    renderImportCompositionChart();
    renderTradePartnersChart();
    renderGrowthForecastChart();
});

// Initialize dropdown functionality
function initializeDropdowns() {
    const calculatorDropdownBtn = document.getElementById('calculator-dropdown-btn');
    const calculatorDropdown = document.getElementById('calculator-dropdown');

    calculatorDropdownBtn.addEventListener('click', function() {
        calculatorDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#calculator-dropdown-btn') && 
            !event.target.closest('#calculator-dropdown')) {
            calculatorDropdown.classList.remove('active');
        }
    });
}

// Fetch economic data from JSON files
async function fetchEconomicData() {
    try {
        // Fetch GDP data
        const gdpResponse = await fetch('../../assets/data/gdp.json');
        const gdpData = await gdpResponse.json();
        renderGDPChart(gdpData);
        
        // Fetch inflation data
        const inflationResponse = await fetch('../../assets/data/inflation.json');
        const inflationData = await inflationResponse.json();
        renderInflationChart(inflationData);
        populateInflationAnalysis(inflationData);
        
        // Fetch unemployment data
        const unemploymentResponse = await fetch('../../assets/data/unemployment.json');
        const unemploymentData = await unemploymentResponse.json();
        renderUnemploymentChart(unemploymentData);
        populateUnemploymentAnalysis(unemploymentData);
        
        // Fetch trade balance data
        const tradeResponse = await fetch('../../assets/data/trade_balance.json');
        const tradeData = await tradeResponse.json();
        renderTradeBalanceChart(tradeData);
        populateTradeAnalysis(tradeData);
    } catch (error) {
        console.error('Error fetching economic data:', error);
    }
}

// Render GDP chart using the fetched data
function renderGDPChart(data) {
    const ctx = document.getElementById('gdp-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.years,
            datasets: [{
                label: 'معدل نمو الناتج المحلي الإجمالي (%)',
                data: data.values,
                backgroundColor: data.values.map(value => 
                    value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
                ),
                borderColor: data.values.map(value => 
                    value >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'نمو الناتج المحلي الإجمالي الحقيقي'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const year = data.years[context.dataIndex];
                            if (data.analysis.growthPeriods && data.analysis.growthPeriods[year]) {
                                return data.analysis.growthPeriods[year];
                            } else if (data.analysis.recessionPeriods && data.analysis.recessionPeriods[year]) {
                                return data.analysis.recessionPeriods[year];
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: data.unit
                    }
                }
            }
        }
    });
}

// Render Inflation chart using the fetched data
function renderInflationChart(data) {
    const ctx = document.getElementById('inflation-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.years,
            datasets: [{
                label: 'معدل التضخم السنوي (%)',
                data: data.values,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 159, 64, 1)',
                pointRadius: 4,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'معدل التضخم السنوي في المملكة'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const year = data.years[context.dataIndex];
                            if (data.analysis.highPeriods && data.analysis.highPeriods[year]) {
                                return data.analysis.highPeriods[year];
                            } else if (data.analysis.lowPeriods && data.analysis.lowPeriods[year]) {
                                return data.analysis.lowPeriods[year];
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });
}

// Populate inflation analysis card with data
function populateInflationAnalysis(data) {
    const inflationAnalysisElement = document.getElementById('inflation-analysis');
    
    let content = `
        <h4>تحليل التضخم</h4>
        <div class="data-value">${data.values[data.values.length - 1]}%</div>
        <div class="data-description">${data.description}</div>
        <hr>
        <div class="data-description">
            <strong>الاتجاهات الأخيرة:</strong> ${data.analysis.recentTrends}
        </div>
    `;
    
    inflationAnalysisElement.innerHTML = content;
}

// Render Unemployment chart using the fetched data
function renderUnemploymentChart(data) {
    const ctx = document.getElementById('unemployment-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.years,
            datasets: [{
                label: 'معدل البطالة بين المواطنين السعوديين (%)',
                data: data.values,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                pointRadius: 4,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'معدل البطالة بين السعوديين'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const year = data.years[context.dataIndex];
                            if (data.analysis.highPeriods && data.analysis.highPeriods[year]) {
                                return data.analysis.highPeriods[year];
                            } else if (data.analysis.improvementPeriods && data.analysis.improvementPeriods[year]) {
                                return data.analysis.improvementPeriods[year];
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 15
                }
            }
        }
    });
}

// Populate unemployment analysis card with data
function populateUnemploymentAnalysis(data) {
    const unemploymentAnalysisElement = document.getElementById('unemployment-analysis');
    
    let content = `
        <h4>تحليل البطالة</h4>
        <div class="data-value">${data.values[data.values.length - 1]}%</div>
        <div class="data-description">${data.description}</div>
        <hr>
        <div class="data-description">
            <strong>تحليل النوع:</strong> ${data.analysis.genderAnalysis}
        </div>
    `;
    
    unemploymentAnalysisElement.innerHTML = content;
}

// Render Trade Balance chart using the fetched data
function renderTradeBalanceChart(data) {
    const ctx = document.getElementById('trade-balance-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.years,
            datasets: [{
                label: 'الميزان التجاري (مليار ريال)',
                data: data.values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'الميزان التجاري للمملكة'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const year = data.years[context.dataIndex];
                            if (data.analysis.highPeriods && data.analysis.highPeriods[year]) {
                                return data.analysis.highPeriods[year];
                            } else if (data.analysis.lowPeriods && data.analysis.lowPeriods[year]) {
                                return data.analysis.lowPeriods[year];
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });
}

// Populate trade balance analysis card with data
function populateTradeAnalysis(data) {
    const tradeAnalysisElement = document.getElementById('trade-analysis');
    
    let content = `
        <h4>تحليل التجارة الخارجية</h4>
        <div class="data-value">${data.values[data.values.length - 1]} ${data.unit}</div>
        <div class="data-description">${data.description}</div>
        <hr>
        <div class="data-description">
            <strong>التغيرات الهيكلية:</strong> ${data.analysis.structuralChanges}
        </div>
    `;
    
    tradeAnalysisElement.innerHTML = content;
}

// Render main market performance chart
function renderMarketChart() {
    const ctx = document.getElementById('market-chart').getContext('2d');
    
    // Sample data for market performance over 12 months
    const marketData = {
        labels: ['يونيو 24', 'يوليو 24', 'أغسطس 24', 'سبتمبر 24', 'أكتوبر 24', 'نوفمبر 24', 'ديسمبر 24', 'يناير 25', 'فبراير 25', 'مارس 25', 'أبريل 25', 'مايو 25', 'يونيو 25'],
        datasets: [{
            label: 'مؤشر تداول العام (TASI)',
            data: [10572, 10789, 11207, 11356, 11024, 10832, 11178, 11432, 11568, 11275, 11093, 11284, 11356],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 3,
            tension: 0.3
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: marketData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'أداء مؤشر تداول العام (TASI) خلال 12 شهر'
                }
            },
            scales: {
                y: {
                    min: 10000,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Render GDP composition by sector chart
function renderGDPCompositionChart() {
    const ctx = document.getElementById('gdp-composition-chart').getContext('2d');
    
    const gdpCompositionData = {
        labels: [
            'النفط والغاز', 
            'الخدمات المالية', 
            'التصنيع', 
            'التجارة', 
            'الاتصالات والتقنية',
            'العقارات',
            'السياحة والترفيه',
            'أخرى'
        ],
        datasets: [{
            label: 'نسبة المساهمة في الناتج المحلي',
            data: [36, 14, 12, 10, 8, 7, 5, 8],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(255, 99, 255, 0.7)',
                'rgba(159, 159, 159, 0.7)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: gdpCompositionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'توزيع الناتج المحلي الإجمالي حسب القطاعات (2023)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render exports composition chart
function renderExportCompositionChart() {
    const ctx = document.getElementById('export-composition-chart').getContext('2d');
    
    const exportCompositionData = {
        labels: [
            'النفط الخام', 
            'المنتجات البترولية المكررة', 
            'البتروكيماويات', 
            'المعادن', 
            'الصناعات التحويلية',
            'المنتجات الزراعية',
            'أخرى'
        ],
        datasets: [{
            label: 'نسبة المساهمة في الصادرات',
            data: [65, 12, 10, 5, 4, 2, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(159, 159, 159, 0.7)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: exportCompositionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'تكوين الصادرات السعودية (2023)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render imports composition chart
function renderImportCompositionChart() {
    const ctx = document.getElementById('import-composition-chart').getContext('2d');
    
    const importCompositionData = {
        labels: [
            'الآلات والمعدات', 
            'السيارات ووسائل النقل', 
            'المنتجات الغذائية', 
            'المنسوجات والملابس', 
            'المواد الكيميائية',
            'الأجهزة الإلكترونية',
            'الأدوية الطبية',
            'أخرى'
        ],
        datasets: [{
            label: 'نسبة المساهمة في الواردات',
            data: [25, 18, 15, 12, 10, 8, 7, 5],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(255, 99, 255, 0.7)',
                'rgba(159, 159, 159, 0.7)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: importCompositionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'تكوين الواردات السعودية (2023)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render trade partners chart
function renderTradePartnersChart() {
    const ctx = document.getElementById('trade-partners-chart').getContext('2d');
    
    const tradePartnersData = {
        labels: ['الصين', 'الهند', 'اليابان', 'كوريا الجنوبية', 'الولايات المتحدة'],
        datasets: [{
            label: 'نسبة التصدير',
            data: [18, 12, 11, 9, 7],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'horizontalBar',
        data: tradePartnersData,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'أهم الشركاء التجاريين'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render growth forecast chart
function renderGrowthForecastChart() {
    const ctx = document.getElementById('growth-forecast-chart').getContext('2d');
    
    const forecastData = {
        labels: ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
        datasets: [{
            label: 'نمو الناتج المحلي المتوقع (%)',
            data: [2.8, 3.2, 3.5, 3.7, 4.1, 4.3, 4.5],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            type: 'line',
            tension: 0.3,
            fill: false
        }, {
            label: 'نمو القطاع غير النفطي المتوقع (%)',
            data: [3.5, 4.2, 4.8, 5.1, 5.3, 5.5, 5.7],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            type: 'bar'
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: forecastData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'توقعات النمو الاقتصادي حتى 2030'
                }
            }
        }
    });
}