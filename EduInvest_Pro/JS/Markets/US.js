document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dropdown menus
    initializeDropdowns();
    
    // Fetch data and render all charts
    fetchEconomicData()
        .then(() => {
            renderMarketChart();
            renderGDPChart();
            renderGDPCompositionChart();
            renderInflationChart();
            renderUnemploymentChart();
            renderTradeBalanceChart();
            renderTradePartnersChart();
            renderExportCompositionChart();
            renderImportCompositionChart();
            renderGrowthForecastChart();
            
            // Update market indices and forecasts
            updateMarketIndices();
            updateEconomicForecasts();
        })
        .catch(error => {
            console.error('Error loading economic data:', error);
        });
        
    // Add event listeners for interactivity
    setupInteractiveFeatures();
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

// Global data objects to store fetched data
let gdpData = null;
let inflationData = null;
let unemploymentData = null;
let tradeBalanceData = null;
let usData = {
    gdp: {
        total: 27.5, // In trillion USD
        perCapita: 81200, // In USD
        growth: 2.8, // Percentage
        forecastGrowth: [2.2, 2.1, 2.3, 2.4, 2.2, 2.3], // Next 6 years
        composition: {
            services: 47,
            industry: 12,
            technology: 11,
            trade: 9,
            realestate: 7,
            healthcare: 6,
            finance: 5,
            other: 3
        }
    },
    marketIndices: {
        sp500: {
            current: 5245.18,
            monthly: 2.5,
            yearly: 15.3,
            history: [4865, 4934, 5032, 5102, 5187, 5245, 5328, 5342, 5268, 5156, 5187, 5223, 5245]
        },
        nasdaq: {
            current: 16742.39,
            monthly: 3.2,
            yearly: 18.7
        },
        dowjones: {
            current: 38564.75,
            monthly: 1.8,
            yearly: 12.4
        },
        russell: {
            current: 2123.45,
            monthly: 1.2,
            yearly: 9.6
        }
    },
    sectors: [
        { name: 'التكنولوجيا', monthlyChange: 3.5, yearlyChange: 25.7 },
        { name: 'الرعاية الصحية', monthlyChange: 1.7, yearlyChange: 12.3 },
        { name: 'المالية', monthlyChange: 2.1, yearlyChange: 14.8 },
        { name: 'السلع الاستهلاكية', monthlyChange: 1.5, yearlyChange: 9.2 },
        { name: 'الصناعة', monthlyChange: -0.8, yearlyChange: 7.5 },
        { name: 'الطاقة', monthlyChange: -1.2, yearlyChange: -3.2 },
        { name: 'العقارات', monthlyChange: 0.4, yearlyChange: 5.9 },
        { name: 'المرافق العامة', monthlyChange: -0.3, yearlyChange: 2.1 },
        { name: 'المواد الأساسية', monthlyChange: 0.9, yearlyChange: 8.3 },
        { name: 'الاتصالات', monthlyChange: 2.6, yearlyChange: 17.8 }
    ],
    economicIndicators: {
        inflation: {
            current: 3.4,
            forecast: 2.5
        },
        unemployment: {
            current: 3.8,
            forecast: 3.6
        },
        interestRate: {
            current: 5.25,
            forecast: 4.75
        }
    },
    trade: {
        balance: -919, // In billion USD
        partners: [
            { name: 'الصين', percentage: 15.8 },
            { name: 'كندا', percentage: 14.9 },
            { name: 'المكسيك', percentage: 14.6 },
            { name: 'اليابان', percentage: 5.7 },
            { name: 'ألمانيا', percentage: 5.1 }
        ],
        exports: {
            machinery: 21,
            electronics: 15,
            chemicals: 12,
            agricultural: 9,
            vehicles: 8,
            aircraft: 7,
            petroleum: 6,
            other: 22
        },
        imports: {
            electronics: 24,
            vehicles: 17,
            consumer: 15,
            raw: 12,
            oil: 8,
            pharmaceutical: 6,
            medical: 5,
            other: 13
        }
    },
    reserves: {
        foreign: 716, // In billion USD
        governmentRevenue: 4.9, // In trillion USD
        debt: 34.2 // In trillion USD
    }
};

// Fetch economic data from JSON files
async function fetchEconomicData() {
    try {
        // Fetch GDP data
        const gdpResponse = await fetch('../../assets/data/gdp.json');
        gdpData = await gdpResponse.json();
        
        // Fetch inflation data
        const inflationResponse = await fetch('../../assets/data/inflation.json');
        inflationData = await inflationResponse.json();
        
        // Fetch unemployment data
        const unemploymentResponse = await fetch('../../assets/data/unemployment.json');
        unemploymentData = await unemploymentResponse.json();
        
        // Fetch trade balance data
        const tradeBalanceResponse = await fetch('../../assets/data/trade_balance.json');
        tradeBalanceData = await tradeBalanceResponse.json();
        
        // Process data for US market (in a real app, this would be US-specific data)
        console.log('Economic data loaded successfully');
        
        return true;
    } catch (error) {
        console.error('Error fetching economic data:', error);
        return false;
    }
}

