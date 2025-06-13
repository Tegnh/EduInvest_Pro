document.addEventListener('DOMContentLoaded', () => {
    const budgetForm = document.getElementById('budget-calculator-form');
    const resultsContainer = document.getElementById('budget-results');
    const saveBudgetBtn = document.getElementById('save-budget-btn');
    
    // Initialize dropdown functionality
    initializeDropdown();
    
    // Handle form submission
    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateBudget();
        });
    }
    
    // Handle save budget button
    if (saveBudgetBtn) {
        saveBudgetBtn.addEventListener('click', saveBudget);
    }
    
    // Calculate and display budget analysis
    function calculateBudget() {
        // Get form data
        const salary = parseFloat(document.getElementById('salary').value) || 0;
        const additionalIncome = parseFloat(document.getElementById('additional-income').value) || 0;
        const housing = parseFloat(document.getElementById('housing').value) || 0;
        const utilities = parseFloat(document.getElementById('utilities').value) || 0;
        const food = parseFloat(document.getElementById('food').value) || 0;
        const transportation = parseFloat(document.getElementById('transportation').value) || 0;
        const health = parseFloat(document.getElementById('health').value) || 0;
        const entertainment = parseFloat(document.getElementById('entertainment').value) || 0;
        const others = parseFloat(document.getElementById('others').value) || 0;
        const savings = parseFloat(document.getElementById('savings').value) || 0;
        const investment = parseFloat(document.getElementById('investment').value) || 0;
        
        // Calculate totals
        const totalIncome = salary + additionalIncome;
        const totalExpenses = housing + utilities + food + transportation + health + entertainment + others + savings + investment;
        const monthlySurplus = totalIncome - totalExpenses;
        
        // Calculate ratios
        const savingsRatio = (savings / totalIncome) * 100;
        const investmentRatio = (investment / totalIncome) * 100;
        const expenseRatio = ((totalExpenses - savings - investment) / totalIncome) * 100;
        
        // Update results display
        document.getElementById('total-income').textContent = formatCurrency(totalIncome);
        document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('monthly-surplus').textContent = formatCurrency(monthlySurplus);
        document.getElementById('savings-ratio').textContent = formatPercentage(savingsRatio);
        document.getElementById('investment-ratio').textContent = formatPercentage(investmentRatio);
        document.getElementById('expense-ratio').textContent = formatPercentage(expenseRatio);
        
        // Create expense data for charts
        const expenseData = [
            { category: 'السكن', amount: housing },
            { category: 'الخدمات', amount: utilities },
            { category: 'الطعام', amount: food },
            { category: 'النقل', amount: transportation },
            { category: 'الصحة', amount: health },
            { category: 'الترفيه', amount: entertainment },
            { category: 'أخرى', amount: others }
        ].filter(item => item.amount > 0);
        
        // Create budget ratio data
        const budgetRatioData = [
            { category: 'الإنفاق', amount: totalExpenses - savings - investment },
            { category: 'الادخار', amount: savings },
            { category: 'الاستثمار', amount: investment }
        ].filter(item => item.amount > 0);
        
        // Create charts
        createExpensesChart(expenseData);
        createBudgetRatioChart(budgetRatioData);
        
        // Generate recommendations
        generateRecommendations(totalIncome, savingsRatio, investmentRatio, expenseRatio, monthlySurplus);
        
        // Show results
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Create expenses pie chart
    function createExpensesChart(data) {
        const ctx = document.getElementById('expenses-chart').getContext('2d');
        
        // Clear any existing chart
        if (window.expensesChart instanceof Chart) {
            window.expensesChart.destroy();
        }
        
        // Create new chart
        window.expensesChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(item => item.category),
                datasets: [{
                    data: data.map(item => item.amount),
                    backgroundColor: [
                        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e',
                        '#e74a3b', '#858796', '#5a5c69', '#f8f9fc'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create budget ratio pie chart
    function createBudgetRatioChart(data) {
        const ctx = document.getElementById('budget-ratio-chart').getContext('2d');
        
        // Clear any existing chart
        if (window.budgetRatioChart instanceof Chart) {
            window.budgetRatioChart.destroy();
        }
        
        // Create new chart
        window.budgetRatioChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(item => item.category),
                datasets: [{
                    data: data.map(item => item.amount),
                    backgroundColor: [
                        '#e74a3b', '#1cc88a', '#4e73df'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Generate financial recommendations
    function generateRecommendations(totalIncome, savingsRatio, investmentRatio, expenseRatio, monthlySurplus) {
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        
        const recommendations = [];
        
        // Savings recommendations
        if (savingsRatio < 10) {
            recommendations.push('ننصح بزيادة نسبة الادخار إلى ١٠٪ على الأقل من إجمالي الدخل.');
        } else if (savingsRatio >= 20) {
            recommendations.push('نسبة ادخارك ممتازة! استمر بالحفاظ على هذا المستوى.');
        } else {
            recommendations.push('نسبة ادخارك جيدة، حاول زيادتها تدريجياً إلى ٢٠٪ إن أمكن.');
        }
        
        // Investment recommendations
        if (investmentRatio < 5) {
            recommendations.push('ننصح بزيادة نسبة الاستثمار إلى ٥-١٠٪ من دخلك لبناء ثروة على المدى الطويل.');
        } else if (investmentRatio >= 15) {
            recommendations.push('نسبة استثمارك ممتازة! استمر في التنويع والاستثمار بحكمة.');
        } else {
            recommendations.push('نسبة استثمارك جيدة، استمر في زيادتها تدريجياً مع تنويع محفظتك الاستثمارية.');
        }
        
        // Expense ratio recommendations
        if (expenseRatio > 80) {
            recommendations.push('نسبة المصروفات مرتفعة نسبياً، حاول تقليل بعض النفقات غير الضرورية لزيادة الادخار والاستثمار.');
        } else if (expenseRatio <= 70) {
            recommendations.push('نسبة مصروفاتك منخفضة نسبياً، وهذا يعني أنك تدير ميزانيتك بشكل جيد.');
        }
        
        // Monthly surplus recommendations
        if (monthlySurplus < 0) {
            recommendations.push('لديك عجز في الميزانية! من الضروري مراجعة نفقاتك وتقليلها أو البحث عن مصادر دخل إضافية.');
        } else if (monthlySurplus === 0) {
            recommendations.push('ميزانيتك متوازنة تماماً، لكن يفضل وجود فائض للطوارئ أو الفرص المستقبلية.');
        } else if (monthlySurplus / totalIncome < 0.1) {
            recommendations.push('لديك فائض إيجابي في الميزانية، لكن يفضل زيادته إلى ١٠٪ من الدخل على الأقل.');
        } else {
            recommendations.push('فائض الميزانية لديك ممتاز! يمكنك استغلاله في زيادة الادخار أو الاستثمار.');
        }
        
        // Add recommendations to the UI
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
    }
    
    // Save budget to local storage
    function saveBudget() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Collect budget data
        const budgetData = {
            date: `${year}-${month+1}`,
            income: {
                salary: parseFloat(document.getElementById('salary').value) || 0,
                additionalIncome: parseFloat(document.getElementById('additional-income').value) || 0
            },
            expenses: {
                housing: parseFloat(document.getElementById('housing').value) || 0,
                utilities: parseFloat(document.getElementById('utilities').value) || 0,
                food: parseFloat(document.getElementById('food').value) || 0,
                transportation: parseFloat(document.getElementById('transportation').value) || 0,
                health: parseFloat(document.getElementById('health').value) || 0,
                entertainment: parseFloat(document.getElementById('entertainment').value) || 0,
                others: parseFloat(document.getElementById('others').value) || 0
            },
            savings: parseFloat(document.getElementById('savings').value) || 0,
            investment: parseFloat(document.getElementById('investment').value) || 0
        };
        
        // Get existing budget history or initialize new array
        let budgetHistory = JSON.parse(localStorage.getItem('budgetHistory')) || [];
        
        // Check if entry for this month already exists
        const existingEntryIndex = budgetHistory.findIndex(entry => entry.date === budgetData.date);
        
        if (existingEntryIndex >= 0) {
            // Update existing entry
            budgetHistory[existingEntryIndex] = budgetData;
            showSuccessMessage('تم تحديث ميزانية الشهر الحالي بنجاح!');
        } else {
            // Add new entry
            budgetHistory.push(budgetData);
            showSuccessMessage('تم حفظ ميزانية الشهر الحالي بنجاح!');
        }
        
        // Save back to local storage
        localStorage.setItem('budgetHistory', JSON.stringify(budgetHistory));
        
        // Disable save button temporarily to prevent multiple saves
        const saveButton = document.getElementById('save-budget-btn');
        saveButton.disabled = true;
        saveButton.textContent = 'تم الحفظ';
        
        setTimeout(() => {
            saveButton.disabled = false;
            saveButton.textContent = 'حفظ الميزانية';
        }, 3000);
    }
    
    // Show success message
    function showSuccessMessage(message) {
        // Create success message element
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;
        successMsg.style.cssText = `
            background-color: #1cc88a;
            color: white;
            padding: 0.8rem;
            border-radius: 6px;
            margin-top: 1rem;
            text-align: center;
        `;
        
        // Append to save budget section
        const saveBudgetSection = document.querySelector('.save-budget-section');
        saveBudgetSection.appendChild(successMsg);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
    
    // Helper function to format currency
    function formatCurrency(value) {
        return new Intl.NumberFormat('ar-SA', { 
            style: 'currency', 
            currency: 'SAR',
            maximumFractionDigits: 0
        }).format(value);
    }
    
    // Helper function to format percentage
    function formatPercentage(value) {
        return `${value.toFixed(1)}%`;
    }

    // Initialize dropdown functionality
    function initializeDropdown() {
        const calculatorBtn = document.getElementById('calculator-dropdown-btn');
        const calculatorDropdown = document.getElementById('calculator-dropdown');

        if (calculatorBtn && calculatorDropdown) {
            // Toggle dropdown on button click
            calculatorBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                calculatorDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!calculatorBtn.contains(e.target) && !calculatorDropdown.contains(e.target)) {
                    calculatorDropdown.classList.remove('active');
                }
            });
        }
    }
});