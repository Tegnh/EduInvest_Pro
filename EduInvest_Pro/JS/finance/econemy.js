/**
 * econemy.js
 * مكتبة JavaScript لدعم صفحات الاقتصاد (أساسيات الاقتصاد والأنظمة الاقتصادية)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('تم تحميل مكتبة الاقتصاد');
    
    // تنفيذ الوظائف حسب الصفحة الحالية
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('basics.html')) {
        initEconomicsBasicsPage();
    } else if (currentPage.includes('systems.html')) {
        initEconomicSystemsPage();
    }
});

/**
 * تهيئة صفحة أساسيات الاقتصاد
 */
function initEconomicsBasicsPage() {
    console.log('تهيئة صفحة أساسيات الاقتصاد');
    
    // تحميل بيانات الاقتصاد الكلي
    loadEconomicData('gdp.json')
        .then(data => {
            if (data) {
                console.log('تم تحميل بيانات الناتج المحلي الإجمالي');
                createGDPChart(data);
            }
        });
    
    loadEconomicData('inflation.json')
        .then(data => {
            if (data) {
                console.log('تم تحميل بيانات التضخم');
                createInflationChart(data);
            }
        });
    
    loadEconomicData('unemployment.json')
        .then(data => {
            if (data) {
                console.log('تم تحميل بيانات البطالة');
                createUnemploymentChart(data);
            }
        });

    // إنشاء الرسوم البيانية للاقتصاد الجزئي
    createMicroeconomicsCharts();
    
    // إنشاء الرسوم البيانية للاقتصاد الكلي
    createMacroeconomicsCharts();
    
    // تهيئة التبويبات
    initTabs();
}

/**
 * تهيئة صفحة الأنظمة الاقتصادية
 */
function initEconomicSystemsPage() {
    console.log('تهيئة صفحة الأنظمة الاقتصادية');
    
    // إنشاء رسوم بيانية مقارنة بين الأنظمة الاقتصادية المختلفة
    createEconomicSystemsComparisonCharts();
    
    // إنشاء خرائط حرارية للأنظمة الاقتصادية حول العالم
    createEconomicSystemsMaps();
}

/**
 * تهيئة التبويبات في الصفحة
 */
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // إزالة الفئة النشطة من جميع التبويبات والمحتويات
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إضافة الفئة النشطة إلى التبويب المحدد والمحتوى المقابل
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

/**
 * إنشاء الرسوم البيانية للاقتصاد الجزئي
 */
function createMicroeconomicsCharts() {
    // يمكن إضافة رسوم بيانية لتوضيح مفاهيم العرض والطلب ومرونة الأسعار وغيرها
    // في حال توفر مكتبة Chart.js أو أي مكتبة رسوم بيانية أخرى
    
    if (typeof Chart !== 'undefined') {
        // مثال: رسم بياني للعرض والطلب
        const supplyDemandCanvas = document.createElement('canvas');
        supplyDemandCanvas.id = 'supply-demand-chart';
        supplyDemandCanvas.style.maxHeight = '300px';
        
        // إضافة الرسم البياني إلى الصفحة (يمكن تعديل هذا حسب هيكل الصفحة)
        const firstSection = document.querySelector('#micro .economics-section:first-child');
        if (firstSection) {
            firstSection.appendChild(supplyDemandCanvas);
            
            // إنشاء الرسم البياني
            new Chart(supplyDemandCanvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                    datasets: [
                        {
                            label: 'منحنى الطلب',
                            data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 2,
                            fill: false
                        },
                        {
                            label: 'منحنى العرض',
                            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderWidth: 2,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'منحنيات العرض والطلب'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'السعر'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'الكمية'
                            }
                        }
                    }
                }
            });
        }
    }
}

/**
 * إنشاء الرسوم البيانية للاقتصاد الكلي
 */