// Render main market performance chart
function renderMarketChart() {
    const ctx = document.getElementById('market-chart')?.getContext('2d');
    if (!ctx) return;
    
    // Define months for the labels
    const months = ['يونيو 24', 'يوليو 24', 'أغسطس 24', 'سبتمبر 24', 'أكتوبر 24', 'نوفمبر 24', 'ديسمبر 24', 'يناير 25', 'فبراير 25', 'مارس 25', 'أبريل 25', 'مايو 25', 'يونيو 25'];
    
    // Use data from our global object
    const marketData = {
        labels: months,
        datasets: [{
            label: 'S&P 500',
            data: usData.marketIndices.sp500.history,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 3,
            tension: 0.3
        }]
    };
    
    // Look for an existing chart instance and destroy it if it exists
    if (window.marketChart instanceof Chart) {
        window.marketChart.destroy();
    }
    
    // Create new chart instance
    window.marketChart = new Chart(ctx, {
        type: 'line',
        data: marketData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'أداء مؤشر S&P 500 خلال 12 شهر'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toLocaleString();
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            scales: {
                y: {
                    min: Math.min(...usData.marketIndices.sp500.history) * 0.99,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Add comparison toggle if the element exists
    const comparisonToggle = document.getElementById('comparison-toggle');
    if (comparisonToggle) {
        comparisonToggle.addEventListener('change', function() {
            const showComparison = this.checked;
            
            if (showComparison) {
                // Add NASDAQ data for comparison
                window.marketChart.data.datasets.push({
                    label: 'ناسداك (مقياس ثانوي)',
                    data: [14500, 14800, 15200, 15400, 15800, 16000, 16300, 16500, 16300, 16000, 16200, 16500, 16742],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 3,
                    tension: 0.3,
                    yAxisID: 'y1'
                });
                
                // Add secondary y-axis
                window.marketChart.options.scales.y1 = {
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                };
            } else {
                // Remove NASDAQ data
                window.marketChart.data.datasets = window.marketChart.data.datasets.slice(0, 1);
                
                // Remove secondary y-axis
                delete window.marketChart.options.scales.y1;
            }
            
            window.marketChart.update();
        });
    }
}

// Render GDP growth chart
function renderGDPChart(yearFilter) {
    const ctx = document.getElementById('gdp-chart')?.getContext('2d');
    if (!ctx) return;
    
    // Define years and GDP growth values
    const years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    const values = [1.7, 2.3, 2.9, 2.3, -3.5, 5.7, 2.1, 2.5, 2.8];
    
    // Apply year filter if specified
    let filteredYears = years;
    let filteredValues = values;
    
    if (yearFilter) {
        const startIndex = years.indexOf(yearFilter);
        if (startIndex !== -1) {
            filteredYears = years.slice(startIndex);
            filteredValues = values.slice(startIndex);
        }
    }
    
    // Define chart data
    const chartData = {
        labels: filteredYears,
        datasets: [{
            label: 'معدل نمو الناتج المحلي الإجمالي (%)',
            data: filteredValues,
            backgroundColor: filteredValues.map(value => 
                value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
            ),
            borderColor: filteredValues.map(value => 
                value >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
            ),
            borderWidth: 1
        }]
    };
    
    // Look for an existing chart instance and destroy it if it exists
    if (window.gdpChart instanceof Chart) {
        window.gdpChart.destroy();
    }
    
    // Create new chart instance
    window.gdpChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'نمو الناتج المحلي الإجمالي الحقيقي للولايات المتحدة'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        },
                        afterLabel: function(context) {
                            const year = context.label;
                            const value = context.raw;
                            
                            // Add contextual information based on the year
                            if (year === '2020') {
                                return 'انكماش حاد بسبب جائحة كوفيد-19';
                            } else if (year === '2021') {
                                return 'تعافي قوي بعد الجائحة مدعوم بحزم التحفيز';
                            } else if (value > 2.5) {
                                return 'نمو قوي فوق المتوسط التاريخي';
                            } else if (value < 0) {
                                return 'انكماش اقتصادي';
                            } else {
                                return 'نمو معتدل ضمن المعدل التاريخي';
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'معدل النمو (%)'
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const year = filteredYears[index];
                    const value = filteredValues[index];
                    
                    // Show detailed information about the selected year
                    const gdpDetailElement = document.getElementById('gdp-detail');
                    if (gdpDetailElement) {
                        gdpDetailElement.innerHTML = `
                            <h4>تفاصيل النمو الاقتصادي لعام ${year}</h4>
                            <p>معدل النمو: <strong>${value}%</strong></p>
                            <p>${getGDPAnalysisForYear(year, value)}</p>
                        `;
                        
                        // Show the detail container
                        gdpDetailElement.style.display = 'block';
                    }
                }
            }
        }
    });
    
    // Add a trend line to the GDP chart
    const trendToggle = document.getElementById('trend-toggle');
    if (trendToggle) {
        trendToggle.addEventListener('change', function() {
            const showTrend = this.checked;
            
            if (showTrend) {
                // Calculate trend values (simplified linear trend)
                const trendValues = calculateLinearTrend(filteredValues);
                
                // Add trend line dataset
                window.gdpChart.data.datasets.push({
                    label: 'اتجاه النمو',
                    data: trendValues,
                    type: 'line',
                    fill: false,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                });
            } else {
                // Remove trend line dataset
                window.gdpChart.data.datasets = window.gdpChart.data.datasets.slice(0, 1);
            }
            
            window.gdpChart.update();
        });
    }
}

// Helper function to get GDP analysis for a specific year
function getGDPAnalysisForYear(year, value) {
    switch(year) {
        case '2016':
            return 'نمو معتدل للاقتصاد الأمريكي، متأثراً بالاستهلاك الخاص وانخفاض الاستثمارات.';
        case '2017':
            return 'تحسن في معدل النمو بسبب زيادة الإنفاق الاستهلاكي وتحسن الصادرات.';
        case '2018':
            return 'أعلى معدل نمو قبل الجائحة، مدفوعاً بالإصلاح الضريبي وزيادة الإنفاق الحكومي.';
        case '2019':
            return 'تباطؤ في النمو مقارنة بالعام السابق بسبب التوترات التجارية وتباطؤ الاقتصاد العالمي.';
        case '2020':
            return 'انكماش حاد بسبب إجراءات الإغلاق المرتبطة بجائحة كوفيد-19، وهو الأسوأ منذ الكساد الكبير.';
        case '2021':
            return 'تعافٍ قوي مدفوع بحزم التحفيز الاقتصادي وعودة النشاط بعد فترة الإغلاق.';
        case '2022':
            return 'تباطؤ في النمو بسبب ارتفاع التضخم وزيادة أسعار الفائدة من قبل الاحتياطي الفيدرالي.';
        case '2023':
            return 'تحسن في النمو رغم استمرار أسعار الفائدة المرتفعة، مدعوماً بقوة سوق العمل وإنفاق المستهلكين.';
        case '2024':
            return 'استمرار النمو الاقتصادي القوي مع بدء السيطرة على التضخم وحفاظ سوق العمل على قوته.';
        default:
            return value >= 0 ? 'نمو إيجابي للاقتصاد الأمريكي' : 'انكماش في الاقتصاد الأمريكي';
    }
}

// Helper function to calculate linear trend
function calculateLinearTrend(values) {
    const n = values.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += values[i];
        sumXY += i * values[i];
        sumXX += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate trend values
    return values.map((_, i) => intercept + slope * i);
}

// Render GDP composition by sector chart
function renderGDPCompositionChart() {
    const ctx = document.getElementById('gdp-composition-chart')?.getContext('2d');
    if (!ctx) return;
    
    // Use data from our global object
    const gdpCompositionLabels = [
        'الخدمات', 
        'الصناعة', 
        'التقنية والمعلومات', 
        'التجارة', 
        'العقارات',
        'الرعاية الصحية',
        'الخدمات المالية',
        'أخرى'
    ];
    
    const gdpCompositionValues = [
        usData.gdp.composition.services,
        usData.gdp.composition.industry,
        usData.gdp.composition.technology,
        usData.gdp.composition.trade,
        usData.gdp.composition.realestate,
        usData.gdp.composition.healthcare,
        usData.gdp.composition.finance,
        usData.gdp.composition.other
    ];
    
    // Define sector descriptions for tooltips
    const sectorDescriptions = {
        'الخدمات': 'يشمل الخدمات المالية والتعليمية والإدارية والاتصالات',
        'الصناعة': 'يشمل التصنيع والبناء والتعدين والطاقة',
        'التقنية والمعلومات': 'يشمل البرمجيات والأجهزة والاتصالات وتكنولوجيا المعلومات',
        'التجارة': 'يشمل تجارة الجملة والتجزئة والتجارة الإلكترونية',
        'العقارات': 'يشمل المباني السكنية والتجارية وخدمات العقارات',
        'الرعاية الصحية': 'يشمل المستشفيات والأدوية والتأمين الصحي',
        'الخدمات المالية': 'يشمل البنوك والتأمين والاستثمار',
        'أخرى': 'يشمل الزراعة والترفيه والقطاعات الأخرى'
    };
    
    const gdpCompositionData = {
        labels: gdpCompositionLabels,
        datasets: [{
            label: 'نسبة المساهمة في الناتج المحلي',
            data: gdpCompositionValues,
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
            hoverBackgroundColor: [
                'rgba(255, 99, 132, 0.9)',
                'rgba(54, 162, 235, 0.9)',
                'rgba(255, 206, 86, 0.9)',
                'rgba(75, 192, 192, 0.9)',
                'rgba(153, 102, 255, 0.9)',
                'rgba(255, 159, 64, 0.9)',
                'rgba(255, 99, 255, 0.9)',
                'rgba(159, 159, 159, 0.9)'
            ],
            borderWidth: 1,
            hoverBorderWidth: 2
        }]
    };
    
    // Look for an existing chart instance and destroy it if it exists
    if (window.gdpCompositionChart instanceof Chart) {
        window.gdpCompositionChart.destroy();
    }
    
    // Create new chart instance with advanced options
    window.gdpCompositionChart = new Chart(ctx, {
        type: 'doughnut',
        data: gdpCompositionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'توزيع الناتج المحلي الإجمالي الأمريكي حسب القطاعات (2024)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        },
                        afterLabel: function(context) {
                            // Add sector description
                            const sectorName = context.label;
                            return sectorDescriptions[sectorName] || '';
                        }
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 15
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const label = gdpCompositionLabels[index];
                    const value = gdpCompositionValues[index];
                    
                    // Show detailed information about the selected sector
                    const infoContainer = document.getElementById('gdp-composition-analysis');
                    if (infoContainer) {
                        infoContainer.innerHTML = `
                            <h4>${label}</h4>
                            <p><strong>نسبة المساهمة:</strong> ${value}% من الناتج المحلي الإجمالي</p>
                            <p><strong>التفاصيل:</strong> ${sectorDescriptions[label]}</p>
                            <p>${getSectorAnalysis(label)}</p>
                        `;
                    }
                    
                    // Highlight selected segment
                    window.gdpCompositionChart.setActiveElements([{
                        datasetIndex: 0,
                        index: index
                    }]);
                    window.gdpCompositionChart.update();
                }
            }
        }
    });
    
    // Add chart type toggle if the element exists
    const chartTypeToggle = document.getElementById('chart-type-toggle');
    if (chartTypeToggle) {
        chartTypeToggle.addEventListener('change', function() {
            // Change chart type between doughnut and bar
            const newType = this.checked ? 'bar' : 'doughnut';
            
            // Update chart configuration
            window.gdpCompositionChart.config.type = newType;
            
            // Additional configurations for bar chart
            if (newType === 'bar') {
                window.gdpCompositionChart.options.indexAxis = 'y';
                window.gdpCompositionChart.options.scales = {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'نسبة المساهمة (%)'
                        }
                    }
                };
            } else {
                // Reset for doughnut chart
                delete window.gdpCompositionChart.options.indexAxis;
                delete window.gdpCompositionChart.options.scales;
            }
            
            window.gdpCompositionChart.update();
        });
    }
}

