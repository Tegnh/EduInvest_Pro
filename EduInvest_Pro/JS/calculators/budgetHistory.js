document.addEventListener('DOMContentLoaded', () => {
    // Initialize dropdown functionality
    initializeDropdown();
    
    // DOM elements
    const yearFilter = document.getElementById('year-filter');
    const currentYearSpan = document.getElementById('current-year');
    const monthlyRecordsTable = document.getElementById('monthly-records-table');
    const monthDetailView = document.getElementById('month-detail-view');
    const backToRecordsBtn = document.getElementById('back-to-records');
    
    // Initialize event listeners
    if (yearFilter) {
        yearFilter.addEventListener('change', () => {
            currentYearSpan.textContent = yearFilter.value;
            loadBudgetHistory(yearFilter.value);
        });
    }
    
    if (backToRecordsBtn) {
        backToRecordsBtn.addEventListener('click', () => {
            monthDetailView.style.display = 'none';
        });
    }
    
    // Load initial budget history
    loadBudgetHistory(new Date().getFullYear());
    
    // Load and display budget history for selected year
    function loadBudgetHistory(year) {
        // Get budget history from local storage
        const budgetHistory = JSON.parse(localStorage.getItem('budgetHistory')) || [];
        
        // Filter entries for selected year
        const yearEntries = budgetHistory.filter(entry => {
            const entryYear = parseInt(entry.date.split('-')[0]);
            return entryYear === parseInt(year);
        });
        
        // Sort entries by month
        yearEntries.sort((a, b) => {
            const monthA = parseInt(a.date.split('-')[1]);
            const monthB = parseInt(b.date.split('-')[1]);
            return monthA - monthB;
        });
        
        // Calculate annual summary
        calculateAnnualSummary(yearEntries);
        
        // Create annual charts
        createAnnualIncomeExpenseChart(yearEntries);
        createAnnualSavingsInvestmentChart(yearEntries);
        
        // Display monthly records
        displayMonthlyRecords(yearEntries);
    }
    
    // Calculate and display annual summary
    function calculateAnnualSummary(entries) {
        if (entries.length === 0) {
            document.getElementById('avg-monthly-income').textContent = formatCurrency(0);
            document.getElementById('avg-monthly-expenses').textContent = formatCurrency(0);
            document.getElementById('avg-monthly-savings').textContent = formatCurrency(0);
            document.getElementById('avg-monthly-investment').textContent = formatCurrency(0);
            return;
        }
        
        // Calculate totals and averages
        let totalIncome = 0;
        let totalExpenses = 0;
        let totalSavings = 0;
        let totalInvestment = 0;
        
        entries.forEach(entry => {
            // Calculate entry income
            const entryIncome = entry.income.salary + entry.income.additionalIncome;
            totalIncome += entryIncome;
            
            // Calculate entry expenses
            const entryExpenses = Object.values(entry.expenses).reduce((sum, value) => sum + value, 0);
            totalExpenses += entryExpenses;
            
            // Add savings and investment
            totalSavings += entry.savings || 0;
            totalInvestment += entry.investment || 0;
        });
        
        // Calculate averages
        const avgMonthlyIncome = totalIncome / entries.length;
        const avgMonthlyExpenses = totalExpenses / entries.length;
        const avgMonthlySavings = totalSavings / entries.length;
        const avgMonthlyInvestment = totalInvestment / entries.length;
        
        // Update UI
        document.getElementById('avg-monthly-income').textContent = formatCurrency(avgMonthlyIncome);
        document.getElementById('avg-monthly-expenses').textContent = formatCurrency(avgMonthlyExpenses);
        document.getElementById('avg-monthly-savings').textContent = formatCurrency(avgMonthlySavings);
        document.getElementById('avg-monthly-investment').textContent = formatCurrency(avgMonthlyInvestment);
    }
    
    // Create annual income and expense chart
    function createAnnualIncomeExpenseChart(entries) {
        const ctx = document.getElementById('annual-income-expense-chart').getContext('2d');
        
        // Clear existing chart
        if (window.incomeExpenseChart instanceof Chart) {
            window.incomeExpenseChart.destroy();
        }
        
        // Prepare data
        const months = [];
        const incomeData = [];
        const expenseData = [];
        
        // Create dummy data for all months if no entries
        if (entries.length === 0) {
            for (let i = 1; i <= 12; i++) {
                months.push(getMonthName(i));
                incomeData.push(0);
                expenseData.push(0);
            }
        } else {
            // Create actual data from entries
            const monthlyData = {};
            
            // Initialize all months
            for (let i = 1; i <= 12; i++) {
                monthlyData[i] = {
                    income: 0,
                    expenses: 0,
                    exists: false
                };
            }
            
            // Add data from entries
            entries.forEach(entry => {
                const month = parseInt(entry.date.split('-')[1]);
                const income = entry.income.salary + entry.income.additionalIncome;
                const expenses = Object.values(entry.expenses).reduce((sum, value) => sum + value, 0);
                
                monthlyData[month] = {
                    income: income,
                    expenses: expenses,
                    exists: true
                };
            });
            
            // Create arrays for chart
            for (let i = 1; i <= 12; i++) {
                months.push(getMonthName(i));
                incomeData.push(monthlyData[i].income);
                expenseData.push(monthlyData[i].expenses);
            }
        }
        
        // Create chart
        window.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'الدخل',
                        data: incomeData,
                        backgroundColor: '#4e73df',
                        borderRadius: 4
                    },
                    {
                        label: 'المصروفات',
                        data: expenseData,
                        backgroundColor: '#e74a3b',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create annual savings and investment chart
    function createAnnualSavingsInvestmentChart(entries) {
        const ctx = document.getElementById('annual-savings-investment-chart').getContext('2d');
        
        // Clear existing chart
        if (window.savingsInvestmentChart instanceof Chart) {
            window.savingsInvestmentChart.destroy();
        }
        
        // Prepare data
        const months = [];
        const savingsData = [];
        const investmentData = [];
        
        // Create dummy data for all months if no entries
        if (entries.length === 0) {
            for (let i = 1; i <= 12; i++) {
                months.push(getMonthName(i));
                savingsData.push(0);
                investmentData.push(0);
            }
        } else {
            // Create actual data from entries
            const monthlyData = {};
            
            // Initialize all months
            for (let i = 1; i <= 12; i++) {
                monthlyData[i] = {
                    savings: 0,
                    investment: 0,
                    exists: false
                };
            }
            
            // Add data from entries
            entries.forEach(entry => {
                const month = parseInt(entry.date.split('-')[1]);
                
                monthlyData[month] = {
                    savings: entry.savings || 0,
                    investment: entry.investment || 0,
                    exists: true
                };
            });
            
            // Create arrays for chart
            for (let i = 1; i <= 12; i++) {
                months.push(getMonthName(i));
                savingsData.push(monthlyData[i].savings);
                investmentData.push(monthlyData[i].investment);
            }
        }
        
        // Create chart
        window.savingsInvestmentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'الادخار',
                        data: savingsData,
                        backgroundColor: '#1cc88a',
                        borderRadius: 4
                    },
                    {
                        label: 'الاستثمار',
                        data: investmentData,
                        backgroundColor: '#f6c23e',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Display monthly records in table
    function displayMonthlyRecords(entries) {
        if (!monthlyRecordsTable) return;
        
        // Clear table
        monthlyRecordsTable.innerHTML = '';
        
        // If no entries, show message
        if (entries.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 7;
            cell.textContent = 'لا توجد سجلات لعرضها في هذه السنة';
            cell.style.textAlign = 'center';
            cell.style.padding = '2rem';
            row.appendChild(cell);
            monthlyRecordsTable.appendChild(row);
            return;
        }
        
        // Create monthly data lookup
        const monthlyData = {};
        for (let i = 1; i <= 12; i++) {
            monthlyData[i] = null;
        }
        
        // Fill with actual data
        entries.forEach(entry => {
            const month = parseInt(entry.date.split('-')[1]);
            monthlyData[month] = entry;
        });
        
        // Create table rows for all months
        for (let month = 1; month <= 12; month++) {
            const entry = monthlyData[month];
            
            // Skip months with no data
            if (!entry) continue;
            
            // Calculate totals
            const totalIncome = entry.income.salary + entry.income.additionalIncome;
            const totalExpenses = Object.values(entry.expenses).reduce((sum, value) => sum + value, 0);
            const surplus = totalIncome - totalExpenses - entry.savings - entry.investment;
            
            // Create row
            const row = document.createElement('tr');
            
            // Month
            const monthCell = document.createElement('td');
            monthCell.textContent = getMonthName(month);
            row.appendChild(monthCell);
            
            // Income
            const incomeCell = document.createElement('td');
            incomeCell.textContent = formatCurrency(totalIncome);
            row.appendChild(incomeCell);
            
            // Expenses
            const expensesCell = document.createElement('td');
            expensesCell.textContent = formatCurrency(totalExpenses);
            row.appendChild(expensesCell);
            
            // Savings
            const savingsCell = document.createElement('td');
            savingsCell.textContent = formatCurrency(entry.savings || 0);
            row.appendChild(savingsCell);
            
            // Investment
            const investmentCell = document.createElement('td');
            investmentCell.textContent = formatCurrency(entry.investment || 0);
            row.appendChild(investmentCell);
            
            // Surplus
            const surplusCell = document.createElement('td');
            surplusCell.textContent = formatCurrency(surplus);
            if (surplus < 0) {
                surplusCell.style.color = '#e74a3b';
            } else {
                surplusCell.style.color = '#1cc88a';
            }
            row.appendChild(surplusCell);
              // Details button
            const detailsCell = document.createElement('td');
            const detailsBtn = document.createElement('button');
            detailsBtn.className = 'detail-btn';
            detailsBtn.textContent = 'عرض التفاصيل';
            detailsBtn.addEventListener('click', () => {
                showMonthDetails(entry, month);
            });
            detailsCell.appendChild(detailsBtn);
            row.appendChild(detailsCell);
            
            // Delete action button
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
            deleteBtn.title = 'حذف سجل الشهر';
            deleteBtn.addEventListener('click', () => {
                deleteMonthRecord(entry, month, row);
            });
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);
            
            // Add row to table
            monthlyRecordsTable.appendChild(row);
        }
    }
    
    // Show detailed view for a specific month
    function showMonthDetails(entry, month) {
        // Show the details view
        monthDetailView.style.display = 'block';
        
        // Update month name
        document.getElementById('detail-month-name').textContent = getMonthName(month);
        
        // Calculate totals
        const totalIncome = entry.income.salary + entry.income.additionalIncome;
        const totalExpenses = Object.values(entry.expenses).reduce((sum, value) => sum + value, 0);
        const monthlySurplus = totalIncome - totalExpenses - entry.savings - entry.investment;
        
        // Calculate ratios
        const savingsRatio = ((entry.savings || 0) / totalIncome) * 100;
        const investmentRatio = ((entry.investment || 0) / totalIncome) * 100;
        const expenseRatio = (totalExpenses / totalIncome) * 100;
        
        // Update summary info
        document.getElementById('detail-total-income').textContent = formatCurrency(totalIncome);
        document.getElementById('detail-total-expenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('detail-monthly-surplus').textContent = formatCurrency(monthlySurplus);
        document.getElementById('detail-savings-ratio').textContent = formatPercentage(savingsRatio);
        document.getElementById('detail-investment-ratio').textContent = formatPercentage(investmentRatio);
        document.getElementById('detail-expense-ratio').textContent = formatPercentage(expenseRatio);
        
        // Create expense data for charts
        const expenseData = [
            { category: 'السكن', amount: entry.expenses.housing },
            { category: 'الخدمات', amount: entry.expenses.utilities },
            { category: 'الطعام', amount: entry.expenses.food },
            { category: 'النقل', amount: entry.expenses.transportation },
            { category: 'الصحة', amount: entry.expenses.health },
            { category: 'الترفيه', amount: entry.expenses.entertainment },
            { category: 'أخرى', amount: entry.expenses.others }
        ].filter(item => item.amount > 0);
        
        // Create budget ratio data
        const budgetRatioData = [
            { category: 'الإنفاق', amount: totalExpenses },
            { category: 'الادخار', amount: entry.savings || 0 },
            { category: 'الاستثمار', amount: entry.investment || 0 }
        ].filter(item => item.amount > 0);
        
        // Create charts
        createDetailExpensesChart(expenseData);
        createDetailBudgetRatioChart(budgetRatioData);
        
        // Display expense breakdown
        displayExpenseBreakdown(entry.expenses);
        
        // Scroll to details
        monthDetailView.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Create expenses chart for detail view
    function createDetailExpensesChart(data) {
        const ctx = document.getElementById('detail-expenses-chart').getContext('2d');
        
        // Clear existing chart
        if (window.detailExpensesChart instanceof Chart) {
            window.detailExpensesChart.destroy();
        }
        
        // Create chart
        window.detailExpensesChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(item => item.category),
                datasets: [{
                    data: data.map(item => item.amount),
                    backgroundColor: [
                        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e',
                        '#e74a3b', '#858796', '#5a5c69'
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
    
    // Create budget ratio chart for detail view
    function createDetailBudgetRatioChart(data) {
        const ctx = document.getElementById('detail-budget-ratio-chart').getContext('2d');
        
        // Clear existing chart
        if (window.detailBudgetRatioChart instanceof Chart) {
            window.detailBudgetRatioChart.destroy();
        }
        
        // Create chart
        window.detailBudgetRatioChart = new Chart(ctx, {
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
    
    // Display expense breakdown
    function displayExpenseBreakdown(expenses) {
        const breakdownList = document.getElementById('expense-breakdown-list');
        breakdownList.innerHTML = '';
        
        // Define expenses with labels
        const expenseItems = [
            { label: 'السكن', value: expenses.housing },
            { label: 'فواتير الخدمات', value: expenses.utilities },
            { label: 'الطعام والمشتريات', value: expenses.food },
            { label: 'النقل والمواصلات', value: expenses.transportation },
            { label: 'الصحة والرعاية الطبية', value: expenses.health },
            { label: 'الترفيه', value: expenses.entertainment },
            { label: 'نفقات أخرى', value: expenses.others }
        ];
        
        // Create list items
        expenseItems.forEach(item => {
            const li = document.createElement('li');
            
            const label = document.createElement('span');
            label.textContent = item.label;
            li.appendChild(label);
            
            const value = document.createElement('span');
            value.textContent = formatCurrency(item.value);
            li.appendChild(value);
            
            breakdownList.appendChild(li);
        });
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
    
    // Helper function to get month name
    function getMonthName(month) {
        const months = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        return months[month - 1];
    }    // Delete month record function
    function deleteMonthRecord(entry, month, rowElement) {
        // Show confirmation dialog
        if (confirm(`هل أنت متأكد من رغبتك في حذف سجل شهر ${getMonthName(month)}؟ لا يمكن التراجع عن هذا الإجراء.`)) {
            // Get budget history from local storage
            let budgetHistory = JSON.parse(localStorage.getItem('budgetHistory')) || [];
            
            // Find index of the entry to delete
            const entryIndex = budgetHistory.findIndex(item => item.date === entry.date);
            
            // Remove the entry if found
            if (entryIndex !== -1) {
                budgetHistory.splice(entryIndex, 1);
                
                // Save updated history back to local storage
                localStorage.setItem('budgetHistory', JSON.stringify(budgetHistory));
                
                // Remove the row from the table
                if (rowElement) {
                    rowElement.remove();
                }
                
                // Show success message
                showNotification('تم حذف سجل الشهر بنجاح');
                
                // Reload data to update charts and summary
                loadBudgetHistory(yearFilter.value);
            } else {
                showNotification('حدث خطأ أثناء محاولة حذف السجل', 'error');
            }
        }
    }
    
    // Show notification message
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#1cc88a';
        } else {
            notification.style.backgroundColor = '#e74a3b';
        }
        
        notification.style.color = 'white';
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
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