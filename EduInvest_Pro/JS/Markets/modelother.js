document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dropdown menus
    initializeDropdowns();
    
    // Initialize model tabs
    initializeModelTabs();
    
    // Render all charts
    renderInflationComparisonCharts();
    renderCountryEconomyCharts();
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

// Initialize model tabs
function initializeModelTabs() {
    const tabs = document.querySelectorAll('.model-tab');
    const contents = document.querySelectorAll('.model-content');
    
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

// Render comparison charts for inflation models
function renderInflationComparisonCharts() {
    // High inflation chart
    renderHighInflationChart();
    
    // Moderate inflation chart
    renderModerateInflationChart();
    
    // Low inflation chart
    renderLowInflationChart();
    
    // Deflation chart
    renderDeflationChart();
    
    // Inflation investment comparison chart
    renderInflationInvestmentComparisonChart();
}

// Render investment performance comparison chart across different inflation scenarios
function renderInflationInvestmentComparisonChart() {
    const ctx = document.getElementById('inflation-investment-comparison')?.getContext('2d');
    if (!ctx) return;
    
    const data = {
        labels: ['التضخم المرتفع', 'التضخم المعتدل', 'التضخم المنخفض', 'الانكماش'],
        datasets: [
            {
                label: 'الأسهم',
                data: [-5, 8, 6, -8],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'السندات',
                data: [-15, 4, 2, 10],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'العقارات',
                data: [0, 6, 4, -10],
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            },
            {
                label: 'الذهب والسلع',
                data: [15, 3, 0, -2],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'النقد',
                data: [-20, -2, 0, 5],
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'متوسط العوائد السنوية المتوقعة لفئات الأصول المختلفة في سيناريوهات التضخم المختلفة (%)'
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
                        text: 'العائد السنوي المتوقع (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render high inflation comparison chart
function renderHighInflationChart() {
    const ctx = document.getElementById('high-inflation-chart')?.getContext('2d');
    if (!ctx) return;
    
    const data = {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'الأرجنتين',
                data: [34.3, 53.5, 42.0, 50.9, 94.8, 211.4, 270.0],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'تركيا',
                data: [16.3, 15.2, 12.3, 19.6, 72.3, 64.8, 52.7],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'فنزويلا',
                data: [130000, 19906, 2355, 686, 156, 190, 150],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 2,
                fill: false,
                hidden: true // Hide Venezuela initially due to extreme values
            },
            {
                label: 'مصر',
                data: [14.4, 9.2, 5.7, 5.2, 13.9, 29.8, 35.7],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'زيمبابوي',
                data: [42.1, 521.1, 557.2, 98.5, 142.8, 243.8, 47.6],
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 2,
                fill: false,
                hidden: true // Hide Zimbabwe initially due to extreme values
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'مقارنة معدلات التضخم المرتفعة (%)'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    onClick: function(e, legendItem, legend) {
                        const index = legendItem.datasetIndex;
                        const ci = legend.chart;
                        
                        // Toggle visibility
                        if (ci.isDatasetVisible(index)) {
                            ci.hide(index);
                            legendItem.hidden = true;
                        } else {
                            ci.show(index);
                            legendItem.hidden = false;
                        }
                        
                        // Adjust y-axis scale when Venezuela or Zimbabwe is shown
                        if ((legendItem.text === 'فنزويلا' || legendItem.text === 'زيمبابوي') && !legendItem.hidden) {
                            // Show logarithmic scale for extreme values
                            ci.options.scales.y = {
                                type: 'logarithmic',
                                ticks: {
                                    callback: function(value) {
                                        return value + '%';
                                    }
                                }
                            };
                        } else if (!ci.isDatasetVisible(2) && !ci.isDatasetVisible(4)) {
                            // Reset to linear scale when both extreme datasets are hidden
                            ci.options.scales.y = {
                                type: 'linear',
                                ticks: {
                                    callback: function(value) {
                                        return value + '%';
                                    }
                                }
                            };
                        }
                        
                        ci.update();
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Render moderate inflation comparison chart
function renderModerateInflationChart() {
    const ctx = document.getElementById('moderate-inflation-chart')?.getContext('2d');
    if (!ctx) return;
    
    const data = {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'المملكة العربية السعودية',
                data: [2.4, -0.7, -2.1, 3.2, 2.5, 2.3, 1.8],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'ألمانيا',
                data: [1.9, 1.4, 0.5, 3.2, 8.7, 3.8, 2.2],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'الإمارات العربية المتحدة',
                data: [3.1, -1.9, -2.1, 0.2, 4.8, 3.0, 2.5],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 2,
                fill: true
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'مقارنة معدلات التضخم المعتدل (%)'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    min: -3,
                    max: 10,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Render low inflation comparison chart
function renderLowInflationChart() {
    const ctx = document.getElementById('low-inflation-chart')?.getContext('2d');
    if (!ctx) return;
    
    const data = {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'سويسرا',
                data: [0.9, 0.4, -0.7, 0.6, 2.8, 1.9, 1.4],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'اليابان',
                data: [1.0, 0.5, 0.0, -0.2, 2.5, 3.1, 2.6],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'سنغافورة',
                data: [0.4, 0.6, -0.2, 2.3, 6.1, 2.0, 1.6],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'الصين',
                data: [2.1, 2.9, 2.5, 0.9, 2.0, 0.2, -0.3],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'الولايات المتحدة (مقارنة)',
                data: [2.4, 1.8, 1.2, 4.7, 8.0, 4.1, 3.4],
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 2,
                fill: true,
                hidden: true // Hide US initially as it's just for comparison
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'مقارنة معدلات التضخم المنخفضة (%)'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    min: -1,
                    max: 7,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render deflation chart
function renderDeflationChart() {
    const ctx = document.getElementById('deflation-chart').getContext('2d');
    
    const data = {
        labels: ['1995', '1998', '2001', '2004', '2007', '2010', '2013', '2016', '2019', '2022'],
        datasets: [
            {
                label: 'اليابان - معدل التضخم',
                data: [0.1, 0.6, -0.7, 0.0, 0.1, -0.7, 0.4, -0.1, 0.5, 2.5],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'اليابان - النمو الاقتصادي',
                data: [2.7, -1.1, 0.4, 2.3, 1.5, 4.2, 2.0, 0.8, -0.7, 1.0],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'اليونان - معدل التضخم',
                data: [null, null, null, null, null, 4.7, 0.8, -1.4, -0.8, 0.6],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'إيطاليا - معدل التضخم',
                data: [null, null, null, null, null, 1.5, 1.2, -0.1, 0.6, 8.2],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true,
                hidden: true
            }
        ]
    };
      new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'مقارنة تجارب الانكماش الاقتصادي حول العالم (%)'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12
                    }
                }
            },
            scales: {
                y: {
                    min: -4,
                    max: 8,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Render country economy composition charts
function renderCountryEconomyCharts() {
    // Argentina economy chart
    const argentinaCtx = document.getElementById('argentina-economy-chart').getContext('2d');
    new Chart(argentinaCtx, {
        type: 'pie',
        data: {
            labels: ['الزراعة والثروة الحيوانية', 'الصناعة والتعدين', 'الخدمات والسياحة', 'البناء والعقارات', 'أخرى'],
            datasets: [{
                data: [10, 23, 54, 8, 5],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Turkey economy chart
    const turkeyCtx = document.getElementById('turkey-economy-chart').getContext('2d');
    new Chart(turkeyCtx, {
        type: 'pie',
        data: {
            labels: ['الصناعة', 'الخدمات', 'الزراعة', 'البناء', 'السياحة', 'أخرى'],
            datasets: [{
                data: [32, 40, 7, 8, 7, 6],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Venezuela economy chart
    const venezuelaCtx = document.getElementById('venezuela-economy-chart').getContext('2d');
    new Chart(venezuelaCtx, {
        type: 'pie',
        data: {
            labels: ['النفط', 'خدمات حكومية', 'الزراعة', 'التصنيع', 'أخرى'],
            datasets: [{
                data: [65, 17, 5, 8, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Egypt economy chart
    const egyptCtx = document.getElementById('egypt-economy-chart').getContext('2d');
    new Chart(egyptCtx, {
        type: 'pie',
        data: {
            labels: ['الخدمات', 'الصناعة', 'الزراعة', 'السياحة', 'قناة السويس', 'أخرى'],
            datasets: [{
                data: [53, 17, 12, 5, 4, 9],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Zimbabwe economy chart
    const zimbabweCtx = document.getElementById('zimbabwe-economy-chart').getContext('2d');
    new Chart(zimbabweCtx, {
        type: 'pie',
        data: {
            labels: ['التعدين', 'الزراعة', 'الصناعة', 'الخدمات', 'السياحة', 'أخرى'],
            datasets: [{
                data: [30, 16, 12, 25, 10, 7],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Saudi Arabia economy chart
    const saudiCtx = document.getElementById('saudi-economy-chart').getContext('2d');
    new Chart(saudiCtx, {
        type: 'pie',
        data: {
            labels: ['النفط والغاز', 'الخدمات الحكومية', 'التصنيع', 'البناء والعقارات', 'التجارة', 'أخرى'],
            datasets: [{
                data: [42, 18, 13, 10, 12, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Germany economy chart
    const germanyCtx = document.getElementById('germany-economy-chart').getContext('2d');
    new Chart(germanyCtx, {
        type: 'pie',
        data: {
            labels: ['الصناعة والتصنيع', 'الخدمات', 'التكنولوجيا', 'الرعاية الصحية', 'البناء', 'أخرى'],
            datasets: [{
                data: [30, 35, 15, 8, 7, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // UAE economy chart
    const uaeCtx = document.getElementById('uae-economy-chart').getContext('2d');
    new Chart(uaeCtx, {
        type: 'pie',
        data: {
            labels: ['النفط والغاز', 'العقارات', 'التجارة', 'السياحة والضيافة', 'الخدمات المالية', 'أخرى'],
            datasets: [{
                data: [30, 15, 20, 12, 15, 8],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Switzerland economy chart
    const switzerlandCtx = document.getElementById('switzerland-economy-chart').getContext('2d');
    new Chart(switzerlandCtx, {
        type: 'pie',
        data: {
            labels: ['الخدمات المالية', 'الصناعات الدقيقة', 'الصيدلة', 'السياحة', 'التجارة', 'أخرى'],
            datasets: [{
                data: [25, 20, 15, 10, 15, 15],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Japan economy chart
    const japanCtx = document.getElementById('japan-economy-chart').getContext('2d');
    new Chart(japanCtx, {
        type: 'pie',
        data: {
            labels: ['التصنيع', 'الخدمات', 'التكنولوجيا', 'التجارة', 'البناء', 'أخرى'],
            datasets: [{
                data: [30, 35, 15, 10, 5, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Singapore economy chart
    const singaporeCtx = document.getElementById('singapore-economy-chart').getContext('2d');
    new Chart(singaporeCtx, {
        type: 'pie',
        data: {
            labels: ['الخدمات المالية', 'التصنيع', 'التجارة والخدمات اللوجستية', 'العقارات', 'الاتصالات والتكنولوجيا', 'أخرى'],
            datasets: [{
                data: [25, 20, 22, 12, 15, 6],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // China economy chart
    const chinaCtx = document.getElementById('china-economy-chart').getContext('2d');
    new Chart(chinaCtx, {
        type: 'pie',
        data: {
            labels: ['التصنيع', 'البناء والعقارات', 'الخدمات المالية', 'التجارة', 'الزراعة', 'أخرى'],
            datasets: [{
                data: [32, 25, 15, 12, 7, 9],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Greece economy chart
    const greeceCtx = document.getElementById('greece-economy-chart').getContext('2d');
    new Chart(greeceCtx, {
        type: 'pie',
        data: {
            labels: ['السياحة', 'الخدمات', 'الشحن البحري', 'الزراعة', 'التصنيع', 'أخرى'],
            datasets: [{
                data: [25, 30, 15, 10, 12, 8],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Italy economy chart
    const italyCtx = document.getElementById('italy-economy-chart').getContext('2d');
    new Chart(italyCtx, {
        type: 'pie',
        data: {
            labels: ['الخدمات', 'التصنيع والصناعات', 'السياحة', 'الزراعة', 'البناء', 'أخرى'],
            datasets: [{
                data: [45, 24, 13, 6, 8, 4],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}