// Helper function for sector analysis
function getSectorAnalysis(sector) {
    switch(sector) {
        case 'الخدمات':
            return 'يُعد قطاع الخدمات المحرك الرئيسي للاقتصاد الأمريكي، ويظهر نمواً مستمراً بمعدل 3.2% سنوياً. القطاع يوظف أكثر من 80% من القوى العاملة الأمريكية ويتميز بإنتاجية عالية وقيمة مضافة كبيرة.';
        case 'الصناعة':
            return 'رغم تراجع حصته النسبية، لا يزال قطاع الصناعة يلعب دوراً مهماً في الاقتصاد الأمريكي، خاصة في مجالات التصنيع المتقدم والتقنيات الحديثة. يواجه القطاع تحديات المنافسة العالمية والأتمتة، لكنه يتميز بإنتاجية عالية.';
        case 'التقنية والمعلومات':
            return 'يُعتبر من أسرع القطاعات نمواً بمعدل 6.7% سنوياً، ويضم عمالقة التكنولوجيا العالمية مثل آبل ومايكروسوفت وجوجل وأمازون. الذكاء الاصطناعي والحوسبة السحابية من أهم محركات النمو للقطاع.';
        case 'التجارة':
            return 'يشهد تحولاً كبيراً نحو التجارة الإلكترونية التي تشكل الآن أكثر من 15% من إجمالي المبيعات. يوظف القطاع حوالي 14% من القوى العاملة الأمريكية ويتأثر بشكل مباشر بتقلبات الإنفاق الاستهلاكي.';
        case 'العقارات':
            return 'يعاني قطاع العقارات حالياً من تحديات ارتفاع أسعار الفائدة، لكنه يظل محركاً مهماً للنشاط الاقتصادي. النقص في المساكن ميسورة التكلفة يمثل تحدياً رئيسياً، بينما تشهد المناطق الحضرية الصغيرة نمواً ملحوظاً.';
        case 'الرعاية الصحية':
            return 'من أكثر القطاعات مرونة في الاقتصاد الأمريكي، ويشهد نمواً مستداماً مدفوعاً بالشيخوخة السكانية والابتكارات الطبية. ينفق الأمريكيون حوالي 18% من الناتج المحلي الإجمالي على الرعاية الصحية، وهي أعلى نسبة عالمياً.';
        case 'الخدمات المالية':
            return 'يلعب دوراً محورياً في النظام المالي العالمي، مع تركز أكبر البنوك والمؤسسات المالية في الولايات المتحدة. القطاع يشهد تحولاً رقمياً سريعاً مع نمو التقنيات المالية (FinTech) ووسائل الدفع الرقمية.';
        case 'أخرى':
            return 'تشمل مجموعة متنوعة من القطاعات مثل الزراعة التي تتميز بكفاءة عالية جداً، والترفيه الذي يعتبر من الصناعات التصديرية المهمة للولايات المتحدة على المستوى الثقافي والاقتصادي.';
        default:
            return 'يساهم هذا القطاع في تنويع الاقتصاد الأمريكي وتعزيز مرونته أمام التغيرات الاقتصادية العالمية.';
    }
}

