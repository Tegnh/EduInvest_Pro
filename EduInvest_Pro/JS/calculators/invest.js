document.addEventListener('DOMContentLoaded', () => {
    // Initialize dropdown functionality
    initializeDropdown();
    
    // Tab elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.calculator-tab-content');
    
    // Form elements
    const compoundInterestForm = document.getElementById('compound-interest-form');
    const regularInvestmentForm = document.getElementById('regular-investment-form');
    const lumpSumForm = document.getElementById('lump-sum-form');
    const resultsContainer = document.getElementById('investment-results');
    
    // Initialize tab switching
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.style.display = 'none');
                
                // Add active class to clicked tab
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).style.display = 'block';
                
                // Hide results when switching tabs
                resultsContainer.style.display = 'none';
            });
        });
    }
    
    // Initialize form submission handlers
    if (compoundInterestForm) {
        compoundInterestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateCompoundInterest();
        });
    }
    
    if (regularInvestmentForm) {
        regularInvestmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateRegularInvestment();
        });
    }
    
    if (lumpSumForm) {
        lumpSumForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateLumpSum();
        });
    }
    
    // Calculate compound interest with monthly contributions
    function calculateCompoundInterest() {
        // Get form values
        const principal = parseFloat(document.getElementById('principal').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
        const annualInterest = parseFloat(document.getElementById('annual-interest').value) || 0;
        const years = parseFloat(document.getElementById('time-period').value) || 0;
        const compoundFrequency = parseInt(document.getElementById('compound-frequency').value) || 12;
        
        // Convert annual interest rate to decimal and per period
        const r = annualInterest / 100 / compoundFrequency;
        const n = compoundFrequency * years;
        
        // Calculate results
        let balance = principal;
        let totalContributions = principal;
        let totalInterest = 0;
        
        // Create detailed breakdown
        const yearlyBreakdown = [];
        
        for (let i = 1; i <= n; i++) {
            // Add interest for this period
            const interestEarned = balance * r;
            balance += interestEarned;
            totalInterest += interestEarned;
            
            // Add contribution (except for the very first period which already has the principal)
            balance += monthlyContribution;
            totalContributions += monthlyContribution;
            
            // Add to yearly breakdown at the end of each year
            if (i % compoundFrequency === 0) {
                const year = i / compoundFrequency;
                yearlyBreakdown.push({
                    year,
                    contributions: totalContributions,
                    interest: totalInterest,
                    balance
                });
            }
        }
        
        // Display results
        displayResults(totalContributions, totalInterest, balance, yearlyBreakdown);
    }
    
    // Calculate regular investment
    function calculateRegularInvestment() {
        // Get form values
        const regularAmount = parseFloat(document.getElementById('regular-amount').value) || 0;
        const investmentFrequency = parseInt(document.getElementById('investment-frequency').value) || 12;
        const annualInterest = parseFloat(document.getElementById('regular-annual-interest').value) || 0;
        const years = parseFloat(document.getElementById('regular-time-period').value) || 0;
        
        // Convert annual interest rate to decimal
        const r = annualInterest / 100;
        
        // Calculate number of payments per year
        const paymentsPerYear = investmentFrequency;
        const totalPayments = paymentsPerYear * years;
        
        // Initialize values
        let balance = 0;
        let totalContributions = 0;
        let totalInterest = 0;
        
        // Create detailed breakdown
        const yearlyBreakdown = [];
        
        // For regular investment, we calculate each payment separately
        for (let i = 1; i <= totalPayments; i++) {
            // Add contribution
            balance += regularAmount;
            totalContributions += regularAmount;
            
            // Add interest (proportionally for the period)
            // Interest is calculated based on the current balance and applied for the fraction of the year
            const interestForPeriod = balance * (r / paymentsPerYear);
            balance += interestForPeriod;
            totalInterest += interestForPeriod;
            
            // Add to yearly breakdown at the end of each year
            if (i % paymentsPerYear === 0) {
                const year = i / paymentsPerYear;
                yearlyBreakdown.push({
                    year,
                    contributions: totalContributions,
                    interest: totalInterest,
                    balance
                });
            }
        }
        
        // Display results
        displayResults(totalContributions, totalInterest, balance, yearlyBreakdown);
    }
    
    // Calculate lump sum investment
    function calculateLumpSum() {
        // Get form values
        const lumpSumAmount = parseFloat(document.getElementById('lump-sum-amount').value) || 0;
        const annualInterest = parseFloat(document.getElementById('lump-sum-annual-interest').value) || 0;
        const years = parseFloat(document.getElementById('lump-sum-time-period').value) || 0;
        const compoundFrequency = parseInt(document.getElementById('lump-sum-compound-frequency').value) || 12;
        
        // Convert annual interest rate to decimal and per period
        const r = annualInterest / 100 / compoundFrequency;
        const n = compoundFrequency * years;
        
        // Calculate final amount using compound interest formula
        // A = P(1 + r)^n
        const finalAmount = lumpSumAmount * Math.pow(1 + r, n);
        const totalInterest = finalAmount - lumpSumAmount;
        
        // Create detailed breakdown
        const yearlyBreakdown = [];
        let runningBalance = lumpSumAmount;
        let runningInterest = 0;
        
        for (let i = 1; i <= years; i++) {
            // Calculate compound interest for this year
            const prevBalance = runningBalance;
            runningBalance = lumpSumAmount * Math.pow(1 + r, i * compoundFrequency);
            const yearInterest = runningBalance - prevBalance;
            runningInterest += yearInterest;
            
            yearlyBreakdown.push({
                year: i,
                contributions: lumpSumAmount,
                interest: runningInterest,
                balance: runningBalance
            });
        }
        
        // Display results
        displayResults(lumpSumAmount, totalInterest, finalAmount, yearlyBreakdown);
    }
    
    // Display investment results
    function displayResults(totalContributions, totalInterest, finalAmount, yearlyBreakdown) {
        // Update summary values
        document.getElementById('total-contributions').textContent = formatCurrency(totalContributions);
        document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
        document.getElementById('final-amount').textContent = formatCurrency(finalAmount);
        
        // Create growth chart
        createGrowthChart(yearlyBreakdown);
        
        // Create detailed breakdown table
        createBreakdownTable(yearlyBreakdown);
        
        // Show results container
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Create investment growth chart
    function createGrowthChart(data) {
        const ctx = document.getElementById('investment-growth-chart').getContext('2d');
        
        // Clear existing chart
        if (window.growthChart instanceof Chart) {
            window.growthChart.destroy();
        }
        
        // Prepare data for chart
        const years = data.map(item => item.year);
        const contributionsData = data.map(item => item.contributions);
        const interestData = data.map(item => item.interest);
        const balanceData = data.map(item => item.balance);
        
        // Create chart
        window.growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years.map(year => `السنة ${year}`),
                datasets: [
                    {
                        label: 'إجمالي القيمة',
                        data: balanceData,
                        borderColor: '#4e73df',
                        backgroundColor: 'rgba(78, 115, 223, 0.05)',
                        borderWidth: 2,
                        pointBackgroundColor: '#4e73df',
                        pointRadius: 3,
                        fill: true
                    },
                    {
                        label: 'المبلغ المستثمر',
                        data: contributionsData,
                        borderColor: '#1cc88a',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: '#1cc88a',
                        pointRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value, false);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `${context.dataset.label}: ${formatCurrency(value)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create breakdown table
    function createBreakdownTable(data) {
        const tableBody = document.getElementById('investment-breakdown-table');
        tableBody.innerHTML = '';
        
        data.forEach((item) => {
            const row = document.createElement('tr');
            
            // Year
            const yearCell = document.createElement('td');
            yearCell.textContent = `السنة ${item.year}`;
            row.appendChild(yearCell);
            
            // Contributions
            const contributionsCell = document.createElement('td');
            contributionsCell.textContent = formatCurrency(item.contributions);
            row.appendChild(contributionsCell);
            
            // Interest
            const interestCell = document.createElement('td');
            interestCell.textContent = formatCurrency(item.interest);
            row.appendChild(interestCell);
            
            // Balance
            const balanceCell = document.createElement('td');
            balanceCell.textContent = formatCurrency(item.balance);
            row.appendChild(balanceCell);
            
            // Add row to table
            tableBody.appendChild(row);
        });
    }
    
    // Helper function to format currency
    function formatCurrency(value, includeSymbol = true) {
        const options = { 
            style: 'currency', 
            currency: 'SAR',
            maximumFractionDigits: 0
        };
        
        if (!includeSymbol) {
            options.style = 'decimal';
        }
        
        return new Intl.NumberFormat('ar-SA', options).format(value);
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