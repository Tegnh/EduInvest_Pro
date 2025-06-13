// د:\Project_with_copilot\EduInvest_Pro\index.js المحسن
document.addEventListener('DOMContentLoaded', () => {
    // Initialize application
    console.log('تم تهيئة تطبيق إديو إنفست برو');
    
    // تعيين القائمة الحالية
    const currentPath = window.location.pathname;
    markCurrentMenu(currentPath);
    
    // إضافة تأثيرات حركية للأيقونات
    addNavIconEffects();
    
    // إضافة تأثير العنوان عند التمرير
    handleHeaderScroll();
    
    // تفعيل نظام القوائم المنسدلة المحسن
    initDropdownSystem();
    
    // Add smooth scrolling for anchor links
    initSmoothScrolling();
    
    // تبديل المظهر (الوضع الليلي/النهاري)
    initThemeToggle();
});

/**
 * تفعيل نظام القوائم المنسدلة المحسن
 */
function initDropdownSystem() {
    // التحقق من وجود النظام المحسن من ملف JS الخارجي
    if (typeof setupDropdowns === 'function') {
        setupDropdowns();
    } else {
        console.log('استخدام نظام القوائم المنسدلة المدمج');
        setupInternalDropdowns();
    }
}

/**
 * إعداد نظام القوائم المنسدلة المدمج
 */
function setupInternalDropdowns() {
    const dropdowns = [
        {
            btnId: 'calculator-dropdown-btn',
            menuId: 'calculator-dropdown',
            color: '#00bcd4'
        },
        {
            btnId: 'markets-dropdown-btn',
            menuId: 'markets-dropdown',
            color: '#ff9800'
        },
        {
            btnId: 'finance-dropdown-btn',
            menuId: 'finance-dropdown',
            color: '#8e24aa'
        },
        {
            btnId: 'systems-dropdown-btn',
            menuId: 'systems-dropdown',
            color: '#4caf50'
        }
    ];
    
    // إعداد كل قائمة منسدلة
    dropdowns.forEach(dropdown => {
        setupDropdown(dropdown);
    });
    
    // إغلاق القوائم عند النقر في أي مكان آخر
    document.addEventListener('click', (e) => {
        let clickedOnDropdown = false;
        
        dropdowns.forEach(dropdown => {
            const btn = document.getElementById(dropdown.btnId);
            const menu = document.getElementById(dropdown.menuId);
            
            if (btn && menu) {
                if (btn.contains(e.target) || menu.contains(e.target)) {
                    clickedOnDropdown = true;
                }
            }
        });
        
        if (!clickedOnDropdown) {
            closeAllDropdowns();
        }
    });
    
    // إعادة ضبط مواقع القوائم عند تغيير حجم النافذة
    window.addEventListener('resize', debounce(() => {
        dropdowns.forEach(dropdown => {
            const btn = document.getElementById(dropdown.btnId);
            const menu = document.getElementById(dropdown.menuId);
            
            if (btn && menu && menu.classList.contains('active')) {
                positionDropdownMenu(btn, menu);
            }
        });
    }, 200));
}

/**
 * إعداد قائمة منسدلة محددة
 * @param {Object} dropdown - بيانات القائمة المنسدلة
 */
function setupDropdown(dropdown) {
    const btn = document.getElementById(dropdown.btnId);
    const menu = document.getElementById(dropdown.menuId);
    
    if (btn && menu) {
        // تطبيق تصميم مخصص إذا كان متوفراً
        if (dropdown.color) {
            menu.style.borderBottom = `3px solid ${dropdown.color}`;
        }
        
        // معالج النقر على الزر
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // إغلاق القوائم الأخرى أولاً
            closeAllDropdowns();
            
            // تبديل حالة القائمة الحالية
            menu.classList.toggle('active');
            btn.classList.toggle('active');
            
            // ضبط موضع القائمة
            positionDropdownMenu(btn, menu);
        });
    }
}

/**
 * ضبط موضع القائمة المنسدلة
 * @param {HTMLElement} button - زر القائمة
 * @param {HTMLElement} dropdown - القائمة المنسدلة
 */
function positionDropdownMenu(button, dropdown) {
    // للأجهزة المحمولة
    if (window.innerWidth <= 768) {
        dropdown.style.top = (button.getBoundingClientRect().bottom + 5 + window.scrollY) + 'px';
        dropdown.style.left = '5%';
        dropdown.style.right = 'auto';
        dropdown.style.width = '90%';
        return;
    }
    
    // للأجهزة المكتبية
    const rect = button.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 5 + window.scrollY) + 'px';
    
    // حساب الموضع الأفقي المركزي
    const menuLeft = rect.left + (rect.width / 2) - (dropdown.offsetWidth / 2);
    
    // التأكد من عدم خروج القائمة عن حدود الشاشة
    const finalLeft = Math.max(10, Math.min(menuLeft, window.innerWidth - dropdown.offsetWidth - 10));
    
    dropdown.style.left = finalLeft + 'px';
    dropdown.style.right = 'auto';
}

/**
 * إغلاق جميع القوائم المنسدلة
 */
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
}

/**
 * تنفيذ الوظائف مع تأخير (لتحسين الأداء)
 * @param {Function} func - الوظيفة المراد تنفيذها بعد تأخير
 * @param {number} wait - وقت التأخير بالمللي ثانية
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * تفعيل التمرير السلس للروابط
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * تبديل المظهر (الوضع الليلي/النهاري)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (themeToggle && themeIcon) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            // تحديث الأيقونة بناءً على الوضع الحالي
            if (document.body.classList.contains('dark-theme')) {
                themeIcon.src = 'assets/icons/light-mode.svg';
                themeIcon.alt = 'الوضع المضيء';
                document.getElementById('theme-style').href = 'css/dark-theme.css';
            } else {
                themeIcon.src = 'assets/icons/dark-mode.svg';
                themeIcon.alt = 'الوضع المظلم';
                document.getElementById('theme-style').href = 'css/light-theme.css';
            }
        });
    }
}

/**
 * تحديد القائمة الحالية بناءً على مسار الصفحة
 * @param {string} path - مسار الصفحة
 */
function markCurrentMenu(path) {
    // إزالة أي / أمامية والامتداد
    path = path.replace(/^\//, '').split('.')[0];
    
    // تحديد القائمة المناسبة وتمييزها
    if (path.includes('finance')) {
        markActiveMenu('finance-dropdown-btn', 'finance-dropdown');
    } else if (path.includes('markets')) {
        markActiveMenu('markets-dropdown-btn', 'markets-dropdown');
    } else if (path.includes('calculator')) {
        markActiveMenu('calculator-dropdown-btn', 'calculator-dropdown');
    } else if (path.includes('system')) {
        markActiveMenu('systems-dropdown-btn', 'systems-dropdown');
    }
}

/**
 * تمييز قائمة محددة كنشطة
 * @param {string} btnId - معرف زر القائمة
 * @param {string} menuId - معرف القائمة المنسدلة
 */
function markActiveMenu(btnId, menuId) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.classList.add('active');
    }
}

/**
 * إضافة تأثيرات للأيقونات
 */
function addNavIconEffects() {
    // إضافة تأثير لطيف عند النقر على الأيقونات
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
        
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // تأثير خاص لقائمة المالية
    const financeBtn = document.getElementById('finance-dropdown-btn');
    if (financeBtn) {
        financeBtn.classList.add('pulse-attention');
        
        // إزالة التأثير بعد فترة
        setTimeout(() => {
            financeBtn.classList.remove('pulse-attention');
        }, 3000);
    }
}

/**
 * معالجة تأثيرات التمرير للعنوان
 */
function handleHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}