// Render Inflation chart
function renderInflationChart() {
    const ctx = document.getElementById('inflation-chart')?.getContext('2d');
    if (!ctx) return;
    
    const inflationData = {
        labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        values: [1.3, 2.1, 2.4, 1.8, 1.2, 4.7, 8.0, 4.1, 3.4]
    };
    
    // Define target inflation zone (2% target with +/- 1% tolerance)
    const targetMin = Array(inflationData.labels.length).fill(1);
    const targetMax = Array(inflationData.labels.length).fill(3);
    
    // Look for an existing chart instance and destroy it if it exists
    if (window.inflationChart instanceof Chart) {
        window.inflationChart.destroy();
    }
    
    // Create new chart instance
    window.inflationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: inflationData.labels,
            datasets: [
                {
                    label: 'معدل التضخم السنوي (%)',
                    data: inflationData.values,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        if (value >= 1 && value <= 3) {
                            return 'rgba(75, 192, 192, 1)'; // In target range
                        } else if (value > 3) {
                            return 'rgba(255, 99, 132, 1)'; // Above target
                        } else {
                            return 'rgba(54, 162, 235, 1)'; // Below target
                        }
                    },
                    pointRadius: 5,
                    fill: true,
                    tension: 0.3,
                    order: 2
                },
                {
                    label: 'الحد الأدنى للنطاق المستهدف (1%)',
                    data: targetMin,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgba(75, 192, 192, 0.5)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    tension: 0,
                    order: 3
                },
                {
                    label: 'الحد الأعلى للنطاق المستهدف (3%)',
                    data: targetMax,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgba(75, 192, 192, 0.5)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: '+1', // Fill between this dataset and the previous one
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'معدل التضخم السنوي في الولايات المتحدة'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                const value = context.raw;
                                let status = '';
                                
                                if (value >= 1 && value <= 3) {
                                    status = '(ضمن النطاق المستهدف)';
                                } else if (value > 3) {
                                    status = '(أعلى من النطاق المستهدف)';
                                } else {
                                    status = '(أقل من النطاق المستهدف)';
                                }
                                
                                return `${context.dataset.label}: ${value}% ${status}`;
                            }
                            return context.dataset.label;
                        },
                        afterLabel: function(context) {
                            if (context.datasetIndex !== 0) return;
                            const year = context.label;
                            const value = context.raw;
                            
                            return getInflationAnalysisForYear(year, value);
                        }
                    }
                },
                annotation: {
                    annotations: {
                        targetLine: {
                            type: 'line',
                            yMin: 2,
                            yMax: 2,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            label: {
                                content: 'المستهدف (2%)',
                                enabled: true,
                                position: 'start'
                            }
                        },
                        covidPeriod: {
                            type: 'box',
                            xMin: 4,
                            xMax: 6,
                            backgroundColor: 'rgba(255, 99, 132, 0.05)',
                            borderColor: 'rgba(255, 99, 132, 0.3)',
                            borderWidth: 1,
                            label: {
                                content: 'فترة كوفيد والتعافي',
                                enabled: true,
                                position: 'center'
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'معدل التضخم (%)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            onClick: function(event, elements) {
                if (elements.length > 0 && elements[0].datasetIndex === 0) {
                    const index = elements[0].index;
                    const year = inflationData.labels[index];
                    const value = inflationData.values[index];
                    
                    // Show detailed information about the selected year
                    const inflationDetailElement = document.getElementById('inflation-analysis');
                    if (inflationDetailElement) {
                        inflationDetailElement.innerHTML = `
                            <h4>تحليل التضخم لعام ${year}</h4>
                            <p>معدل التضخم: <strong>${value}%</strong></p>
                            <p>${getInflationAnalysisForYear(year, value)}</p>
                            <p>${getInflationImpact(value)}</p>
                        `;
                    }
                }
            }
        }
    });
    
    // Add CPI components toggle if the element exists
    const cpiToggle = document.getElementById('cpi-toggle');
    if (cpiToggle) {
        cpiToggle.addEventListener('change', function() {
            const showComponents = this.checked;
            
            if (showComponents) {
                // Add CPI components data
                window.inflationChart.data.datasets.push(
                    {
                        label: 'السكن',
                        data: [1.8, 2.6, 3.2, 2.7, 1.4, 3.5, 7.9, 6.3, 5.2],
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 2,
                        pointRadius: 3,
                        tension: 0.3,
                        hidden: false
                    },
                    {
                        label: 'الغذاء',
                        data: [0.8, 1.3, 1.6, 1.8, 3.5, 6.3, 10.4, 4.6, 2.7],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 2,
                        pointRadius: 3,
                        tension: 0.3,
                        hidden: false
                    },
                    {
                        label: 'النقل والطاقة',
                        data: [-2.8, 3.1, 3.0, -0.7, -3.5, 13.2, 14.1, 1.3, 1.8],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 2,
                        pointRadius: 3,
                        tension: 0.3,
                        hidden: false
                    }
                );
                
                // Hide target range datasets
                window.inflationChart.data.datasets[1].hidden = true;
                window.inflationChart.data.datasets[2].hidden = true;
            } else {
                // Remove CPI components
                window.inflationChart.data.datasets = window.inflationChart.data.datasets.slice(0, 3);
                
                // Show target range datasets
                window.inflationChart.data.datasets[1].hidden = false;
                window.inflationChart.data.datasets[2].hidden = false;
            }
            
            window.inflationChart.update();
        });
    }
}

// Helper function for inflation analysis by year
function getInflationAnalysisForYear(year, value) {
    switch(year) {
        case '2016':
            return 'معدل تضخم منخفض بسبب انخفاض أسعار الطاقة وضعف النمو العالمي';
        case '2017':
            return 'ارتفاع معتدل للتضخم مع تحسن الاقتصاد وزيادة الطلب المحلي';
        case '2018':
            return 'استمرار ارتفاع التضخم مع قوة سوق العمل والنمو الاقتصادي';
        case '2019':
            return 'انخفاض التضخم نسبياً رغم استمرار النمو الاقتصادي';
        case '2020':
            return 'انخفاض التضخم بسبب تراجع النشاط الاقتصادي أثناء الجائحة';
        case '2021':
            return 'ارتفاع حاد للتضخم بسبب اضطرابات سلاسل التوريد والطلب المكبوت بعد الجائحة';
        case '2022':
            return 'أعلى معدل تضخم منذ 40 عاماً بسبب حزم التحفيز واضطرابات العرض والحرب الروسية الأوكرانية';
        case '2023':
            return 'بداية انخفاض معدلات التضخم مع تشديد السياسة النقدية وتحسن سلاسل التوريد';
        case '2024':
            return 'استمرار انخفاض التضخم نحو المعدلات المستهدفة مع استمرار السياسة النقدية المتشددة';
        default:
            return 'معدل تضخم يعكس الظروف الاقتصادية للفترة';
    }
}

// Helper function for inflation impact analysis
function getInflationImpact(value) {
    if (value < 1) {
        return 'تضخم منخفض جداً يثير مخاوف الانكماش ويقيد قدرة البنك المركزي على خفض أسعار الفائدة في حالة الركود.';
    } else if (value >= 1 && value <= 3) {
        return 'معدل تضخم صحي ضمن النطاق المستهدف للاحتياطي الفيدرالي، يدعم النمو الاقتصادي المستدام.';
    } else if (value > 3 && value <= 5) {
        return 'تضخم مرتفع عن المستهدف، يؤدي إلى تآكل القوة الشرائية وقد يستدعي تشديد السياسة النقدية.';
    } else {
        return 'تضخم مرتفع جداً يضر بالاقتصاد، يؤثر سلباً على المدخرين وذوي الدخل الثابت ويتطلب إجراءات صارمة من البنك المركزي.';
    }
}

// Render Unemployment chart
function renderUnemploymentChart() {
    const ctx = document.getElementById('unemployment-chart').getContext('2d');
    
    const unemploymentData = {
        labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        values: [4.9, 4.4, 3.9, 3.7, 8.1, 5.4, 3.6, 3.7, 3.8]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: unemploymentData.labels,
            datasets: [{
                label: 'معدل البطالة (%)',
                data: unemploymentData.values,
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
                    text: 'معدل البطالة في الولايات المتحدة'
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 10
                }
            }
        }
    });
}