function createMacroeconomicsCharts() {
    // تحميل البيانات الاقتصادية من ملفات JSON وإنشاء الرسوم البيانية
    if (typeof Chart !== 'undefined') {
        const macroSection = document.querySelector('#macro .economics-section:first-child');
        if (!macroSection) return;
        
        // إضافة قسم للمؤشرات الاقتصادية
        const indicatorsSection = document.createElement('div');
        indicatorsSection.className = 'macro-indicators-section';
        indicatorsSection.style.marginTop = '2rem';
        macroSection.appendChild(indicatorsSection);
        
        // إنشاء عنصر canvas للرسم البياني للمؤشرات
        const macroIndicatorsCanvas = document.createElement('canvas');
        macroIndicatorsCanvas.id = 'macro-indicators-chart';
        macroIndicatorsCanvas.style.maxHeight = '300px';
        indicatorsSection.appendChild(macroIndicatorsCanvas);
        
        // إنشاء الرسم البياني للمؤشرات الاقتصادية
        new Chart(macroIndicatorsCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['الولايات المتحدة', 'الصين', 'اليابان', 'ألمانيا', 'المملكة المتحدة', 'فرنسا', 'الهند', 'إيطاليا', 'كندا', 'السعودية'],
                datasets: [
                    {
                        label: 'النمو الاقتصادي (%)',
                        data: [2.3, 6.1, 0.7, 1.1, 1.4, 1.7, 5.0, 0.3, 1.6, 8.7],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'معدل التضخم (%)',
                        data: [1.8, 2.9, 0.5, 1.4, 1.7, 1.3, 3.4, 0.6, 1.9, 2.3],
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'معدل البطالة (%)',
                        data: [3.6, 3.8, 2.4, 3.2, 3.8, 8.1, 6.1, 9.8, 5.7, 8.0],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {                    title: {
                        display: true,
                        text: 'مؤشرات الاقتصاد الكلي لأكبر 10 اقتصادات (2022-2023)'
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
                }
            }
        });
    }
}

/**
 * إنشاء رسوم بيانية مقارنة بين الأنظمة الاقتصادية المختلفة
 */
function createEconomicSystemsComparisonCharts() {
    // إنشاء مخطط راداري لمقارنة خصائص الأنظمة الاقتصادية المختلفة
    
    if (typeof Chart !== 'undefined') {
        // إنشاء مخطط مقارنة بين الأنظمة الاقتصادية
        const systemComparisonCanvas = document.createElement('canvas');
        systemComparisonCanvas.id = 'economic-systems-comparison-chart';
        systemComparisonCanvas.style.maxHeight = '400px';
        
        // إضافة الرسم البياني إلى الصفحة
        const comparisonSection = document.querySelector('.system-section:nth-child(5)');
        if (comparisonSection) {
            comparisonSection.appendChild(systemComparisonCanvas);
            
            // إنشاء الرسم البياني الراداري
            new Chart(systemComparisonCanvas.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: [
                        'الملكية الخاصة',
                        'حرية السوق',
                        'دور الحكومة',
                        'الابتكار والتطوير',
                        'المساواة الاجتماعية',
                        'الاستقرار الاقتصادي'
                    ],
                    datasets: [
                        {
                            label: 'النظام الرأسمالي',
                            data: [9, 9, 3, 8, 4, 6],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            pointBackgroundColor: 'rgba(255, 99, 132, 1)'
                        },
                        {
                            label: 'النظام الاشتراكي',
                            data: [3, 3, 9, 5, 8, 7],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                        },
                        {
                            label: 'النظام المختلط',
                            data: [7, 7, 6, 7, 6, 8],
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            pointBackgroundColor: 'rgba(255, 206, 86, 1)'
                        },
                        {
                            label: 'النظام الإسلامي',
                            data: [7, 6, 5, 6, 7, 7],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            pointBackgroundColor: 'rgba(75, 192, 192, 1)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'مقارنة خصائص الأنظمة الاقتصادية (مقياس من 1-10)'
                        },
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.raw + '/10';
                                }
                            }
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 10
                        }
                    }
                }
            });
            
            // إضافة مخطط شريطي لمقارنة مؤشرات الأداء الاقتصادي للدول المختلفة
            const economicPerformanceCanvas = document.createElement('canvas');
            economicPerformanceCanvas.id = 'economic-performance-chart';
            economicPerformanceCanvas.style.maxHeight = '400px';
            economicPerformanceCanvas.style.marginTop = '2rem';
            
            comparisonSection.appendChild(economicPerformanceCanvas);
            
            new Chart(economicPerformanceCanvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['الولايات المتحدة (رأسمالي)', 'السويد (مختلط)', 'الصين (اشتراكي السوق)', 'ماليزيا (مختلط إسلامي)'],
                    datasets: [
                        {
                            label: 'نمو الناتج المحلي الإجمالي (%)',
                            data: [2.3, 1.9, 6.1, 4.3],
                            backgroundColor: 'rgba(255, 99, 132, 0.7)'
                        },
                        {
                            label: 'معدل البطالة (%)',
                            data: [3.5, 7.2, 4.1, 3.3],
                            backgroundColor: 'rgba(54, 162, 235, 0.7)'
                        },
                        {
                            label: 'التضخم (%)',
                            data: [2.9, 2.0, 2.5, 2.2],
                            backgroundColor: 'rgba(255, 206, 86, 0.7)'
                        },
                        {
                            label: 'نسبة الدين العام إلى الناتج المحلي (%)',
                            data: [106, 39, 66, 58],
                            backgroundColor: 'rgba(75, 192, 192, 0.7)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'مقارنة مؤشرات الأداء الاقتصادي حسب نوع النظام الاقتصادي (2023)'
                        },
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'النسبة المئوية (%)'
                            }
                        }
                    }
                }
            });
        }
    }
}

/**
 * إنشاء خرائط حرارية للأنظمة الاقتصادية حول العالم
 */