// Render Trade Balance chart
function renderTradeBalanceChart() {
    const ctx = document.getElementById('trade-balance-chart')?.getContext('2d');
    if (!ctx) return;
    
    // Trade balance data (in billions USD)
    const tradeData = {
        labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        balance: [-502, -552, -648, -617, -678, -845, -948, -920, -919],
        exports: [1450, 1547, 1663, 1647, 1431, 1761, 2001, 2046, 2090],
        imports: [1952, 2099, 2311, 2264, 2109, 2606, 2949, 2966, 3009]
    };
    
    // Look for an existing chart instance and destroy it if it exists
    if (window.tradeBalanceChart instanceof Chart) {
        window.tradeBalanceChart.destroy();
    }
    
    // Create new chart instance
    window.tradeBalanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tradeData.labels,
            datasets: [{
                label: 'الميزان التجاري (مليار دولار)',
                data: tradeData.balance,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                order: 3
            }]
        },
        options: {            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'الميزان التجاري للولايات المتحدة'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        afterTitle: function(context) {
                            const index = context[0].dataIndex;
                            const exports = tradeData.exports[index];
                            const imports = tradeData.imports[index];
                            
                            return `\nصادرات: ${exports} مليار دولار\nواردات: ${imports} مليار دولار`;
                        },
                        label: function(context) {
                            if (context.dataset.label.includes('الميزان')) {
                                return `${context.dataset.label}: ${context.raw} مليار دولار`;
                            }
                            return `${context.dataset.label}: ${context.raw} مليار دولار`;
                        },
                        afterLabel: function(context) {
                            if (context.datasetIndex === 0) { // Trade balance dataset
                                const year = context.label;
                                const value = context.raw;
                                
                                if (value <= -900) {
                                    return 'عجز تجاري كبير يتجاوز 4% من الناتج المحلي الإجمالي';
                                } else if (value <= -700) {
                                    return 'عجز تجاري مرتفع بين 3-4% من الناتج المحلي الإجمالي';
                                } else if (value <= -500) {
                                    return 'عجز تجاري متوسط حوالي 2.5% من الناتج المحلي الإجمالي';
                                } else {
                                    return 'عجز تجاري منخفض نسبياً أقل من 2.5% من الناتج المحلي الإجمالي';
                                }
                            }
                            return null;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'مليار دولار أمريكي'
                    }
                }
            }
        }
    });
    
    // Add exports/imports toggle if the element exists
    const tradeDetailsToggle = document.getElementById('trade-details-toggle');
    if (tradeDetailsToggle) {
        tradeDetailsToggle.addEventListener('change', function() {
            const showDetails = this.checked;
            
            if (showDetails) {
                // Add exports and imports datasets
                window.tradeBalanceChart.data.datasets.push(
                    {
                        label: 'الصادرات',
                        data: tradeData.exports,
                        type: 'line',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 3,
                        order: 1
                    },
                    {
                        label: 'الواردات',
                        data: tradeData.imports,
                        type: 'line',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 3,
                        order: 2
                    }
                );
            } else {
                // Remove exports and imports datasets
                window.tradeBalanceChart.data.datasets = window.tradeBalanceChart.data.datasets.slice(0, 1);
            }
            
            window.tradeBalanceChart.update();
        });
    }
    
    // Add interactive year selection
    const yearsElement = document.getElementById('trade-years');
    if (yearsElement) {
        tradeData.labels.forEach(year => {
            const button = document.createElement('button');
            button.className = 'year-button';
            button.textContent = year;
            button.addEventListener('click', function() {
                const index = tradeData.labels.indexOf(year);
                
                // Update trade analysis content
                const tradeAnalysis = document.getElementById('trade-balance-analysis');
                if (tradeAnalysis) {
                    const balance = tradeData.balance[index];
                    const exports = tradeData.exports[index];
                    const imports = tradeData.imports[index];
                    const coverage = ((exports / imports) * 100).toFixed(1);
                    
                    tradeAnalysis.innerHTML = `
                        <h4>تحليل الميزان التجاري لعام ${year}</h4>
                        <p>
                            <strong>العجز التجاري:</strong> ${Math.abs(balance)} مليار دولار
                            <br><strong>الصادرات:</strong> ${exports} مليار دولار
                            <br><strong>الواردات:</strong> ${imports} مليار دولار
                            <br><strong>نسبة تغطية الصادرات للواردات:</strong> ${coverage}%
                        </p>
                        <p>${getTradeAnalysisForYear(year, balance)}</p>
                    `;
                }
                
                // Highlight the selected year in the chart
                window.tradeBalanceChart.setActiveElements([{
                    datasetIndex: 0,
                    index: index
                }]);
                window.tradeBalanceChart.tooltip.setActiveElements([{
                    datasetIndex: 0,
                    index: index
                }]);
                window.tradeBalanceChart.update();
            });
            yearsElement.appendChild(button);
        });
    }
}

// Helper function for trade balance analysis by year
function getTradeAnalysisForYear(year, balance) {
    switch(year) {
        case '2016':
            return 'العجز التجاري متأثر بقوة الدولار وضعف الطلب العالمي، مع تراجع الصادرات النفطية الأمريكية.';
        case '2017':
            return 'توسع العجز التجاري رغم بدء سياسات حمائية جديدة، مع نمو الواردات بوتيرة أسرع من الصادرات.';
        case '2018':
            return 'اتساع العجز التجاري رغم الرسوم الجمركية الجديدة على الصين، مع تأثير التخفيضات الضريبية على زيادة الاستهلاك والاستيراد.';
        case '2019':
            return 'تقلص العجز التجاري بشكل طفيف مع انخفاض الواردات من الصين بسبب الحرب التجارية وتباطؤ النمو الاقتصادي.';
        case '2020':
            return 'اتساع العجز التجاري رغم انخفاض التجارة العالمية خلال الجائحة، بسبب انخفاض الصادرات بنسبة أكبر من انخفاض الواردات.';
        case '2021':
            return 'عجز تجاري قياسي بسبب التعافي السريع للاقتصاد الأمريكي وارتفاع الطلب الاستهلاكي على السلع المستوردة.';
        case '2022':
            return 'أكبر عجز تجاري في التاريخ الأمريكي مع استمرار قوة الدولار وارتفاع أسعار الطاقة والسلع المستوردة بسبب التضخم.';
        case '2023':
            return 'تقلص العجز التجاري بشكل طفيف مع تباطؤ النمو الاقتصادي وانخفاض الطلب على السلع المستوردة.';
        case '2024':
            return 'استقرار العجز التجاري عند مستويات مرتفعة، مما يعكس اعتماد الاقتصاد الأمريكي المستمر على الواردات وتحدي تعزيز القدرة التنافسية للصادرات.';
        default:
            return 'العجز التجاري الأمريكي يعكس هيكل الاقتصاد الاستهلاكي وقوة الدولار وتحديات القدرة التنافسية التصديرية.';
    }
}

// Render trade partners chart
function renderTradePartnersChart() {
    const ctx = document.getElementById('trade-partners-chart').getContext('2d');
    
    const tradePartnersData = {
        labels: ['الصين', 'كندا', 'المكسيك', 'اليابان', 'ألمانيا'],
        datasets: [{
            label: 'نسبة التبادل التجاري',
            data: [15.8, 14.9, 14.6, 5.7, 5.1],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
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

// Render exports composition chart
function renderExportCompositionChart() {
    const ctx = document.getElementById('export-composition-chart').getContext('2d');
    
    const exportCompositionData = {
        labels: [
            'الآلات والمعدات', 
            'السلع الإلكترونية', 
            'المواد الكيميائية', 
            'المنتجات الزراعية', 
            'المركبات',
            'الطائرات',
            'المنتجات البترولية',
            'أخرى'
        ],
        datasets: [{
            label: 'نسبة المساهمة في الصادرات',
            data: [21, 15, 12, 9, 8, 7, 6, 22],
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
        data: exportCompositionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'تكوين الصادرات الأمريكية (2023)'
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
            'الإلكترونيات والتقنية', 
            'السيارات والآليات', 
            'المنتجات الاستهلاكية', 
            'المواد الخام', 
            'النفط والغاز',
            'المنتجات الصيدلانية',
            'المعدات الطبية',
            'أخرى'
        ],
        datasets: [{
            label: 'نسبة المساهمة في الواردات',
            data: [24, 17, 15, 12, 8, 6, 5, 13],
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
                    text: 'تكوين الواردات الأمريكية (2023)'
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

// Render growth forecast chart
function renderGrowthForecastChart() {
    const ctx = document.getElementById('growth-forecast-chart')?.getContext('2d');
    if (!ctx) return;
    
    // Define forecast scenarios
    const baseScenario = {
        gdp: [2.2, 2.1, 2.3, 2.4, 2.2, 2.3],
        inflation: [2.8, 2.6, 2.5, 2.3, 2.2, 2.0],
        unemployment: [3.7, 3.6, 3.6, 3.7, 3.8, 3.8],
        interest: [4.75, 4.0, 3.75, 3.5, 3.5, 3.5]
    };
    
    const optimisticScenario = {
        gdp: [2.8, 3.0, 3.1, 2.9, 2.7, 2.6],
        inflation: [2.5, 2.3, 2.2, 2.0, 2.0, 2.0],
        unemployment: [3.4, 3.3, 3.2, 3.2, 3.3, 3.4],
        interest: [4.5, 3.75, 3.5, 3.25, 3.25, 3.25]
    };
    
    const pessimisticScenario = {
        gdp: [1.5, 1.0, 0.5, 1.2, 1.8, 2.0],
        inflation: [3.2, 3.5, 2.8, 2.2, 2.0, 1.8],
        unemployment: [4.2, 4.8, 5.2, 5.0, 4.5, 4.2],
        interest: [5.0, 4.5, 3.75, 3.5, 3.25, 3.0]
    };
    
    // Use base scenario by default
    const forecastData = {
        labels: ['2025', '2026', '2027', '2028', '2029', '2030'],
        datasets: [{
            label: 'نمو الناتج المحلي المتوقع (%)',
            data: baseScenario.gdp,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            type: 'line',
            tension: 0.3,
            fill: false
        }, {
            label: 'التضخم المتوقع (%)',
            data: baseScenario.inflation,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            type: 'line',
            tension: 0.3,
            fill: false
        }]
    };
    
    // Look for an existing chart instance and destroy it if it exists
    if (window.growthForecastChart instanceof Chart) {
        window.growthForecastChart.destroy();
    }
    
    // Create new chart instance
    window.growthForecastChart = new Chart(ctx, {
        type: 'bar',
        data: forecastData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'التوقعات الاقتصادية حتى 2030'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'النسبة المئوية (%)'
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const year = forecastData.labels[index];
                    
                    // Update forecast details
                    updateForecastDetails(year, index, 'base');
                }
            }
        }
    });
    
    // Add scenario selector if the element exists
    const scenarioSelector = document.getElementById('scenario-selector');
    if (scenarioSelector) {
        scenarioSelector.addEventListener('change', function() {
            const selectedScenario = this.value;
            updateForecastScenario(selectedScenario);
        });
    }
    
    // Add indicator toggle if the element exists
    const indicatorToggle = document.getElementById('indicator-toggle');
    if (indicatorToggle) {
        indicatorToggle.addEventListener('change', function() {
            const showUnemployment = this.checked;
            
            // Check if unemployment dataset already exists
            const hasUnemployment = window.growthForecastChart.data.datasets.some(ds => ds.label.includes('البطالة'));
            
            if (showUnemployment && !hasUnemployment) {
                // Add unemployment rate dataset
                window.growthForecastChart.data.datasets.push({
                    label: 'معدل البطالة المتوقع (%)',
                    data: baseScenario.unemployment,
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    type: 'line',
                    tension: 0.3,
                    fill: false
                });
                
                // Add interest rate dataset
                window.growthForecastChart.data.datasets.push({
                    label: 'سعر الفائدة المتوقع (%)',
                    data: baseScenario.interest,
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    type: 'line',
                    tension: 0.3,
                    fill: false
                });
            } else if (!showUnemployment && hasUnemployment) {
                // Remove unemployment and interest datasets
                window.growthForecastChart.data.datasets = window.growthForecastChart.data.datasets.slice(0, 2);
            }
            
            window.growthForecastChart.update();
        });
    }
    
    // Function to update forecast scenario
    function updateForecastScenario(scenario) {
        let selectedScenario;
        let scenarioName;
        
        switch(scenario) {
            case 'optimistic':
                selectedScenario = optimisticScenario;
                scenarioName = 'متفائل';
                break;
            case 'pessimistic':
                selectedScenario = pessimisticScenario;
                scenarioName = 'متحفظ';
                break;
            default:
                selectedScenario = baseScenario;
                scenarioName = 'أساسي';
                break;
        }
        
        // Update GDP growth data
        window.growthForecastChart.data.datasets[0].data = selectedScenario.gdp;
        
        // Update inflation data
        window.growthForecastChart.data.datasets[1].data = selectedScenario.inflation;
        
        // Update unemployment and interest rate if they exist
        if (window.growthForecastChart.data.datasets.length > 2) {
            window.growthForecastChart.data.datasets[2].data = selectedScenario.unemployment;
            window.growthForecastChart.data.datasets[3].data = selectedScenario.interest;
        }
        
        // Update chart title
        window.growthForecastChart.options.plugins.title.text = `التوقعات الاقتصادية حتى 2030 (سيناريو ${scenarioName})`;
        
        // Update chart
        window.growthForecastChart.update();
        
        // Update forecast details for the first year in the new scenario
        updateForecastDetails('2025', 0, scenario);
    }
    
    // Function to update forecast details
    function updateForecastDetails(year, index, scenario) {
        const forecastAnalysis = document.getElementById('economy-forecast-analysis');
        if (!forecastAnalysis) return;
        
        let scenarioData;
        let scenarioDescription;
        
        switch(scenario) {
            case 'optimistic':
                scenarioData = optimisticScenario;
                scenarioDescription = 'يفترض هذا السيناريو المتفائل تسارع النمو الاقتصادي مع انخفاض التضخم، مدفوعاً بزيادة الإنتاجية وتحسن العلاقات التجارية العالمية وتسريع الابتكار التكنولوجي.';
                break;
            case 'pessimistic':
                scenarioData = pessimisticScenario;
                scenarioDescription = 'يفترض هذا السيناريو المتحفظ تباطؤاً اقتصادياً مع فترة ركود قصيرة في 2026-2027، نتيجة لتحديات جيوسياسية وصدمات اقتصادية عالمية واستمرار التضخم.';
                break;
            default:
                scenarioData = baseScenario;
                scenarioDescription = 'يمثل هذا السيناريو الأساسي توقعات النمو المعتدل مع استقرار تدريجي للتضخم، مع افتراض عدم حدوث صدمات كبيرة في الاقتصاد العالمي.';
                break;
        }
        
        const gdp = scenarioData.gdp[index];
        const inflation = scenarioData.inflation[index];
        const unemployment = scenarioData.unemployment[index];
        const interest = scenarioData.interest[index];
        
        forecastAnalysis.innerHTML = `
            <h4>توقعات اقتصادية لعام ${year}</h4>
            <div class="forecast-details">
                <p><strong>النمو الاقتصادي:</strong> ${gdp}%</p>
                <p><strong>التضخم:</strong> ${inflation}%</p>
                <p><strong>البطالة:</strong> ${unemployment}%</p>
                <p><strong>سعر الفائدة:</strong> ${interest}%</p>
            </div>
            <div class="forecast-analysis">
                <p><strong>تحليل السيناريو:</strong> ${scenarioDescription}</p>
                <p><strong>القطاعات الواعدة:</strong> ${getPromisingSecators(scenario)}</p>
                <p><strong>المخاطر الرئيسية:</strong> ${getRisks(scenario)}</p>
            </div>
        `;
    }
    
    // Helper function to get promising sectors based on scenario
    function getPromisingSecators(scenario) {
        switch(scenario) {
            case 'optimistic':
                return 'الذكاء الاصطناعي، الطاقة المتجددة، التقنيات الحيوية، السياحة الفضائية، الروبوتات المتقدمة';
            case 'pessimistic':
                return 'الرعاية الصحية، السلع الأساسية، قطاعات الدفاع، الطاقة التقليدية، الخدمات المالية الآمنة';
            default:
                return 'التكنولوجيا، الرعاية الصحية، الطاقة النظيفة، التقنيات المالية، البنية التحتية';
        }
    }
    
    // Helper function to get risks based on scenario
    function getRisks(scenario) {
        switch(scenario) {
            case 'optimistic':
                return 'ارتفاع قيمة الأصول وخطر الفقاعات المالية، تزايد التفاوت الاقتصادي، مخاطر الأمن السيبراني';
            case 'pessimistic':
                return 'ارتفاع معدلات البطالة، تزايد الديون العامة، اضطرابات اجتماعية، تعطل سلاسل التوريد العالمية';
            default:
                return 'التوترات الجيوسياسية، ارتفاع الديون العامة، تحديات التغير المناخي، اضطرابات سلاسل التوريد';
        }
    }
    
    // Initialize with base scenario details
    updateForecastDetails('2025', 0, 'base');
}

// Update market indices in the UI
function updateMarketIndices() {
    // Update S&P 500
    const sp500 = document.querySelector('#sp500 .index-value') || document.querySelector('.index-card:nth-child(2) .index-value');
    const sp500Monthly = document.querySelector('#sp500 .index-change.monthly') || document.querySelector('.index-card:nth-child(2) .index-header span.change-positive');
    const sp500Yearly = document.querySelector('#sp500 .index-change.yearly');
    
    if (sp500) sp500.textContent = usData.marketIndices.sp500.current.toLocaleString();
    if (sp500Monthly) sp500Monthly.textContent = `${usData.marketIndices.sp500.monthly > 0 ? '+' : ''}${usData.marketIndices.sp500.monthly}%`;
    if (sp500Yearly) sp500Yearly.textContent = `السنوي: ${usData.marketIndices.sp500.yearly > 0 ? '+' : ''}${usData.marketIndices.sp500.yearly}%`;
    
    // Update NASDAQ
    const nasdaq = document.querySelector('#nasdaq .index-value') || document.querySelector('.index-card:nth-child(3) .index-value');
    const nasdaqMonthly = document.querySelector('#nasdaq .index-change.monthly') || document.querySelector('.index-card:nth-child(3) .index-header span.change-positive');
    const nasdaqYearly = document.querySelector('#nasdaq .index-change.yearly');
    
    if (nasdaq) nasdaq.textContent = usData.marketIndices.nasdaq.current.toLocaleString();
    if (nasdaqMonthly) nasdaqMonthly.textContent = `${usData.marketIndices.nasdaq.monthly > 0 ? '+' : ''}${usData.marketIndices.nasdaq.monthly}%`;
    if (nasdaqYearly) nasdaqYearly.textContent = `السنوي: ${usData.marketIndices.nasdaq.yearly > 0 ? '+' : ''}${usData.marketIndices.nasdaq.yearly}%`;
    
    // Update Dow Jones
    const dowjones = document.querySelector('#dowjones .index-value') || document.querySelector('.index-card:nth-child(1) .index-value');
    const dowjonesMonthly = document.querySelector('#dowjones .index-change.monthly') || document.querySelector('.index-card:nth-child(1) .index-header span.change-positive');
    const dowjonesYearly = document.querySelector('#dowjones .index-change.yearly');
    
    if (dowjones) dowjones.textContent = usData.marketIndices.dowjones.current.toLocaleString();
    if (dowjonesMonthly) dowjonesMonthly.textContent = `${usData.marketIndices.dowjones.monthly > 0 ? '+' : ''}${usData.marketIndices.dowjones.monthly}%`;
    if (dowjonesYearly) dowjonesYearly.textContent = `السنوي: ${usData.marketIndices.dowjones.yearly > 0 ? '+' : ''}${usData.marketIndices.dowjones.yearly}%`;
    
    // Update Russell 2000
    const russell = document.querySelector('#russell .index-value');
    const russellMonthly = document.querySelector('#russell .index-change.monthly');
    const russellYearly = document.querySelector('#russell .index-change.yearly');
    
    if (russell) russell.textContent = usData.marketIndices.russell.current.toLocaleString();
    if (russellMonthly) russellMonthly.textContent = `الشهري: ${usData.marketIndices.russell.monthly > 0 ? '+' : ''}${usData.marketIndices.russell.monthly}%`;
    if (russellYearly) russellYearly.textContent = `السنوي: ${usData.marketIndices.russell.yearly > 0 ? '+' : ''}${usData.marketIndices.russell.yearly}%`;
    
    // Update sectors table if it exists
    const sectorsTableBody = document.getElementById('sectors-table-body');
    if (sectorsTableBody) {
        sectorsTableBody.innerHTML = '';
        usData.sectors.forEach(sector => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = sector.name;
            
            const monthlyCell = document.createElement('td');
            monthlyCell.textContent = `${sector.monthlyChange > 0 ? '+' : ''}${sector.monthlyChange}%`;
            monthlyCell.className = sector.monthlyChange > 0 ? 'change-positive' : 'change-negative';
            
            const yearlyCell = document.createElement('td');
            yearlyCell.textContent = `${sector.yearlyChange > 0 ? '+' : ''}${sector.yearlyChange}%`;
            yearlyCell.className = sector.yearlyChange > 0 ? 'change-positive' : 'change-negative';
            
            row.appendChild(nameCell);
            row.appendChild(monthlyCell);
            row.appendChild(yearlyCell);
            
            sectorsTableBody.appendChild(row);
        });
    }
}

// Update economic forecasts in the UI
function updateEconomicForecasts() {
    // Update inflation info
    const inflationRate = document.getElementById('inflation-rate');
    const inflationAnalysis = document.getElementById('inflation-analysis');
    const inflationForecast = document.querySelector('#inflation-forecast .forecast-value');
    
    if (inflationRate) inflationRate.textContent = `${usData.economicIndicators.inflation.current}%`;
    if (inflationAnalysis) {
        inflationAnalysis.innerHTML = `
            التضخم في الولايات المتحدة بلغ ${usData.economicIndicators.inflation.current}% لعام 2024، وهو معدل 
            مرتفع نسبياً عن المستهدف (2%)، ولكنه يظهر اتجاهاً نحو الانخفاض بعد أن وصل إلى مستويات 
            قياسية في 2022 (8%). تستمر جهود الاحتياطي الفيدرالي في تخفيف معدلات التضخم من خلال سياسته النقدية.
        `;
    }
    if (inflationForecast) inflationForecast.textContent = `${usData.economicIndicators.inflation.forecast}%`;
    
    // Update unemployment info
    const unemploymentRate = document.getElementById('unemployment-rate');
    const unemploymentAnalysis = document.getElementById('unemployment-analysis');
    const unemploymentForecast = document.querySelector('#unemployment-forecast .forecast-value');
    
    if (unemploymentRate) unemploymentRate.textContent = `${usData.economicIndicators.unemployment.current}%`;
    if (unemploymentAnalysis) {
        unemploymentAnalysis.innerHTML = `
            معدل البطالة في الولايات المتحدة يبلغ ${usData.economicIndicators.unemployment.current}%، وهو معدل منخفض 
            يقترب من مستويات التوظيف الكامل، مما يعكس قوة سوق العمل الأمريكي. رغم التباطؤ الاقتصادي المتوقع، 
            لا تزال فرص العمل وافرة مع انخفاض معدلات البطالة الهيكلية.
        `;
    }
    if (unemploymentForecast) unemploymentForecast.textContent = `${usData.economicIndicators.unemployment.forecast}%`;
    
    // Update GDP info
    const gdpTotal = document.getElementById('gdp-total');
    const gdpGrowth = document.getElementById('gdp-growth');
    const gdpPerCapita = document.getElementById('gdp-per-capita');
    const gdpForecast = document.querySelector('#gdp-forecast .forecast-value');
    const gdpGrowthRate = document.getElementById('gdp-growth-rate');
    const gdpAnalysis = document.getElementById('gdp-analysis');
    
    if (gdpTotal) gdpTotal.textContent = `${usData.gdp.total} ترليون دولار`;
    if (gdpGrowth) gdpGrowth.textContent = `${usData.gdp.growth > 0 ? '+' : ''}${usData.gdp.growth}%`;
    if (gdpPerCapita) gdpPerCapita.textContent = `${usData.gdp.perCapita.toLocaleString()} دولار`;
    if (gdpForecast) gdpForecast.textContent = `${usData.gdp.forecastGrowth[0]}%`;
    if (gdpGrowthRate) gdpGrowthRate.textContent = `${usData.gdp.growth}%`;
    if (gdpAnalysis) {
        gdpAnalysis.innerHTML = `
            حقق الاقتصاد الأمريكي نمواً بنسبة ${usData.gdp.growth}% في 2024، متجاوزاً التوقعات وسط
            تحديات ارتفاع أسعار الفائدة. القطاعات الرئيسية المساهمة في النمو تشمل التكنولوجيا والخدمات المالية
            والرعاية الصحية، بينما شهدت قطاعات الصناعة والعقارات تباطؤاً نسبياً.
        `;
    }
    
    // Update interest rate info
    const interestRate = document.getElementById('interest-rate');
    const interestAnalysis = document.getElementById('interest-analysis');
    const interestForecast = document.querySelector('#interest-forecast .forecast-value');
    
    if (interestRate) interestRate.textContent = `${usData.economicIndicators.interestRate.current}%`;
    if (interestAnalysis) {
        interestAnalysis.innerHTML = `
            يحافظ الاحتياطي الفيدرالي على سعر الفائدة عند ${usData.economicIndicators.interestRate.current}% في محاولة 
            لكبح التضخم مع تجنب التسبب في ركود اقتصادي. تشير التوقعات إلى احتمالية خفض أسعار الفائدة 
            خلال النصف الثاني من العام الجاري مع استمرار انخفاض معدلات التضخم.
        `;
    }
    if (interestForecast) interestForecast.textContent = `${usData.economicIndicators.interestRate.forecast}%`;
    
    // Update trade balance analysis
    const tradeBalanceAnalysis = document.getElementById('trade-balance-analysis');
    if (tradeBalanceAnalysis) {
        tradeBalanceAnalysis.innerHTML = `
            الميزان التجاري الأمريكي يعاني من عجز يبلغ ${Math.abs(usData.trade.balance)} مليار دولار، 
            ويمثل حوالي 3.3% من الناتج المحلي الإجمالي. استمرار العجز التجاري يعكس الاعتماد 
            الكبير على الواردات وخاصة من الصين، مقابل نسبة أقل من الصادرات.
        `;
    }
    
    // Update exports analysis
    const exportsAnalysis = document.getElementById('exports-analysis');
    if (exportsAnalysis) {
        exportsAnalysis.innerHTML = `
            تشكل صادرات الآلات والمعدات النسبة الأكبر من الصادرات الأمريكية (${usData.trade.exports.machinery}%)، 
            تليها السلع الإلكترونية (${usData.trade.exports.electronics}%) والمواد الكيميائية (${usData.trade.exports.chemicals}%). 
            الصادرات الأمريكية متنوعة وذات قيمة مضافة عالية، وتعكس التفوق التكنولوجي والصناعي للاقتصاد الأمريكي.
        `;
    }
    
    // Update imports analysis
    const importsAnalysis = document.getElementById('imports-analysis');
    if (importsAnalysis) {
        importsAnalysis.innerHTML = `
            تتركز الواردات الأمريكية في المنتجات الإلكترونية والتقنية (${usData.trade.imports.electronics}%) 
            والسيارات والآليات (${usData.trade.imports.vehicles}%) والمنتجات الاستهلاكية (${usData.trade.imports.consumer}%). 
            تعكس هذه التركيبة الاعتماد على سلاسل التوريد العالمية وخاصة من الصين وجنوب شرق آسيا.
        `;
    }
    
    // Update GDP composition analysis
    const gdpCompositionAnalysis = document.getElementById('gdp-composition-analysis');
    if (gdpCompositionAnalysis) {
        gdpCompositionAnalysis.innerHTML = `
            يهيمن قطاع الخدمات على الاقتصاد الأمريكي بنسبة ${usData.gdp.composition.services}% من الناتج المحلي، 
            يليه قطاع الصناعة (${usData.gdp.composition.industry}%) وقطاع التقنية والمعلومات (${usData.gdp.composition.technology}%). 
            هذا التوزيع يعكس طبيعة الاقتصاد الأمريكي المتقدم القائم على المعرفة والخدمات عالية القيمة.
        `;
    }
    
    // Update economic forecast analysis
    const economyForecastAnalysis = document.getElementById('economy-forecast-analysis');
    if (economyForecastAnalysis) {
        economyForecastAnalysis.innerHTML = `
            <p><strong>نظرة مستقبلية:</strong> يتوقع أن ينمو الاقتصاد الأمريكي بمتوسط ${usData.gdp.forecastGrowth[0]}% سنوياً خلال السنوات القادمة،
            مع استقرار معدلات التضخم عند ${usData.economicIndicators.inflation.forecast}% واستمرار قوة سوق العمل.</p>
            <p><strong>المخاطر الرئيسية:</strong> تشمل التوترات التجارية العالمية، وارتفاع الدين العام، والتحديات الجيوسياسية.</p>
            <p><strong>القطاعات الواعدة:</strong> الذكاء الاصطناعي، الطاقة النظيفة، الرعاية الصحية المتقدمة، والتقنيات المالية.</p>
        `;
    }
    
    // Update reserves info
    const foreignReserves = document.getElementById('foreign-reserves');
    if (foreignReserves) {
        foreignReserves.textContent = `${usData.reserves.foreign} مليار دولار`;
    }
    
    // Update government revenue
    const governmentRevenue = document.getElementById('government-revenue');
    if (governmentRevenue) {
        governmentRevenue.textContent = `${usData.reserves.governmentRevenue} ترليون دولار`;
    }
}

// Setup interactive features for the market page
function setupInteractiveFeatures() {
    // Add year filter for GDP chart if it exists
    const gdpYearFilter = document.getElementById('gdp-year-filter');
    if (gdpYearFilter) {
        gdpYearFilter.addEventListener('change', function() {
            const selectedYear = this.value;
            renderGDPChart(selectedYear);
        });
    }
    
    // Add sector filter for GDP composition
    const sectorFilter = document.getElementById('sector-filter');
    if (sectorFilter) {
        sectorFilter.addEventListener('change', function() {
            const selectedSector = this.value;
            const sectorInfo = document.getElementById('sector-info');
            
            if (sectorInfo) {
                switch(selectedSector) {
                    case 'services':
                        sectorInfo.textContent = `قطاع الخدمات يمثل ${usData.gdp.composition.services}% من الناتج المحلي الأمريكي ويشمل الخدمات المالية والتعليمية والصحية.`;
                        break;
                    case 'industry':
                        sectorInfo.textContent = `قطاع الصناعة يمثل ${usData.gdp.composition.industry}% من الناتج المحلي الأمريكي ويشمل التصنيع والبناء والتعدين.`;
                        break;
                    case 'technology':
                        sectorInfo.textContent = `قطاع التكنولوجيا يمثل ${usData.gdp.composition.technology}% من الناتج المحلي الأمريكي ويعتبر المحرك الرئيسي للنمو والابتكار.`;
                        break;
                    default:
                        sectorInfo.textContent = '';
                }
            }
        });
    }
}