function createEconomicSystemsMaps() {
    // إنشاء قسم للخريطة وتضمين رسم بياني يمثل توزيع الأنظمة الاقتصادية عالمياً
    
    const mapSection = document.querySelector('.system-section:nth-child(6)');
    if (!mapSection) return;
    
    // إنشاء عنصر خريطة
    const economicSystemsMapContainer = document.createElement('div');
    economicSystemsMapContainer.id = 'economic-systems-map-container';
    economicSystemsMapContainer.style.marginTop = '2rem';
    mapSection.appendChild(economicSystemsMapContainer);
    
    // مجموعة بيانات بسيطة للعرض
    const worldRegions = [
        { region: 'أمريكا الشمالية', systems: { capitalist: 70, mixed: 30, socialist: 0, islamic: 0 } },
        { region: 'أمريكا الجنوبية', systems: { capitalist: 40, mixed: 50, socialist: 10, islamic: 0 } },
        { region: 'أوروبا الغربية', systems: { capitalist: 30, mixed: 70, socialist: 0, islamic: 0 } },
        { region: 'أوروبا الشرقية', systems: { capitalist: 50, mixed: 40, socialist: 10, islamic: 0 } },
        { region: 'الشرق الأوسط وشمال أفريقيا', systems: { capitalist: 15, mixed: 50, socialist: 5, islamic: 30 } },
        { region: 'أفريقيا جنوب الصحراء', systems: { capitalist: 20, mixed: 60, socialist: 15, islamic: 5 } },
        { region: 'آسيا المتقدمة', systems: { capitalist: 40, mixed: 60, socialist: 0, islamic: 0 } },
        { region: 'آسيا النامية', systems: { capitalist: 30, mixed: 40, socialist: 25, islamic: 5 } }
    ];
    
    // إنشاء عنصر canvas للرسم البياني المجمع (stacked bar chart)
    const systemsMapCanvas = document.createElement('canvas');
    systemsMapCanvas.id = 'economic-systems-map-chart';
    systemsMapCanvas.style.maxHeight = '400px';
    economicSystemsMapContainer.appendChild(systemsMapCanvas);
    
    if (typeof Chart !== 'undefined') {
        // تحضير البيانات للرسم البياني
        const regions = worldRegions.map(item => item.region);
        
        // إنشاء الرسم البياني للمناطق
        new Chart(systemsMapCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: regions,
                datasets: [
                    {
                        label: 'النظام الرأسمالي (%)',
                        data: worldRegions.map(item => item.systems.capitalist),
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'النظام المختلط (%)',
                        data: worldRegions.map(item => item.systems.mixed),
                        backgroundColor: 'rgba(255, 206, 86, 0.7)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'النظام الاشتراكي (%)',
                        data: worldRegions.map(item => item.systems.socialist),
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'النظام الاقتصادي الإسلامي (%)',
                        data: worldRegions.map(item => item.systems.islamic),
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'توزيع الأنظمة الاقتصادية حسب المناطق الجغرافية'
                    },
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index'
                    }
                },
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'النسبة المئوية (%)'
                        }
                    }
                }
            }
        });
        
        // إضافة جدول النظم الاقتصادية ودولها الرئيسية
        const systemCountriesTable = document.createElement('div');
        systemCountriesTable.className = 'economic-systems-table';
        systemCountriesTable.style.marginTop = '2rem';
        systemCountriesTable.innerHTML = `
            <h4>أمثلة للدول حسب النظام الاقتصادي</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 1rem;">
                <thead>
                    <tr style="background-color: var(--primary-color); color: white;">
                        <th style="padding: 10px; text-align: right;">النظام الاقتصادي</th>
                        <th style="padding: 10px; text-align: right;">أمثلة للدول</th>
                        <th style="padding: 10px; text-align: right;">السمات الرئيسية</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px; font-weight: bold;">النظام الرأسمالي</td>
                        <td style="padding: 10px;">الولايات المتحدة، سنغافورة، هونغ كونغ، سويسرا، أستراليا</td>
                        <td style="padding: 10px;">ملكية خاصة، قوى السوق، حرية اقتصادية عالية</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px; font-weight: bold;">النظام المختلط</td>
                        <td style="padding: 10px;">السويد، فرنسا، ألمانيا، كندا، اليابان، المملكة العربية السعودية</td>
                        <td style="padding: 10px;">اقتصاد سوق مع تدخل حكومي، شبكة أمان اجتماعي</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px; font-weight: bold;">النظام الاشتراكي</td>
                        <td style="padding: 10px;">الصين، كوبا، فيتنام، لاوس</td>
                        <td style="padding: 10px;">ملكية الدولة للوسائل الإنتاج، تخطيط مركزي/موجه</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">النظام الإسلامي</td>
                        <td style="padding: 10px;">إيران، السودان، باكستان (جزئياً)، ماليزيا (جزئياً)</td>
                        <td style="padding: 10px;">تطبيق مبادئ الشريعة، حظر الربا، التكافل الاجتماعي</td>
                    </tr>
                </tbody>
            </table>
        `;
        economicSystemsMapContainer.appendChild(systemCountriesTable);
    }
}

/**
 * تحميل بيانات اقتصادية من ملف JSON
 * @param {string} dataFile - اسم ملف البيانات
 * @returns {Promise} وعد يحتوي على بيانات من الملف
 */
function loadEconomicData(dataFile) {
    return fetch(`../../../assets/data/${dataFile}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`خطأ في تحميل البيانات: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('فشل في تحميل البيانات الاقتصادية:', error);
            return null;
        });
}